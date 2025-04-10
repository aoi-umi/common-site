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
  Index,
} from 'sequelize-typescript';
import { BaseEntity } from '@/models/base.entity';
import { SysPage } from '../../sys/entities/sys-page.entity';
import { SysAuthority } from '../../sys-authority/entities/sys-authority.entity';

@Table({ tableName: 'sys_menu' })
export class SysMenu extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index({ name: 'name', unique: true })
  @AllowNull(false)
  @Length({ max: 50 })
  @Column
  name: string;

  @AllowNull(false)
  @Length({ max: 36 })
  @Default('')
  @Column
  pageName: string;

  @BelongsTo(() => SysPage, {
    foreignKey: 'pageName',
    targetKey: 'name',
    constraints: false,
  })
  page: SysPage;

  @AllowNull(false)
  @Length({ max: 50 })
  @Column
  text: string;

  @AllowNull(false)
  @Length({ max: 50 })
  @Default('')
  @Column
  icon: string;

  @AllowNull(false)
  @Default(true)
  @Column
  status: boolean;

  @Column(DataType.VIRTUAL)
  authorityList: SysAuthority[];
}
