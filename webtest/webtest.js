import { oom } from './notml.js'

const { document } = window


/**
 * @param {string} name
 * @param {any} actual
 * @param {any} expected
 */
function assertEqual(name, actual, expected) {
  if (actual !== expected) {
    console.log('actual =>', actual)
    console.log('expected =>', expected)
    console.error(new Error('actual !== expected'))
  } else {
    console.log(name, ' -> ok')
  }
}


// Example #1
const exp1 = document.getElementById('exp1')
const div1 = oom('div')
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' })
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


// Example #2
const exp2 = document.getElementById('exp2')
const header2 = oom('div', { class: 'header' })
  .span('Test Header')
const block2 = oom
  .div(oom
    .append(header2.clone())
    .div('div 1'))
  .div(oom
    .append(header2.clone())
    .div('div 2'))
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


// Example #3
/** Test custom element */
class MyElement extends HTMLElement {

  span = oom.span('My element new text')
  template = oom('div', { class: 'MyElement__inner' }, this.span)

}

const exp3 = document.getElementById('exp3')
const block3 = oom.define(MyElement)
  .MyElement({ class: 'MyCustom' }, oom
    .span('My custom'))
const html3 = block3.html

exp3.append(block3.dom)
assertEqual('Example #3-1', html3,
  '<my-element class="MyCustom">' +
  '<span>My custom</span>' +
  '</my-element>')
assertEqual('Example #3-2', exp3.innerHTML,
  '<my-element class="MyCustom">' +
  '<div class="MyElement__inner">' +
  '<span>My element new text</span>' +
  '</div>' +
  '</my-element>')
