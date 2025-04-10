import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DbUtilsService,
  FindManyOptions,
} from '@/processors/utils/db-utils.service';

import { Oauth } from './entities/oauth.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepo: typeof User,
    @InjectModel(Oauth)
    private oauthRepo: typeof Oauth,
    private dbUtilSer: DbUtilsService,
  ) {}

  async findUserByOauth(opt: { name: string; oauthId: string }) {
    let oauth = await this.oauthRepo.findOne({
      where: {
        name: opt.name,
        oauthId: opt.oauthId,
      },
    });
    let user: User;
    if (oauth) {
      user = await this.userRepo.findOne({ where: { id: oauth.userId } });
    }
    return user;
  }

  async createByOauth(opt: {
    user: Partial<User>;
    oauthId: string;
    oauthName: string;
  }) {
    let user = new this.userRepo(opt.user);
    let oauth = new this.oauthRepo({
      name: opt.oauthName,
      oauthId: opt.oauthId,
    });
    await this.dbUtilSer.transaction(async (transaction) => {
      user = await user.save({ transaction });
      oauth.userId = user.id;
      oauth = await oauth.save({ transaction });
    });
    return {
      user,
      oauth,
    };
  }

  async findAll(opt?: FindManyOptions<User>) {
    let rs = await this.dbUtilSer.findAndCount({
      resp: this.userRepo,
      findOpt: opt,
    });
    return rs;
  }
}
