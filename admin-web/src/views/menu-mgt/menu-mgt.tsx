import ElementUI from 'element-plus'

import { Component, Confirm } from '@/components/decorator'
import { Base } from '@/views/base'
import {
  Button,
  Input,
  Option,
  Select,
  Load,
  Tree,
  Form,
  FormItem,
  Dialog,
  Divider,
  Switch,
  Buttons,
  Tags,
} from '@/components'
import { OperateModel } from '@/utils'
import { IconSelect } from '@/components/icon-select'
import { cls } from '@/components/styles'

import {
  AuthoritySelect,
  AuthoritySelectDataType,
  AuthoritySelectModel,
} from '../comps/authority-select'
import { AuthorityDataType } from '../authority-mgt'
import styles from './index.module.less'

export type MenuType = {
  id?: string
  pageName?: string
  text?: string | unknown
  name?: string
  icon?: string
  status?: boolean
  parentId?: string
  children?: MenuType[]
  authorityList?: AuthorityDataType[]
}
@Component
export class MenuMgt extends Base {
  $refs: {
    tree: ElementUI.Tree
    form: ElementUI.Form
    authSelect: AuthoritySelect
  }
  op: OperateModel<{ op: string; data?: any }> = null
  data: MenuType[] = []
  editingData: MenuType = null
  loadedData = null
  created() {
    this.init()
  }

  init() {
    this.op = this.getOpModel({
      fn: ({ op, data }) => {
        if (op === 'save') return this.save(data)
        else if (op === 'del') return this.del(data)
        else if (op === 'move') return this.move(data)
      },
    })
  }

  async loadData() {
    let rs = await this.$api.sysMenuQuery()
    this.loadedData = rs
    this.data = rs.menuTree
    return rs
  }

  editDiaVisible = false
  currData: MenuType = null
  currParent: MenuType = null
  getNewMenuData() {
    let newData: MenuType = {
      id: null,
      pageName: '',
      name: '',
      text: '',
      icon: '',
      children: [],
      authorityList: [],
      status: true,
    }
    return newData
  }
  addClick(node?, data?: MenuType) {
    this.currParent = data
    this.editingData = this.getNewMenuData()
    this.currData = this.editingData
    this.editData()
  }

  editClick(node, data: MenuType) {
    this.currData = data
    this.editingData = { ...data }
    this.editData()
  }

  private editData() {
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

  private findInChild(node, data) {
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex((d) => d.id === data.id)
    return {
      index,
      children,
    }
  }

  @Confirm(`确认删除?`)
  delClick(node, data) {
    this.op.run({
      op: 'del',
      data: { node, data },
    })
  }
  async del({ node, data }) {
    let { children, index } = this.findInChild(node, data)
    await this.$api.sysMenuDelete({ id: data.id })
    children.splice(index, 1)
  }

  saveClick() {
    this.op.run({
      op: 'save',
      data: { data: this.editingData },
    })
  }

  enableToggleClick(node, data) {
    this.currData = data
    this.op.run({
      op: 'save',
      data: { data: { id: data.id, status: !data.status } },
    })
  }

  async save({ data }) {
    let authorityList = this.authData.list
      .filter((ele) => this.authData.value.includes(ele.key))
      .map((ele) => {
        return { id: ele.data.id }
      })
    data.authorityList = authorityList
    if (this.editDiaVisible) await this.$utils.validateForm(this.$refs.form)
    let { children, ...saveData } = data
    if (!this.currData.id) {
      let rs = await this.$api.sysMenuCreate({
        ...saveData,
        parentId: this.currParent?.id,
      })
      ;(this.currParent?.children || this.data).push({
        ...this.getNewMenuData(),
        ...rs,
      })
    } else {
      let rs = await this.$api.sysMenuUpdate(saveData)
      for (let key in rs) {
        this.currData[key] = rs[key]
      }
    }
    this.editDiaVisible = false
  }

  // op = moveUp | moveDown
  moveClick(data, op) {
    this.currData = data
    this.op.run({
      op: 'move',
      data: { op },
    })
  }

  async move(data) {
    let rs = await this.$api.sysMenuMove({
      ...data,
      id: this.currData.id,
    })
    if (rs.update) this.loadData()
  }

  private authData: AuthoritySelectDataType = {
    list: [],
    value: [],
  }

  rules = {
    name: [{ required: true }],
    text: [{ required: true }],
  }

  renderFn() {
    return (
      <div class={styles['root']} v-loading={this.op.loading}>
        <div>
          {
            <Buttons
              items={[
                {
                  label: '新增',
                  type: 'primary',
                  click: () => {
                    this.addClick()
                  },
                },
              ]}
            ></Buttons>
          }
        </div>
        <Divider />
        <div>{this.renderTree()}</div>
      </div>
    )
  }

  renderTree() {
    return (
      <Tree
        ref="tree"
        data={this.data}
        props={
          {
            props: {
              children: 'children',
              label: 'text',
            },
          } as any
        }
        defaultExpandAll
        highlightCurrent
        expandOnClickNode={false}
        scopedSlots={{
          default: ($scope) => {
            let { node, data } = $scope as { node: any; data: MenuType }
            return (
              <div class={styles['tree-node']}>
                <span class={{ [styles['disabled']]: !data.status }}>
                  <i class={data.icon}></i>
                  <span>{data.text}</span>
                </span>
                <span class={cls.wrap}></span>
                <div style="width: 120px">
                  <Tags items={data.authorityList}></Tags>
                </div>
                <div class={styles['op-box']}>
                  <Buttons
                    defaultType="text"
                    items={[
                      {
                        label: '添加',
                        click: () => {
                          this.addClick(node, data)
                        },
                      },
                      {
                        label: '编辑',
                        click: () => {
                          this.editClick(node, data)
                        },
                      },
                      {
                        label: !data.status ? '启用' : '禁用',
                        click: () => {
                          this.enableToggleClick(node, data)
                        },
                      },
                      {
                        label: '删除',
                        click: () => {
                          this.delClick(node, data)
                        },
                      },
                    ]}
                  ></Buttons>
                </div>
                <div>
                  <Buttons
                    defaultType="text"
                    items={[
                      {
                        label: '上移',
                        click: () => {
                          this.moveClick(data, 'moveUp')
                        },
                      },
                      {
                        label: '下移',
                        click: () => {
                          this.moveClick(data, 'moveDown')
                        },
                      },
                    ]}
                  ></Buttons>
                </div>
              </div>
            )
          },
        }}
      ></Tree>
    )
  }
  render() {
    return (
      <div>
        <Load loadFn={this.loadData} renderFn={this.renderFn}></Load>
        <Dialog
          class={cls.dialog}
          title={this.editingData?.id ? '修改' : '新增'}
          visible={this.editDiaVisible}
          appendToBody
          on={{
            'update:visible': (newVal) => (this.editDiaVisible = newVal),
          }}
        >
          {this.editingData && (
            <div v-loading={this.op.loading}>
              <Form
                ref="form"
                props={{ model: this.editingData }}
                rules={this.rules}
                labelPosition="top"
                inline
              >
                <FormItem label="名称" prop="name">
                  <Input v-model={this.editingData.name} />
                </FormItem>
                <FormItem label="显示" prop="text">
                  <Input v-model={this.editingData.text} />
                </FormItem>
                <FormItem label="图标" prop="icon">
                  <IconSelect v-model={this.editingData.icon}></IconSelect>
                </FormItem>
                <FormItem label="页面" prop="pageName">
                  <Select v-model={this.editingData.pageName}>
                    {this.loadedData.pages.map((ele) => {
                      return <Option value={ele.name} label={ele.text}></Option>
                    })}
                  </Select>
                </FormItem>
                <br />
                <FormItem label="启用状态" prop="status">
                  <Switch v-model={this.editingData.status}></Switch>
                </FormItem>

                <br />
                <FormItem label="权限">
                  <AuthoritySelect
                    ref="authSelect"
                    data={this.authData}
                  ></AuthoritySelect>
                </FormItem>
              </Form>
            </div>
          )}
          <div slot="footer" class={styles['form-footer']}>
            <Button on-click={this.saveClick}>保存</Button>
          </div>
        </Dialog>
      </div>
    )
  }
}
