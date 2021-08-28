import { oom } from '../@notml/core/core.js'

const { HTMLElement, document } = window


/** Тестовый класс со стилями */
class MySpan extends oom.extends(HTMLElement) {

  static style = oom.style({ '.my_shadow': { background: 'darkorange' } })

  template = oom.span('test', { class: 'my_shadow' })

}

/** Тестовый элемент с теневым DOM */
class MyShadowRoot extends oom.extends(HTMLElement) {

  static attachShadow = true

  template = oom(new MySpan())

}

/** Тестовый элемент с теневым DOM */
class MyShadowRootClosed extends oom.extends(HTMLElement) {

  static attachShadow = { mode: 'closed' }

  template = oom(new MySpan())

}


oom.define(MySpan, MyShadowRoot, MyShadowRootClosed)


oom(document.head, oom.style({
  'my-span .my_shadow': { color: 'darkgreen' }
}))

oom(document.body, oom(new MySpan())
  .br()(new MyShadowRoot())
  .br()(new MyShadowRootClosed()))
