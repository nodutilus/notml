import { oom } from 'https://cdn.jsdelivr.net/npm/notml@0.1.0-pre.1/core.min.js'


oom(document.head, oom
  .style({
    '.test': { background: 'darkorange' },
    '.label': { color: 'darkgreen' }
  }))
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - from CDN (All-in-one - minimized)', { class: 'label' })))
