import { Watch } from 'vue-property-decorator'
import ElementUI from 'element-ui'
import {
  TableColumnFixedType,
  TableColumnType,
} from 'element-ui/types/table-column'

import { Component, Vue, Prop } from '@/components/decorator'
import { OperateModel } from '@/utils'
import {
  Card,
  ButtonItem,
  Buttons,
  Pagination,
  Row,
  Col,
  Table,
  TableColumn,
  Result,
  DynamicComp,
} from '..'

import { BaseComp } from '../base-comp'
import { TableExModel, TableExQuery } from './model'
import styles from './index.module.less'

export type TableExColumnProp = {
  prop?: string
  label?: string
  className?: string
  labelClassName?: string
  fixed?: boolean | TableColumnFixedType
  width?: string
  type?: TableColumnType
  render?: (h, params) => any
}

export type TableExQueryFieldProp = TableExQuery & {}

class TableExProp {
  @Prop()
  tableProps?: Partial<ElementUI.Table>

  @Prop()
  columns?: TableExColumnProp[]

  @Prop()
  queryProps?: TableExQueryFieldProp[]

  @Prop()
  buttons?: ButtonItem[]

  @Prop()
  loadFn?: (opt: { model: TableExModel }) => Promise<any>

  @Prop()
  total?: number

  @Prop({
    default: '',
  })
  pagePosition?: 'bottom' | 'top' | 'both' | 'none' | ''
}
@Component({
  extends: BaseComp,
  props: TableExProp,
})
export class TableEx extends Vue<TableExProp, BaseComp> {
  model: TableExModel = null
  op: OperateModel = null

  created() {
    this.op = new OperateModel({
      noDefaultHandler: true,
      fn: async () => {
        return this._lodaData()
      },
    })
    this.model = new TableExModel({
      queryProps: this.queryProps,
    })
    this._queryTrigger = this.debounce((opt) => {
      this.$emit('query-trigger', { ...opt })
    }, 50)
  }

  private cols?: TableExColumnProp[] = []
  @Watch('columns', {
    immediate: true,
  })
  private watchColumns() {
    this.cols = this.columns || []
  }

  @Watch('model.page.index')
  @Watch('model.page.size')
  private watchPage(val) {
    this.queryTrigger()
  }

  private _queryTrigger
  private queryTrigger(opt?: { refresh?: boolean }) {
    this._queryTrigger(opt)
  }

  errMsg = ''
  async loadData() {
    this.errMsg = ''
    let rs = await this.op.run()
    if (!rs.success) this.errMsg = rs.msg
    return rs
  }

  private _lodaData() {
    if (this.loadFn) {
      return this.loadFn({
        model: this.model,
      })
    }
  }

  renderHeader() {
    return (
      <div class={styles['header']}>
        <Row class={styles['query-fields']} gutter={5}>
          {this.queryProps?.map((ele) => {
            return (
              <Col xs={24} sm={6} md={4}>
                <span class={styles['query-field-label']}>{ele.label}</span>
                <DynamicComp
                  type={ele.propType || 'input'}
                  v-model={this.model.query[ele.prop].value}
                  v-key-input={{
                    key: 'enter',
                    fn: () => {
                      this.queryTrigger({ refresh: true })
                    },
                  }}
                  compProps={{
                    clearable: true,
                    placeholder: ele.label,
                  }}
                  compData={ele.data}
                ></DynamicComp>
              </Col>
            )
          })}
        </Row>
        {this.buttons && (
          <div class={styles['buttons']}>
            <Buttons items={this.buttons}></Buttons>
          </div>
        )}
      </div>
    )
  }

  renderPagination() {
    return (
      <Pagination
        class={styles['page']}
        total={this.total}
        background
        layout="total, sizes, prev, pager, next, jumper"
        currentPage={this.model.page.index}
        pageSize={this.model.page.size}
        hideOnSinglePage
        on={{
          'update:currentPage': (val) => {
            this.model.page.index = val
          },
          'update:pageSize': (val) => {
            this.model.page.size = val
          },
        }}
      ></Pagination>
    )
  }
  renderData(h) {
    return (
      <div>
        {['top', 'both'].includes(this.pagePosition) && this.renderPagination()}
        <Table props={this.tableProps}>
          {this.cols.map((ele) => {
            return (
              <TableColumn
                props={ele}
                scopedSlots={{
                  default: !ele.render
                    ? undefined
                    : ($scope) => {
                        return ele.render(h, $scope)
                      },
                }}
              ></TableColumn>
            )
          })}
        </Table>
        {['bottom', 'both'].includes(this.pagePosition) &&
          this.renderPagination()}
      </div>
    )
  }
  render(h) {
    return (
      <div v-loading={this.op.loading}>
        {this.renderHeader()}
        {this.errMsg ? (
          <Card>
            <Result title="出错了" subTitle={this.errMsg} icon="error"></Result>
          </Card>
        ) : (
          this.renderData(h)
        )}
      </div>
    )
  }
}
