const { document, customElements, DocumentFragment, HTMLElement } = window
const isOOMElementSymbol = Symbol('isOOMElement')
/** @type {import('@notml/core').ExtProxyConstructor} */
// @ts-ignore
const XProxy = Proxy

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

    return new XProxy(wrapper, OOMElement.proxyHandler)
  }

  /**
   * Обновление атрибутов или добавление вложенных элементов для OOMElement,
   *  через перехват apply внешнего Proxy.
   * Поведение выбирается в зависимости от переданного типа аргументов
   *
   * @param {{instance:OOMElement}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {*} _ thisArg (контекст this)
   * @param {import('@notml/core').OOMElement.ProxyApplyArgs} args Аргументы вызова - объекты с атрибутами элемента,
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

  /**
   * Перехват обращений к свойствам OOM элемента.
   * Методы и свойства объявленные в HTMLElement обеспечивают API взаимодействия с элементом.
   * Остальные обращения, используя цепочки вызовов,
   *  создают OOM элементы на одном уровне используя DocumentFragment
   *
   * @param {{instance:OOMElement}} wrapper Обертка для OOMElement, и сам элемент в instance
   * @param {string} tagName Имя тега DOM элемента для создания,
   *  на основе которого будет создан OOM элемент
   * @param {import('@notml/core').OOMProxy} proxy Внешний Proxy для работы с OOM элементом
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
   * @param {OOMElement|import('@notml/core').OOMProxy} instance Экземпляр класса для проверки на соответствие OOMElement
   * @returns {boolean} Признак соответствия OOMElement
   */
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMElementSymbol]
  }

  /**
   * Преобразование имени класса пользовательского элемента в имя html-тега.
   * Заглавные буквы класса заменяются на нижний регистр, с разделением частей имени через "-"
   *
   * @param {string} tagName Исходное имя для html-тега
   * @returns {string} Нормализованное имя html-тега
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
   * @param {HTMLElement} instance Элемент DOM
   * @param {string} attrName Имя атрибута DOM элемента
   * @param {OOMAttributeValue} attrValue Значения атрибута
   */
  static setAttribute(instance, attrName, attrValue) {
    const attrType = typeof attrValue

    if (attrName === 'style' && attrType === 'object') {
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
   * @param {HTMLElement} instance Элемент DOM
   * @param {string} attrName Имя атрибута DOM элемента
   * @returns {OOMAttributeValue} Значения атрибута
   */
  static getAttribute(instance, attrName) {
    let attrValue

    if (typeof instance[attrName] === 'function') {
      attrValue = instance[attrName]
    } else {
      if ((/[A-Z]/).test(attrName)) {
        attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
      }
      attrValue = instance.getAttribute(attrName)
      if (attrValue && attrValue.startsWith('json::')) {
        attrValue = JSON.parse(attrValue.replace('json::', ''))
      }
    }

    return attrValue
  }

  /**
   * Установка атрибутов элемента.
   * Работает аналогично setAttribute, но обновляет сразу несколько атрибутов
   *
   * @param {HTMLElement} instance Элемент DOM
   * @param {OOMAttributes} attributes Объект с обновляемыми атрибутами
   */
  static setAttributes(instance, attributes = {}) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      OOMElement.setAttribute(instance, attrName, attrValue)
    }
  }

  /**
   * Свойство экземпляра для проверки на соответствие классу OOMElement,
   *  позволяющее выполнить instanceof для Proxy-объекта через метод класса Symbol.hasInstance
   *
   * @type {boolean}
   */
  [isOOMElementSymbol] = true

  /**
   * Экземпляр DOM элемента, которым управляет OOM элемент
   *
   * @type {DocumentFragment|HTMLElement}
   */
  dom

  /**
   * @returns {string} HTML код элемента
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
   * @param {HTMLElement|DocumentFragment|string} tagName Имя тега DOM элемента для создания,
   *  сам DOM элемент, или его функция конструктор, на основе которого будет создан OOM элемент
   * @param {Array<OOMAttributes|OOMChild>} [args] Аргументы вызова - объекты с атрибутами элемента,
   *  или вложенные элементы. Типы аргументов можно комбинировать в 1-ом вызове
   */
  constructor(tagName, ...args) {
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
      this.dom = document.createElement(tagName)
    }
    OOMElement.proxyApply({ instance: this }, null, args)
  }

  /**
   * Добавление дочернего элемента для OOMElement в конец списка элементов
   *
   * @param {OOMChild} child Экземпляр элемента для вставки
   * @returns {OOMElement} Замыкание на самого себя для использования чейнинга
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

/** @type {import('@notml/core').OOMElement_proxyHandler} */
OOMElement.proxyHandler = {
  apply: OOMElement.proxyApply,
  get: OOMElement.proxyGetter,
  set: () => false
}

export { OOMElement }
