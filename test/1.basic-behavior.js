import { assert, Test } from '@nodutilus/test'
import { oom } from '../src/core.js'

const { HTMLDivElement } = window


/** Проверка базового поведения создания верстки */
export default class BasicBehavior extends Test {

  /** Создание всегда начинается с единичного элемента,
   *    это делает API однозначным. */
  ['Создание DOM элемента']() {
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
   *  Символы "()" создают создают эффект проваливания ниже на уровень. */
  ['Вложенные DOM элементы']() {
    const div1 = oom.div()
    const div2 = oom('div')
    const div3 = oom.oom('div')

    div1(oom.oom('a'))
    div2(oom.a())
    div3(oom('a'))

    assert.equal(div1.html, '<div><a></a></div>')
    assert.equal(div2.html, '<div><a></a></div>')
    assert.equal(div3.html, '<div><a></a></div>')
  }

}
