// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { HTMLElement, HTMLButtonElement, customElements, document } = window


/** Проверка расширенной работы пользовательских элементов */
export default class CustomElements extends Test {

  /** Для удобства регистрации и переиспользования все опции define перенесены на класс */
  ['Регистрация пользовательского элемента']() {
    /** Имя тега забирается по названию класса */
    class MyElement1 extends oom.extends(HTMLElement) { }

    /** Имя тега получается из статического свойства класса */
    class MyElement2 extends oom.extends(HTMLElement) {

      static tagName = 'm-e-2'

    }

    /** Расширения базового тега так же выполняется через класс */
    class MyButton1 extends oom.extends(HTMLButtonElement) {

      static extendsTagName = 'button'

    }

    oom.define(MyElement1, MyElement2, MyButton1)

    assert.equal(oom(new MyElement1()).html, '<my-element1></my-element1>')
    assert.equal(oom(MyElement1).html, '<my-element1></my-element1>')
    assert.equal(oom.MyElement1().html, '<my-element1></my-element1>')
    assert.equal(oom('MyElement1').html, '<my-element1></my-element1>')
    assert.equal(customElements.get('my-element1'), MyElement1)

    assert.equal(oom(new MyElement2()).html, '<m-e-2></m-e-2>')
    assert.equal(oom(MyElement2).html, '<m-e-2></m-e-2>')
    assert.equal(oom['ME-2']().html, '<m-e-2></m-e-2>')
    assert.equal(oom('ME-2').html, '<m-e-2></m-e-2>')
    assert.equal(customElements.get('m-e-2'), MyElement2)

    assert.equal(oom(new MyButton1()).html, '<button is="my-button1"></button>')
    assert.equal(oom(MyButton1).html, '<button is="my-button1"></button>')
    assert.equal(oom.MyButton1().html, '<button is="my-button1"></button>')
    assert.equal(oom('MyButton1').html, '<button is="my-button1"></button>')
    assert.equal(customElements.get('my-button1'), MyButton1)
  }

  /** Свойство template экземпляра класса используется как шаблон компонента по аналогии с одноименным тегом */
  ['Шаблон компонента в template']() {
    /** Класс с шаблоном */
    class MyElement3 extends oom.extends(HTMLElement) {

      template = oom('div')

    }

    oom.define(MyElement3)

    const myElm3 = new MyElement3()

    assert.equal(myElm3.outerHTML, '<my-element3></my-element3>')

    document.body.innerHTML = ''
    document.body.append(myElm3)
    assert.equal(document.body.innerHTML, '<my-element3><div></div></my-element3>')
    document.body.innerHTML = ''

    assert.equal(myElm3.outerHTML, '<my-element3><div></div></my-element3>')
  }

  /**
   * При вставке шаблона определяется такой порядок что бы были 2 точки взаимодействия:
   *  1-ая в constructor до применения, 2-ая в connectedCallback, после применения шаблона
   * Чтобы можно было гибко управлять содержимым и использовать такие элементы как slot
   */
  ['Работа с constructor, connectedCallback и template']() {
    /** Шаблон + обновление верстки в конструкторе */
    class MyElement4 extends oom.extends(HTMLElement) {

      template = oom('div')

      /**
       * На конструкторе шаблон еще не применен,
       *  и можно изменить внутреннюю верстку, аналогично работе через createElement
       */
      constructor() {
        super()
        assert.equal(this.outerHTML, '<my-element4></my-element4>')
        this.innerHTML = 'test1'
      }

      /**
       * На обработчике вставки в DOM расширение в oom.extends вставляет шаблон,
       *  и можно работать с готовой версткой компонента
       */
      connectedCallback() {
        super.connectedCallback() // Применение template
        assert.equal(this.outerHTML, '<my-element4>test1<div></div></my-element4>')
      }

    }

    oom.define(MyElement4)

    const myElm4 = new MyElement4()

    assert.equal(myElm4.outerHTML, '<my-element4>test1</my-element4>')

    document.body.innerHTML = ''
    document.body.append(myElm4)
    assert.equal(document.body.innerHTML, '<my-element4>test1<div></div></my-element4>')
    document.body.innerHTML = ''
  }

  /**
   * oom.extends может работать и от пользовательского класса, например из сторонней библиотеки.
   * В таком случае методы из OOMCustomElement выполняются всегда раньше, сохраняя базовое поведение.
   * Однако это создает больше классов OOMCustomElement чем наследование от базовых классов
   * (по 1му на каждый пользовательский, вместо 1го общего на базовый)
   */
  ['Наследование через oom.extends от пользовательского класса']() {
    let myE9html = ''

    /** Расширяемый класс. Может быть компонентом из другой библиотеки */
    class MyElement9 extends HTMLElement {

      /** Выполниться до построения верстки в дочернем классе, но имя тега уже будет переопределено */
      connectedCallback() {
        myE9html = this.outerHTML
      }

    }

    /** Наследуется от стороннего класса пользовательского элемента, при этом добавляя oom поведение */
    class MyElement10 extends oom.extends(MyElement9) {

      template = 'test10'

    }

    oom.define(MyElement10)

    document.body.innerHTML = ''
    document.body.append(new MyElement10())
    assert.equal(myE9html, '<my-element10></my-element10>')
    assert.equal(document.body.innerHTML, '<my-element10>test10</my-element10>')
    document.body.innerHTML = ''
  }

  /** Для разных типов шаблонов должна быть общая последовательность вставки */
  ['Типы template']() {
    const [MyElement5, MyElement6, MyElement7, MyElement8] = oom.define(
      class MyElement5 extends oom.extends(HTMLElement) {

        template = oom('div')

      },
      class MyElement6 extends oom.extends(HTMLElement) {

        template = '<div></div>'

      },
      class MyElement7 extends oom.extends(HTMLElement) {

        template = document.createElement('div')

      },
      class MyElement8 extends oom.extends(HTMLElement) {

        template = oom.a().b().dom

      })
    const myElm5 = new MyElement5()
    const myElm6 = new MyElement6()
    const myElm7 = new MyElement7()
    const myElm8 = new MyElement8()

    myElm5.innerHTML = 'test'
    myElm6.innerHTML = 'test'
    myElm7.innerHTML = 'test'
    myElm8.innerHTML = 'test'

    document.body.innerHTML = ''
    document.body.append(myElm5)
    document.body.append(myElm6)
    document.body.append(myElm7)
    document.body.append(myElm8)
    assert.equal(document.body.innerHTML, `
      <my-element5>test<div></div></my-element5>
      <my-element6>test<div></div></my-element6>
      <my-element7>test<div></div></my-element7>
      <my-element8>test<a></a><b></b></my-element8>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

  ['Опции класса конструктора']() {
    throw new Error('Реализовать проверку работы опций и их типизации через указание дефолтных опций вторым аргументом в oom.extends')
  }

  /** Тест примера из в extends из types.d.ts */
  ['types.d.ts - example for extends']() {
    /** Тестовая кнопка */
    class MyButton extends oom.extends(HTMLButtonElement) {

      static tagName = 'my-butt'
      static extendsTagName = 'button'

      template = oom.span({ class: 'my-butt__caption' }, this.options.caption)

    }

    oom.define(MyButton)
    document.body.innerHTML = ''
    document.body.append(new MyButton({ caption: 'Жми тут' }))
    assert.equal(document.body.innerHTML, `
      <button is="my-butt">
        <span class="my-butt__caption">Жми тут</span>
      </button>
    `.replace(/\s*\n+\s+/g, ''))

    document.body.innerHTML = ''
  }

}
