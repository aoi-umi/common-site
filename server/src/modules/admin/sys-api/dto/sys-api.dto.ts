import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { TrimOrNull } from 'src/decorators/transformer';
import { DeleteBaseDto } from 'src/models/operate.dto';
import { FindOptionBaseDto } from 'src/models/query.dto';
class ApiAuthorityDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}
class SysApiSaveDto {
  @TrimOrNull()
  name: string;

  @TrimOrNull()
  method: string;

  @TrimOrNull()
  path: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiAuthorityDto)
  authorityList: ApiAuthorityDto[];
}

export class SysApiCreateDto extends SysApiSaveDto {}
export class SysApiUpdateDto extends SysApiSaveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

export class SysApiDeleteDto extends DeleteBaseDto {}
export class SysApiFindOptionDto extends FindOptionBaseDto {}
