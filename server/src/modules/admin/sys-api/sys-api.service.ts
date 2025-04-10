import { HttpStatus, Injectable } from '@nestjs/common';
import * as os from 'os';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { UtilsService } from '@/processors/utils/utils.service';
import { ConfigService } from '@/processors/config/config.service';
import { CommonException } from '@/processors/exception/common-exception';
import {
  DbUtilsService,
  FindManyOptions,
} from '@/processors/utils/db-utils.service';

import { SysAuthority } from '../sys-authority/entities/sys-authority.entity';
import { SysApi } from './entities/sys-api.entity';
import { SysApiAuthority } from './entities/sys-api-authority.entity';
import {
  SysApiDeleteDto,
  SysApiCreateDto,
  SysApiUpdateDto,
} from './dto/sys-api.dto';

@Injectable()
export class SysApiService {
  constructor(
    private utilsSer: UtilsService,
    private dbUtilsSer: DbUtilsService,
    @InjectModel(SysApi)
    private sysApiRepo: typeof SysApi,
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    @InjectModel(SysApiAuthority)
    private sysApiAuthRepo: typeof SysApiAuthority,
  ) {}

  async findAll(opt?: FindManyOptions<SysApi>) {
    opt = {
      ...opt,
    };
    if (!opt.order) {
      opt.order = [['path', 'ASC']];
    }
    let rs = await this.dbUtilsSer.findAndCount({
      resp: this.sysApiRepo,
      findOpt: opt,
    });
    await this.setData({ api: rs.rows });
    return rs;
  }

  async findOne(id: string) {
    let rs = await this.sysApiRepo.findByPk(id);
    if (rs) {
      await this.setData({ api: rs });
    }
    return rs;
  }

  private async setData(opt: { api: SysApi | SysApi[] }) {
    let apis = opt.api instanceof Array ? opt.api : [opt.api];
    if (!apis.length) return;
    let apiIds = apis.map((ele) => ele.id);
    let [data] = await this.dbUtilsSer.sequelize.query(
      [
        `select auth.*, apiAuth.apiId from ${this.sysAuthRepo.tableName} auth`,
        `inner join ${this.sysApiAuthRepo.tableName} apiAuth`,
        `on apiAuth.apiId in (${apiIds.map(
          (ele) => `'${ele}'`,
        )}) and apiAuth.authorityId = auth.id`,
      ].join('\r\n'),
    );
    apis.forEach((api) => {
      api.authorityList = data
        .filter((auth: any) => auth.apiId === api.id)
        .map((ele) => new this.sysAuthRepo(ele));
    });
  }
  async create(dto: SysApiCreateDto) {
    let data = await this.save(dto, { update: false });
    return data;
  }

  async update(dto: SysApiUpdateDto) {
    let data = await this.save(dto, { update: true });
    return data;
  }

  private async save(
    dto: SysApiCreateDto | SysApiUpdateDto,
    opt: { update: boolean },
  ) {
    await this.checkSaveData(dto, { update: opt.update });
    let data: SysApi;
    let updateData;
    let authorityList = dto.authorityList || [];
    if (!opt.update) {
      data = new this.sysApiRepo(dto);
    } else {
      let updateDto = dto as SysApiUpdateDto;
      data = await this.sysApiRepo.findOne({ where: { id: updateDto.id } });
      if (!data)
        throw new CommonException({
          status: HttpStatus.NOT_FOUND,
        });
      this.checkOperate(data);
      updateData = new this.sysApiRepo(dto).get();
    }
    let authSaveData = authorityList.map((ele) => {
      return {
        authorityId: ele.id,
        apiId: '',
      };
    });
    await this.dbUtilsSer.transaction(async (transaction) => {
      if (!opt.update) {
        await data.save({ transaction });
      } else {
        await data.update(updateData, { transaction });
        await this.sysApiAuthRepo.destroy({
          where: { apiId: data.id },
          transaction,
        });
      }
      authSaveData.forEach((ele) => {
        ele.apiId = data.id;
      });
      await this.sysApiAuthRepo.bulkCreate(authSaveData, {
        transaction,
      });
    });
    return this.findOne(data.id);
  }

  async checkSaveData(
    dto: SysApiCreateDto | SysApiUpdateDto,
    opt?: { update: boolean },
  ) {
    opt = { ...opt };
    let currId = '';
    if (opt.update) {
      let d = dto as SysApiUpdateDto;
      currId = d.id;
    } else {
      delete dto['id'];
    }
    if (dto.path) {
      let d = new this.sysApiRepo(dto);
      let key = d.getKey();
      let data = await this.sysApiRepo.findOne({
        where: { path: dto.path, method: dto.method, id: { [Op.ne]: currId } },
      });
      if (data) throw new CommonException(`[${key}]已存在`);
    }
  }

  checkOperate(data: SysApi) {}

  async remove(dto: SysApiDeleteDto) {
    let api = await this.sysApiRepo.findByPk(dto.id);
    if (!api) return;
    this.checkOperate(api);
    await this.dbUtilsSer.transaction(async (transaction) => {
      await api.destroy({ transaction });
      await this.sysApiAuthRepo.destroy({
        where: { apiId: api.id },
        transaction,
      });
    });
  }
}
