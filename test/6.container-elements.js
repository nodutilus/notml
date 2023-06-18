// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document, HTMLElement } = window


/** Проверка работы контейнерных элементов */
export default class ContainerElements extends Test {

  /**
   * В простом варианте контейнер не содержит собственной верстки
   */
  ['Контейнер без собственной верстки']() {
    /** Контейнер без верстки */
    class MyContainer1 extends oom.extends(HTMLElement) {

      static tagName = 'my-container1'

    }

    oom.define(MyContainer1)

    document.body.innerHTML = ''

    oom(document.body, oom.myContainer1(oom.span('test myContainer1')))

    assert.equal(document.body.innerHTML, `
      <my-container1>
        <span>test myContainer1</span>
      </my-container1>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

  /**
   * Компонент может иметь контентные опции, используемые при описание верстки шаблона
   */
  ['Контентные опции']() {
    /** Контейнер с контентными опциями */
    class MyContainer2 extends oom.extends(HTMLElement) {

      static tagName = 'my-container2'

      template = oom
        .div(this.options.span1)
        .div(this.options.span2)

    }

    oom.define(MyContainer2)

    document.body.innerHTML = ''

    oom(document.body, new MyContainer2({
      span1: oom.span('test myContainer2 span1'),
      span2: oom.span('test myContainer2 span2')
    }))

    assert.equal(document.body.innerHTML, `
      <my-container2>
        <div>
          <span>test myContainer2 span1</span>
        </div>
        <div>
          <span>test myContainer2 span2</span>
        </div>
      </my-container2>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

  /**
   * В сочетании с теневым DOM можно использовать заполнение контента через слоты
   */
  ['Слоты теневого DOM']() {
    /** Контейнер со слотами */
    class MyContainer3 extends oom.extends(HTMLElement) {

      static tagName = 'my-container3'
      static attachShadow = true

      template = oom
        .div(oom.slot({ name: 'title' }))
        .div(oom.slot({ name: 'field' }))

    }

    oom.define(MyContainer3)

    const myC3 = new MyContainer3()
    const myTitle = oom.span('my-title', { slot: 'title' })
    const myField = oom.span('my-field', { slot: 'field' })

    document.body.innerHTML = ''

    oom(document.body, oom(myC3, myTitle, myField))

    /** @type {HTMLSlotElement} */
    // @ts-ignore
    const slotTitle = myC3.shadowRoot.firstChild.firstChild
    /** @type {HTMLSlotElement} */
    // @ts-ignore
    const slotField = myC3.shadowRoot.lastChild.firstChild

    assert.equal(document.body.innerHTML, `
      <my-container3>
        <span slot="title">my-title</span>
        <span slot="field">my-field</span>
      </my-container3>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(myC3.shadowRoot.innerHTML, `
      <div>
        <slot name="title"></slot>
      </div>
      <div>
        <slot name="field"></slot>
      </div>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(myTitle.dom, slotTitle.assignedElements()[0])
    assert.equal(myField.dom, slotField.assignedElements()[0])

    document.body.innerHTML = ''
  }

  /**
   * Слот по умолчанию работает как и в базовой реализации теневого DOM
   */
  ['Слот по умолчанию (первый без имени)']() {
    /** Контейнер со слотом по умолчанию */
    class MyContainer4 extends oom.extends(HTMLElement) {

      static tagName = 'my-container4'
      static attachShadow = true

      template = oom.div(oom.slot())

    }

    oom.define(MyContainer4)

    const myC4 = new MyContainer4()
    const mySpan = oom.span('my-span')

    document.body.innerHTML = ''

    oom(document.body, oom(myC4, mySpan))

    /** @type {HTMLSlotElement} */
    // @ts-ignore
    const slot = myC4.shadowRoot.firstChild.firstChild

    assert.equal(document.body.innerHTML, `
      <my-container4>
        <span>my-span</span>
      </my-container4>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(myC4.shadowRoot.innerHTML, `
      <div>
        <slot></slot>
      </div>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(mySpan.dom, slot.assignedElements()[0])

    document.body.innerHTML = ''
  }

  /**
   * При помощи теневого дом и шаблона функции можно создать компонент,
   *  который в рамках шаблона будет работать сразу с 2мя деревьями, основным и теневым.
   * this сам компонент, а root теневой DOM
   */
  ['Функция шаблон, основной и теневой DOM']() {
    /** Шаблон-функция теневого DOM */
    class MyContainer5 extends oom.extends(HTMLElement) {

      static tagName = 'my-container5'
      static attachShadow = true

      template = (/** @type {ShadowRoot} */ root) => {
        oom(root, oom.slot())
        oom(this, oom.span('test root'))
      }

    }

    oom.define(MyContainer5)
    document.body.innerHTML = ''

    const myС5 = new MyContainer5()

    document.body.append(myС5)

    /** @type {HTMLSlotElement} */
    // @ts-ignore
    const slot = myС5.shadowRoot.firstChild

    assert.equal(myС5.firstChild, slot.assignedElements()[0])

    assert.equal(myС5.shadowRoot.innerHTML, `
      <slot></slot>
    `.replace(/\s*\n+\s+/g, ''))

    assert.equal(document.body.innerHTML, `
      <my-container5>
        <span>test root</span>
      </my-container5>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

}
