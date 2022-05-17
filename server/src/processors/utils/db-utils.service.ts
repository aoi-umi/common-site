import { Injectable } from '@nestjs/common';
import { Model, Sequelize, ModelStatic, DataType } from 'sequelize-typescript';
import {
  Transaction,
  FindAndCountOptions,
  ModelAttributeColumnOptions,
} from 'sequelize';

export interface FindManyOptions<T> extends FindAndCountOptions<T> {
  pageIndex?: number;
  pageSize?: number;
}

@Injectable()
export class DbUtilsService {
  constructor(public sequelize: Sequelize) {}
  async findAndCount<T extends Model>(opt: {
    resp: typeof Model & ModelStatic<T>;
    findOpt: FindManyOptions<T>;
  }) {
    let { resp, findOpt } = opt;

    let { offset, limit, pageIndex, pageSize } = findOpt || {};
    if (pageIndex && pageSize) {
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
    }
    let rs = await resp.findAndCountAll({
      ...findOpt,
      offset,
      limit,
    });

    return {
      rows: rs.rows,
      total: rs.count,
      pageIndex,
      pageSize,
    };
  }

  getAttributes<T extends Model>(opt: {
    resp: typeof Model & ModelStatic<T>;
    noVirtual?: boolean;
  }) {
    let attrs: any = opt.resp.getAttributes();
    let rs: { [key: string]: ModelAttributeColumnOptions } = {};
    for (let key in attrs) {
      if (opt.noVirtual && attrs[key].type instanceof DataType.VIRTUAL) {
        continue;
      }
      rs[key] = attrs[key];
    }
    return rs;
  }

  async transaction<T>(runInTransaction: (t: Transaction) => Promise<T>) {
    return await this.sequelize.transaction(runInTransaction);
  }
}
