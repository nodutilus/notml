import { oom } from '../@notml/notml/core.min.js'


const { HTMLElement, document } = window


/** Тестовый класс со стилями */
class MySpan extends oom.extends(HTMLElement) {

  static style = oom.style({ '.my_span': { background: 'darkorange' } })

  template = oom.span('darkorange', { class: 'my_span' })

}

oom.define(MySpan)
oom(document.body, new MySpan())
