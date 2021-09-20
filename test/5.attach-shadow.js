// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document, HTMLElement } = window


/** Проверка работы ShadowRoot в составе CustomElements */
export default class AttachShadow extends Test {

  /**
   * Включение теневого дом выполняется свойством attachShadow на классе элемента.
   * Может быть указано как boolean | ShadowRootInit
   */
  ['Подключение теневого DOM']() {
    /** Открытый теневой DOM */
    class MyShadow1 extends oom.extends(HTMLElement) {

      static tagName = 'my-shadow1'
      static attachShadow = true

      template = oom.span('MyShadow1')

    }

    /** Закрытый теневой DOM */
    class MyShadow2 extends oom.extends(HTMLElement) {

      static tagName = 'my-shadow2'
      static attachShadow = { mode: 'closed' }

      template = oom.span('MyShadow2')

    }

    oom.define(MyShadow1, MyShadow2)

    const myShadow1 = new MyShadow1()
    const myShadow2 = new MyShadow2()

    document.body.innerHTML = ''
    document.body.append(myShadow1)
    document.body.append(myShadow2)

    assert.equal(document.body.innerHTML, '<my-shadow1></my-shadow1><my-shadow2></my-shadow2>')
    assert.equal(myShadow1.shadowRoot.constructor.name, 'ShadowRoot')
    assert.equal(myShadow1.shadowRoot.innerHTML, '<span>MyShadow1</span>')
    assert.equal(myShadow2.shadowRoot, null)

    document.body.innerHTML = ''
  }

  /**
   * Стили компонентов при вставке в теневой DOM копируются,
   *  и вставляются перед первым использованием компонента.
   * При удалении компонента стили остаются в корне shadowRoot, аналогично стилям в основном дереве,
   *  и при повторной вставке стили не дублируются.
   */
  ['Копирование Style в состав shadowRoot']() {
    /** Компонент со стилями 1 */
    class MySpan1 extends oom.extends(HTMLElement) {

      static tagName = 'my-span1'
      static style = oom.style({
        '.my-span1_title': { background: 'red' }
      })

      template = oom.span({ class: '.my-span1_title' })

    }

    /** Компонент со стилями 2 */
    class MySpan2 extends oom.extends(HTMLElement) {

      static tagName = 'my-span2'
      static style = oom.style({
        '.my-span2_title': { background: 'green' }
      })

      template = oom.span({ class: '.my-span2_title' })

    }

    /** Теневой дом содержащий внутри компонент */
    class MyShadow3 extends oom.extends(HTMLElement) {

      static tagName = 'my-shadow3'
      static attachShadow = true

      template = oom()(new MySpan1(), new MySpan2())

    }

    oom.define(MySpan1, MySpan2, MyShadow3)

    const myShadow3 = new MyShadow3()

    document.body.innerHTML = ''
    document.body.append(myShadow3)

    assert.equal(document.documentElement.innerHTML, `
      <head>
        <style is="oom-style" oom-element="my-span1">
          my-span1 .my-span1_title{ background: red; }
        </style>
        <style is="oom-style" oom-element="my-span2">
          my-span2 .my-span2_title{ background: green; }
        </style>
      </head>
      <body>
        <my-shadow3></my-shadow3>
      </body>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(myShadow3.shadowRoot.innerHTML, `
      <head>
        <style is="oom-style" oom-element="my-span1">
          my-span1 .my-span1_title{ background: red; }
        </style>
        <style is="oom-style" oom-element="my-span2">
          my-span2 .my-span2_title{ background: green; }
        </style>
      </head>
      <my-span1>
        <span class=".my-span1_title"></span>
      </my-span1>
      <my-span2>
        <span class=".my-span2_title"></span>
      </my-span2>
    `.replace(/\s*\n+\s+/g, ''))

    myShadow3.shadowRoot.lastChild.remove()
    myShadow3.shadowRoot.lastChild.remove()

    assert.equal(myShadow3.shadowRoot.innerHTML, `
      <head>
        <style is="oom-style" oom-element="my-span1">
          my-span1 .my-span1_title{ background: red; }
        </style>
        <style is="oom-style" oom-element="my-span2">
          my-span2 .my-span2_title{ background: green; }
        </style>
      </head>
    `.replace(/\s*\n+\s+/g, ''))

    oom(myShadow3.shadowRoot, new MySpan1(), new MySpan2())

    assert.equal(myShadow3.shadowRoot.innerHTML, `
      <head>
        <style is="oom-style" oom-element="my-span1">
          my-span1 .my-span1_title{ background: red; }
        </style>
        <style is="oom-style" oom-element="my-span2">
          my-span2 .my-span2_title{ background: green; }
        </style>
      </head>
      <my-span1>
        <span class=".my-span1_title"></span>
      </my-span1>
      <my-span2>
        <span class=".my-span2_title"></span>
      </my-span2>
    `.replace(/\s*\n+\s+/g, ''))

    document.head.innerHTML = ''
    document.body.innerHTML = ''
  }

  /**
   * При работе с теневым DOM для добавления элементов в DOM в функцию шаблон передается корень теневого DOM.
   * В случае с закрытым теневым DOM это позволит получить к нему доступ из функции шаблона.
   * this сам компонент, а root теневой DOM
   */
  ['Функция шаблон и теневой DOM']() {
    /** Шаблон-функция теневого DOM */
    class MyShadow4 extends oom.extends(HTMLElement) {

      static tagName = 'my-shadow4'
      static attachShadow = true

      template = (/** @type {ShadowRoot} */ root) => {
        oom(root, oom.span('test root'))
      }

    }

    oom.define(MyShadow4)
    document.body.innerHTML = ''

    const myE26 = new MyShadow4()

    document.body.append(myE26)

    assert.equal(myE26.shadowRoot.innerHTML, `
      <span>test root</span>
    `.replace(/\s*\n+\s+/g, ''))

    assert.equal(document.body.innerHTML, `
      <my-shadow4></my-shadow4>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

}
