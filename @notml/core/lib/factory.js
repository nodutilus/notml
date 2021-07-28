const { document, customElements, DocumentFragment, HTMLElement } = window
const isOOMElementSymbol = Symbol('isOOMElement')
/** @type {import('@notml/core').OOMProxyConstructor} */
const OOMProxyConstructor = Proxy

/** @typedef {import('@notml/core').OOMElement} IOOMElement */
/** @implements {IOOMElement} */
class OOMElement {

  /** @type {import('@notml/core').OOMElement.createProxy} */
  static createProxy(
    /** @type {import('@notml/core').OOMElement.OOMElementArgs} */
    args
  ) {
    const wrapper = /* c8 ignore next */ () => { }

    wrapper.instance = new OOMElement(...args)

    return new OOMProxyConstructor(wrapper, OOMElement.proxyHandler)
  }

  /** @type {import('@notml/core').OOMElement.proxyApply} */
  static proxyApply(
    /** @type {import('@notml/core').OOMElement.OOMElementWrapper} */
    { instance }, /** @type {any} */_,
    /** @type {import('@notml/core').OOMElement.ProxyApplyArgs} */
    args
  ) {
    for (const arg of args) {
      const isChild =
        arg instanceof OOMElement ||
        arg instanceof HTMLElement ||
        arg instanceof DocumentFragment ||
        typeof arg !== 'object' || !arg ||
        arg.constructor !== Object

      if (isChild) {
        instance.append(arg)
      } else if (instance.dom instanceof HTMLElement) {
        OOMElement.setAttributes(instance.dom, arg)
      }
    }
  }

  /** @type {import('@notml/core').OOMElement.proxyGetter} */
  static proxyGetter(
    /** @type {import('@notml/core').OOMElement.OOMElementWrapper} */
    { instance },
    /** @type {import('@notml/core').OOMElement.TagName} */
    tagName,
    /** @type {import('@notml/core').OOMProxy} */
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
    /** @type {import('@notml/core').OOMProxy} */
    instance
  ) {
    return instance && instance[isOOMElementSymbol] === true
  }

  /** @type {import('@notml/core').OOMElement.resolveTagName} */
  static resolveTagName(
    /** @type {string} */
    tagName
  ) {
    let result

    if (typeof tagName === 'string' && tagName[0] === tagName[0].toUpperCase()) {
      result = tagName
        .replace((/^[A-Z]/), str => str.toLowerCase())
        .replace((/[A-Z]/g), str => `-${str.toLowerCase()}`)
    } else {
      result = tagName
    }

    return result
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
        if ((/[A-Z]/).test(attrName)) {
          attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
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
      for (const item of Array.from(dom.children)) {
        html += item.outerHTML
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
      tagName = OOMElement.resolveTagName(tagName)

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

  /**
   * Добавление дочернего элемента с аргументами вызова OOM
   *
   * @param {...any} args Аргументы конструктора класса OOMElement
   * @returns {OOMElement} Замыкание на самого себя для использования чейнинга
   */
  oom(...args) {
    this.append(new OOMElement(...args))

    return this
  }

  /**
   * Клонирование OOM элемента
   *
   * @returns {Proxy<OOMElement>} Новый экземпляр обертки и OOM элемента
   */
  clone() {
    const dom = document.importNode(this.dom, true)
    const element = new this.constructor(dom)
    const proxy = new Proxy(element, OOMElement.proxyHandler)

    return proxy
  }

}

/** @type {import('@notml/core').OOMElement.proxyHandler} */
OOMElement.proxyHandler = {
  apply: OOMElement.proxyApply,
  get: OOMElement.proxyGetter,
  set: () => false
}

export { OOMElement }
