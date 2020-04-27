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

  /** Модификация вложенных элементов, ссылка на DOM созданного элемента */
  ['oom callback, DOM instance']() {
    const form1 = oom('form', oom
      .span('test', span => {
        span.textContent += '-ok'
        span.classList.add('test')
      }))
      .html
    const form2 = oom('form')
      .span('test', span => {
        span.textContent += '-ok'
        span.classList.add('test')
      })
      .html
    const form3 = oom('form', form => {
      form.append(oom.span('test', span => {
        span.textContent += '-ok'
        span.classList.add('test')
      }).dom)
    })
      .html
    const testForm = '<form><span class="test">test-ok</span></form>'

    assert.equal(form1, testForm)
    assert.equal(form2, testForm)
    assert.equal(form3, testForm)
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
      },
      test: () => {
        counter++
      }
    }).dom

    div.click()
    div.test()

    assert.equal(counter, 2)
  }

  /** Установка объекта в качесвте атрибута */
  ['setAttributes - object=>json']() {
    const div = oom('div', { test: [] }).dom

    assert.equal(div.outerHTML, '<div test="json::[]"></div>')
  }

  /** Установка атрибута в верхнем регистре работает по аналогии dataset */
  ['setAttributes - UpperCase']() {
    const div = oom('div', { dataTest: 'test' }).dom

    assert.equal(div.outerHTML, '<div data-test="test"></div>')
  }

  /** Установка атрибутов через oom.setAttributes */
  ['oom - setAttributes']() {
    const div = oom('div').dom

    oom.setAttributes(div, { class: 'test1' })
    assert.equal(div.outerHTML, '<div class="test1"></div>')

    oom.setAttributes(div, 'class', 'test2')
    assert.equal(div.outerHTML, '<div class="test2"></div>')
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

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element2 class="MyElement"><span>test</span></my-element2>')
    document.body.innerHTML = ''
  }

  /** Регистрация новых элементов через oom.define */
  ['customElements - oom.define']() {
    /** Test custom element */
    class MyElementDefine1 extends HTMLElement { }

    /** Test custom element */
    class MyElementDefine2 extends HTMLElement { }


    oom.define(MyElementDefine1)
    oom.define('m-e-d', MyElementDefine2)

    assert.equal(customElements.get('my-element-define1'), MyElementDefine1)
    assert.equal(customElements.get('m-e-d'), MyElementDefine2)
  }

  /** Регистрация новых элементов через oom.define */
  ['customElements - static template']() {
    /** Test custom element */
    class MyElement3 extends HTMLElement {

      static template = oom('span', 'test')

      /***/
      template() {
        this.classList.add('MyElement')
      }

    }

    const mye = oom.define(MyElement3).oom(MyElement3)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element3 class="MyElement"><span>test</span></my-element3>')
    document.body.innerHTML = ''
  }

  /** Статический метод шаблона */
  ['customElements - static template function']() {
    /** Test custom element */
    class MyElement3x1 extends HTMLElement {

      static tmp = oom('div')

      /** @returns {oom} */
      static template = () => {
        return this.tmp.clone().span('test')
      }

    }

    const mye = oom.define(MyElement3x1).oom(MyElement3x1)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.tmp.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element3x1><div><span>test</span></div></my-element3x1>')
    document.body.innerHTML = ''
  }

  /** Статический шаблон в виде текста, передается в метод на экземпляре */
  ['customElements - template string+function']() {
    /** Test custom element */
    class MyElement3x2 extends HTMLElement {

      static template = '<b>test1</b>'

      /** @param {{template:string}} options
       *  @returns {string} */
      template = ({ template }) => template + '<b>test2</b>'

    }

    const mye = oom.define(MyElement3x2).oom(MyElement3x2)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.template, '<b>test1</b>')
    assert.equal(document.body.innerHTML, '<my-element3x2><b>test1</b><b>test2</b></my-element3x2>')
    document.body.innerHTML = ''
  }

  /** Шаблоны на экземпляре тоже клонируются,
   *   т.к. могут быть использованы в рамках жц */
  ['customElements - instance template']() {
    /** Test custom element */
    class MyElement4 extends HTMLElement {

      template = oom('span', 'test')

    }

    const mye = oom.define(MyElement4).oom(MyElement4)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element4><span>test</span></my-element4>')
    document.body.innerHTML = ''
  }

  /** Шаблон неподдерживаемого типа */
  ['customElements - instance template (bad)']() {
    /** Test custom element */
    class MyElement5 extends HTMLElement {

      template = 123

    }

    const mye = oom.define(MyElement5).oom(MyElement5)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element5></my-element5>')
    document.body.innerHTML = ''
  }

  /** Метод шаблона на экземпляре принимает на вход статичный шаблон */
  ['customElements - instance template function']() {
    /** Test custom element */
    class MyElement6 extends HTMLElement {

      static template = oom('div')

      /** @param {{template:oom}} options */
      template({ template }) {
        template.span('test')
      }

    }

    const mye = oom.define(MyElement6).oom(MyElement6)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.constructor.template.dom.parentNode, null)
    assert.equal(document.body.innerHTML, '<my-element6><div><span>test</span></div></my-element6>')
    document.body.innerHTML = ''
  }

  /** Шаблон на экземпляре в виде строки */
  ['customElements - instance template string']() {
    /** Test custom element */
    class MyElement6x1 extends HTMLElement {

      template = '<div>test</div>'

    }

    const mye = oom.define(MyElement6x1).oom(MyElement6x1)

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(mye.dom.template, '<div>test</div>')
    assert.equal(document.body.innerHTML, '<my-element6x1><div>test</div></my-element6x1>')
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

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element7 class="MyElement"></my-element7>')
    document.body.innerHTML = ''
  }

  /** Отслеживание изменений атрибутов */
  ['customElements - attributeChanged']() {
    /** Test custom element */
    class MyElement8x0 extends HTMLElement {

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataClassNameChanged(oldValue, newValue) {
        this.classList.remove(oldValue)
        this.classList.add(newValue)
      }

    }

    /** Test custom element */
    class MyElement8 extends MyElement8x0 {

      /** @returns {oom} */
      template() {
        return oom('div', this.dataset.myText, div => (this._div = div))
      }

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataMyTextChanged(oldValue, newValue) {
        if (this._div.textContent !== newValue) {
          this._div.textContent = newValue
        }
      }

    }

    const mye = oom.define(MyElement8).oom(MyElement8, {
      'data-my-text': 'test1'
    })

    assert.equal(mye.html, '<my-element8 data-my-text="test1"></my-element8>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element8 data-my-text="test1"><div>test1</div></my-element8>')

    mye.dom.dataset.myText = 'test2'
    assert.equal(document.body.innerHTML, '<my-element8 data-my-text="test2"><div>test2</div></my-element8>')

    mye.dom.dataset.className = 'CLS'
    assert.equal(document.body.innerHTML, '<my-element8 data-my-text="test2" ' +
      'data-class-name="CLS" class="CLS"><div>test2</div></my-element8>')

    document.body.innerHTML = ''
  }

  /** Отслеживание изменений атрибутов * 2, кэш внутри */
  ['customElements - attributeChanged * 2, new Set']() {
    /** Test custom element */
    class MyElement8x1 extends HTMLElement {

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataMyText1Changed(oldValue, newValue) {
        this.textContent += newValue
      }

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataMyText2Changed(oldValue, newValue) {
        this.textContent += newValue
      }

    }

    const mye = oom.define(MyElement8x1).oom(MyElement8x1, {
      'data-my-text1': 'test1',
      'data-my-text2': 'test2'
    })

    assert.equal(mye.html, '<my-element8x1 data-my-text1="test1" data-my-text2="test2"></my-element8x1>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element8x1 data-my-text1="test1" data-my-text2="test2">' +
      'test1test2</my-element8x1>')

    document.body.innerHTML = ''
  }

  /** Отслеживание изменений атрибутов с пользовательским обработчиком */
  ['customElements - attributeChanged + observedAttributes']() {
    const changed = []

    /** Test custom element */
    class MyElement9 extends HTMLElement {

      /** @returns {[string]} */
      static get observedAttributes() {
        return ['test']
      }

      /** @returns {oom} */
      template() {
        return oom('div', div => (this._div = div))
      }

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataMyTextChanged(oldValue, newValue) {
        this._div.textContent = newValue
      }

      /**
       * @param {string} name
       * @param {string} oldValue
       * @param {string} newValue
       */
      attributeChangedCallback(name, oldValue, newValue) {
        changed.push([name, oldValue, newValue])
      }

    }

    const mye = oom.define(MyElement9).oom(MyElement9, {
      'data-my-text': 'test1',
      'test': 'test2'
    })

    assert.equal(mye.html, '<my-element9 data-my-text="test1" test="test2"></my-element9>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element9 data-my-text="test1" test="test2">' +
      '<div>test1</div></my-element9>')

    mye.dom.dataset.myText = 'test3'
    mye.dom.setAttribute('test', 'test4')
    assert.equal(document.body.innerHTML, '<my-element9 data-my-text="test3" test="test4">' +
      '<div>test3</div></my-element9>')

    assert.deepEqual(changed, [
      ['data-my-text', null, 'test1'],
      ['test', null, 'test2'],
      ['data-my-text', 'test1', 'test3'],
      ['test', 'test2', 'test4']
    ])
    document.body.innerHTML = ''
  }

  /** JSON объекты в качестве атрибута парсятся в объект */
  ['customElements - attributeChanged + json::*']() {
    let result

    /** Test custom element */
    class MyElement10 extends HTMLElement {

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      testChanged(oldValue, newValue) {
        result = newValue
      }

    }

    const mye = oom.define(MyElement10).oom(MyElement10, { test: { a: 1 } })

    assert.equal(mye.html, '<my-element10 test="json::{&quot;a&quot;:1}"></my-element10>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element10 test="json::{&quot;a&quot;:1}"></my-element10>')
    assert.deepEqual(result, { a: 1 })

    document.body.innerHTML = ''
  }

  /** Работа с атрибутами в шаблоне */
  ['customElements - template + proxyAttributes']() {
    let result

    /** Test custom element */
    class MyElement11 extends HTMLElement {

      static template = oom('div')

      /**
       * @param {{template:oom, attributes:Proxy}} options
       * @returns {oom}
       */
      template = ({ template, attributes }) => {
        attributes.onclick()

        return template
          .span(attributes.test1.test2)
      }

    }

    const mye = oom.define(MyElement11).oom(MyElement11, {
      test1: {
        test2: 'test3'
      },
      onclick: () => (result = 1)
    })

    assert.equal(mye.html, '<my-element11 ' +
      'test1="json::{&quot;test2&quot;:&quot;test3&quot;}"></my-element11>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(result, 1)
    assert.equal(document.body.innerHTML, '<my-element11 ' +
      'test1="json::{&quot;test2&quot;:&quot;test3&quot;}"><div><span>test3</span></div></my-element11>')

    document.body.innerHTML = ''
  }

  /** Работа с атрибутами в статическом шаблоне */
  ['customElements - static template + proxyAttributes']() {
    let result

    /** Test custom element */
    class MyElement12 extends HTMLElement {

      /**
       * @param {{attributes:Proxy}} options
       * @returns {oom}
       */
      static template = ({ attributes }) => {
        attributes.onclick()

        return oom('div')
          .span(attributes.test1.test2)
      }

      /**
       * @param {{template:oom, attributes:Proxy}} options
       * @returns {oom}
       */
      template = ({ template, attributes }) => template
        .span(attributes.test4)

    }

    const mye = oom.define(MyElement12).oom(MyElement12, {
      test1: {
        test2: 'test3'
      },
      test4: 'test5',
      onclick: () => (result = 1)
    })

    assert.equal(mye.html, '<my-element12 ' +
      'test1="json::{&quot;test2&quot;:&quot;test3&quot;}" test4="test5"></my-element12>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(result, 1)
    assert.equal(document.body.innerHTML, '<my-element12 ' +
      'test1="json::{&quot;test2&quot;:&quot;test3&quot;}" test4="test5"><div>' +
      '<span>test3</span><span>test5</span></div></my-element12>')

    document.body.innerHTML = ''
  }

  /** Работа с атрибутами в верхнем регистре как с dataset */
  ['customElements - proxyAttributes + UpperCase']() {
    /** Test custom element */
    class MyElement13 extends HTMLElement {

      /**
       * @param {{attributes:Proxy}} options
       * @returns {oom}
       */
      template = ({ attributes }) => oom
        .div(attributes.dataTestAttr, div => (this._div = div))

      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataTestAttrChanged(oldValue, newValue) {
        this._div.textContent += newValue
      }

    }

    const mye = oom.define(MyElement13).oom(MyElement13, {
      dataTestAttr: 'test1'
    })

    assert.equal(mye.html, '<my-element13 data-test-attr="test1"></my-element13>')

    document.body.innerHTML = ''
    document.body.append(mye.dom)
    assert.equal(document.body.innerHTML, '<my-element13 data-test-attr="test1">' +
      '<div>test1test1</div></my-element13>')

    mye.dom.dataset.testAttr = 'test2'
    assert.equal(document.body.innerHTML, '<my-element13 data-test-attr="test2">' +
      '<div>test1test1test2</div></my-element13>')

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

  /** Код из примера - Простой шаблон */
  ['example in readme - Example #3']() {
    /** Test custom element */
    class MyElementExp3 extends HTMLElement {

      mySpan = oom.span('My element new text')

      template = oom('div', { class: 'MyElement__inner' })
        .append(this.mySpan.clone())
        .append(oom('br'))
        .append(this.mySpan)

    }

    const block = oom.define(MyElementExp3).MyElementExp3()

    document.body.innerHTML = ''
    document.body.append(block.dom)

    assert.equal(document.body.innerHTML,
      '<my-element-exp3>' +
      '<div class="MyElement__inner">' +
      '<span>My element new text</span>' +
      '<br>' +
      '<span>My element new text</span>' +
      '</div>' +
      '</my-element-exp3>')

    document.body.innerHTML = ''
  }

  /** Код из примера - Реактивные свойства */
  ['example in readme - Example #4']() {
    /** Test custom element */
    class MyElementExp4 extends HTMLElement {

      static label = oom('span', { class: 'label' })
      static field = oom('span', { class: 'field' })

      /**
       * @param {{element:HTMLElement}} options
       * @returns {oom}
       */
      static template({ element }) {
        return oom()
          .append(this.label.clone()
            .span({ class: 'text' }, label => (element._label = label)))
          .append(this.field.clone()
            .span({ class: 'text' }, field => (element._field = field)))
      }

      /**
       * on 'data-field-text' attribute change
       *
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataFieldTextChanged(oldValue, newValue) {
        this._field.textContent = newValue
      }

      /**
       * on 'data-label-text' attribute change
       *
       * @param {string} oldValue
       * @param {string} newValue
       */
      dataLabelTextChanged(oldValue, newValue) {
        this._label.textContent = newValue
      }

    }

    oom.define(MyElementExp4)

    const block = document.createElement('my-element-exp4')
    const html = block.outerHTML

    block.dataset.labelText = 'Name: '
    block.dataset.fieldText = 'Test'

    document.body.innerHTML = ''
    document.body.append(block)

    assert.equal(html, '<my-element-exp4></my-element-exp4>')
    assert.equal(document.body.innerHTML,
      '<my-element-exp4 data-label-text="Name: " data-field-text="Test">' +
      '<span class="label"><span class="text">Name: </span></span>' +
      '<span class="field"><span class="text">Test</span></span>' +
      '</my-element-exp4>')
  }

}
