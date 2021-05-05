import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document, HTMLDivElement } = window


/** Проверка базового поведения создания верстки */
export default class BasicBehavior extends Test {

  /** Создание всегда начинается с единичного элемента,
   *    это делает API однозначным */
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

  /** Вставка выполняется вызовом как функции ранее созданного элемента.
   *  Символы "()" создают создают эффект проваливания ниже на уровень */
  ['Вложение элемента, как экземпляра oom']() {
    const div1 = oom.div()
    const a2 = oom('a')
    const p3 = oom.oom('p')
    const u4 = oom.u()

    div1(oom.oom('p'))
    a2(oom.i())
    p3(oom('div'))
    u4(div1, a2)

    assert.equal(div1.html, '<div><p></p></div>')
    assert.equal(a2.html, '<a><i></i></a>')
    assert.equal(p3.html, '<p><div></div></p>')
    assert.equal(u4.html, '<u><div><p></p></div><a><i></i></a></u>')
  }

  /** Вставка дочерних элементов, через вызов функции,
   *    работает и для базовых элементов DOM */
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

  /** При вставке в качестве дочерних элементов встроенных объектов JS,
   *    и экземпляров пользовательских классов, выполняется приведение к строке.
   *  Вставка HTML строкой также экранируется стандартным методом HTMLElement.append */
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

  /** При создании элемента доп. аргументом передается объект с атрибутами,
   *    которые перекладываются на созданный экземпляр DOM.
   *  Символ " экранируется, чтобы не портить разметку */
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

}
