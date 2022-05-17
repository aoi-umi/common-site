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
  Switch,
  TableEx,
  TableExColumnProp,
  Tag,
  Tags,
} from '@/components'
import { cls } from '@/components/styles'
import { OperateModel } from '@/utils'
import { QueryOpEnum } from '@/models/enum'
import { AuthorityDataType } from '../authority-mgt'
import {
  AuthoritySelect,
  AuthoritySelectDataType,
  AuthoritySelectModel,
} from '../comps/authority-select'

export type RoleDataType = {
  id?: string
  name?: string
  text?: string
  status?: boolean
  authorityList?: AuthorityDataType[]
  canOperate?: boolean
}

@Component
export class RoleMgt extends Base {
  $refs: {
    table: TableEx
    form: ElementUI.Form
    authSelect: AuthoritySelect
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
        else if (op === 'del') return this.del(data)
      },
    })
    this.loadedData = {
      rows: [],
      total: null,
    }
    this.columns = [
      {
        prop: 'name',
        label: '名字',
      },
      {
        prop: 'text',
        label: '显示',
      },
      {
        prop: 'authorityList',
        label: '权限',
        render: (h, params) => {
          let data = params.row as RoleDataType
          return <Tags items={data.authorityList}></Tags>
        },
      },
      {
        prop: 'status',
        label: '状态',
        render: (h, params) => {
          return params.row.status ? '启用' : '禁用'
        },
      },
      {
        prop: 'op',
        label: '操作',
        fixed: 'right',
        width: '140',
        render: (h, params) => {
          let data = params.row as RoleDataType
          return (
            <div>
              {data.canOperate && (
                <Buttons
                  defaultType="text"
                  items={[
                    {
                      label: '修改',
                      click: () => {
                        this.editClick(data)
                      },
                    },
                    {
                      label: data.status ? '禁用' : '启用',
                      click: () => {
                        this.enableToggleClick(data)
                      },
                    },
                    {
                      label: '删除',
                      click: () => {
                        this.delClick(data)
                      },
                    },
                  ]}
                ></Buttons>
              )}
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
    let rs = await this.$api.sysRoleQuery({
      ...data,
    })
    this.loadedData = rs
    return rs
  }

  private getNewData() {
    return {
      id: null,
      name: '',
      text: '',
      status: true,
      authorityList: [],
    } as RoleDataType
  }
  editingData: RoleDataType = null
  addClick() {
    this.editingData = this.getNewData()
    this.editData()
  }

  editClick(row) {
    this.editingData = { ...row }
    this.editData()
  }

  private originalData: RoleDataType = null
  private editData() {
    this.originalData = this.$utils.clone(this.editingData)
    if (this.editingData.id) {
      this.formOpt.name.disabled = true
      this.formOpt.name.showDisabled = true
    } else {
      this.formOpt.name.disabled = false
      this.formOpt.name.showDisabled = false
    }

    this.authData.list = [
      ...this.editingData.authorityList.map((ele) =>
        AuthoritySelectModel.toTransferData(ele),
      ),
    ]
    this.authData.value = this.authData.list.map((ele) => ele.key)
    this.$refs.form?.resetFields()
    this.$refs.authSelect?.reset()
    this.editDiaVisible = true
  }

  async saveClick() {
    let rs = await this.op.run({ op: 'save', data: this.editingData })
    if (rs.success) this.runLoadData()
  }
  async save(data: RoleDataType) {
    let authorityList = this.authData.list
      .filter((ele) => this.authData.value.includes(ele.key))
      .map((ele) => {
        return { id: ele.data.id }
      })
    data.authorityList = authorityList
    if (this.editDiaVisible) await this.$utils.validateForm(this.$refs.form)
    if (!data.id) await this.$api.sysRoleCreate(data)
    else await this.$api.sysRoleUpdate(data)
    this.editDiaVisible = false
  }

  async enableToggleClick(data) {
    let rs = await this.op.run({
      op: 'save',
      data: { id: data.id, status: !data.status },
    })
    if (rs.success) this.runLoadData()
  }

  @Confirm('确认删除?')
  async delClick(row) {
    let rs = await this.op.run({ op: 'del', data: row })
    if (rs.success) this.runLoadData()
  }

  async del(data: RoleDataType) {
    await this.$api.sysRoleDelete({ id: data.id })
  }

  private authData: AuthoritySelectDataType = {
    list: [],
    value: [],
  }

  rules = {
    name: [{ required: true }],
    text: [{ required: true }],
  }

  editDiaVisible = false
  private formOpt = {
    name: {
      showDisabled: false,
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
          <FormItem prop="name">
            <span slot="label">
              名称
              {this.formOpt.name.showDisabled && (
                <Button
                  type="text"
                  on-click={() => {
                    this.formOpt.name.disabled = !this.formOpt.name.disabled
                    if (this.formOpt.name.disabled) {
                      this.editingData.name = this.originalData.name
                    }
                  }}
                >
                  {this.formOpt.name.disabled ? '修改' : '取消'}
                </Button>
              )}
            </span>
            <Input
              v-model={this.editingData.name}
              disabled={this.formOpt.name.disabled}
            />
          </FormItem>
          <FormItem label="显示" prop="text">
            <Input v-model={this.editingData.text} />
          </FormItem>
          <br />
          <FormItem label="启用状态" prop="status">
            <Switch v-model={this.editingData.status}></Switch>
          </FormItem>
          <br />
          <FormItem label="权限" prop="authorityList">
            <AuthoritySelect
              ref="authSelect"
              data={this.authData}
            ></AuthoritySelect>
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
              prop: 'name',
              label: '名字',
              matchType: QueryOpEnum.$like,
            },
            {
              prop: 'text',
              label: '显示',
              matchType: QueryOpEnum.$like,
            },
            {
              prop: 'status',
              label: '状态',
              propType: 'select',
              data: [
                {
                  label: '启用',
                  value: 1,
                },
                {
                  label: '禁用',
                  value: 0,
                },
              ],
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
