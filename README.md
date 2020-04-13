# NotML Core [![npm][npmbadge]][npm] [![build][badge]][actions]

Not a HTML - is object-oriented modeling of HTML

### Example #1

Simple layout. Comparison with HTML.

##### NotML

```js
import { oom } from '@notml/core'

const div = oom('div')
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' })
```

##### HTML

```html
<div>
  <div class="header"></div>
  <div class="test">
    <span class="test-label">Name: </span>
    <span class="test-name">Test</span>
  </div>
  <div class="footer"></div>
</div>
```

##### JavaScript native DOM

Code executed inside NotML

```js
const divHeader = document.createElement('div')
const spanName = document.createElement('span')
const spanTest = document.createElement('span')
const divTest = document.createElement('div')
const divFooter = document.createElement('div')
const domDiv = document.createElement('div')

divHeader.setAttribute('class', 'header')
spanName.setAttribute('class', 'test-label')
spanTest.setAttribute('class', 'test-name')
divTest.setAttribute('class', 'test')
divFooter.setAttribute('class', 'footer')
spanName.textContent = 'Name: '
spanTest.textContent = 'Test'

domDiv.append(divHeader)
divTest.append(spanName)
divTest.append(spanTest)
domDiv.append(divTest)
domDiv.append(divFooter)
```

### Example #2

Reuse prepared elements

##### NotML

```js
const header = oom('div', { class: 'header' })
  .span('Test Header')

const block = oom
  .div(oom
    .append(header.clone())
    .div('div 1'))
  .div(oom
    .append(header.clone())
    .div('div 2'))
```

##### HTML

```html
<div>
  <div class="header">
    <span>Test Header</span>
  </div>
  <div>div 1</div>
</div>
<div>
  <div class="header">
    <span>Test Header</span>
  </div>
  <div>div 2</div>
</div>
```

### Example #3

Simple `template`

> A `template` instance is cloned on `connectedCallback`. Handler implemented in `oom.define`.

##### NotML

```js
class MyElementExp3 extends HTMLElement {

  mySpan = oom.span('My element new text')

  template = oom('div', { class: 'MyElement__inner' })
    .append(this.mySpan.clone())
    .append(oom('br'))
    .append(this.mySpan)

}

const block = oom.define(MyElementExp3).MyElementExp3()
```

##### HTML

```html
<my-element-exp3>
  <div class="MyElement__inner">
    <span>My element new text</span>
    <br>
    <span>My element new text</span>
  </div>
</my-element-exp3>
```

### Example #4

Reactive data-properties and attributes. (see more: `HTMLElement.dataset`)

##### NotML

```js
class MyElementExp4 extends HTMLElement {

  static label = oom('span', { class: 'label' })
  static field = oom('span', { class: 'field' })

  static template(instance) {
    return oom()
      .append(this.label.clone()
        .span({ class: 'text' }, label => (instance._label = label)))
      .append(this.field.clone()
        .span({ class: 'text' }, field => (instance._field = field)))
  }

  /** on 'data-field-text' attribute change */
  dataFieldTextChanged(oldValue, newValue) {
    this._field.textContent = newValue
  }

  /** on 'data-label-text' attribute change */
  dataLabelTextChanged(oldValue, newValue) {
    this._label.textContent = newValue
  }

}

oom.define(MyElementExp4)

const block = document.createElement('my-element-exp4')

block.dataset.labelText = 'Name: '
block.dataset.fieldText = 'Test'

document.body.append(block)
```

##### HTML

```html
<my-element-exp4 data-label-text="Name: " data-field-text="Test">
  <span class="label">
    <span class="text">Name: </span>
  </span>
  <span class="field">
    <span class="text">Test</span>
  </span>
</my-element-exp4>
```

[npmbadge]: https://img.shields.io/npm/v/@notml/core

[npm]: https://www.npmjs.com/package/@notml/core

[badge]: https://github.com/@notml/core/workflows/Checks%20%26%20Publish/badge.svg

[actions]: https://github.com/@notml/core/actions
