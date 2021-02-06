import { customClasses } from './lib/shared-const.js'
import { OOMAbstract, OOMFragment, OOMElement } from './lib/factory.js'
import { defineCustomElement } from './lib/custom-elements.js'

const { customElements } = window
const oomOrigin = Object.assign(Object.create(null), {
  append: (...args) => {
    return oom().append(...args)
  },
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
  },
  oom: (...args) => {
    return oom(...args)
  }
})


export const oom = new Proxy(OOMAbstract, {
  apply: (_, __, args) => {
    const element = OOMAbstract.factory(...args)
    const proxy = new Proxy(element, OOMAbstract.proxyHandler)

    return proxy
  },
  get: (_, tagName) => {
    return oomOrigin[tagName] || ((...args) => {
      const element = new OOMElement(tagName, ...args)
      const fragment = new OOMFragment(element)
      const proxy = new Proxy(fragment, OOMAbstract.proxyHandler)

      return proxy
    })
  },
  set: () => false
})
