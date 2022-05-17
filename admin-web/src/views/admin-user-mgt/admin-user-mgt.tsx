import ElementUI from 'element-ui'
import { Watch } from 'vue-property-decorator'

import { Component, Confirm } from '@/components/decorator'
import { Base } from '@/views/base'
import {
  Button,
  Buttons,
  Dialog,
  Form,
  FormItem,
  Input,
  TableEx,
  TableExColumnProp,
  Tags,
} from '@/components'
import { cls } from '@/components/styles'
import { OperateModel } from '@/utils'
import { QueryOpEnum } from '@/models/enum'
import { UserInfo } from '@/models/user'
import {
  AuthoritySelect,
  AuthoritySelectDataType,
  AuthoritySelectModel,
} from '../comps/authority-select'
import {
  RoleSelect,
  RoleSelectDataType,
  RoleSelectModel,
} from '../comps/role-select'
import { RoleTags } from '../comps/role-tags'

export type AdminUserDataType = UserInfo & {}

@Component
export class AdminUserMgt extends Base {
  $refs: {
    table: TableEx
    form: ElementUI.Form
    authSelect: AuthoritySelect
    roleSelect: AuthoritySelect
  }
  op: OperateModel<{ op: string; data?: any }> = null
  loadedData: any = null
  created() {
    this.init()
  }
  mounted() {
    this.runLoadData()
  }

  columns: TableExColumnProp[] = []
  init() {
    this.op = this.getOpModel({
      fn: ({ op, data }) => {
        if (op === 'save') return this.save(data)
      },
    })
    this.loadedData = {
      rows: [],
      total: null,
    }
    this.columns = [
      {
        type: 'expand',
        render: (h, params) => {
          let data = params.row as AdminUserDataType
          return (
            <div>
              <Tags items={data.allAuthorityList}></Tags>
            </div>
          )
        },
      },
      {
        prop: 'account',
        label: '账号',
      },
      {
        prop: 'nickname',
        label: '昵称',
      },
      {
        prop: 'roleList',
        label: '角色',
        render: (h, params) => {
          let data = params.row as AdminUserDataType
          return <RoleTags items={data.roleList}></RoleTags>
        },
      },
      {
        prop: 'authorityList',
        label: '权限',
        render: (h, params) => {
          let data = params.row as AdminUserDataType
          return <Tags items={data.authorityList}></Tags>
        },
      },
      {
        prop: 'op',
        label: '操作',
        fixed: 'right',
        width: '140',
        render: (h, params) => {
          let data = params.row as AdminUserDataType
          return (
            <div>
              <Buttons
                defaultType="text"
                items={[
                  {
                    label: '修改',
                    click: () => {
                      this.editClick(data)
                    },
                  },
                ]}
              ></Buttons>
            </div>
          )
        },
      },
    ]
  }

  @Watch('$route')
  private watchRoute() {
    this.runLoadData()
  }

  private toQuery(opt) {
    let model = this.$refs.table.model
    this.gotoPage(
      this.$utils.getUrl({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...this.$utils.tableExModel2Query({
            model,
            refresh: opt.refresh,
          }),
        },
      }),
    )
  }

  private runLoadData() {
    let table = this.$refs.table
    if (table) {
      this.$utils.query2TableExModel({
        query: this.$route.query,
        model: table.model,
      })
      table.loadData()
    }
  }

  async loadData(opt) {
    let model = this.$refs.table.model
    let data = this.$utils.tableExModel2ApiParams({ model })
    let rs = await this.$api.adminUserMgtQuery({
      ...data,
    })
    this.loadedData = rs
    return rs
  }

  private getNewData() {
    return {
      id: null,
      account: '',
      nickname: '',
      password: '',
      authorityList: [],
      roleList: [],
    } as AdminUserDataType
  }
  editingData: AdminUserDataType = null
  addClick() {
    this.editingData = this.getNewData()
    this.editData()
  }

  editClick(row) {
    this.editingData = { ...row }
    this.editData()
  }

  private originalData: AdminUserDataType = null
  private editData() {
    this.originalData = this.$utils.clone(this.editingData)
    if (this.editingData.id) {
      this.formOpt.account.disabled = true
      this.formOpt.nickname.disabled = true
    } else {
      this.formOpt.account.disabled = false
      this.formOpt.nickname.disabled = false
    }

    this.authData.list = [
      ...this.editingData.authorityList.map((ele) =>
        AuthoritySelectModel.toTransferData(ele),
      ),
    ]
    this.authData.value = this.authData.list.map((ele) => ele.key)

    this.roleData.list = [
      ...this.editingData.roleList.map((ele) =>
        RoleSelectModel.toTransferData(ele),
      ),
    ]
    this.roleData.value = this.roleData.list.map((ele) => ele.key)

    this.$refs.form?.resetFields()
    this.$refs.authSelect?.reset()
    this.$refs.roleSelect?.reset()
    this.editDiaVisible = true
  }

  async saveClick() {
    let rs = await this.op.run({ op: 'save', data: this.editingData })
    if (rs.success) this.runLoadData()
  }
  async save(data: AdminUserDataType) {
    let authorityList = this.authData.list
      .filter((ele) => this.authData.value.includes(ele.key))
      .map((ele) => {
        return { id: ele.data.id }
      })
    data.authorityList = authorityList
    let roleList = this.roleData.list
      .filter((ele) => this.roleData.value.includes(ele.key))
      .map((ele) => {
        return { id: ele.data.id }
      })
    data.roleList = roleList
    if (this.editDiaVisible) await this.$utils.validateForm(this.$refs.form)
    if (!data.id) await this.$api.adminUserMgtCreate(data)
    else await this.$api.adminUserMgtUpdate(data)
    this.editDiaVisible = false
  }

  async enableToggleClick(data) {
    let rs = await this.op.run({
      op: 'save',
      data: { id: data.id, status: !data.status },
    })
    if (rs.success) this.runLoadData()
  }

  private authData: AuthoritySelectDataType = {
    list: [],
    value: [],
  }

  private roleData: RoleSelectDataType = {
    list: [],
    value: [],
  }

  rules = {
    account: [{ required: true }],
    nickname: [{ required: true }],
  }

  editDiaVisible = false

  private formOpt = {
    account: {
      disabled: false,
    },
    nickname: {
      disabled: false,
    },
  }
  renderForm() {
    return (
      <div v-loading={this.op.loading}>
        <Form
          ref="form"
          props={{ model: this.editingData }}
          rules={this.rules}
          labelPosition="top"
          inline
        >
          <FormItem prop="account">
            <span slot="label">账号</span>
            <Input
              v-model={this.editingData.account}
              disabled={this.formOpt.account.disabled}
            />
          </FormItem>
          <FormItem label="昵称" prop="nickname">
            <Input
              v-model={this.editingData.nickname}
              disabled={this.formOpt.nickname.disabled}
            />
          </FormItem>
          <br />
          <FormItem label="权限" prop="authorityList">
            <AuthoritySelect
              ref="authSelect"
              data={this.authData}
            ></AuthoritySelect>
          </FormItem>
          <br />
          <FormItem label="角色" prop="roleList">
            <RoleSelect ref="roleSelect" data={this.roleData}></RoleSelect>
          </FormItem>
        </Form>
      </div>
    )
  }
  render() {
    let data = this.loadedData
    return (
      <div>
        <TableEx
          ref="table"
          columns={this.columns}
          tableProps={{ data: data.rows, stripe: true }}
          total={data.total}
          pagePosition="both"
          loadFn={this.loadData}
          queryProps={[
            {
              prop: 'account',
              label: '账号',
              matchType: QueryOpEnum.$like,
            },
            {
              prop: 'nickname',
              label: '昵称',
              matchType: QueryOpEnum.$like,
            },
          ]}
          on-query-trigger={this.toQuery}
          buttons={[
            {
              name: 'query',
              label: '查询',
              type: 'primary',
              click: () => {
                this.toQuery({ refresh: true })
              },
            },
            {
              name: 'add',
              label: '添加',
              click: this.addClick,
            },
          ]}
        ></TableEx>
        <Dialog
          class={cls.dialog}
          appendToBody
          visible={this.editDiaVisible}
          on={{ 'update:visible': (v) => (this.editDiaVisible = v) }}
          title={this.editingData?.id ? '修改' : '新增'}
          width="800px"
        >
          {this.editingData && this.renderForm()}
          <div slot="footer">
            <Button on-click={this.saveClick}>保存</Button>
          </div>
        </Dialog>
      </div>
    )
  }
}
