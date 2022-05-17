export type TableExQuery = {
  prop: string
  label?: string
  propType?: string
  matchType?: string
  data?: any
}

export class TableExModel<T = any> {
  queryProps: TableExQuery[] = []
  constructor(opt: { queryProps: TableExQuery[] }) {
    this.queryProps = opt.queryProps
    let query: any = {}
    this.queryProps.forEach((ele) => {
      query[ele.prop] = {
        value: '',
        matchType: ele.matchType || '',
      }
    })
    this.query = query
  }
  page = {
    index: 1,
    size: 10,
  }
  sort = {
    orderBy: '',
    sortOrder: '',
  }
  query: T = null
  selection = []
  setPage(p: { index?: any; size?: any }) {
    if (p) {
      const index = parseInt(p.index)
      if (!isNaN(index) && index > 0) {
        this.page.index = index
      }

      const size = parseInt(p.size)
      if (!isNaN(size) && size > 0) {
        this.page.size = size
      }
    }
  }

  setSort(sort: { orderBy; sortOrder }) {
    this.sort.orderBy = sort.orderBy
    this.sort.sortOrder = sort.sortOrder
  }

  set(data) {
    let query = data.query
    if (query) {
      this.queryProps.forEach((ele) => {
        for (let key in this.query[ele.prop]) {
          this.query[ele.prop][key] = query[ele.prop]?.[key]
        }
      })
    }
    if (data.page) {
      this.setPage(data.page)
    }
  }
}
