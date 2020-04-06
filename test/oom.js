import { assert, Test } from '@nodutilus/test'
import { oom } from '../src/oom.js'

const { HTMLElement, DocumentFragment, customElements, document } = window


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
    const { html } = oom('html')
      .body(oom
        .div('test')
      )

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
      .html
    const form2 = oom('form')
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      })
      .html
    const form3 = oom('form', form => form
      .span('test', span => {
        span = span.dom
        span.textContent += '-ok'
        span.classList.add('test')
      }))
      .html
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
      .html

    assert.equal(div, '<div class="test"><span></span></div>')
  }

  /** Чейнинг конструктора элементов oom из самого элемента */
  ['chaining - oom in OOMAbstract']() {
    const div = oom('div')
      .oom('span', 'test')
      .oom('MyElm')
      .html

    assert.equal(div, '<div><span>test</span><my-elm></my-elm></div>')
  }

  /** Пустой вызов oom и обращение к атрибутам oom создают фрагмент */
  ['create Fragment with oom']() {
    const fr1 = oom().div1()
    const fr2 = oom.div2()
    const div1 = oom('div', fr1).dom.innerHTML
    const div2 = oom('div', fr2).dom.innerHTML

    assert.equal(div1, '<div1></div1>')
    assert.equal(div2, '<div2></div2>')
    assert.ok(fr1.dom instanceof DocumentFragment)
    assert.ok(fr2.dom instanceof DocumentFragment)
  }

  /** Простая запись атрибутов */
  ['setAttributes - simple']() {
    const div = oom('div', { id: 'test' }).html

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

  /** Метод append от оом аналогичен методу от OOMAbstract */
  ['oom - append']() {
    const div11 = oom().div().append(oom('span'))
    const div12 = oom.append(oom('div')).span()
    const div13 = oom('div').append(oom('span'))

    assert.equal(div11.html, '<div></div><span></span>')
    assert.equal(div12.html, '<div></div><span></span>')
    assert.equal(div13.html, '<div><span></span></div>')
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

    assert.equal(span.html, '<span>test</span>')
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

  /** Создание и регистрация пользовательских элементов */
  ['customElements - create']() {
    let cCount = 0

    /** Test custom element */
    class MyElement extends HTMLElement {

      /***/
      constructor() {
        super()
        this.cCount = ++cCount
      }

    }

    customElements.define('my-element1', MyElement)

    const mye = oom('my-element1')
      .MyElement1('test', { class: 'Test' })

    assert.equal(cCount, 2)
    assert.equal(mye.dom.cCount, 1)
    assert.equal(mye.html, '<my-element1><my-element1 class="Test">test</my-element1></my-element1>')
  }

  /** Кастомизация содержания пользовательских элементов */
  ['customElements - connectedCallback']() {
    /** Test custom element */
    class MyElement extends HTMLElement {

      /***/
      connectedCallback() {
        this.classList.add('MyElement')
        this.append(oom('span', 'test').dom)
      }

    }

    customElements.define('my-element2', MyElement)

    const mye = oom.MyElement2()

    assert.equal(mye.html, '<my-element2></my-element2>')

    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element2 class="MyElement"><span>test</span></my-element2>')
    document.body.innerHTML = ''
  }

  /** Регистрация новых элементов через oom.define */
  ['customElements - oom.define, static template']() {
    /** Test custom element */
    class MyElement3 extends HTMLElement {

      static template = oom('span', 'test')

      /***/
      template() {
        this.classList.add('MyElement')
      }

    }

    const mye = oom.define(MyElement3).oom(MyElement3)

    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element3 class="MyElement"><span>test</span></my-element3>')
    document.body.innerHTML = ''
  }

  /** Статический метод шаблона */
  ['customElements - oom.define, static template function']() {
    /** Test custom element */
    class MyElement3x1 extends HTMLElement {

      static tmp = oom('div')

      /** @returns {oom} */
      static template = () => {
        return this.tmp.clone().span('test')
      }

    }

    const mye = oom.define(MyElement3x1).oom(MyElement3x1)

    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.tmp.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element3x1><div><span>test</span></div></my-element3x1>')
    document.body.innerHTML = ''
  }

  /** Шаблоны на экземпляре тоже клонируются,
   *   т.к. могут быть использованы в рамках жц */
  ['customElements - oom.define, instance template']() {
    /** Test custom element */
    class MyElement4 extends HTMLElement {

      template = oom('span', 'test')

    }

    const mye = oom.define(MyElement4).oom(MyElement4)

    document.body.append(mye.dom)
    assert.equal(mye.dom.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element4><span>test</span></my-element4>')
    document.body.innerHTML = ''
  }

  /** Шаблон неподдерживаемого типа */
  ['customElements - oom.define, instance template (bad)']() {
    /** Test custom element */
    class MyElement5 extends HTMLElement {

      template = 123

    }

    const mye = oom.define(MyElement5).oom(MyElement5)

    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element5></my-element5>')
    document.body.innerHTML = ''
  }

  /** Метод шаблона на экземпляре принимает на вход статичный шаблон */
  ['customElements - oom.define, instance template function']() {
    /** Test custom element */
    class MyElement6 extends HTMLElement {

      static template = oom('div')

      /** @param {oom} tmpl */
      template(tmpl) {
        tmpl.span('test')
      }

    }

    const mye = oom.define(MyElement6).oom(MyElement6)

    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element6><div><span>test</span></div></my-element6>')
    document.body.innerHTML = ''
  }

  /** По аналогии с customElements.define можно задать имя тега самому */
  ['customElements - oom.define, указание имени тега']() {
    /** Test custom element */
    class MyElement6 extends HTMLElement { }

    const mye = oom.define('my-e-6', MyElement6).oom(MyElement6)

    document.body.append(mye.dom)

    assert.equal(document.body.innerHTML, '<my-e-6></my-e-6>')
    document.body.innerHTML = ''
  }

  /** Можно использовать пользовательский connectedCallback */
  ['customElements - oom.define, connectedCallback']() {
    /** Test custom element */
    class MyElement7 extends HTMLElement {

      /***/
      connectedCallback() {
        this.classList.add('MyElement')
      }

    }

    const mye = oom.define(MyElement7).oom(MyElement7)

    assert.equal(mye.html, '<my-element7></my-element7>')

    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element7 class="MyElement"></my-element7>')
    document.body.innerHTML = ''
  }

  /** Код из примера - Простая верстка */
  ['example in readme - Example #1']() {
    const oomDiv = oom('div')
      .div({ class: 'header' })
      .div({ class: 'test' }, oom
        .span('Name: ', { class: 'test-label' })
        .span('Test', { class: 'test-name' }))
      .div({ class: 'footer' })
    const divHeader = document.createElement('div')
    const spanName = document.createElement('span')
    const spanTest = document.createElement('span')
    const divTest = document.createElement('div')
    const divFooter = document.createElement('div')
    const domDiv = document.createElement('div')

    divHeader.setAttribute('class', 'header')
    spanName.setAttribute('class', 'test-label')
    spanTest.setAttribute('class', 'test-name')
    divTest.setAttribute('class', 'test')
    divFooter.setAttribute('class', 'footer')
    spanName.textContent = 'Name: '
    spanTest.textContent = 'Test'

    domDiv.append(divHeader)
    divTest.append(spanName)
    divTest.append(spanTest)
    domDiv.append(divTest)
    domDiv.append(divFooter)

    assert.equal(oomDiv.html, domDiv.outerHTML)
  }

  /** Код из примера - Переиспользование элементов */
  ['example in readme - Example #2']() {
    const header = oom('div', { class: 'header' })
      .span('Test Header')
    const block = oom
      .div(oom
        .append(header.clone())
        .div('div 1'))
      .div(oom
        .append(header.clone())
        .div('div 2'))

    assert.equal(block.html,
      '<div>' +
      '<div class="header"><span>Test Header</span></div>' +
      '<div>div 1</div>' +
      '</div>' +
      '<div>' +
      '<div class="header"><span>Test Header</span></div>' +
      '<div>div 2</div>' +
      '</div>')
  }

}
