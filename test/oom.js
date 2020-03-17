import { assert, Test } from '@nodutilus/test'
import { oom } from '../src/oom.js'


/** Тесты источника данных заказа */
export default class TestOOM extends Test {

  /** Защита от случайного переопределения полей для Proxy */
  ['disable oom setter']() {
    const div = oom('div')
    let trows = 0

    try {
      oom.div = null
    } catch (error) {
      trows++
    }
    try {
      div.div = null
    } catch (error) {
      trows++
    }

    assert(typeof oom.div, 'function')
    assert(typeof div.div, 'function')
    assert(trows, 2)
  }

  /** Базовый чейнинг для создания верстки */
  ['chaining - base']() {
    const html = oom('html')
      .body(oom
        .div('test')
      )
      .dom.outerHTML

    assert.equal(html, '<html><body><div>test</div></body></html>')
  }

  /** callback для чейнинга и модификаций вложенных элементов */
  ['chaining - with callback']() {
    const form = oom('form', oom
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      })
    ).dom.outerHTML

    assert.equal(form, '<form><span class="test">test-ok</span></form>')
  }

  /** Пустой вызов oom и обращение к атрибутам oom создают фрагмент */
  ['create Fragment with oom']() {
    const { DocumentFragment } = window
    const fr1 = oom().div1()
    const fr2 = oom.div2()
    const div1 = oom('div', fr1).dom.innerHTML
    const div2 = oom('div', fr2).dom.innerHTML

    assert.equal(div1, '<div1></div1>')
    assert.equal(div2, '<div2></div2>')
    assert.ok(fr1.dom instanceof DocumentFragment)
    assert.ok(fr2.dom instanceof DocumentFragment)
  }

  /** Создание кастомных элементов по имени класса */
  ['customElements by class name']() {
    const custom = oom('div')
      .MyTagName()
      .dom.outerHTML

    assert.equal(custom, '<div><my-tag-name></my-tag-name></div>')
  }

  /** Простая запись атрибутов */
  ['setAttributes - simple']() {
    const div = oom('div', { id: 'test' }).dom.outerHTML

    assert.equal(div, '<div id="test"></div>')
  }

  /** Установка обработчика на элемент через атрибуты */
  ['setAttributes - set a function']() {
    let counter = 0
    const div = oom('div', {
      onclick: () => {
        counter++
      }
    }).dom

    div.click()

    assert.equal(counter, 1)
  }

}
