import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { TrimOrNull } from '@/decorators/transformer';
import { DeleteBaseDto } from '@/models/operate.dto';

export class SysMenuQueryDto {}
class MenuAuthorityDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}
class SysMenuSaveDto {
  @TrimOrNull()
  name: string;

  @TrimOrNull()
  pageName: string;

  @TrimOrNull()
  text: string;

  @TrimOrNull()
  icon: string;

  status: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuAuthorityDto)
  authorityList: MenuAuthorityDto[];
}
export class SysMenuCreateDto extends SysMenuSaveDto {
  parentId: string;

  @IsDefined()
  pageName: string;

  @IsDefined()
  text: string;
}

export class SysMenuUpdateDto extends SysMenuSaveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

export class SysMenuMoveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @IsNotEmpty()
  op: string;
}

export class SysMenuDeleteDto extends DeleteBaseDto {}
