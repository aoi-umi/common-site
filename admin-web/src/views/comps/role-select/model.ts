import { RoleDataType } from '@/views/role-mgt'
import { RoleTransferData } from './role-select'

export class RoleSelectModel {
  static toTransferData(data: RoleDataType): RoleTransferData {
    return {
      key: data.name,
      label: `${data.text}(${data.name})`,
      disabled: false,
      data,
    }
  }
}
