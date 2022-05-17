import { IsDefined } from 'class-validator';

export class DeleteBaseDto {
  @IsDefined()
  id: string;
}
