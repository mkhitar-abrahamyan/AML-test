import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

export class SummaryFilterDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  @IsEnum(ExpenseCategory, {
    message: `Category must be one of: ${Object.values(ExpenseCategory).join(', ')}`,
  })
  category?: ExpenseCategory;

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate?: string;
}