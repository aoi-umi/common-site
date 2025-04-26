import axios, { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'
import { resolveComponent } from 'vue'
import { RouteLocationRaw, RouteLocation } from 'vue-router'

export async function request(options: AxiosRequestConfig) {
  if (!options.url) {
    throw new Error('url can not be empty!')
  }
  let opt: AxiosRequestConfig = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
    method: 'POST',
    paramsSerializer: qs.stringify,
  }
  if (options.headers) {
    opt.headers = extend({}, opt.headers, options.headers)
    delete options.headers
  }
  opt = extend(opt, options)

  if (opt.method?.toLowerCase() == 'get') {
    opt.params = opt.data
  }

  const rs = await axios.request(opt)
  return rs
}

export function extend(...args) {
  const res = args[0] || {}
  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (typeof arg !== 'object') {
      continue
    }
    for (const key in arg) {
      if (arg[key] !== undefined) {
        res[key] = arg[key]
      }
    }
  }
  return res
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function getDeco(fn: (constructor) => any) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return fn(constructor)
  }
}

export function error(e, code?) {
  if (!(e instanceof Error)) {
    e = new Error(e)
  }
  if (code) {
    e.code = code
  }
  return e
}

export function randStr() {
  return Math.random().toString(36).substr(2, 15)
}

export const stringFormat = function (formatString: string, ...args) {
  if (!formatString) {
    formatString = ''
  }
  let reg = /(\{(\d)\})/g
  if (typeof args[0] === 'object') {
    args = args[0]
    reg = /(\{([^{}]+)\})/g
  }
  const result = formatString.replace(reg, function (...args) {
    const match = args[2]
    return args[match] || ''
  })
  return result
}

export function defer<T = any>() {
  let resolve: (value?: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  const promise = new Promise<T>((reso, reje) => {
    resolve = reso
    reject = reje
  })
  return {
    promise,
    resolve,
    reject,
  }
}

export const wait = (ms) => {
  let def = defer()
  setTimeout(() => {
    def.resolve()
  }, ms)
  return def.promise
}

export const isLocal = () => {
  return window.location.hostname === 'localhost'
}

export const getUrl = (obj: RouteLocation) => {
  let queryStr = qs.stringify(obj.query)
  let url = obj.path + (queryStr ? `?${queryStr}` : queryStr)
  return url
}

export const openWindow = (location: RouteLocationRaw, target?: string) => {
  let url = typeof location === 'string' ? location : getUrl(location as any)
  window.open(url, target)
}

export const setTitle = (title: string) => {
  document.title = title
}

const comps = {}
export const getCompByName = (name: string) => {
  let comp = comps[name]
  if (!comp) {
    comp = comps[name] = resolveComponent(name)
  }
  return comp
}
