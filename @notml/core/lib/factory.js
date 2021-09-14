import { OOMStyle } from './style.js'

const { document, customElements, DocumentFragment, HTMLElement } = window
const isOOMElementSymbol = Symbol('isOOMElement')
const proxiesMap = new WeakMap()
/** @type {import('@notml/core').base.OOMProxyConstructor} */
const OOMProxyConstructor = Proxy

/** @type {import('@notml/core').OOMElement} */
class OOMElement {

  /** @type {import('@notml/core').OOMElement.createProxy} */
  static createProxy(
    /** @type {import('@notml/core').OOMElement.OOMElementArgs} */
    args
  ) {
    const wrapper = /* c8 ignore next */ () => { }
    const proxy = new OOMProxyConstructor(wrapper, OOMElement.proxyHandler)

    wrapper.instance = new OOMElement(...args)
    proxiesMap.set(wrapper.instance, proxy)

    return proxy
  }

  /** @type {import('@notml/core').OOMElement.proxyApply} */
  static proxyApply(
    /** @type {import('@notml/core').OOMElement.OOMElementWrapper} */
    { instance }, /** @type {any} */_,
    /** @type {import('@notml/core').OOMElement.ProxyApplyArgs} */
    args
  ) {
    const proxy = proxiesMap.get(instance)

    if (instance.dom instanceof OOMStyle) {
      // @ts-ignore вызываем независимо от аргументов, чтобы упало стандартное исключение из DOM API
      instance.dom.update(...args)
    } else {
      for (const arg of args) {
        const isChild =
          arg instanceof OOMElement ||
          arg instanceof HTMLElement ||
          arg instanceof DocumentFragment ||
          typeof arg !== 'object' || !arg ||
          arg.constructor !== Object

        // Чтобы поймать стандартное исключение DOM API, игнорируем проверку на произвольные типы данных
        if (isChild) {
          // @ts-ignore независимо от типа добавляемого элемента вызовем вставку
          instance.append(arg)
        } else {
          // @ts-ignore независимо от типа аргументов вызываем установку атрибутов
          OOMElement.setAttributes(instance.dom, arg)
        }
      }
    }

    return proxy
  }

  /** @type {import('@notml/core').OOMElement.proxyGetter} */
  static proxyGetter(
    /** @type {import('@notml/core').OOMElement.OOMElementWrapper} */
    { instance },
    /** @type {import('@notml/core').OOMElement.TagName} */
    tagName,
    /** @type {import('@notml/core').OOMElementProxy} */
    proxy
  ) {
    if (tagName in instance) {
      if (typeof instance[tagName] === 'function') {
        return (...args) => {
          const result = instance[tagName](...args)

          return result === instance ? proxy : result
        }
      } else {
        return instance[tagName]
      }
    } else {
      return (...args) => {
        if (instance.dom instanceof DocumentFragment) {
          instance.append(new OOMElement(tagName, ...args))
        } else {
          proxy = OOMElement.createProxy([
            document.createDocumentFragment(),
            proxy.dom,
            new OOMElement(tagName, ...args)
          ])
        }

        return proxy
      }
    }
  }

  /** @type {import('@notml/core').OOMElement.hasInstance} */
  static [Symbol.hasInstance](
    /** @type {import('@notml/core').OOMElementProxy} */
    instance
  ) {
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/44512
    return instance && instance[isOOMElementSymbol] === true
  }

  /** @type {import('@notml/core').OOMElement.setAttribute} */
  static setAttribute(
    /** @type {HTMLElement} */
    instance,
    /** @type {import('@notml/core').OOMElement.AttributeName} */
    attrName,
    /** @type {import('@notml/core').OOMElement.OOMAttributeValue} */
    attrValue
  ) {
    switch (typeof attrValue) {
      case 'object':
        if (attrName === 'style') {
          for (const name in attrValue) {
            instance.style[name] = attrValue[name]
          }
        }
        break
      case 'function':
        instance[attrName] = attrValue
        break
      default:
        attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
        if (attrName === 'class' && 'className' in instance.constructor) {
          attrValue = instance.constructor.className + ' ' + attrValue
        }
        instance.setAttribute(attrName, attrValue)
        break
    }
  }

  /** @type {import('@notml/core').OOMElement.setAttributes} */
  static setAttributes(
    /** @type {HTMLElement} */
    instance,
    /** @type {import('@notml/core').OOMElement.OOMAttributes} */
    attributes = {}
  ) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      OOMElement.setAttribute(instance, attrName, attrValue)
    }
  }

  /** @type {import('@notml/core').OOMElement.getAttribute} */
  static getAttribute(
    /** @type {HTMLElement} */
    instance,
    /** @type {import('@notml/core').OOMElement.AttributeName} */
    attrName
  ) {
    if (typeof instance[attrName] === 'function') {
      return instance[attrName]
    }
    if ((/[A-Z]/).test(attrName)) {
      attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
    }
    if (attrName === 'style') {
      return instance.style
    } else {
      return instance.getAttribute(attrName)
    }
  }

  /** @type {import('@notml/core').OOMElement.isOOMElementSymbol} */
  [isOOMElementSymbol] = true

  /** @type {import('@notml/core').OOMElement.DOMElement} */
  dom

  /** @type {import('@notml/core').OOMElement.HTML} */
  get html() {
    const { dom } = this
    let html = ''

    if (dom instanceof DocumentFragment) {
      for (const item of Array.from(dom.childNodes)) {
        if (item instanceof HTMLElement) {
          html += item.outerHTML
        } else if (item.nodeType === document.TEXT_NODE) {
          html += item.textContent
        }
      }
    } else {
      html = dom.outerHTML
    }

    return html
  }

  /** @type {import('@notml/core').OOMElement.constructor} */
  constructor(
    /** @type {import('@notml/core').OOMElement.OOMTagName} */
    tagName,
    /** @type {import('@notml/core').OOMElement.ProxyApplyArgs} */
    ...args
  ) {
    if (typeof tagName === 'string') {
      tagName = tagName.replace((/[A-Z]+/g), str => `-${str.toLowerCase()}`)
      if (tagName === 'style') {
        tagName = 'oom-style'
      }

      const Constructor = customElements.get(tagName)

      if (Constructor) {
        this.dom = new Constructor()
      } else {
        this.dom = document.createElement(tagName)
      }
    } else if (tagName instanceof HTMLElement || tagName instanceof DocumentFragment) {
      this.dom = tagName
      /* eslint-disable-next-line no-prototype-builtins */
    } else if (HTMLElement.isPrototypeOf(tagName) || DocumentFragment.isPrototypeOf(tagName)) {
      /* eslint-disable-next-line new-cap */
      this.dom = new tagName()
    } else if (typeof tagName === 'undefined') {
      this.dom = document.createDocumentFragment()
    } else {
      // @ts-ignore В остальных случаях createElement вернет собственную ошибку создания элемента
      this.dom = document.createElement(tagName)
    }
    OOMElement.proxyApply({ instance: this }, null, args)
  }

  /** @type {import('@notml/core').OOMElement.append} */
  append(/** @type {any} */child) {
    if (child instanceof OOMElement) {
      this.dom.append(child.dom)
    } else if (typeof child !== 'undefined') {
      this.dom.append(child)
    }

    return this
  }

  /** @type {import('@notml/core').OOMElement.clone} */
  clone() {
    const dom = document.importNode(this.dom, true)

    return OOMElement.createProxy([dom])
  }

}

/** @type {import('@notml/core').OOMElement.proxyHandler} */
OOMElement.proxyHandler = {
  apply: OOMElement.proxyApply,
  get: OOMElement.proxyGetter,
  set: () => false
}

export { OOMElement }
