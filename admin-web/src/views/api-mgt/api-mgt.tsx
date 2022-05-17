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

import {
  AuthoritySelect,
  AuthoritySelectDataType,
  AuthoritySelectModel,
} from '../comps/authority-select'
import { AuthorityDataType } from '../authority-mgt'

export type ApiDataType = {
  id?: string
  name?: string
  method?: string
  path?: string
  authorityList?: AuthorityDataType[]
}
@Component
export class ApiMgt extends Base {
  $refs: { table: TableEx; form: ElementUI.Form; authSelect: AuthoritySelect }
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
        prop: 'path',
        label: 'path',
      },
      {
        prop: 'method',
        label: 'method',
      },
      {
        prop: 'authorityList',
        label: '权限',
        render: (h, params) => {
          let data = params.row as ApiDataType
          return <Tags items={data.authorityList}></Tags>
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
    let rs = await this.$api.sysApiQuery({
      ...data,
    })
    this.loadedData = rs
    return rs
  }

  private getNewData() {
    return {
      id: null,
      name: '',
      method: '',
      path: '',
      authorityList: [],
    } as ApiDataType
  }
  editingData: ApiDataType = null
  addClick() {
    this.editingData = this.getNewData()
    this.editData()
  }

  editClick(row) {
    this.editingData = { ...row }
    this.editData()
  }
  private originalData: ApiDataType = null
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
    this.$refs.authSelect?.reset()
    this.$refs.form?.resetFields()
    this.editDiaVisible = true
  }

  async saveClick() {
    let rs = await this.op.run({ op: 'save', data: this.editingData })
    if (rs.success) this.runLoadData()
  }
  async save(data: ApiDataType) {
    let authorityList = this.authData.list
      .filter((ele) => this.authData.value.includes(ele.key))
      .map((ele) => {
        return { id: ele.data.id }
      })
    data.authorityList = authorityList
    if (this.editDiaVisible) await this.$utils.validateForm(this.$refs.form)
    if (!data.id) await this.$api.sysApiCreate(data)
    else await this.$api.sysApiUpdate(data)
    this.editDiaVisible = false
  }

  @Confirm('确认删除?')
  async delClick(row) {
    let rs = await this.op.run({ op: 'del', data: row })
    if (rs.success) this.runLoadData()
  }

  async del(data: ApiDataType) {
    await this.$api.sysApiDelete({ id: data.id })
  }
  private authData: AuthoritySelectDataType = {
    list: [],
    value: [],
  }

  rules = {
    method: [{ required: true }],
    path: [{ required: true }],
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
          <FormItem label="method" prop="method">
            <Input
              v-model={this.editingData.method}
              on-input={() => {
                this.editingData.method = this.editingData.method.toUpperCase()
              }}
            />
          </FormItem>
          <FormItem label="path" prop="path">
            <Input v-model={this.editingData.path} />
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
              prop: 'method',
              label: 'method',
              matchType: QueryOpEnum.$like,
            },
            {
              prop: 'path',
              label: 'path',
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
