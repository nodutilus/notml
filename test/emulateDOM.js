import jsdom from 'jsdom'

const { JSDOM } = jsdom
const { window } = new JSDOM('', {
  url: 'https://github.com/nodutilus/notml',
  runScripts: 'dangerously'
})


global.window = window
