import { SignInAdminUser } from 'src/modules/admin/admin-user/admin-user.service';

export interface NormalUser {
  nickname: string;
}

declare module 'express' {
  interface Request {
    isAdmin: boolean;
    normalUser?: NormalUser;
    adminUser?: SignInAdminUser;
  }
}
