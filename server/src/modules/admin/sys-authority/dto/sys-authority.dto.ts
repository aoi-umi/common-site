import { IsDefined, IsNotEmpty } from 'class-validator';
import { TrimOrNull } from 'src/decorators/transformer';
import { DeleteBaseDto } from 'src/models/operate.dto';
import { FindOptionBaseDto } from 'src/models/query.dto';

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
