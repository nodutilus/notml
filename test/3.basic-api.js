import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

/** Проверка API OOM элементов */
export default class BasicAPI extends Test {

  /**
   * Клонирование элемента для его переиспользования.
   * Создает копию DOM элемента и оборачивает его в новый экземпляр OOM Proxy
   */
  ['Клонирование через OOMElement#clone']() {
    const div1 = oom('div', { class: 'test' })
    const div2 = div1.clone()

    div1('test1')
    div2('test2')

    assert.notEqual(div1.dom, div2.dom)
    assert.equal(div1.html, '<div class="test">test1</div>')
    assert.equal(div2.html, '<div class="test">test2</div>')
  }

}
