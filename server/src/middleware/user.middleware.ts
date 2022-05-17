import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AdminUserService } from 'src/modules/admin/admin-user/admin-user.service';
import { dev } from 'src/processors/config/config.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private adminUserSer: AdminUserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let token = req.header(dev.authKey) || req.cookies[dev.authKey];
    if (req.originalUrl.startsWith('/admin')) {
      req.isAdmin = true;
      let rs = await this.adminUserSer.getCacheUser(token);
      req.adminUser = rs?.user;
    }
    next();
  }
}
