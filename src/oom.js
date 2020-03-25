const isOOMInstance = Symbol('isOOMInstance')
const { document, DocumentFragment, HTMLElement } = window


/** Базовый класс для oom-элементов */
class OOMAbstract {

  /**
   * Проверка на экземпляр OOMAbstract, в т.ч. обернутый в Proxy
   *
   * @param {OOMAbstract|Proxy<OOMAbstract>} instance
   * @returns {boolean}
   */
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMInstance]
  }

  [isOOMInstance] = true

  /**
   * Добавление дочернего элемента
   *
   * @param {DocumentFragment|HTMLElement} child
   * @returns {OOMAbstract}
   */
  append(child) {
    if (child instanceof OOMAbstract) {
      this.dom.append(child.dom)
    } else if (child) {
      this.dom.append(child)
    }

    return this
  }

  /**
   * Клонирование элемента
   *
   * @returns {Proxy<DocumentFragment|HTMLElement>}
   */
  clone() {
    const dom = document.importNode(this.dom, true)
    const element = new this.constructor(dom)
    const proxy = new Proxy(element, elementHandler)

    return proxy
  }

}


/** Фрагмент - набор элементов без общего родителя */
class OOMFragment extends OOMAbstract {

  /**
   * HTML элемента
   *
   * @returns {string}
   */
  get html() {
    let html = ''

    for (const item of this.dom.children) {
      html += item.outerHTML
    }

    return html
  }

  /**
   * @param {DocumentFragment|HTMLElement} child
   */
  constructor(child) {
    super()
    if (child instanceof DocumentFragment) {
      this.dom = child
    } else {
      this.dom = document.createDocumentFragment()
      this.append(child)
    }
  }

}


/** Элемент объектной модели документа */
class OOMElement extends OOMAbstract {

  /**
   * Определение правильного порядка аргументов
   *
   * @param {Object<string, string>} attributes
   * @param {DocumentFragment|HTMLElement} child
   * @returns {[Object<string, string>, DocumentFragment|HTMLElement]}
   */
  static resolveArgs(attributes, child) {
    if (
      typeof attributes === 'string' ||
      attributes instanceof OOMAbstract ||
      attributes instanceof DocumentFragment ||
      attributes instanceof HTMLElement
    ) {
      return [child, attributes]
    } else {
      return [attributes, child]
    }
  }

  /**
   * HTML элемента
   *
   * @returns {string}
   */
  get html() {
    return this.dom.outerHTML
  }

  /**
   * @param {HTMLElement|string} tagName
   * @param {Object<string, string>} attributes
   * @param {DocumentFragment|HTMLElement} child
   */
  constructor(tagName, attributes, child) {
    super()
    if (tagName instanceof HTMLElement) {
      this.dom = tagName
    } else {
      if (tagName[0] === tagName[0].toUpperCase()) {
        tagName = tagName
          .replace((/^[A-Z]/), str => str.toLowerCase())
          .replace((/[A-Z]/g), str => `-${str.toLowerCase()}`)
      }
      this.dom = document.createElement(tagName)
    }
    [attributes, child] = OOMElement.resolveArgs(attributes, child)
    this.setAttributes(attributes)
    this.append(child)
  }

  /**
   * Установка атрибутов элемента
   *
   * @param {Object<string, string>} [attributes]
   * @returns {OOMAbstract}
   */
  setAttributes(attributes = {}) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      if (typeof attrValue === 'function') {
        this.dom[attrName] = attrValue
      } else {
        this.dom.setAttribute(attrName, attrValue)
      }
    }

    return this
  }

}

const elementHandler = {
  get: (target, tagName, proxy) => {
    if (tagName in target) {
      if (typeof target[tagName] === 'function') {
        return (...args) => {
          let result = target[tagName](...args)

          result = result === target ? proxy : result

          return result
        }
      } else {
        return target[tagName]
      }
    } else {
      return (...args) => {
        const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
        const element = new OOMElement(tagName, ...args)

        target.append(element)

        if (callback) callback(new Proxy(element, elementHandler))

        return proxy
      }
    }
  },
  set: () => false
}
const oomOrigin = Object.assign(Object.create(null), {
  append: (...args) => {
    return oom().append(...args)
  }
})
const oomHandler = {
  apply: (_, __, args) => {
    const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    const element = new (typeof args[0] === 'string' ? OOMElement : OOMFragment)(...args)
    const proxy = new Proxy(element, elementHandler)

    if (callback) callback(proxy)

    return proxy
  },
  get: (_, tagName) => {
    return oomOrigin[tagName] || ((...args) => {
      const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
      const element = new OOMElement(tagName, ...args)
      const fragment = new OOMFragment(element)
      const proxy = new Proxy(fragment, elementHandler)

      if (callback) callback(new Proxy(element, elementHandler))

      return proxy
    })
  },
  set: () => false
}
const oom = new Proxy(OOMAbstract, oomHandler)


export { oom }
