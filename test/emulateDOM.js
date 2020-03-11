import jsdom from 'jsdom'

const { JSDOM } = jsdom
const { window } = new JSDOM('', { url: 'https://github.com/notml/core/' })


global.window = window
