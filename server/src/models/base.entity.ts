import { CreatedAt, UpdatedAt, Model } from 'sequelize-typescript';

export class BaseEntity extends Model {
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
