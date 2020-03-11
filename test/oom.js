import { Test } from '@nodutilus/test'
import { oom } from '../src/oom.js'


/** Тесты источника данных заказа */
export default class TestOOM extends Test {

  /** test */
  test() {
    oom
      .div({}, oom
        .div()
      )('span')
      .div(oom('span', 'asd'))
  }

}
