import mitt from 'mitt'

type Events = {
  signInSuccess: void
}

const bus = mitt<Events>()
export default bus
