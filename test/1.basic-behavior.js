// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document, HTMLDivElement, DocumentFragment } = window


/** Проверка базового поведения создания верстки */
export default class BasicBehavior extends Test {

  /** Защита от случайного переопределения полей для Proxy */
  ['Отключение setter`а у Proxy OOM элемента']() {
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

  /**
   * Создание всегда начинается с единичного элемента,
   *    это делает API однозначным
   */
  ['Создание DOM элемента через oom']() {
    const div1 = oom.div()
    const div2 = oom('div')
    const div3 = oom.oom('div')

    assert.ok(div1.dom instanceof HTMLDivElement)
    assert.ok(div2.dom instanceof HTMLDivElement)
    assert.ok(div3.dom instanceof HTMLDivElement)

    assert.equal(div1.html, '<div></div>')
    assert.equal(div2.html, '<div></div>')
    assert.equal(div3.html, '<div></div>')
  }

  /** Создание экземпляра OOM по готовому DOM элементу */
  ['Использование готового DOM элемента в oom']() {
    const div = oom(document.createElement('div'))

    assert.ok(div.dom instanceof HTMLDivElement)

    assert.equal(div.html, '<div></div>')
  }

  /** Создание OOM элемента с некорректным tagName завершается ошибкой */
  ['Ошибка при вызове с некорректным tagName']() {
    let div

    try {
      // @ts-ignore
      div = oom(0)
    } catch (error) {
      assert.ok(error.message.startsWith('"0" did not match the Name production'))
    }
    try {
      // @ts-ignore
      div = oom({})
    } catch (error) {
      assert.ok(error.message.startsWith('"[object Object]" did not match the Name production'))
    }

    assert.equal(div, undefined)
  }

  /**
   * Вставка выполняется вызовом как функции ранее созданного элемента.
   *  Символы "()" создают создают эффект проваливания ниже на уровень
   */
  ['Вложение элемента, как экземпляра oom']() {
    const div1 = oom.div()
    const a2 = oom('a')
    const p3 = oom.oom('p')

    div1(oom.oom('p'))
    a2(oom.i())
    p3(oom('div'))

    assert.equal(div1.html, '<div><p></p></div>')
    assert.equal(a2.html, '<a><i></i></a>')
    assert.equal(p3.html, '<p><div></div></p>')
  }

  /**
   * Вставка дочерних элементов, через вызов функции,
   *    работает и для базовых элементов DOM
   */
  ['Вложение элемента, как базового элемента DOM']() {
    const div1 = oom.div()
    const a2 = oom('a')
    const fragment1 = document.createDocumentFragment()

    fragment1.append(
      document.createElement('p'),
      document.createElement('b')
    )

    div1(document.createElement('a'))
    a2(fragment1)

    assert.equal(div1.html, '<div><a></a></div>')
    assert.equal(a2.html, '<a><p></p><b></b></a>')
  }

  /**
   * При вставке в качестве дочерних элементов встроенных объектов JS,
   *    и экземпляров пользовательских классов, выполняется приведение к строке.
   *  Вставка HTML строкой также экранируется стандартным методом HTMLElement.append
   */
  ['Вложение элемента, встроенного объекта JS или строки']() {
    const p1 = oom.p()
    const p2 = oom.p()
    const p3 = oom.p()
    const p2Date = new Date()
    const p2Str = p2Date + ''

    p1(/test/i) // RegExp - превратиться в строку
    p2(p2Date)
    p3(null, false, true, undefined)

    assert.equal(p1.html, '<p>/test/i</p>')
    assert.equal(p2.html, `<p>${p2Str}</p>`)
    assert.equal(p3.html, '<p>nullfalsetrue</p>')
  }

  /**
   * При создании элемента доп. аргументом передается объект с атрибутами,
   *    которые перекладываются на созданный экземпляр DOM.
   *  Символ " экранируется, чтобы не портить разметку
   */
  ['Установка атрибутов элемента при создании']() {
    const div1 = oom.div({ class: 'test1', test: '"' })
    const div2 = oom('div', { class: 'test2', test: '"' })
    const div3 = oom.oom('div', { class: 'test3', test: '"' })

    assert.equal(div1.html, '<div class="test1" test="&quot;"></div>')
    assert.equal(div2.html, '<div class="test2" test="&quot;"></div>')
    assert.equal(div3.html, '<div class="test3" test="&quot;"></div>')
  }

  /** Выполняется вызовом как функции ранее созданного элемента */
  ['Обновление атрибутов элемента через ловушку apply']() {
    const div1 = oom.div({ class: 'test1' })
    const div2 = oom('div', { class: 'test2' })
    const div3 = oom.oom('div', { class: 'test3' })

    assert.equal(div1.html, '<div class="test1"></div>')
    assert.equal(div2.html, '<div class="test2"></div>')
    assert.equal(div3.html, '<div class="test3"></div>')

    div1({ class: 'test4' })
    div2({ class: 'test5' })
    div3({ class: '' })

    assert.equal(div1.html, '<div class="test4"></div>')
    assert.equal(div2.html, '<div class="test5"></div>')
    assert.equal(div3.html, '<div class=""></div>')
  }

  /**
   * Все аргументы вызова как функции созданного элемента последовательно обрабатываются,
   *    и выполняется вставка дочерних элементов и обновление атрибутов
   */
  ['Вложение нескольких элементов / обновление атрибутов за 1 вызов']() {
    const div1 = oom.div()
    const a2 = oom('a')
    const p3 = oom.oom('p')

    div1(a2, p3, { class: 'test' }, { test: 'class', class: 'test2' })

    assert.equal(div1.html, '<div class="test2" test="class"><a></a><p></p></div>')
  }

  /**
   * При создании элемента все аргументы используются аналогично аргументам при вызове элемента как функции,
   *    за исключением аргумента с названием тега.
   *  А в коде используется общий метод для обновления созданного элемента
   */
  ['Вложение нескольких элементов / обновление атрибутов при создании экземпляра oom']() {
    const a1 = oom('a')
    const p1 = oom.oom('p')
    const a2 = oom('a')
    const p2 = oom.oom('p')
    const div1 = oom.div(a1, p1, { class: 'test' }, { test: 'class', class: 'test2' })
    const div2 = oom('div', a2, p2, { class: 'test' }, { test: 'class', class: 'test2' })

    assert.equal(div1.html, '<div class="test2" test="class"><a></a><p></p></div>')
    assert.equal(div2.html, '<div class="test2" test="class"><a></a><p></p></div>')
  }

  /**
   * Создание составных компонентов можно выполнять без использования промежуточных переменных,
   *    чтобы приблизить вид к верстке через HTML.
   */
  ['Верстка составного компонента через аргументы']() {
    const component1 = oom('div', { class: 'link' },
      oom.span({ class: 'title' }, 'Link: '),
      oom.a({ href: 'https://test.ok' }, 'test.ok')
    )
    const component2 = oom.div({ class: 'link' },
      oom.span({ class: 'title' }, 'Link: '),
      oom.a({ href: 'https://test.ok' }, 'test.ok')
    )
    const componentText = `
      <div class="link">
        <span class="title">Link: </span>
        <a href="https://test.ok">test.ok</a>
      </div>
    `.replace(/\s*\n+\s+/g, '')

    assert.equal(component1.html, componentText)
    assert.equal(component2.html, componentText)
  }

  /**
   * Чтобы создать несколько элементов без вложенности на одном уровне,
   *    а затем поместить в другой элемент, в качестве контейнера используется DocumentFragment
   */
  ['Создание OOM элемента с DocumentFragment']() {
    const fragment1 = oom()
    const fragment2 = oom(document.createDocumentFragment())

    fragment1(oom.div())
    fragment2(oom.div(), oom.div())

    assert.ok(fragment1.dom instanceof DocumentFragment)
    assert.ok(fragment2.dom instanceof DocumentFragment)

    assert.equal(fragment1.html, '<div></div>')
    assert.equal(fragment2.html, '<div></div><div></div>')
  }

  /**
   * При попытке обновления атрибутов для DocumentFragment
   *    кидается стандартная ошибка об отсутствии метода
   */
  ['Ошибка обновления атрибутов для DocumentFragment']() {
    const fragment = oom()
    let err

    try {
      fragment({ class: 'test' })
    } catch (error) {
      err = error
    }

    assert.equal(err.message, 'instance.setAttribute is not a function')
    assert.equal(fragment.html, '')
  }

  /**
   * Использование чейнинга на элементе создает DocumentFragment,
   *    помещая элементы последовательно
   */
  ['Создание последовательных элементов через чейнинг']() {
    const fragment1 = oom
      .div('test1')
      .div('test2')
      .div('test3')
    const fragment2 = oom()

    fragment2.div('test1')
    fragment2(oom('div', 'test2'))
    fragment2.div('test3')

    assert.equal(fragment1.html, '<div>test1</div><div>test2</div><div>test3</div>')
    assert.equal(fragment2.html, '<div>test1</div><div>test2</div><div>test3</div>')
  }

  /** Что бы уменьшить кол-во кода создание составных компонентов можно выполнять с использованием чейнинга */
  ['Верстка составного компонента через чейнинг']() {
    const component1 = oom('div', { class: 'link' }, oom
      .span({ class: 'title' }, 'Link: ')
      .a({ href: 'https://test.ok' }, 'test.ok'))
    const component2 = oom.div({ class: 'link' }, oom
      .span({ class: 'title' }, 'Link: ')
      .a({ href: 'https://test.ok' }, 'test.ok'))
    const componentText = `
    <div class="link">
      <span class="title">Link: </span>
      <a href="https://test.ok">test.ok</a>
    </div>
  `.replace(/\s*\n+\s+/g, '')

    assert.equal(component1.html, componentText)
    assert.equal(component2.html, componentText)
  }

}
