import { oom } from '../@notml/notml/core.min.js'

oom(document.head, oom
  .style({
    '.test': { background: 'darkorange' },
    '.label': { color: 'darkgreen' }
  }))
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - CDN lib (min)', { class: 'label' })))
