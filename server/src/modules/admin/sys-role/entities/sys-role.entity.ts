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
import { SysAuthority } from '../../sys-authority/entities/sys-authority.entity';
import { SysRoleData } from '../sys-role.constants';

@Table({ tableName: 'sys_role' })
export class SysRole extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index({ name: 'name', unique: true })
  @AllowNull(false)
  @Length({ max: 30 })
  @Column
  name: string;

  @AllowNull(false)
  @Length({ max: 60 })
  @Column
  text: string;

  @AllowNull(false)
  @Default(true)
  @Column
  status: boolean;

  @Column(DataType.VIRTUAL)
  authorityList: SysAuthority[];

  @Column(DataType.VIRTUAL)
  get canOperate() {
    return this.name !== SysRoleData.Admin;
  }
}
