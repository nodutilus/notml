import { oom } from '../@notml/core/core.js'

const style = oom.style({
  ':root': {
    '--bg-color': 'red',
    '--lbl-color': 'darkgreen'
  },
  '.test': {
    background: 'var(--bg-color)'
  },
  '.label': { color: 'var(--lbl-color)' }
})


style({ ':root': { '--bg-color': 'darkorange' } })

oom(document.head, style)
oom(document.body, oom
  .div({ class: 'test' }, oom
    .span('NotML Core - CSS Custom Properties', { class: 'label' })))
