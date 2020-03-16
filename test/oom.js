import { assert, Test } from '@nodutilus/test'
import { oom } from '../src/oom.js'


/** Тесты источника данных заказа */
export default class TestOOM extends Test {

  /** Базовый чейнинг для создания верстки */
  ['chaining - base']() {
    const html = oom('html')
      .body(oom
        .div('test')
      )
      .dom.outerHTML

    assert.equal(html, '<html><body><div>test</div></body></html>')
  }

}
