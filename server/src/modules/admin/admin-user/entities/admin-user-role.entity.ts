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
import { BaseEntity } from 'src/models/base.entity';

@Table({ tableName: 'admin_user_role' })
export class AdminUserRole extends BaseEntity {
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
  roleId: string;
}
