# NotML Core [![npm][npmbadge]][npm] [![build][badge]][actions]

Not a HTML - is object-oriented modeling of HTML

### Example #1

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

code executed inside NotML

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

[npmbadge]: https://img.shields.io/npm/v/@notml/core

[npm]: https://www.npmjs.com/package/@notml/core

[badge]: https://github.com/@notml/core/workflows/Checks%20%26%20Publish/badge.svg

[actions]: https://github.com/@notml/core/actions
