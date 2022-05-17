import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

class Page {
  name: string;

  path: string;

  text: string;
}
export class SysGenerateScriptDto {
  @IsArray()
  @IsOptional()
  @Type(() => Page)
  pages?: Page[];
}
