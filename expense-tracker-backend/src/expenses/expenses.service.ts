import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { SummaryFilterDto } from './dto/summary-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    const expense = await this.prisma.expense.create({
      data: {
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        note: dto.note ?? null,
        userId,
      },
      select: {
        id: true,
        amount: true,
        category: true,
        date: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return expense;
  }

  async findAll(userId: string, filters: FilterExpenseDto) {
    const page = Math.max(1, parseInt(filters.page ?? '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit ?? '10', 10) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = { userId };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.date.lte = endDate;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          amount: true,
          category: true,
          date: true,
          note: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(userId: string, expenseId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      select: {
        id: true,
        amount: true,
        category: true,
        date: true,
        note: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    const { userId: _, ...result } = expense;
    return result;
  }

  async update(userId: string, expenseId: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, expenseId);

    const updateData: Prisma.ExpenseUpdateInput = {};

    if (dto.amount !== undefined) {
      updateData.amount = dto.amount;
    }
    if (dto.category !== undefined) {
      updateData.category = dto.category;
    }
    if (dto.date !== undefined) {
      updateData.date = new Date(dto.date);
    }
    if (dto.note !== undefined) {
      updateData.note = dto.note;
    }

    const updated = await this.prisma.expense.update({
      where: { id: expenseId },
      data: updateData,
      select: {
        id: true,
        amount: true,
        category: true,
        date: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async remove(userId: string, expenseId: string) {
    await this.findOne(userId, expenseId);

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });

    return { message: 'Expense deleted successfully' };
  }

  async getSummary(userId: string, filters: SummaryFilterDto) {
    const where: Prisma.ExpenseWhereInput = { userId };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.date.lte = endDate;
      }
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      select: {
        amount: true,
        category: true,
      },
    });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCount = expenses.length;

    const categoryMap = new Map<string, { total: number; count: number }>();
    for (const expense of expenses) {
      const existing = categoryMap.get(expense.category) ?? { total: 0, count: 0 };
      existing.total += expense.amount;
      existing.count += 1;
      categoryMap.set(expense.category, existing);
    }

    const byCategory = Array.from(categoryMap.entries()).map(
      ([category, { total, count }]) => ({
        category,
        total: Math.round(total * 100) / 100,
        count,
      }),
    );

    return {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalCount,
      byCategory,
    };
  }
}
