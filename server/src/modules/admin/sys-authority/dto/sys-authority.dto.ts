import { IsDefined, IsNotEmpty } from 'class-validator';
import { TrimOrNull } from '@/decorators/transformer';
import { DeleteBaseDto } from '@/models/operate.dto';
import { FindOptionBaseDto } from '@/models/query.dto';

class SysAuthoritySaveDto {
  @TrimOrNull()
  name: string;

  @TrimOrNull()
  text: string;

  status: boolean;
}
export class SysAuthorityCreateDto extends SysAuthoritySaveDto {}
export class SysAuthorityUpdateDto extends SysAuthoritySaveDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;
}

export class SysAuthorityDeleteDto extends DeleteBaseDto {}

export class SysAuthorityFindOptionDto extends FindOptionBaseDto {}
