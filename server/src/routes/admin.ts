import { Routes } from '@nestjs/core';
import { AdminUserMgtModule } from '@/modules/admin/admin-user-mgt/admin-user-mgt.module';

import { AdminUserModule } from '@/modules/admin/admin-user/admin-user.module';
import { AdminMainModule } from '@/modules/admin/main/main.module';
import { SysApiModule } from '@/modules/admin/sys-api/sys-api.module';
import { SysAuthorityModule } from '@/modules/admin/sys-authority/sys-authority.module';
import { SysMenuModule } from '@/modules/admin/sys-menu/sys-menu.module';
import { SysRoleModule } from '@/modules/admin/sys-role/sys-role.module';
import { SysModule } from '@/modules/admin/sys/sys.module';
import { UserModule } from '@/modules/admin/user/user.module';

const sys = [
  {
    path: 'sys',
    module: SysModule,
  },
  {
    path: 'sysMenu',
    module: SysMenuModule,
  },
  {
    path: 'sysAuthority',
    module: SysAuthorityModule,
  },
  {
    path: 'sysRole',
    module: SysRoleModule,
  },
  {
    path: 'sysApi',
    module: SysApiModule,
  },
];
export const adminRoutes: Routes = [
  {
    path: 'admin',
    children: [
      ...sys,
      {
        path: '/',
        module: AdminMainModule,
      },
      {
        path: 'adminUser',
        module: AdminUserModule,
      },
      {
        path: 'adminUserMgt',
        module: AdminUserMgtModule,
      },
      {
        path: 'userMgt',
        module: UserModule,
      },
    ],
  },
];
