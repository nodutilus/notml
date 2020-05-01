import { customTagNames, customOptions } from './shared-const.js'

const { document, DocumentFragment, HTMLElement } = window
const isOOMAbstractSymbol = Symbol('isOOMAbstract')


/** @typedef {DocumentFragment|HTMLElement|OOMAbstract|Proxy<OOMAbstract>} OOMChild */
/** @typedef {Object<string,*>} OOMAttributes */


/** Базовый класс для oom-элементов */
class OOMAbstract {

  /**
   * @param {OOMAbstract} instance
   * @param {string} tagName
   * @param {Proxy<OOMAbstract>} proxy
   * @returns {*}
   */
  static proxyGetter(instance, tagName, proxy) {
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
        instance.append(OOMAbstract.create(OOMElement, tagName, ...args))

        return proxy
      }
    }
  }

  static proxyHandler = { get: this.proxyGetter, set: () => false }

  /**
   * @param {typeof OOMAbstract} constructor
   * @param  {...any} args
   * @returns {OOMAbstract}
   */
  static create(constructor, ...args) {
    const lastArg = args[args.length - 1]
    const isCallback = typeof lastArg === 'function' && !(customTagNames.has(lastArg))
    const callback = isCallback ? args.pop() : null
    const element = new constructor(...args)

    if (callback) {
      callback(element.dom)
    }

    return element
  }

  /**
   * @param {HTMLElement|string} tagName
   * @param  {...any} args
   * @returns {OOMAbstract}
   */
  static factory(tagName, ...args) {
    const isTagName = typeof tagName === 'string' || customTagNames.has(tagName)
    const element = OOMAbstract.create(isTagName ? OOMElement : OOMFragment, tagName, ...args)

    return element
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
    const child = OOMAbstract.factory(...args)

    this.append(child)

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
   * @returns {*}
   */
  static setAttribute(instance, attrName, attrValue) {
    // TODO: если имя style - генератор object->css

    if (attrName === 'options') {
      instance[attrName] = attrValue
      customOptions.set(instance, attrValue)
    } else {
      const attrType = typeof attrValue

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

    return attrValue
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

    if (attrName === 'options') {
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
        if (attrValue.startsWith('json::')) {
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
    super()
    if (tagName instanceof HTMLElement) {
      this.dom = tagName
    } else {
      if (customTagNames.has(tagName)) {
        tagName = customTagNames.get(tagName)
      } else {
        tagName = OOMElement.resolveTagName(tagName)
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
