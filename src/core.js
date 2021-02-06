import { customClasses } from './lib/shared-const.js'
import { OOMAbstract, OOMElement } from './lib/factory.js'
import { defineCustomElement } from './lib/custom-elements.js'

const { customElements } = window
const oomOrigin = Object.assign(Object.create(null), {
  setAttributes: (...args) => {
    OOMElement.setAttributes(...args)

    return oom
  },
  define: (...args) => {
    defineCustomElement(...args)

    return oom
  },
  getDefined: (tagName) => {
    return customClasses.get(customElements.get(tagName))
  }
})


export const oom = oomOrigin.oom = new Proxy(OOMAbstract, {
  apply: (_, __, args) => {
    const element = new OOMElement(...args)
    const proxy = new Proxy(element, OOMAbstract.proxyHandler)

    return proxy
  },
  get: (_, tagName, proxy) => {
    return oomOrigin[tagName] || ((...args) => proxy(tagName, ...args))
  },
  set: () => false
})
