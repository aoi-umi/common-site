import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  Default,
  IsUUID,
  Index,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from '@/models/base.entity';

@Table({ tableName: 'admin_user_authority' })
export class AdminUserAuthority extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  userId: string;

  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  authorityId: string;
}
