import { oom } from 'https://cdn.jsdelivr.net/npm/notml@latest/core.min.js'

const style = oom
  .style({
    '.test': { background: 'darkorange' },
    '.label': { color: 'darkgreen' }
  })

oom(document.head, style)
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - from CDN (All-in-one - minimized)', { class: 'label' })))
