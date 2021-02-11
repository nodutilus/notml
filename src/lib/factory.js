import { customTagNames, customElementTagName, customClasses, customOptions } from './shared-const.js'

const { document, customElements, DocumentFragment, HTMLElement } = window
const isOOMAbstractSymbol = Symbol('isOOMAbstract')


/** @typedef {DocumentFragment|HTMLElement|OOMAbstract|Proxy<OOMAbstract>} OOMChild */
/** @typedef {Object<string,*>} OOMAttributes */


/** Базовый класс для oom-элементов */
class OOMAbstract {

  /** Создание внешнего Proxy для работы с oom-элементом
   *
   * @param {*} args Аргументы для конструктора OOMElement
   * @returns {Proxy<OOMElement>} Обертка для OOMElement
   */
  static createProxy(args) {
    const wrapper = /* c8 ignore next */ () => { }

    wrapper.instance = new OOMElement(...args)

    return new Proxy(wrapper, OOMAbstract.proxyHandler)
  }

  /** Обновление атрибутов или вложенных элементов для OOMElement,
   *    через перехват apply внешнего Proxy.
   *  Поведение выбирается в зависимости от переданного типа аргументов
   *
   * @param {{instance:OOMAbstract}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {*} _ thisArg (контекст this)
   * @param {Array<OOMAttributes|OOMChild>} args Аргументы вызова - объекты с атрибутами элемента,
   *  или вложенные элементы. Типы аргументов можно комбинировать в 1-ом вызове
   */
  static proxyApply({ instance }, _, args) {
    for (const arg of args) {
      const isChild =
        arg instanceof OOMAbstract ||
        arg instanceof HTMLElement ||
        arg instanceof DocumentFragment ||
        typeof arg !== 'object' || !arg ||
        arg.constructor !== Object

      if (isChild) {
        instance.append(arg)
      } else {
        instance.setAttribute(arg)
      }
    }
  }

  /**
   * @param {{instance:OOMAbstract}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {string} tagName
   * @param {Proxy<OOMAbstract>} proxy
   * @returns {*}
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
        instance.append(new OOMElement(tagName, ...args))

        return proxy
      }
    }
  }

  /**
   * Проверка на экземпляр OOMAbstract, в т.ч. обернутый в Proxy
   *
   * @param {OOMAbstract|Proxy<OOMAbstract>} instance
   * @returns {boolean}
   */
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMAbstractSymbol]
  }

  /** @type {boolean} */
  [isOOMAbstractSymbol] = true

  /** @type {DocumentFragment|HTMLElement} */
  dom

  /**
   * Добавление дочернего элемента
   *
   * @param {OOMChild} child
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
    this.append(new OOMElement(...args))

    return this
  }

  /**
   * Клонирование элемента
   *
   * @returns {Proxy<OOMAbstract>}
   */
  clone() {
    const dom = document.importNode(this.dom, true)
    const element = new this.constructor(dom)
    const proxy = new Proxy(element, OOMAbstract.proxyHandler)

    return proxy
  }

}

OOMAbstract.proxyHandler = {
  apply: OOMAbstract.proxyApply,
  get: OOMAbstract.proxyGetter,
  set: () => false
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
   * @param {OOMChild} child
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

  /**
   * Определение правильного порядка аргументов
   *
   * @param {OOMAttributes} attributes
   * @param {OOMChild} child
   * @returns {[OOMAttributes, OOMChild]}
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
   * @param {OOMAttributes} attributes
   * @param {OOMChild} child
   */
  constructor(tagName, attributes, child) {
    [attributes, child] = OOMElement.resolveArgs(attributes, child)
    super()
    if (tagName instanceof HTMLElement) {
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
      this.dom = tagName ? document.createElement(tagName) : document.createElement()
    }
    this.setAttributes(attributes)
    this.append(child)
  }

  /**
   * Установка атрибутов элемента
   *
   * @param {OOMAttributes} [attributes]
   * @returns {OOMAbstract}
   */
  setAttributes(attributes) {
    OOMElement.setAttributes(this.dom, attributes)

    return this
  }

}


export {
  OOMAbstract,
  OOMFragment,
  OOMElement
}
