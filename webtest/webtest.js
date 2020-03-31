import { oom } from './notml.js'

/**
 * @param {string} name
 * @param {any} actual
 * @param {any} expected
 */
function assertEqual(name, actual, expected) {
  if (actual !== expected) {
    console.log('actual =>', actual)
    console.log('expected =>', expected)
    throw new Error('actual !== expected')
  } else {
    console.log(name, ' -> ok')
  }
}

// Example #1
const div1 = oom('div')
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' })

document.getElementById('exp1').append(div1.dom)
assertEqual('Example #1', document.getElementById('exp1').innerHTML,
  '<div>' +
  '<div class="header"></div>' +
  '<div class="test">' +
  '<span class="test-label">Name: </span>' +
  '<span class="test-name">Test</span>' +
  '</div>' +
  '<div class="footer"></div>' +
  '</div>')

// Example #2
const header2 = oom('div', { class: 'header' })
  .span('Test Header')
const block2 = oom('div')
  .div(oom
    .append(header2.clone())
    .div('div 1'))
  .div(oom
    .append(header2.clone())
    .div('div 2'))

document.getElementById('exp2').append(block2.dom)
assertEqual('Example #2', document.getElementById('exp2').innerHTML,
  '<div>' +
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 1</div>' +
  '</div>' +
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 2</div>' +
  '</div>' +
  '</div>')
