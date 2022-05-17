import { AuthorityDataType } from '@/views/authority-mgt'
import { AuthorityTransferData } from './authority-select'

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
