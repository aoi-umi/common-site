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
} from '@/components'
import { OperateModel } from '@/utils'
import { QueryOpEnum } from '@/models/enum'

export type AuthorityDataType = {
  id?: string
  name?: string
  text?: string
  status?: boolean
}
@Component
export class AuthorityMgt extends Base {
  $refs: { table: TableEx; form: ElementUI.Form }
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
          let data = params.row
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
    let rs = await this.$api.sysAuthorityQuery({
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
    } as AuthorityDataType
  }
  editingData: AuthorityDataType = null
  addClick() {
    this.editingData = this.getNewData()
    this.editData()
  }

  editClick(row) {
    this.editingData = { ...row }
    this.editData()
  }
  private originalData: AuthorityDataType = null
  private editData() {
    this.originalData = this.$utils.clone(this.editingData)
    if (this.editingData.id) {
      this.formOpt.name.disabled = true
      this.formOpt.name.showDisabled = true
    } else {
      this.formOpt.name.disabled = false
      this.formOpt.name.showDisabled = false
    }
    this.$refs.form?.resetFields()
    this.editDiaVisible = true
  }

  async saveClick() {
    let rs = await this.op.run({ op: 'save', data: this.editingData })
    if (rs.success) this.runLoadData()
  }
  async save(data: AuthorityDataType) {
    if (this.editDiaVisible) await this.$utils.validateForm(this.$refs.form)
    if (!data.id) await this.$api.sysAuthorityCreate(data)
    else await this.$api.sysAuthorityUpdate(data)
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

  async del(data: AuthorityDataType) {
    await this.$api.sysAuthorityDelete({ id: data.id })
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
        </Form>
        <div>
          <Button on-click={this.saveClick}>保存</Button>
        </div>
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
          appendToBody
          visible={this.editDiaVisible}
          on={{ 'update:visible': (v) => (this.editDiaVisible = v) }}
          title={this.editingData?.id ? '修改' : '新增'}
        >
          {this.editingData && this.renderForm()}
        </Dialog>
      </div>
    )
  }
}
