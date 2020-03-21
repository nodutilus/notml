# NotML Core [![npm][npmbadge]][npm] [![build][badge]][actions]

Not a HTML - is object-oriented modeling of HTML

### Example #1

<table>
<tr><th width="1%">NotML</th><th width="1%">HTML</th></tr>
<tr>
<td><pre lang="js">
import { oom } from '@notml/core'
<br>
const div = oom('div')
  .div({ class: 'header' })
  .div({ class: 'test' }, oom
    .span('Name: ', { class: 'test-label' })
    .span('Test', { class: 'test-name' }))
  .div({ class: 'footer' })
</pre></td>
<td><pre lang="html">
&lt;div>
  &lt;div class="header">&lt;/div>
  &lt;div class="test">
    &lt;span class="test-label">Name: &lt;/span>
    &lt;span class="test-name">Test&lt;/span>
  &lt;/div>
  &lt;div class="footer">&lt;/div>
&lt;/div>
</pre></td>
</tr>
</table>

<table>
<tr><th width="1%">JavaScript native DOM (code executed inside NotML)</th></tr>
<tr><td><pre lang="js">
const divHeader = document.createElement('div')
const spanName = document.createElement('span')
const spanTest = document.createElement('span')
const divTest = document.createElement('div')
const divFooter = document.createElement('div')
const domDiv = document.createElement('div')
<br>
divHeader.setAttribute('class', 'header')
spanName.setAttribute('class', 'test-label')
spanTest.setAttribute('class', 'test-name')
divTest.setAttribute('class', 'test')
divFooter.setAttribute('class', 'footer')
spanName.textContent = 'Name: '
spanTest.textContent = 'Test'
<br>
domDiv.append(divHeader)
divTest.append(spanName)
divTest.append(spanTest)
domDiv.append(divTest)
domDiv.append(divFooter)
</pre></td></tr>
</table>

[npmbadge]: https://img.shields.io/npm/v/@notml/core

[npm]: https://www.npmjs.com/package/@notml/core

[badge]: https://github.com/@notml/core/workflows/Checks%20%26%20Publish/badge.svg

[actions]: https://github.com/@notml/core/actions
