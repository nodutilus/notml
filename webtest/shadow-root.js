import { oom } from '../@notml/core/core.js'

const { HTMLElement, document } = window


/** Тестовый класс со стилями */
class MySpan extends oom.extends(HTMLElement) {

  static style = oom.style({ '.my_shadow': { background: 'darkorange' } })

  template = oom.span('test1', { class: 'my_shadow' })

}


/** Тестовый класс со стилями */
class MySpan2 extends oom.extends(HTMLElement) {

  static style = oom.style({ '.my_shadow2': { background: 'gold' } })

  template = oom.span('test2', { class: 'my_shadow2' })

}


/** Тестовый элемент с теневым DOM */
class MyShadowRoot extends oom.extends(HTMLElement) {

  static attachShadow = true

  template = oom(new MySpan())
    .br()(new MySpan())
    .br()(new MySpan2())
    .br()(new MySpan2())

}

/** Тестовый элемент с теневым DOM */
class MyShadowRootClosed extends oom.extends(HTMLElement) {

  static attachShadow = { mode: 'closed' }

  template = oom(new MySpan())
    .br()(new MySpan())
    .br()(new MySpan2())
    .br()(new MySpan2())

}


oom.define(MySpan, MySpan2, MyShadowRoot, MyShadowRootClosed)


oom(document.head, oom.style({
  'my-span .my_shadow': { color: 'white' },
  'my-span2 .my_shadow2': { color: 'white' }
}))

oom(document.body, oom(new MySpan())
  .br()(new MySpan2())
  .br()(new MyShadowRoot())
  .br()(new MyShadowRootClosed()))
