import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  IsUUID,
  Default,
  Index,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from 'src/models/base.entity';

@Table({ tableName: 'sys_page' })
export class SysPage extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index({
    name: 'name',
    unique: true,
  })
  @AllowNull(false)
  @Length({ max: 50 })
  @Column
  name: string;

  @Length({ max: 50 })
  @Column
  text: string;

  @Length({ max: 100 })
  @Column
  path: string;
}
