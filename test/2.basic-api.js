// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document } = window


/** Проверка API OOM элементов */
export default class BasicAPI extends Test {

  /**
   * Добавление дочернего элемента.
   * Выполняет универсальное добавление элемента с учетом реализации OOM элементов.
   * Добавление выполняется в конец списка детей, другое поведение нерационально
   */
  ['OOMElement#append - Вставка дочернего элемента']() {
    const div = oom('div')
      .append(oom('a'))
      .append(document.createElement('b'))
      .append('test')

    assert.equal(div.html, '<div><a></a><b></b>test</div>')
  }


  /**
   * Клонирование элемента для его переиспользования.
   * Создает копию DOM элемента и оборачивает его в новый экземпляр OOM Proxy
   */
  ['OOMElement#clone - Клонирование элемента']() {
    const div1 = oom('div', { class: 'test' })
    const div2 = div1.clone()

    div1('test1')
    div2('test2')

    assert.notEqual(div1.dom, div2.dom)
    assert.equal(div1.html, '<div class="test">test1</div>')
    assert.equal(div2.html, '<div class="test">test2</div>')
  }

}
