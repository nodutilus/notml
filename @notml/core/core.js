/// <reference path="core.d.ts"/>
import { OOMElement } from './lib/factory.js'
import { extendsCustomElement, defineCustomElement } from './lib/custom-elements.js'

const oomOrigin = Object.assign(Object.create(null), {
  extends: extendsCustomElement,
  define: defineCustomElement
})


/** @type {import('@notml/core').OOMProxy} */
export const oom = oomOrigin.oom = new Proxy(OOMElement, {
  /** @type {import('@notml/core').OOMProxy.apply} */
  apply: (_, __, args) => {
    return OOMElement.createProxy(args)
  },
  get: (_, tagName, proxy) => {
    return oomOrigin[tagName] || ((...args) => proxy(tagName, ...args))
  },
  set: () => false
})
