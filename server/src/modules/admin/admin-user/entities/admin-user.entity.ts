import {
  Column,
  Table,
  DataType,
  Length,
  PrimaryKey,
  AllowNull,
  IsUUID,
  Default,
  Index,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { BaseEntity } from 'src/models/base.entity';
import { SysAuthority } from '../../sys-authority/entities/sys-authority.entity';
import { SysRole } from '../../sys-role/entities/sys-role.entity';
import { SysRoleData } from '../../sys-role/sys-role.constants';

@Table({ tableName: 'admin_user' })
export class AdminUser extends BaseEntity {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index({
    name: 'account',
    unique: true,
  })
  @AllowNull(false)
  @Length({ max: 60 })
  @Column
  account: string;

  @AllowNull(false)
  @Length({ max: 60 })
  @Column
  nickname: string;

  @Length({ max: 60 })
  @AllowNull(false)
  @Column
  password: string;

  @Column
  // 修改密码时间
  changePwdAt: Date;

  @Column(DataType.VIRTUAL)
  authorityList: SysAuthority[];

  @Column(DataType.VIRTUAL)
  roleList: SysRole[];

  @Column(DataType.VIRTUAL)
  allAuthorityList: SysAuthority[];

  @Column(DataType.VIRTUAL)
  authority: { [key: string]: boolean };

  @Column(DataType.VIRTUAL)
  get isSysAdmin() {
    return !!this.roleList?.find((ele) => ele.name === SysRoleData.Admin);
  }

  toJSON() {
    let data = {
      ...this.get(),
    };
    delete data.password;
    return data;
  }
}
