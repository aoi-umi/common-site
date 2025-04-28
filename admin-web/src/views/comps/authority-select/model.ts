import { AuthorityDataType } from '@/views/authority-mgt'
import AuthoritySelect, { AuthorityTransferData } from './authority-select.vue'

export type AuthoritySelectInstance = InstanceType<typeof AuthoritySelect>
export class AuthoritySelectModel {
  static toTransferData(data: AuthorityDataType): AuthorityTransferData {
    return {
      key: data.name,
      label: `${data.text}(${data.name})`,
      disabled: false,
      data,
    }
  }
}
