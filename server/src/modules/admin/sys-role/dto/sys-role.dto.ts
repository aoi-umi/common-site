import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { TrimOrNull } from '@/decorators/transformer';
import { DeleteBaseDto } from '@/models/operate.dto';
import { FindOptionBaseDto } from '@/models/query.dto';

class RoleAuthorityDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}
class SysRoleSaveDto {
  @TrimOrNull()
  name: string;

  @TrimOrNull()
  text: string;

  status: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleAuthorityDto)
  authorityList: RoleAuthorityDto[];
}

export class SysRoleCreateDto extends SysRoleSaveDto {}
export class SysRoleUpdateDto extends SysRoleSaveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

export class SysRoleDeleteDto extends DeleteBaseDto {}

export class SysRoleFindOptionDto extends FindOptionBaseDto {}
