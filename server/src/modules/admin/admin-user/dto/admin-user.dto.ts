import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { TrimOrNull } from '@/decorators/transformer';

import { FindOptionBaseDto } from '@/models/query.dto';

export class AdminUserSignInDto {
  @IsDefined()
  account: string;

  @IsDefined()
  token: string;

  @IsDefined()
  randKey: string;
}

class AdminUserAuthorityDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}
class AdminUserRoleDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

class AdminUserMgtSaveDto {
  @TrimOrNull()
  account: string;

  @TrimOrNull()
  nickname: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminUserRoleDto)
  roleList: AdminUserRoleDto[];
}
export class AdminUserMgtCreateDto extends AdminUserMgtSaveDto {}

export class AdminUserMgtUpdateDto extends AdminUserMgtSaveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

export class AdminUserFindOptionDto extends FindOptionBaseDto {}

export class AdminUserUpdateDto {
  @TrimOrNull()
  nickname: string;

  @TrimOrNull()
  password: string;

  @TrimOrNull()
  oldPassword: string;
}
