import { RoleDataType } from '@/views/role-mgt'
import RoleSelect, { RoleTransferData } from './role-select.vue'

export type RoleSelectInstance = InstanceType<typeof RoleSelect>
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
