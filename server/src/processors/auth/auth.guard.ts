import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { SysApiService } from '@/modules/admin/sys-api/sys-api.service';

import * as authDeco from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiSer: SysApiService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    let auth = this.reflector.get<authDeco.AuthOptions>(
      authDeco.authKey,
      context.getHandler(),
    );
    auth = {
      ...auth,
    };
    let userAuthority;
    let user;
    if (request.isAdmin) {
      user = request.adminUser;
      userAuthority = user?.authority;
    } else {
      user = request.normalUser;
    }

    if (auth.self) {
      if (!user) throw new UnauthorizedException();
    }

    let api = await this.apiSer.findAll({
      where: {
        path: request.path,
        method: request.method,
      },
      limit: 1,
    });
    let authorityList = api.rows[0]?.authorityList || [];
    if (!authorityList.length) {
      return true;
    }

    if (!user) throw new UnauthorizedException();
    if (user.isSysAdmin) return true;
    let notPass = [];
    userAuthority = userAuthority || {};
    authorityList.forEach((auth) => {
      if (!auth.status) return;
      let key = auth.name;
      if (!userAuthority[key])
        notPass.push({ name: auth.name, text: auth.text });
    });

    if (notPass.length) throw new ForbiddenException({ notPass });
    return true;
  }
}
