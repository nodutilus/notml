import { oom } from '../@notml/core/core.js'

const { document } = window


/**
 * @param {string} name Имя теста
 * @param {any} actual Актуальное значение для проверки
 * @param {any} expected Фактическое значение для проверки
 */
function assertEqual(name, actual, expected) {
  if (actual !== expected) {
    console.log(name, ' -> failed')
    console.log('actual   =>', actual)
    console.log('expected =>', expected)
    console.error(new Error('actual !== expected'))
  } else {
    console.log(name, ' -> ok')
  }
}


// Example #1 - базовая верстка
const exp1 = document.getElementById('exp1')
const div1 = oom('div', oom
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' }))
const html1 = div1.html

exp1.append(div1.dom)
assertEqual('Example #1-1', html1, exp1.innerHTML)
assertEqual('Example #1-2', exp1.innerHTML,
  '<div>' +
  '<div class="header"></div>' +
  '<div class="test">' +
  '<span class="test-label">Name: </span>' +
  '<span class="test-name">Test</span>' +
  '</div>' +
  '<div class="footer"></div>' +
  '</div>')


// Example #2 - переиспользование и копирование
const exp2 = document.getElementById('exp2')
const header2 = oom('div', { class: 'header' }, oom
  .span('Test Header'))
const block2 = oom()

block2(oom
  .div(oom()
    .append(header2.clone())
    .div('div 1')))
block2(oom
  .div(oom()
    .append(header2.clone())
    .div('div 2')))

const html2 = block2.html

exp2.append(block2.dom)
assertEqual('Example #2-1', html2, exp2.innerHTML)
assertEqual('Example #2-2', exp2.innerHTML,
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 1</div>' +
  '</div>' +
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 2</div>' +
  '</div>')


// Example #3 - простой кастомный компонент
/** Test custom element */
class MyElementExp3 extends oom.extends(HTMLElement) {

  mySpan = oom.span('My element new text')

  template = oom('div', { class: 'MyElement__inner' })
    .append(this.mySpan.clone())
    .append(oom('br'))
    .append(this.mySpan)

}

oom.define(MyElementExp3)

const exp3 = document.getElementById('exp3')
const block3 = oom.MyElementExp3()
const html3 = block3.html

exp3.append(block3.dom)
assertEqual('Example #3-1', html3, '<my-element-exp3></my-element-exp3>')
assertEqual('Example #3-2', exp3.innerHTML,
  '<my-element-exp3>' +
  '<div class="MyElement__inner">' +
  '<span>My element new text</span>' +
  '<br>' +
  '<span>My element new text</span>' +
  '</div>' +
  '</my-element-exp3>')


// Example #4 - генерация style is="oom-style"
const exp4 = oom(document.getElementById('exp4'), oom
  .style({ '.exp4__label': { color: 'darkgreen' } })
  .span('exp4__label', { class: 'exp4__label' }))

assertEqual('Example #4-1', exp4.html, `
  <div id="exp4">
    <style is="oom-style">
      .exp4__label{ color: darkgreen; }
    </style>
    <span class="exp4__label">exp4__label</span>
  </div>
`.replace(/\s*\n+\s*/g, ''))
