import { Routes } from '@nestjs/core';

import { UserModule } from 'src/modules/normal/user/user.module';
export const normalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        module: UserModule,
      },
    ],
  },
];
