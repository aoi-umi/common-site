import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  Index,
  Default,
  IsUUID,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from 'src/models/base.entity';

@Table({ tableName: 'sys_authority' })
export class SysAuthority extends BaseEntity {
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

  @Default(true)
  @Column
  status: boolean;
}
