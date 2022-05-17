import * as decorator from '../decorator'
export function convClass<prop, partial extends boolean = false, U = {}>(t: U) {
  type P = partial extends false ? prop : Partial<prop>
  return t as any as {
    new (props: P & VueComponentOptions<Partial<prop>>): any
    props: { [key in keyof prop]: { default: any } }
  } & U
}

export type convType<prop, partial extends boolean = false> = {
  new (
    props: (partial extends false ? prop : Partial<prop>) &
      VueComponentOptions<Partial<prop>>,
  ): any
}

export const getCompOpts = decorator.getCompOpts

export function getInstCompName(inst) {
  if (inst.componentOptions) {
    return inst.componentOptions.Ctor.options.name
  }
}
