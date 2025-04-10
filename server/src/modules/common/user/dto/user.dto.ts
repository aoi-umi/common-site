import { ApiProperty } from '@nestjs/swagger';
import { FindOptionBaseDto } from '@/models/query.dto';

export class UserSignInDto {
  code: string;

  nickname: string;

  avatar: string;
}

export class UserFindOptionDto extends FindOptionBaseDto {}
