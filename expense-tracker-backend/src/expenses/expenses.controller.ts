import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { SummaryFilterDto } from './dto/summary-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtUser } from '../common/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
      @CurrentUser() user: JwtUser,
      @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user.userId, dto);
  }

  @Get()
  async findAll(
      @CurrentUser() user: JwtUser,
      @Query() filters: FilterExpenseDto,
  ) {
    return this.expensesService.findAll(user.userId, filters);
  }

  @Get('summary')
  async getSummary(
      @CurrentUser() user: JwtUser,
      @Query() filters: SummaryFilterDto,
  ) {
    return this.expensesService.getSummary(user.userId, filters);
  }

  @Get(':id')
  async findOne(
      @CurrentUser() user: JwtUser,
      @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.expensesService.findOne(user.userId, id);
  }

  @Patch(':id')
  async update(
      @CurrentUser() user: JwtUser,
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
      @CurrentUser() user: JwtUser,
      @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.expensesService.remove(user.userId, id);
  }
}