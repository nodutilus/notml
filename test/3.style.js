// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { document } = window

/** Тесты генерации CSS через OOMStyle */
export default class OOMStyle extends Test {

  /**
   * Атрибут style в oom шаблоне позволяет задавать стили объектом в формате CSSStyleDeclaration.
   * Что позволяет последовательно обновлять inline стили, не перетирая всё значение атрибута.
   * Также можно указать style в классическом виде, как строку
   */
  ['Атрибут style']() {
    const div = oom.div({ style: { background: 'red' } })

    assert.equal(div.html, '<div style="background: red;"></div>')

    div({ style: { background: 'green', fontSize: '14px' } })
    assert.equal(div.html, '<div style="background: green; font-size: 14px;"></div>')

    div({ style: { background: 'orange' } })
    assert.equal(div.html, '<div style="font-size: 14px; background: orange;"></div>')

    // Можно указать строкой и перезаписать весь style
    div({ style: 'background: red;' })
    assert.equal(div.html, '<div style="background: red;"></div>')

    // Для обнуления стилей можно использовать указание пустой строки
    div({ style: '' })
    assert.equal(div.html, '<div style=""></div>')
  }

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
   * Возможность создания встроенного style остается через document.createElement,
   *  в oom шаблоне для обычного style нет особого применения
   */
  ['Создание style через document.createElement']() {
    const style = oom(document.createElement('style'))
    const oomStyle = oom(document.createElement('style', { is: 'oom-style' }))

    assert.equal(style.html, '<style></style>')
    assert.equal(oomStyle.html, '<style is="oom-style"></style>')
  }

  /**
   * Стили указываются объектом, где ключи это CSS селекторы, а значения объект со свойствами CSS.
   * Объект со свойствами определяется в формате CSSStyleDeclaration, как и атрибут style в oom шаблоне
   */
  ['Простой объект с селекторами']() {
    const style = oom.style({ '.my-class': { background: 'red', fontSize: '12px' } })

    document.body.innerHTML = ''
    document.body.append(style.dom)
    assert.equal(document.body.innerHTML, `
      <style is="oom-style">
        .my-class{ background: red; font-size: 12px; }
      </style>
    `.replace(/\s*\n+\s+/g, ''))
    document.body.innerHTML = ''
  }

}
