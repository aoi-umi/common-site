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
import { BaseEntity } from '@/models/base.entity';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['name', 'oauthId', 'userId'],
      name: 'unique-key',
    },
  ],
  tableName: 'oauth',
})
export class Oauth extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Length({ max: 80 })
  @Column
  name: string;

  @AllowNull(false)
  @Length({ max: 80 })
  @Column
  oauthId: string;

  @AllowNull(false)
  @Length({ max: 36 })
  @Column
  userId: string;
}
