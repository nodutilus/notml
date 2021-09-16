// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { HTMLElement, HTMLButtonElement, customElements, document } = window


/** Проверка расширенной работы пользовательских элементов */
export default class CustomElements extends Test {

  /** Для удобства регистрации и переиспользования все опции define перенесены на класс */
  ['Регистрация пользовательского элемента']() {
    /** Имя тега забирается по названию класса */
    class MyElement1 extends oom.extends(HTMLElement) {

      static tagName = 'my-element1'

    }

    /** Имя тега получается из статического свойства класса */
    class MyElement2 extends oom.extends(HTMLElement) {

      static tagName = 'me-2'

    }

    /**
     * Несколько заклавных в названии класса подряд,
     * при использовании его в качетстве имени тега, не разделяется
     */
    class OOMElement2 extends oom.extends(HTMLElement) {

      static tagName = 'oom-element2'

    }

    /** Расширения базового тега так же выполняется через класс */
    class MyButton1 extends oom.extends(HTMLButtonElement) {

      static tagName = 'my-button1'
      static extendsTagName = 'button'

    }

    oom.define(MyElement1, MyElement2, OOMElement2, MyButton1)

    assert.equal(oom(new MyElement1()).html, '<my-element1></my-element1>')
    assert.equal(oom(MyElement1).html, '<my-element1></my-element1>')
    assert.equal(oom.myElement1().html, '<my-element1></my-element1>')
    assert.equal(oom('myElement1').html, '<my-element1></my-element1>')
    assert.equal(customElements.get('my-element1'), MyElement1)

    assert.equal(oom(new MyElement2()).html, '<me-2></me-2>')
    assert.equal(oom(MyElement2).html, '<me-2></me-2>')
    assert.equal(oom['me-2']().html, '<me-2></me-2>')
    assert.equal(oom('me-2').html, '<me-2></me-2>')
    assert.equal(customElements.get('me-2'), MyElement2)

    assert.equal(oom(new OOMElement2()).html, '<oom-element2></oom-element2>')
    assert.equal(oom(OOMElement2).html, '<oom-element2></oom-element2>')
    assert.equal(oom.oomElement2().html, '<oom-element2></oom-element2>')
    assert.equal(oom('oomElement2').html, '<oom-element2></oom-element2>')
    assert.equal(customElements.get('oom-element2'), OOMElement2)

    assert.equal(oom(new MyButton1()).html, '<button is="my-button1"></button>')
    assert.equal(oom(MyButton1).html, '<button is="my-button1"></button>')
    assert.equal(oom.myButton1().html, '<button is="my-button1"></button>')
    assert.equal(oom('myButton1').html, '<button is="my-button1"></button>')
    assert.equal(customElements.get('my-button1'), MyButton1)

    assert.equal((new MyButton1()).getAttribute('is'), 'my-button1')
  }

  /** Свойство template экземпляра класса используется как шаблон компонента по аналогии с одноименным тегом */
  ['Шаблон компонента в template']() {
    /** Класс с шаблоном */
    class MyElement3 extends oom.extends(HTMLElement) {

      static tagName = 'my-element3'

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

      static tagName = 'my-element4'

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

      static tagName = 'my-element10'

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
  ['Базовые типы template']() {
    const [MyElement5, MyElement6, MyElement7, MyElement8] = oom.define(
      class MyElement5 extends oom.extends(HTMLElement) {

        static tagName = 'my-element5'

        template = oom('div')

      },
      class MyElement6 extends oom.extends(HTMLElement) {

        static tagName = 'my-element6'

        template = '<div></div>'

      },
      class MyElement7 extends oom.extends(HTMLElement) {

        static tagName = 'my-element7'

        template = document.createElement('div')

      },
      class MyElement8 extends oom.extends(HTMLElement) {

        static tagName = 'my-element8'

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
   * Шаблон элемента может быть функцией возвращающей дочерний элемент для вставки,
   *  или void, тогда предполагается что добавление дочерних элементов осуществляется внутри функции.
   * Эта особенность позволяет создавать динамические шаблоны и влиять из функции на сам элемент.
   */
  ['Функция в качестве шаблона']() {
    /** Шаблон функция */
    class MyElement23 extends oom.extends(HTMLElement) {

      static tagName = 'my-element23'

      template = () => {
        this.id = 'test-ok'
        oom(this, oom.span('test ok'))
      }

      /** Aвтоматическая вставка в DOM */
      constructor() {
        super()
        oom(document.body, this)
      }

    }

    /** Шаблон функция */
    class MyElement24 extends oom.extends(HTMLElement) {

      static tagName = 'my-element24'

      template = () => oom.span('test ok 2')

      /** Aвтоматическая вставка в DOM */
      constructor() {
        super()
        oom(document.body, this)
      }

    }

    oom.define(MyElement23, MyElement24)
    document.body.innerHTML = ''

    const myElm23 = oom.myElement23().dom
    const myElm24 = oom.myElement24().dom

    assert.equal(myElm23.outerHTML, `
      <my-element23 id="test-ok">
        <span>test ok</span>
      </my-element23>
    `.replace(/\s*\n+\s+/g, ''))
    assert.equal(myElm24.outerHTML, `
      <my-element24>
        <span>test ok 2</span>
      </my-element24>
  `.replace(/\s*\n+\s+/g, ''))
    assert.equal(document.body.innerHTML, `
      <my-element23 id="test-ok">
        <span>test ok</span>
      </my-element23>
      <my-element24>
        <span>test ok 2</span>
      </my-element24>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

  /**
   * Функция построения шаблона может быть асинхронной,
   *  в этом случае содержимое компонента обновляется по завершению Promise, либо непосредственно из функции.
   * Отображение заглушки на загрузку остается за автором пользовательского элемента.
   * Необработанная ошибка шаблона выводится прямо в тело компонента,
   *  прикладной шаблон должен сам позаботится об отображении, а вывод является последней фатальной мерой.
   * Асинхронная загрузка не блокирует компоненты которые строятся после данного шаблона,
   *  синхронизация состояний задача пользовательского шаблона
   */
  async ['Асинхронная функция в качестве шаблона']() {
    /** Асинхроный шаблон */
    class MyElement26 extends oom.extends(HTMLElement) {

      static tagName = 'my-element26'

      template = async () => {
        const span = oom.span('async')

        await new Promise(resolve => setTimeout(() => resolve(), 1))

        return span
      }

    }

    oom.define(MyElement26)

    const myE26 = oom.myElement26()

    document.body.innerHTML = ''
    oom(document.body, myE26.span('sync'))

    assert.equal(document.body.innerHTML, `
      <my-element26></my-element26>
      <span>sync</span>
    `.replace(/\s*\n+\s+/g, ''))

    await myE26.dom.ready

    assert.equal(document.body.innerHTML, `
      <my-element26><span>async</span></my-element26>
      <span>sync</span>
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
    class MyElement11 extends oom.extends(HTMLElement) {

      static tagName = 'my-element11'

    }

    oom.define(MyElement11)

    // Без указания опций
    mye11 = new MyElement11()
    assert.deepEqual(mye11.options, {})

    // Можно передать любые опции
    mye11 = new MyElement11({ a: 1, b11: { c11: 2 } })
    assert.deepEqual(mye11.options, { a: 1, b11: { c11: 2 } })
    assert.equal(mye11.options.a, 1)
    assert.equal(mye11.options.b11.c11, 2)

    /** С опцией по умолчанию */
    class MyElement12 extends oom.extends(HTMLElement, { a: 'test', b12: { c12: 2 } }) {

      static tagName = 'my-element12'

    }

    oom.define(MyElement12)

    // Без указания опций, вернется по умолчанию
    mye12 = new MyElement12()
    assert.equal(mye12.options.a, 'test')
    assert.equal(mye12.options.b12.c12, 2)
    assert.deepEqual(MyElement12.optionsDefaults, { a: 'test', b12: { c12: 2 } })

    // Обновлениен опций
    mye12 = new MyElement12({ a: 'update', b12: { c12: 3 } })
    assert.equal(mye12.options.a, 'update')
    assert.equal(mye12.options.b12.c12, 3)
    assert.deepEqual(MyElement12.optionsDefaults, { a: 'test', b12: { c12: 2 } })
  }

  /** Опции могут являться массивом, содержимое массивов и вложенные объекты копируются */
  ['Опции: массив']() {
    const dOptions = ['defaults']
    const options = ['ok']

    /** Опции в виде массива */
    class MyElement15 extends oom.extends(HTMLElement, dOptions) {

      static tagName = 'my-element15'

    }

    oom.define(MyElement15)

    const myE15 = new MyElement15(options)

    dOptions.push('1')
    options.push('2')

    assert.deepEqual(myE15.options, ['ok'])
    assert.deepEqual(MyElement15.optionsDefaults, ['defaults'])
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
    class MyElement16 extends oom.extends(HTMLElement, dOptions) {

      static tagName = 'my-element16'

    }

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
    const optionsDefaults = { b13: { c13: 2 }, d13: [1, 2, 3] }

    /** объект + объект в объекте */
    class MyElement13 extends oom.extends(HTMLElement, optionsDefaults) {

      static tagName = 'my-element13'

    }

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
      // @ts-ignore
      MyElement13.optionsDefaults = {}
    } catch (error) { err = error }
    assert.ok(err.message.startsWith("Cannot assign to read only property 'optionsDefaults' of function 'class MyElement13"))
    try {
      MyElement13.optionsDefaults.b13.c13 = 4
    } catch (error) { err = error }
    assert.equal(err.message, "Cannot assign to read only property 'c13' of object '#<Object>'")
    try {
      // @ts-ignore
      MyElement13.optionsDefaults.b13.cd13 = {}
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
    class MyElement14 extends oom.extends(HTMLElement, dOptions) {

      static tagName = 'my-element14'

    }

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

  /**
   * При наследовании классов расширенных через oom, опции по умолчанию тоже расширяются
   */
  ['Опции: наследование optionsDefaults']() {
    /** Базовый класс */
    class MyElement17 extends oom.extends(HTMLElement, { a17: 1, c17: 1 }) { }

    /** Класс наследник */
    class MyElement18 extends oom.extends(MyElement17, { b18: 1, c17: 2 }) { }

    assert.deepEqual(MyElement17.optionsDefaults, { a17: 1, c17: 1 })
    assert.deepEqual(MyElement18.optionsDefaults, { a17: 1, b18: 1, c17: 2 })
  }

  /**
   * При расширении через наследование опции компонента пробрасываются в конструктор родителя.
   * Опции собираются в первом OOMCustomElement, и в родительский конструктор прокидываются только на чтение
   */
  ['Опции: доступ к опциям в parent и child']() {
    /** Базовый класс */
    class MyElement19 extends oom.extends(HTMLElement, { name: 'testName' }) {

      static tagName = 'my-element19'

      template = oom.div({ class: 'field' }, this.options.name)

    }

    /** Класс наследник */
    class MyElement20 extends oom.extends(MyElement19, { label: 'testLabel' }) {

      static tagName = 'my-element20'

      template = oom.span({ class: 'label' },
        oom.span(this.options.label, {
          class: 'label__title'
        }),
        this.template)

    }

    oom.define(MyElement19, MyElement20)

    const myE19 = new MyElement19()
    const myE20 = new MyElement20()

    document.body.innerHTML = ''
    document.body.append(myE19)
    document.body.append(myE20)
    assert.equal(document.body.innerHTML, `
      <my-element19>
        <div class="field">testName</div>
      </my-element19>
      <my-element20>
        <span class="label">
          <span class="label__title">testLabel</span>
          <div class="field">testName</div>
        </span>
      </my-element20>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''

    const myE20v2 = new MyElement20({ label: 'label2', name: 'name2' })

    document.body.append(myE20v2)
    assert.equal(document.body.innerHTML, `
      <my-element20>
        <span class="label">
        <span class="label__title">label2</span>
          <div class="field">name2</div>
        </span>
      </my-element20>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

  /**
   * При передаче зацикленных полей в options
   *  необходимо вовремя выходить из рекурсии чтобы избежать падения с ошибкой.
   * Цикличные ссылки в опциях заменяются на undefined без изменения исходного объекта
   */
  ['Опции: бесконечная рекурсия в resolveOptions']() {
    const options = { test1: {} }

    /** Бесконечная рекурсия */
    class MyElement25 extends oom.extends(HTMLElement) {

      static tagName = 'my-element25'

    }

    oom.define(MyElement25)

    options.test2 = options
    options.test1.test3 = options

    const myE25 = new MyElement25(options)

    assert.equal(myE25.options.test2, undefined)
    assert.equal(myE25.options.test1.test3, undefined)

    assert.equal(options.test2, options)
    assert.equal(options.test1.test3, options)

    delete options.test2
    delete options.test1.test3
  }

  /**
   * Стили компонентов определяются в статическом свойстве класса style,
   *  откуда при регистрации пользовательского элемента добавляются в документ в состав <head>.
   * Стили автоматически привязываются к имени тега элемента, что позволяет избежать пересечений имен классов
   */
  ['Глобальные стили компонента']() {
    /** Компонент с глобальными стилями */
    class MyElement21 extends oom.extends(HTMLElement) {

      static tagName = 'my-element21'
      static style = oom.style({
        'my-element21': { fontSize: '12px' },
        'my-element21.green': { color: 'green' },
        '.small': { fontSize: '8px' }
      })

      template = oom.span('text', { class: 'small' })

    }

    document.head.innerHTML = ''
    oom.define(MyElement21)
    document.body.innerHTML = ''
    document.body.append(new MyElement21())

    assert.equal(document.getElementsByTagName('html')[0].outerHTML, `
      <html>
        <head>
          <style is="oom-style" oom-element="my-element21">
            my-element21{ font-size: 12px; }
            my-element21.green{ color: green; }
            my-element21 .small{ font-size: 8px; }
          </style>
        </head>
        <body>
          <my-element21>
            <span class="small">text</span>
          </my-element21>
        </body>
      </html>
    `.replace(/\s*\n+\s+/g, ''))

    document.head.innerHTML = ''
    document.body.innerHTML = ''
  }

  /**
   * Для пользовательского элемента можно задать собственный класс,
   *  который не будет стираться обновлением атрибута через шаблонизатор oom.
   * Это дает возможность удобно навешивать на элементы обязательные классы из внешних библиотек
   */
  ['Класс элемента в static className']() {
    /** Компонент с собственным именем класса */
    class MyElement22 extends oom.extends(HTMLElement) {

      static tagName = 'my-element22'
      static className = 'my-class22'

    }

    oom.define(MyElement22)

    const mye22 = new MyElement22()

    assert.equal(mye22.outerHTML, `
      <my-element22 class="my-class22"></my-element22>
    `.replace(/\s*\n+\s+/g, ''))

    oom(mye22, { class: 'test1' })
    assert.equal(mye22.outerHTML, `
      <my-element22 class="my-class22 test1"></my-element22>
    `.replace(/\s*\n+\s+/g, ''))

    oom(mye22, { class: 'test2' })
    assert.equal(mye22.outerHTML, `
      <my-element22 class="my-class22 test2"></my-element22>
    `.replace(/\s*\n+\s+/g, ''))
  }

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

      static style = oom.style({
        'button[is="my-butt"]': { fontSize: '12px' },
        'button[is="my-butt"].active': { color: 'yellow' },
        '.my-butt__caption': { color: 'red' }
      })

      template = oom.span({ class: 'my-butt__caption' }, this.options.caption)

    }

    document.head.innerHTML = ''
    oom.define(MyButton)
    document.body.innerHTML = ''
    document.body.append(new MyButton({ caption: 'Жми тут' }))
    assert.equal(document.getElementsByTagName('html')[0].outerHTML, `
      <html>
        <head>
          <style is="oom-style" oom-element="my-butt">
            button[is="my-butt"]{ font-size: 12px; }
            button[is="my-butt"].active{ color: yellow; }
            button[is="my-butt"] .my-butt__caption{ color: red; }
          </style>
        </head>
        <body>
          <button is="my-butt">
            <span class="my-butt__caption">Жми тут</span>
          </button>
        </body>
      </html>
    `.replace(/\s*\n+\s+/g, ''))

    document.head.innerHTML = ''
    document.body.innerHTML = ''
  }

}
