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

      static attachShadow = true

      template = oom.span('MyShadow1')

    }

    /** Закрытый теневой DOM */
    class MyShadow2 extends oom.extends(HTMLElement) {

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
   *  и вставляются перед первым использованием компонента
   */
  ['Копирование Style в состав shadowRoot']() {
    /** Компонент со стилями */
    class MySpan1 extends oom.extends(HTMLElement) {

      static style = oom.style({
        '.my-span1_title': { background: 'red' }
      })

      template = oom.span({ class: '.my-span1_title' })

    }

    /** Теневой дом содержащий внутри компонент */
    class MyShadow3 extends oom.extends(HTMLElement) {

      static attachShadow = true

      template = new MySpan1()

    }

    oom.define(MySpan1, MyShadow3)

    const myShadow3 = new MyShadow3()

    document.body.innerHTML = ''
    document.body.append(myShadow3)

    assert.equal(document.documentElement.innerHTML, `
      <head>
        <style is="oom-style" oom-element="my-span1">
          my-span1 .my-span1_title{ background: red; }
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
      </head>
      <my-span1>
        <span class=".my-span1_title"></span>
      </my-span1>
    `.replace(/\s*\n+\s+/g, ''))

    document.head.innerHTML = ''
    document.body.innerHTML = ''
  }

}
