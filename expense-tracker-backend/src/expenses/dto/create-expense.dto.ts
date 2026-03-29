import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

export class CreateExpenseDto {
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be a positive number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  @IsEnum(ExpenseCategory, {
    message: `Category must be one of: ${Object.values(ExpenseCategory).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Category is required' })
  category: ExpenseCategory;

  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  note?: string;
}