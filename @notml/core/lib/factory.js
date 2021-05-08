import { customTagNames, customElementTagName, customClasses, customOptions } from './shared-const.js'

const { document, customElements, DocumentFragment, HTMLElement } = window
const isOOMElementSymbol = Symbol('isOOMElement')


/** @typedef {DocumentFragment|HTMLElement|OOMElement|Proxy<OOMElement>} OOMChild */
/** @typedef {Object<string,*>} OOMAttributes */


/** Базовый класс для OOM элементов */
class OOMElement {

  /** Создание внешнего Proxy для работы с OOM элементом
   *
   * @param {*} args Аргументы для конструктора OOMElement
   * @returns {Proxy<OOMElement>} Обертка для OOMElement
   */
  static createProxy(args) {
    const wrapper = /* c8 ignore next */ () => { }

    wrapper.instance = new OOMElement(...args)

    return new Proxy(wrapper, OOMElement.proxyHandler)
  }

  /** Обновление атрибутов или добавление вложенных элементов для OOMElement,
   *    через перехват apply внешнего Proxy.
   *  Поведение выбирается в зависимости от переданного типа аргументов
   *
   * @param {{instance:OOMElement}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {*} _ thisArg (контекст this)
   * @param {Array<OOMAttributes|OOMChild>} args Аргументы вызова - объекты с атрибутами элемента,
   *  или вложенные элементы. Типы аргументов можно комбинировать в 1-ом вызове
   */
  static proxyApply({ instance }, _, args) {
    for (const arg of args) {
      const isChild =
        arg instanceof OOMElement ||
        arg instanceof HTMLElement ||
        arg instanceof DocumentFragment ||
        typeof arg !== 'object' || !arg ||
        arg.constructor !== Object

      if (isChild) {
        instance.append(arg)
      } else {
        OOMElement.setAttributes(instance.dom, arg)
      }
    }
  }

  /** Перехват обращений к свойствам OOM элемента.
   *  Методы и свойства объявленные в HTMLElement обеспечивают API взаимодействия с элементом.
   *  Остальные обращения, используя цепочки вызовов,
   *    создают OOM элементы на одном уровне используя DocumentFragment
   *
   * @param {{instance:OOMElement}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {HTMLElement|string} tagName Имя тега DOM элемента для создания или сам DOM элемент,
   *  на основе которого будет создан OOM элемент
   * @param {Proxy<OOMElement>} proxy Внешний Proxy для работы с OOM элементом
   * @returns {*} Метод или свойство из OOM элемента или фабрика для генерации DocumentFragment
   */
  static proxyGetter({ instance }, tagName, proxy) {
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

  /**
   * Проверка на экземпляр OOMElement, в т.ч. обернутый в Proxy
   *
   * @param {OOMElement|Proxy<OOMElement>} instance
   * @returns {boolean}
   */
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMElementSymbol]
  }

  /**
   * Преобразование имени класса пользовательского элемента в имя тега
   *
   * @param {string} tagName
   * @returns {string}
   */
  static resolveTagName(tagName) {
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
   * Установка атрибута элемента.
   * Позволяет задавать методы, объекты в виде JSON, стили в виде объекта, и строковые атрибуты.
   *
   * @param {HTMLElement} instance
   * @param {string} attrName
   * @param {*} attrValue
   */
  static setAttribute(instance, attrName, attrValue) {
    const attrType = typeof attrValue

    if (attrName === 'options' && customClasses.has(instance.constructor)) {
      customOptions.set(instance, attrValue)
    } else if (attrName === 'style' && attrType === 'object') {
      for (const name in attrValue) {
        instance.style[name] = attrValue[name]
      }
    } else {
      if (attrType === 'function') {
        instance[attrName] = attrValue
      } else {
        if ((/[A-Z]/).test(attrName)) {
          attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
        }
        if (attrType === 'object') {
          instance.setAttribute(attrName, `json::${JSON.stringify(attrValue)}`)
        } else {
          instance.setAttribute(attrName, attrValue)
        }
      }
    }
  }

  /**
   * Получение атрибута элемента.
   * Работает аналогично установке атрибутов в setAttribute
   *
   * @param {HTMLElement} instance
   * @param {string} attrName
   * @returns {*}
   */
  static getAttribute(instance, attrName) {
    let attrValue

    if (attrName === 'options' && customClasses.has(instance.constructor)) {
      attrValue = customOptions.get(instance, attrValue)
    } else {
      const ownValue = instance[attrName]

      if (typeof ownValue === 'function') {
        attrValue = ownValue
      } else {
        if ((/[A-Z]/).test(attrName)) {
          attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
        }
        attrValue = instance.getAttribute(attrName)
        if (attrValue && attrValue.startsWith('json::')) {
          attrValue = JSON.parse(attrValue.replace('json::', ''))
        }
      }
    }

    return attrValue
  }

  /**
   * Установка атрибутов элемента.
   *
   * @param {HTMLElement} instance
   * @param {string|OOMAttributes} attributes
   * @param {*} attrValue
   */
  static setAttributes(instance, attributes = {}, attrValue) {
    if (typeof attributes === 'string') {
      OOMElement.setAttribute(instance, attributes, attrValue)
    } else {
      for (const [attrName, attrValue] of Object.entries(attributes)) {
        OOMElement.setAttribute(instance, attrName, attrValue)
      }
    }
  }

  /** @type {boolean} */
  [isOOMElementSymbol] = true

  /** @type {DocumentFragment|HTMLElement} */
  dom

  /**
   * HTML элемента
   *
   * @returns {string}
   */
  get html() {
    const { dom } = this
    let html = ''

    if (dom instanceof DocumentFragment) {
      for (const item of dom.children) {
        html += item.outerHTML
      }
    } else {
      html = dom.outerHTML
    }

    return html
  }

  /**
   * @param {HTMLElement|string} tagName Имя тега DOM элемента для создания или сам DOM элемент,
   *  на основе которого будет создан OOM элемент
   * @param {Array<OOMAttributes|OOMChild>} [args] Аргументы вызова - объекты с атрибутами элемента,
   *  или вложенные элементы. Типы аргументов можно комбинировать в 1-ом вызове
   */
  constructor(tagName, ...args) {
    if (tagName instanceof HTMLElement || tagName instanceof DocumentFragment) {
      this.dom = tagName
    } else {
      if (customElementTagName.has(tagName)) {
        tagName = customElementTagName.get(tagName)
        customElements.get(tagName).options = attributes ? attributes.options : undefined
      } else {
        tagName = OOMElement.resolveTagName(tagName)
        if (customTagNames.has(tagName)) {
          customElements.get(tagName).options = attributes ? attributes.options : undefined
        }
      }
      this.dom = typeof tagName === 'undefined'
        ? document.createDocumentFragment()
        : document.createElement(tagName)
    }
    OOMElement.proxyApply({ instance: this }, null, args)
  }

  /**
   * Установка атрибутов элемента
   *
   * @param {OOMAttributes} [attributes]
   * @returns {OOMElement}
   */
  setAttributes(attributes) {
    OOMElement.setAttributes(this.dom, attributes)

    return this
  }

  /**
   * Добавление дочернего элемента
   *
   * @param {OOMChild} child
   * @returns {OOMElement}
   */
  append(child) {
    if (child instanceof OOMElement) {
      this.dom.append(child.dom)
    } else if (typeof child !== 'undefined') {
      this.dom.append(child)
    }

    return this
  }

  /**
   * Добавление дочернего элемента по параметрам OOM
   *
   * @param {...any} args
   * @returns {OOMElement}
   */
  oom(...args) {
    this.append(new OOMElement(...args))

    return this
  }

  /**
   * Клонирование элемента
   *
   * @returns {Proxy<OOMElement>}
   */
  clone() {
    const dom = document.importNode(this.dom, true)
    const element = new this.constructor(dom)
    const proxy = new Proxy(element, OOMElement.proxyHandler)

    return proxy
  }

}

OOMElement.proxyHandler = {
  apply: OOMElement.proxyApply,
  get: OOMElement.proxyGetter,
  set: () => false
}

export { OOMElement }
