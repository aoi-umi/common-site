import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isDefined } from 'class-validator';
import { Op } from 'sequelize';

import { CommonException } from 'src/processors/exception/common-exception';
import {
  DbUtilsService,
  FindManyOptions,
} from 'src/processors/utils/db-utils.service';
import { UtilsService } from 'src/processors/utils/utils.service';
import {
  SysAuthorityCreateDto,
  SysAuthorityDeleteDto,
  SysAuthorityUpdateDto,
} from './dto/sys-authority.dto';
import { SysAuthority } from './entities/sys-authority.entity';

@Injectable()
export class SysAuthorityService {
  constructor(
    @InjectModel(SysAuthority)
    private sysAuthRepo: typeof SysAuthority,
    private dbUtilsSer: DbUtilsService,
    private utilsSer: UtilsService,
  ) {}

  async findAll(opt?: FindManyOptions<SysAuthority>) {
    opt = {
      ...opt,
    };
    if (!opt.order) {
      opt.order = [['name', 'ASC']];
    }
    let rs = await this.dbUtilsSer.findAndCount({
      resp: this.sysAuthRepo,
      findOpt: opt,
    });
    return rs;
  }

  async findOne(id: string) {
    let rs = await this.sysAuthRepo.findByPk(id);
    return rs;
  }

  async create(dto: SysAuthorityCreateDto) {
    await this.checkSaveData(dto);
    let data = new this.sysAuthRepo(dto);
    await data.save();
    return data;
  }

  async update(dto: SysAuthorityUpdateDto) {
    let data = await this.sysAuthRepo.findOne({ where: { id: dto.id } });
    if (!data)
      throw new CommonException({
        status: HttpStatus.NOT_FOUND,
      });
    await this.checkSaveData(dto, { update: true });
    let updateData = new this.sysAuthRepo(dto).get();
    await data.update(updateData);
    return data;
  }

  async checkSaveData(
    dto: SysAuthorityCreateDto | SysAuthorityUpdateDto,
    opt?: { update: boolean },
  ) {
    opt = { ...opt };
    let currId = '';
    if (opt.update) {
      let d = dto as SysAuthorityUpdateDto;
      currId = d.id;
    } else {
      delete dto['id'];
    }
    if (dto.name) {
      let data = await this.sysAuthRepo.findOne({
        where: { name: dto.name, id: { [Op.ne]: currId } },
      });
      if (data) throw new CommonException(`[${dto.name}]已存在`);
    }
  }

  async remove(dto: SysAuthorityDeleteDto) {
    await this.sysAuthRepo.destroy({ where: { id: dto.id } });
  }
}
