import SparkMD5 from 'spark-md5'
import * as FileSaver from 'file-saver'
import ElementUI from 'element-ui'
import { defer } from './common'
import { TableExModel } from '@/components/table-ex/model'
import { QueryOpEnum } from '@/models/enum'

export const md5 = (data) => {
  if (typeof data === 'string') return SparkMD5.hash(data)
  else return SparkMD5.hashBinary(data)
}

export const saveFile = (data, name?) => {
  FileSaver.saveAs(data, name)
}

export const validateForm = (form: ElementUI.Form) => {
  let def = defer()
  form.validate((isValid: boolean, invalidFields) => {
    if (!isValid) {
      let msg = []
      for (let key in invalidFields) {
        msg.push(invalidFields[key])
      }
      let err = new Error(
        msg
          .flat()
          .map((ele) => ele.message)
          .join('; '),
      )
      err['data'] = invalidFields
      console.log(err)
      def.reject(err)
    } else {
      def.resolve({ isValid, invalidFields })
    }
  })
  return def.promise
}

export const tableExModel2Query = (opt: {
  model: TableExModel
  refresh?: boolean
}) => {
  let { model } = opt
  if (opt.refresh) model.page.index = 1
  console.log(JSON.stringify(model.query))
  let newQuery = {}
  for (let key in model.query) {
    let v = model.query[key]
    if (v.value) newQuery[key] = v
  }
  let query = {
    data: JSON.stringify({
      query: newQuery,
      page: model.page,
    }),
    _t: Date.now(),
  }
  return query as any
}

export const query2TableExModel = (opt: {
  query: any
  model: TableExModel
}) => {
  let { model, query } = opt
  let data
  if (query.data) {
    data = JSON.parse(query.data)
    model.set(data)
  }
  return data
}

export const tableExModel2ApiParams = (opt: { model: TableExModel }) => {
  let { model } = opt
  let data: any = {
    pageIndex: model.page.index,
    pageSize: model.page.size,
  }
  let where = {}
  for (let key in model.query) {
    let q = model.query[key]
    let v = q.value
    if (typeof v === 'string') {
      v = v.trim()
    }
    if (![null, undefined, ''].includes(v)) {
      if (q.matchType === QueryOpEnum.$like) v = `%${v}%`
      where[key] = q.matchType ? { [q.matchType]: v } : v
    }
  }
  if (Object.keys(where).length) data.where = where
  return data
}
