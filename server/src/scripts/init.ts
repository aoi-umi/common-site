import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';

import { UtilsService } from 'src/processors/utils/utils.service';
import { env } from 'src/processors/config/config.service';

import { AdminUser } from 'src/modules/admin/admin-user/entities/admin-user.entity';
import { SysRole } from 'src/modules/admin/sys-role/entities/sys-role.entity';
import { SysRoleData } from 'src/modules/admin/sys-role/sys-role.constants';
import { AdminUserRole } from 'src/modules/admin/admin-user/entities/admin-user-role.entity';

let db;
(async () => {
  db = new Sequelize({
    ...env.db,
    models: [AdminUser, SysRole, AdminUserRole],
    logging: false,
  });
  let utils = new UtilsService();
  let adminUserResp = AdminUser;
  let sysRoleRepo = SysRole;

  async function createAdmin(opt: { adminRole: SysRole }) {
    let { adminRole } = opt;
    let user = {
      account: 'admin',
      password: '654321',
    };
    let admin = await adminUserResp.findOne({ where: { account: 'admin' } });
    if (!admin) {
      console.log('创建admin:', JSON.stringify(user));
      user.password = utils.hash(user.password, 'md5');
      admin = await new adminUserResp({
        ...user,
        nickname: 'admin',
      }).save();
    }
    let userAdminRole = await AdminUserRole.findOne({
      where: { userId: admin.id, roleId: adminRole.id },
    });
    if (!userAdminRole) {
      await AdminUserRole.create({
        userId: admin.id,
        roleId: adminRole.id,
      });
    }
  }

  async function createAdminRole() {
    let role = await sysRoleRepo.findOne({
      where: { name: SysRoleData.Admin },
    });
    if (!role) {
      role = await new sysRoleRepo({
        name: SysRoleData.Admin,
        text: '系统管理员',
      }).save();
    }
    return role;
  }

  let adminRole = await createAdminRole();
  await createAdmin({ adminRole });
})()
  .catch((error) => console.log(error))
  .finally(async () => {
    if (db) await db.close();
  });
