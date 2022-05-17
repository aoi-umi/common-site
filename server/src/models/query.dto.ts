import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';

export class FindOptionBaseDto {
  @Min(1)
  @IsInt()
  @IsOptional()
  pageIndex?: number;

  @Min(1)
  @Max(50)
  @IsInt()
  @IsOptional()
  pageSize?: number;

  where?: any;
}
