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

Reuse of the prepared elements

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

[npmbadge]: https://img.shields.io/npm/v/@notml/core

[npm]: https://www.npmjs.com/package/@notml/core

[badge]: https://github.com/@notml/core/workflows/Checks%20%26%20Publish/badge.svg

[actions]: https://github.com/@notml/core/actions
