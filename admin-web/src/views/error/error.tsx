import { Component, Prop, Vue } from '@/components/decorator'
import { Card, Result } from '@/components'
import { Base } from '../base'

class ErrorProp {
  @Prop()
  title?: string
}
@Component({
  extends: Base,
  props: ErrorProp,
})
export class ErrorView extends Vue<ErrorProp, Base> {
  render() {
    return (
      <Card>
        <Result title={this.title || 'Not Found'} icon="error"></Result>
      </Card>
    )
  }
}
