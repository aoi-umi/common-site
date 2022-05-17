import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  IsUUID,
  Default,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from 'src/models/base.entity';
import { SysAuthority } from '../../sys-authority/entities/sys-authority.entity';

@Table({
  tableName: 'sys_api',
  indexes: [
    {
      unique: true,
      fields: ['name', 'method', 'path'],
      name: 'unique-key',
    },
  ],
})
export class SysApi extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Length({ max: 50 })
  @Default('')
  @Column
  name: string;

  @AllowNull(false)
  @Length({ max: 50 })
  @Column
  method: string;

  @AllowNull(false)
  @Length({ max: 100 })
  @Column
  path: string;

  @Column(DataType.VIRTUAL)
  authorityList: SysAuthority[];

  getKey() {
    return `${this.path}_${this.method}`;
  }
}
