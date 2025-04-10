import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  Default,
  IsUUID,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from '@/models/base.entity';

@Table({ tableName: 'user' })
export class User extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Length({ max: 60 })
  @Column
  nickname: string;

  @AllowNull(false)
  @Length({ max: 256 })
  @Default('')
  @Column
  avatar?: string;

  @AllowNull(false)
  @Length({ max: 60 })
  @Default('')
  @Column
  mobile?: string;
}
