import { Watch } from 'vue-property-decorator'

import { Component, Vue, Prop } from '@/components/decorator'

import { BaseComp } from '../base-comp'

export class InputBaseProp {
  @Prop()
  value?: string
}
@Component({
  extends: BaseComp,
  props: InputBaseProp,
})
export class InputBase extends Vue<InputBaseProp, BaseComp> {
  protected currentValue = this.value || ''
  protected disableEmitChange = false

  @Watch('value')
  watchValue(val) {
    if (this.currentValue !== val) {
      this.disableEmitChange = true
    }
    this.currentValue = val
  }

  @Watch('currentValue')
  watchCurrentValue(val) {
    this.watchCurrentValueHandler && this.watchCurrentValueHandler(val)
    this.$emit('input', val)
    if (this.disableEmitChange) {
      this.disableEmitChange = false
      return
    }
    this.$emit('on-change', val)
  }

  protected watchCurrentValueHandler(val) {}
}
