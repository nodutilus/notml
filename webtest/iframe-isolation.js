import { oom } from '../@notml/core/core.js'

const { document } = window
/** @type {HTMLIFrameElement} */
// @ts-ignore
const frame = document.getElementById('iframe')

if (frame) {
  const fDoc = frame.contentDocument
  const script = fDoc.createElement('script')

  script.type = 'module'
  script.src = '/webtest/iframe-isolation.js'
  fDoc.documentElement.appendChild(script)
}

oom(document.head, oom
  .style({
    '.test': { background: frame ? 'darkorange' : 'darkgreen' },
    '.label': { color: frame ? 'darkgreen' : 'darkorange' }
  }))
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - CDN lib', { class: 'label' })))
