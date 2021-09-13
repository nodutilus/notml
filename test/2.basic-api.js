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
   * Добавление элемента в фрагмент выполняется аналогично добавлению в OOM элемент
   */
  ['OOMFragment#append - Вставка элемента в фрагмент']() {
    const fragment = oom()
      .append(oom('a'))
      .append(document.createElement('b'))
      .append('test')

    assert.equal(fragment.html, '<a></a><b></b>test')
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

    assert.notEqual(div1, div2)
    assert.notEqual(div1.dom, div2.dom)
    assert.equal(div1.html, '<div class="test">test1</div>')
    assert.equal(div2.html, '<div class="test">test2</div>')
  }

  /** Фрагменты документов копируются, как и элементы, включая все вложенные элементы */
  ['OOMFragment#clone - Клонирование фрагмента документа']() {
    const fragment1 = oom
      .div('test1')
      .div('test2')
    const fragment2 = fragment1.clone()

    fragment2.dom.children[0].className = 'test3'

    assert.notEqual(fragment1, fragment2)
    assert.notEqual(fragment1.dom, fragment2.dom)
    assert.equal(fragment1.html, '<div>test1</div><div>test2</div>')
    assert.equal(fragment2.html, '<div class="test3">test1</div><div>test2</div>')
  }

}
