import { Watch } from 'vue-property-decorator'
import { TransferData } from 'element-ui/types/transfer'

import { Component, Vue, Prop } from '@/components/decorator'
import { Autocomplete, Transfer } from '@/components'
import { Base } from '@/views/base'
import { AuthorityDataType } from '@/views/authority-mgt'
import { QueryOpEnum } from '@/models/enum'

import styles from './index.module.less'

export type AuthorityTransferData = TransferData & {
  data: AuthorityDataType
}

type AuthorityQueryDataType = {
  value: string
  data: AuthorityDataType
}

export type AuthoritySelectDataType = {
  list: AuthorityTransferData[]
  value: string[]
}

class AuthoritySelectProp {
  @Prop()
  data: AuthoritySelectDataType
}

@Component({
  props: AuthoritySelectProp,
  extends: Base,
})
export class AuthoritySelect extends Vue<AuthoritySelectProp, Base> {
  private authQueryStr = ''
  private isAuthQueryClick = false
  private async authQuery(queryString: string, cb) {
    this._authQuery(queryString)
      .catch((e) => {
        return []
      })
      .then((t: Array<AuthorityDataType>) => {
        let data = t.map((ele) => {
          return {
            value: ele.text,
            data: ele,
          } as AuthorityQueryDataType
        })
        cb(data)
      })
  }
  private async _authQuery(queryString: string) {
    queryString = queryString.trim()
    let queryData = {
      where: {
        status: 1,
      },
    }
    if (queryString) {
      let like = `%${queryString}%`
      queryData.where[QueryOpEnum.$or] = [
        {
          name: { [QueryOpEnum.$like]: like },
        },
        {
          text: { [QueryOpEnum.$like]: like },
        },
      ]
    }
    let rs = await this.$api.sysAuthorityQuery(queryData)
    return rs.rows
  }
  private authSelect(row: AuthorityQueryDataType) {
    let data = row.data
    let matched = this.data.list.find((ele) => ele.key === data.name)
    if (!matched) {
      this.data.list.push(this.auth2TransferData(data))
    }
    let matchedValue = this.data.value.find((ele) => ele === data.name)
    if (!matchedValue) this.data.value.push(data.name)
  }
  private auth2TransferData(data: AuthorityDataType): AuthorityTransferData {
    return {
      key: data.name,
      label: `${data.text}(${data.name})`,
      disabled: false,
      data,
    }
  }
  reset() {
    this.authQueryStr = ''
  }
  render() {
    return (
      <div>
        <Autocomplete
          ref="authQueryInput"
          class={styles['query-input']}
          value={this.authQueryStr}
          on-input={(v) => {
            if (this.isAuthQueryClick) {
              this.isAuthQueryClick = false
              return
            }
            this.authQueryStr = v
          }}
          fetchSuggestions={this.authQuery}
          clearable
          on-select={this.authSelect}
          scopedSlots={{
            default: ($scope) => {
              let item = $scope.item as AuthorityQueryDataType
              return (
                <span
                  style="display:flex"
                  on-click={() => {
                    this.isAuthQueryClick = true
                  }}
                >
                  {item.data.text}({item.data.name})
                </span>
              )
            },
          }}
        ></Autocomplete>
        <Transfer
          filterable
          titles={['移除', '已选择']}
          data={this.data.list}
          v-model={this.data.value}
        ></Transfer>
      </div>
    )
  }
}
