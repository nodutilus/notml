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
const exp1 = document.getElementById('exp1')
const div1 = oom('div')
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' })

exp1.append(div1.dom)
assertEqual('Example #1-1', div1.html, exp1.innerHTML)
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

exp2.append(block2.dom)
assertEqual('Example #2-1', block2.html, exp2.innerHTML)
assertEqual('Example #2-2', exp2.innerHTML,
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 1</div>' +
  '</div>' +
  '<div>' +
  '<div class="header"><span>Test Header</span></div>' +
  '<div>div 2</div>' +
  '</div>')
