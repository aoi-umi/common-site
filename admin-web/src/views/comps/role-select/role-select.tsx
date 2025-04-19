import { Watch } from 'vue-property-decorator'
import { TransferData } from 'element-ui/types/transfer'

import { Component, Vue, Prop } from '@/components/decorator'
import { Autocomplete, Transfer } from '@/components'
import { Base } from '@/views/base'
import { RoleDataType } from '@/views/role-mgt'
import { QueryOpEnum } from '@/models/enum'

import styles from './index.module.less'

export type RoleTransferData = TransferData & {
  data: RoleDataType
}

type RoleQueryDataType = {
  value: string
  data: RoleDataType
}

export type RoleSelectDataType = {
  list: RoleTransferData[]
  value: string[]
}

class RoleSelectProp {
  @Prop()
  data: RoleSelectDataType
}

@Component({
  props: RoleSelectProp,
  extends: Base,
})
export class RoleSelect extends Vue<RoleSelectProp, Base> {
  private roleQueryStr = ''
  private isRoleQueryClick = false
  private async roleQuery(queryString: string, cb) {
    this._roleQuery(queryString)
      .catch((e) => {
        return []
      })
      .then((t: Array<RoleDataType>) => {
        let data = t.map((ele) => {
          return {
            value: ele.text,
            data: ele,
          } as RoleQueryDataType
        })
        cb(data)
      })
  }
  private async _roleQuery(queryString: string) {
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
    let rs = await this.$api.sysRoleQuery(queryData)
    return rs.rows
  }
  private roleSelect(row: RoleQueryDataType) {
    let data = row.data
    let matched = this.data.list.find((ele) => ele.key === data.name)
    if (!matched) {
      this.data.list.push(this.role2TransferData(data))
    }
    let matchedValue = this.data.value.find((ele) => ele === data.name)
    if (!matchedValue) this.data.value.push(data.name)
  }
  private role2TransferData(data: RoleDataType): RoleTransferData {
    return {
      key: data.name,
      label: `${data.text}(${data.name})`,
      disabled: false,
      data,
    }
  }
  reset() {
    this.roleQueryStr = ''
  }
  render() {
    return (
      <div>
        <Autocomplete
          ref="roleQueryInput"
          class={styles['query-input']}
          value={this.roleQueryStr}
          on-input={(v) => {
            if (this.isRoleQueryClick) {
              this.isRoleQueryClick = false
              return
            }
            this.roleQueryStr = v
          }}
          fetchSuggestions={this.roleQuery}
          clearable
          on-select={this.roleSelect}
          scopedSlots={{
            default: ($scope) => {
              let item = $scope.item as RoleQueryDataType
              return (
                <span
                  style="display:flex"
                  on-click={() => {
                    this.isRoleQueryClick = true
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
          scopedSlots={{
            default: ({ option }) => {
              return (
                <el-tooltip content={option.label}>
                  <span>{option.label}</span>
                </el-tooltip>
              )
            },
          }}
        ></Transfer>
      </div>
    )
  }
}
