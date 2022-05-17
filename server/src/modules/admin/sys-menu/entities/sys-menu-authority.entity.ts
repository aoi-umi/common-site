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

@Table({ tableName: 'sys_menu_authority' })
export class SysMenuAuthority extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  menuId: string;

  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  authorityId: string;
}
