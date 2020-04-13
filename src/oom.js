const customElementsCache = new WeakMap()
const observedAttributesSymbol = Symbol('observedAttributesSymbol')
const isOOMInstanceSymbol = Symbol('isOOMInstanceSymbol')
const { document, DocumentFragment, HTMLElement, customElements } = window


/** Базовый класс для oom-элементов */
class OOMAbstract {

  /**
   * Проверка на экземпляр OOMAbstract, в т.ч. обернутый в Proxy
   *
   * @param {OOMAbstract|Proxy<OOMAbstract>} instance
   * @returns {boolean}
   */
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMInstanceSymbol]
  }

  [isOOMInstanceSymbol] = true

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
   * Добавление дочернего элемента по параметрам OOM
   *
   * @param {...any} args
   * @returns {OOMAbstract}
   */
  oom(...args) {
    const child = oom(...args)

    this.append(child)

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
      if (customElementsCache.has(tagName)) {
        tagName = customElementsCache.get(tagName)
      } else {
        tagName = resolveTagName(tagName)
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


/**
 * Преобразование имени класса в имя тега
 *
 * @param {string} tagName
 * @returns {string}
 */
function resolveTagName(tagName) {
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


/**
 * @param {typeof HTMLElement} proto
 * @param {Map} setters
 * @returns {Map}
 */
function getObservedAttributes(proto, setters) {
  const properties = Object.getOwnPropertyNames(proto)
  const nestedProto = Reflect.getPrototypeOf(proto)

  if (Object.isPrototypeOf.call(HTMLElement, nestedProto.constructor)) {
    getObservedAttributes(nestedProto, setters)
  }

  for (const name of properties) {
    const { value } = Reflect.getOwnPropertyDescriptor(proto, name)
    const isFunction = typeof value === 'function'
    const isChanged = name.endsWith('Changed')
    const isValidName = (/^[a-z][a-zA-Z]+$/).test(name)

    if (isFunction && isChanged && isValidName) {
      const attributeName = name
        .replace(/Changed$/, '')
        .replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)

      setters.set(attributeName, name)
    }
  }

  return setters
}


/**
 * Применение OOM шаблонизации
 *
 * @param {HTMLElement} instance
 */
function applyOOMTemplate(instance) {
  let { template } = instance

  // TODO: Асинхронные шаблоны

  if (template instanceof OOMAbstract) {
    template = template.clone()
  } else if (typeof template !== 'string') {
    let staticTemplate = instance.constructor.template

    if (staticTemplate instanceof OOMAbstract) {
      staticTemplate = staticTemplate.clone()
    } else if (typeof staticTemplate === 'function') {
      staticTemplate = instance.constructor.template(instance)
    }
    if (typeof template === 'function') {
      template = instance.template(staticTemplate) || staticTemplate
    } else {
      template = staticTemplate
    }
  }

  if (template instanceof OOMAbstract) {
    instance.innerHTML = ''
    instance.append(template.dom)
  } else if (typeof template === 'string') {
    instance.innerHTML = template
  }
}


/**
 * @typedef CustomElementsOptions
 * @property {string} extends Имя встроенного элемента для расширения
 */
/**
 * Регистрация пользовательского элемента с элементами OOM шаблонизатора
 *
 * @param {string} [name]
 * @param {typeof HTMLElement} constructor
 * @param {CustomElementsOptions} options
 * @returns {Proxy<OOMAbstract>}
 */
function defineOOMCustomElements(name, constructor, options) {
  if (Object.isPrototypeOf.call(HTMLElement, name)) {
    [constructor, options] = [name, constructor]
    name = resolveTagName(constructor.name)
  }

  const observedAttributes = getObservedAttributes(constructor.prototype, new Map())

  if (observedAttributes.size > 0) {
    constructor[observedAttributesSymbol] = [...observedAttributes.keys()]
  }

  constructor.prototype.connectedCallback = (connectedCallback =>
    function __connectedCallback() {
      applyOOMTemplate(this)
      if (connectedCallback) connectedCallback.apply(this)
    }
  )(constructor.prototype.connectedCallback)

  customElements.define(name, constructor, options)
  customElementsCache.set(constructor, name)

  return oom
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
  },
  define: defineOOMCustomElements,
  oom: (...args) => {
    return oom(...args)
  }
})
const oomHandler = {
  apply: (_, __, args) => {
    const isTagName = typeof args[0] === 'string' || customElementsCache.has(args[0])
    const callback = args.length > 1 && typeof args[args.length - 1] === 'function' ? args.pop() : null
    const element = new (isTagName ? OOMElement : OOMFragment)(...args)
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
