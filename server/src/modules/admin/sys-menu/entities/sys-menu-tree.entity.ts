import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  Default,
  IsUUID,
  BelongsTo,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from '@/models/base.entity';
import { SysMenu } from './sys-menu.entity';

@Table({ tableName: 'sys_menu_tree' })
export class SysMenuTree extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Length({ max: 36 })
  @Column
  ancestor: string;

  @AllowNull(false)
  @Length({ max: 36 })
  @Column
  descendant: string;

  @AllowNull(false)
  @Default(0)
  @Column
  distance: number;

  @AllowNull(false)
  @Default(0)
  @Column
  priority: number;

  @BelongsTo(() => SysMenu, {
    foreignKey: 'descendant',
    constraints: false,
  })
  menu: SysMenu;
}
