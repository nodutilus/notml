// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document } = window

/** Тесты генерации CSS через OOMStyle */
export default class OOMStyle extends Test {

  /**
   * Генератор стилей наследуется от базового style для сохранения оригинального tagName.
   * И все обращения к style через oom шаблонизатор создают OOMStyle, что бы использовать объектную модель
   */
  ['OOMStyle extends HTMLStyleElement']() {
    let style

    style = oom('style')
    assert.equal(style.html, '<style is="oom-style"></style>')

    style = oom('oom-style')
    assert.equal(style.html, '<style is="oom-style"></style>')

    style = oom.style()
    assert.equal(style.html, '<style is="oom-style"></style>')

    style = oom.OOMStyle()
    assert.equal(style.html, '<style is="oom-style"></style>')
  }

  /**
   * У тега style общий чейнинг с другими элементами, базовая верстка через oom не нарушается
   */
  ['Чейнинг для style']() {
    let style

    style = oom.div().style().span()
    assert.equal(style.html, '<div></div><style is="oom-style"></style><span></span>')

    style = oom.div(oom.style().span())
    assert.equal(style.html, '<div><style is="oom-style"></style><span></span></div>')

    style = oom.div(oom.span().style())
    assert.equal(style.html, '<div><span></span><style is="oom-style"></style></div>')
  }

  /**
   * У style всего 1 значимый атрибут для HTML5 - media,
   * только его установка и поддерживается в OOM шаблонизаторе. @see http://htmlbook.ru/html/style
   */
  ['Атрибут media для style']() {
    let style

    style = oom.style('print')
    assert.equal(style.html, '<style is="oom-style" media="print"></style>')

    style = oom.style()
    assert.equal(style.html, '<style is="oom-style"></style>')
    style('handheld')
    assert.equal(style.html, '<style is="oom-style" media="handheld"></style>')
  }

  /**
   * Возможность создания встроенного style остается при передаче экземпляра элемента
   */
  ['Создание style через document.createElement']() {
    const style = oom(document.createElement('style'))
    const oomStyle = oom(document.createElement('style', { is: 'oom-style' }))

    assert.equal(style.html, '<style></style>')
    assert.equal(oomStyle.html, '<style is="oom-style"></style>')
  }

}
