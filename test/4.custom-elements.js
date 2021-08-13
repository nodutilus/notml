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

      static tagName = 'me-2'

    }

    /**
     * Несколько заклавных в названии класса подряд,
     * при использовании его в качетстве имени тега, не разделяется
     */
    class OOMElement2 extends oom.extends(HTMLElement) { }

    /** Расширения базового тега так же выполняется через класс */
    class MyButton1 extends oom.extends(HTMLButtonElement) {

      static extendsTagName = 'button'

    }

    oom.define(MyElement1, MyElement2, OOMElement2, MyButton1)

    assert.equal(oom(new MyElement1()).html, '<my-element1></my-element1>')
    assert.equal(oom(MyElement1).html, '<my-element1></my-element1>')
    assert.equal(oom.MyElement1().html, '<my-element1></my-element1>')
    assert.equal(oom('MyElement1').html, '<my-element1></my-element1>')
    assert.equal(customElements.get('my-element1'), MyElement1)

    assert.equal(oom(new MyElement2()).html, '<me-2></me-2>')
    assert.equal(oom(MyElement2).html, '<me-2></me-2>')
    assert.equal(oom['ME-2']().html, '<me-2></me-2>')
    assert.equal(oom('ME-2').html, '<me-2></me-2>')
    assert.equal(customElements.get('me-2'), MyElement2)

    assert.equal(oom(new OOMElement2()).html, '<oom-element2></oom-element2>')
    assert.equal(oom(OOMElement2).html, '<oom-element2></oom-element2>')
    assert.equal(oom.OOMElement2().html, '<oom-element2></oom-element2>')
    assert.equal(oom('OOMElement2').html, '<oom-element2></oom-element2>')
    assert.equal(customElements.get('oom-element2'), OOMElement2)

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

  /**
   * В качестве описания структуры опций можно использовать простые объекты и массивы.
   * - Объекты будут клонированы и объединены с опциями по умолчанию в новые объекты.
   * - Массивы из опций по умолчанию будет полностью заменены копиями массивов указанными в опциях.
   * - Примитивные значения опций передаются по значению.
   * - Сложные объекты, такие как Date, RegExp, пр., и пользовательские классы, будут переданы по ссылке.
   * Такое поведение позволит создавать структурированные опции,
   *  и использовать в качестве опций DOM элементы для создания агрегаций
   */
  ['Опции: объект']() {
    let mye11, mye12

    /** Без опций по умолчанию */
    class MyElement11 extends oom.extends(HTMLElement) { }

    oom.define(MyElement11)

    // Без указания опций
    mye11 = new MyElement11()
    assert.deepEqual(mye11.options, {})

    // Можно передать любые опции
    mye11 = new MyElement11({ a: 1, b11: { c11: 2 } })
    assert.deepEqual(mye11.options, { a: 1, b11: { c11: 2 } })
    assert.equal(mye11.options.a, 1)
    assert.equal(mye11.options.b11.c11, 2)

    const mye11V2 = new MyElement11()

    // Опции по умолчанию указывают на один объект в состоянии readonly
    assert.ok(mye11.optionsDefaults === mye11V2.optionsDefaults)

    /** С опцией по умолчанию */
    class MyElement12 extends oom.extends(HTMLElement, { a: 'test', b12: { c12: 2 } }) { }

    oom.define(MyElement12)

    // Без указания опций, вернется по умолчанию
    mye12 = new MyElement12()
    assert.equal(mye12.options.a, 'test')
    assert.equal(mye12.options.b12.c12, 2)
    assert.deepEqual(mye12.optionsDefaults, { a: 'test', b12: { c12: 2 } })

    // Обновлениен опций
    mye12 = new MyElement12({ a: 'update', b12: { c12: 3 } })
    assert.equal(mye12.options.a, 'update')
    assert.equal(mye12.options.b12.c12, 3)
    assert.deepEqual(mye12.optionsDefaults, { a: 'test', b12: { c12: 2 } })

    const mye12V2 = new MyElement12()

    // Пользовательские опции определяются для всего класса,
    //  и свойство на экземпляре указывают на общий объект в состоянии readonly
    assert.ok(mye12.optionsDefaults === mye12V2.optionsDefaults)
  }

  /** Опции могут являться массивом, содержимое массивов и вложенные объекты копируются */
  ['Опции: массив']() {
    const dOptions = ['defaults']
    const options = ['ok']

    /** Опции в виде массива */
    class MyElement15 extends oom.extends(HTMLElement, dOptions) { }

    oom.define(MyElement15)

    const myE15 = new MyElement15(options)

    dOptions.push('1')
    options.push('2')

    assert.deepEqual(myE15.options, ['ok'])
    assert.deepEqual(dOptions, ['defaults', '1'])
    assert.deepEqual(options, ['ok', '2'])
  }

  /**
   * Сложные объекты считаем уникальными и передаются по ссылке, например дата или пользовательские классы.
   * При этом сложные объекты не подвергается заморозке, чтобы не нарушить их логику работы
   */
  ['Опции: сложные объекты']() {
    /** Пользовательский класс опций */
    class COptions { c16 = new Date() }

    const dOptions = { a16: null, b16: new Date() }
    const options = { a16: new COptions() }

    /** Сложные объекты в опциях */
    class MyElement16 extends oom.extends(HTMLElement, dOptions) { }

    oom.define(MyElement16)

    const myE16 = new MyElement16(options)

    assert.ok(myE16.options.a16 === options.a16)
    assert.ok(myE16.options.a16.c16 === options.a16.c16)
    assert.ok(myE16.options.b16 === dOptions.b16)

    myE16.options.a16.e16 = 1
    // @ts-ignore
    myE16.options.b16.e16 = 2

    assert.ok(myE16.options.b16.getTime() > 0)
    myE16.options.b16.setTime(0)

    assert.equal(myE16.options.a16.e16, 1)
    // @ts-ignore
    assert.equal(myE16.options.b16.e16, 2)
    assert.equal(myE16.options.b16.getTime(), 0)
  }


  /** Опции запрещено редактировать */
  ['Опции: readonly']() {
    /** объект + объект в объекте */
    class MyElement13 extends oom.extends(HTMLElement, { b13: { c13: 2 }, d13: [1, 2, 3] }) { }

    oom.define(MyElement13)

    let err
    const mye13 = new MyElement13()

    try {
      // @ts-ignore
      mye13.options = {}
    } catch (error) { err = error }
    assert.equal(err.message, "Cannot assign to read only property 'options' of object '#<MyElement13>'")
    try {
      // @ts-ignore
      mye13.options.a13 = {}
    } catch (error) { err = error }
    assert.equal(err.message, 'Cannot add property a13, object is not extensible')
    try {
      // @ts-ignore
      mye13.options.b13.c13 = {}
    } catch (error) { err = error }
    assert.equal(err.message, "Cannot assign to read only property 'c13' of object '#<Object>'")
    try {
      // @ts-ignore
      mye13.options.b13.e13 = {}
    } catch (error) { err = error }
    assert.equal(err.message, 'Cannot add property e13, object is not extensible')
    try {
      // @ts-ignore
      mye13.options.d13.push(4)
    } catch (error) { err = error }
    assert.equal(err.message, 'Cannot add property 3, object is not extensible')
    // Опции по умолчанию также неизменяемые
    try {
      mye13.optionsDefaults.b13.c13 = 4
    } catch (error) { err = error }
    assert.equal(err.message, "Cannot assign to read only property 'c13' of object '#<Object>'")
    try {
      // @ts-ignore
      mye13.optionsDefaults.b13.cd13 = {}
    } catch (error) { err = error }
    assert.equal(err.message, 'Cannot add property cd13, object is not extensible')
  }

  /**
   * Объект передаваемый в качестве значения опций по умолчанию или опций остается неизменным,
   *  внутри компонента опции копируются, и внешний объект можно использовать повторно
   */
  ['Опции: копирование']() {
    const dOptions = { a14: 1, b14: { c14: 1 } }
    const options = { a14: 2, d14: [{ e14: 0 }, 2, 3] }

    /** объект + объект в объекте */
    class MyElement14 extends oom.extends(HTMLElement, dOptions) { }

    oom.define(MyElement14)

    const myE14 = new MyElement14(options)

    dOptions.b14.c14 = 3
    options.a14 = 4
    options.d14.push(4)
    // @ts-ignore
    options.d14[0].e14 = -1

    assert.deepEqual(myE14.options, { a14: 2, b14: { c14: 1 }, d14: [{ e14: 0 }, 2, 3] })
    assert.deepEqual(dOptions, { a14: 1, b14: { c14: 3 } })
    assert.deepEqual(options, { a14: 4, d14: [{ e14: -1 }, 2, 3, 4] })
  }

  //TODO Расширение через наследование (пробрасывать опции внутри компонента в конструктор родителя)

  /** Тест примера из в extends из types.d.ts */
  ['types.d.ts - example for extends']() {
    /**
     * @typedef OptionsDefaults
     * @property {string} [caption] Надпись на кнопке
     */
    /** @type {OptionsDefaults} */
    const optionsDefaults = { caption: '' }

    /** Тестовая кнопка */
    class MyButton extends oom.extends(HTMLButtonElement, optionsDefaults) {

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
