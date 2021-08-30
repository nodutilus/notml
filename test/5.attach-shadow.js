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

}
