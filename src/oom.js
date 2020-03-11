class OOMElement {

}


function oomTagFactory() {

}


const oom = new Proxy(() => { }, {
  apply: (_, __, args) => new Proxy(new OOMElement(...args), oomHandler),
  get: (_, tagName) => (typeof tagName === 'string' && !(tagName in oomOrigin))
    ? (oomOrigin[tagName] = (...args) => new Proxy(new OOMElement(new OOMElement(tagName, ...args)), oomHandler))
    : oomOrigin[tagName],
  set: () => false
})


export { oom }
