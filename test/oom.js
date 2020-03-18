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
    const form1 = oom('form', oom
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      }))
      .dom.outerHTML
    const form2 = oom('form')
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      })
      .dom.outerHTML
    const form3 = oom('form', form => form
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      }))
      .dom.outerHTML
    const testForm = '<form><span class="test">test-ok</span></form>'

    assert.equal(form1, testForm)
    assert.equal(form2, testForm)
    assert.equal(form3, testForm)
  }

  /** Чейнинг методов OOMAbstract/OOMFragment/OOMElement */
  ['chaining - oom methods']() {
    const div = oom('div')
      .append(oom('span'))
      .setAttributes({ class: 'test' })
      .dom.outerHTML

    assert.equal(div, '<div class="test"><span></span></div>')
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

  /** Перетаскивание элемента между разными узлами DOM */
  ['OOMElement - moving']() {
    const span = oom('span', 'test')
    const div1 = oom('div')
    const div2 = oom('div')

    div1.append(span)
    assert.equal(span.dom.parentNode, div1.dom)
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '')

    div2.append(span)
    assert.equal(span.dom.parentNode, div2.dom)
    assert.equal(div1.dom.innerHTML, '')
    assert.equal(div2.dom.innerHTML, '<span>test</span>')

    assert.equal(span.dom.outerHTML, '<span>test</span>')
  }

  /** Клонирование элемента */
  ['OOMElement - cloning']() {
    const span = oom('span', 'test')
    const div1 = oom('div')
    const div2 = oom('div')
    const div3 = oom('div')

    div1.append(span.clone())
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '')

    div2.append(span.clone())
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '<span>test</span>')

    assert.equal(span.dom.outerHTML, '<span>test</span>')
    assert.equal(span.dom.parentNode, null)

    div3.append(span)
    assert.equal(div2.dom.innerHTML, '<span>test</span>')
    assert.equal(div3.dom.innerHTML, '<span>test</span>')
    assert.equal(span.dom.parentNode, div3.dom)
  }

  /** Фрагмент не перетаскивается между разными узлами DOM,
   *    его содержимое изымается и вставляется в DOM, оставляя фрагмент-пустышку */
  ['OOMFragment - no moving']() {
    const span = oom.span('test')
    const div1 = oom('div')
    const div2 = oom('div')

    assert.equal(span.dom.childNodes.length, 1)

    div1.append(span)
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '')

    div2.append(span)
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '')

    assert.equal(span.dom.childNodes.length, 0)
  }

  /** Клонирование фрагмента */
  ['OOMFragment - cloning']() {
    const span = oom.span('test')
    const div1 = oom('div')
    const div2 = oom('div')

    assert.equal(span.dom.childNodes.length, 1)

    div1.append(span.clone())
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '')

    div2.append(span.clone())
    assert.equal(div1.dom.innerHTML, '<span>test</span>')
    assert.equal(div2.dom.innerHTML, '<span>test</span>')

    assert.equal(span.dom.childNodes.length, 1)
  }

}
