import { assert, Test } from '@nodutilus/test'
import { oom } from '../src/core.js'

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

  /** Вставка выполняется вызовом как функции ранее созданного элемента.
   *  Символы "()" создают создают эффект проваливания ниже на уровень */
  ['Вложение DOM элемента, как экземпляра oom']() {
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
  ['Вложение DOM элемента, как базового элемента DOM']() {
    const div1 = oom.div()
    const a2 = oom('a')
    const ragment1 = document.createDocumentFragment()

    ragment1.append(
      document.createElement('p'),
      document.createElement('b')
    )

    div1(document.createElement('a'))
    a2(ragment1)

    assert.equal(div1.html, '<div><a></a></div>')
    assert.equal(a2.html, '<a><p></p><b></b></a>')
  }

}
