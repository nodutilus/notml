/// <reference path="core.d.ts"/>
import { OOMElement } from './lib/factory.js'
import { extendsCustomElement } from './lib/custom-elements.js'

const oomOrigin = Object.assign(Object.create(null), {
  update: (...args) => {
    OOMElement.update(...args)

    return oom
  },
  extends: extendsCustomElement
})


/** @type {import('@notml/core').OOMProxy} */
export const oom = oomOrigin.oom = new Proxy(OOMElement, {
  apply: (_, __, args) => {
    return OOMElement.createProxy(args)
  },
  get: (_, tagName, proxy) => {
    return oomOrigin[tagName] || ((...args) => proxy(tagName, ...args))
  },
  set: () => false
})
