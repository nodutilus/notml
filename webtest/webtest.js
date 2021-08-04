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
    console.log('actual =>', actual)
    console.log('expected =>', expected)
    console.error(new Error('actual !== expected'))
  } else {
    console.log(name, ' -> ok')
  }
}


// Example #1
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


// Example #2
const exp2 = document.getElementById('exp2')
const header2 = oom('div', { class: 'header' }, oom
  .span('Test Header'))
const block2 = oom()

block2(
  oom
    .div(oom()
      .append(header2.clone())
      .div('div 1')),
  oom
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


// Example #3
/** Test custom element */
class MyElementExp3 extends HTMLElement {

  mySpan = oom.span('My element new text')

  template = oom('div', { class: 'MyElement__inner' })
    .append(this.mySpan.clone())
    .append(oom('br'))
    .append(this.mySpan)

}

const exp3 = document.getElementById('exp3')
const block3 = oom.define(MyElementExp3).MyElementExp3()
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


// Example #4
/** Test custom element */
class MyElementExp4 extends HTMLElement {

  static label = oom('span', { class: 'label' })
  static field = oom('span', { class: 'field' })

  /**
   * @param {{element:HTMLElement}} options Опции шаблона
   * @returns {oom} Шаблон компонента
   */
  static template({ element }) {
    return oom()
      .append(this.label.clone()
        .span({ class: 'text' }, label => (element._label = label)))
      .append(this.field.clone()
        .span({ class: 'text' }, field => (element._field = field)))
  }

  /**
   * on 'data-field-text' attribute change
   *
   * @param {string} oldValue Старое значение атрибута fieldText
   * @param {string} newValue Новое значение атрибута fieldText
   */
  dataFieldTextChanged(oldValue, newValue) {
    this._field.textContent = newValue
  }

  /**
   * on 'data-label-text' attribute change
   *
   * @param {string} oldValue Старое значение атрибута labelText
   * @param {string} newValue Новое значение атрибута labelText
   */
  dataLabelTextChanged(oldValue, newValue) {
    this._label.textContent = newValue
  }

}

oom.define(MyElementExp4)

const exp4 = document.getElementById('exp4')
const block4 = document.createElement('my-element-exp4')
const html4 = block4.outerHTML

block4.dataset.labelText = 'Name: '
block4.dataset.fieldText = 'Test'

exp4.append(block4)

assertEqual('Example #4-1', html4, '<my-element-exp4></my-element-exp4>')

assertEqual('Example #4-3', exp4.innerHTML,
  '<my-element-exp4 data-label-text="Name: " data-field-text="Test">' +
  '<span class="label"><span class="text">Name: </span></span>' +
  '<span class="field"><span class="text">Test</span></span>' +
  '</my-element-exp4>')
