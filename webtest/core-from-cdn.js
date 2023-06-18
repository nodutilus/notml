import { oom } from 'https://cdn.jsdelivr.net/npm/notml@latest/core.js'


oom(document.head, oom
  .style({
    '.test': { background: 'darkorange' },
    '.label': { color: 'darkgreen' }
  }))
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - from CDN (All-in-one)', { class: 'label' })))
