import { Type } from '@nestjs/common';
import { Routes } from '@nestjs/core';

import { adminRoutes } from './admin';
import { normalRoutes } from './normal';
export const routes: Routes = [...adminRoutes, ...normalRoutes];

export const routeModules = [];
function getModule(routes: Routes | Type<any>[]) {
  for (let m of <Routes>routes) {
    if (m.module) routeModules.push(m.module);
    if (m.children?.length) getModule(m.children);
  }
}
getModule(routes);
