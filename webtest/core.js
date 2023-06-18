import { oom } from '../@notml/notml/core.js'

oom(document.head, oom
  .style({
    '.test': { background: 'darkorange' },
    '.label': { color: 'darkgreen' }
  }))
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - CDN lib', { class: 'label' })))
