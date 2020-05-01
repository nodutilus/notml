import { customTagNames, customOptions } from './shared-const.js'
import { OOMAbstract, OOMElement } from './factory.js'

const { HTMLElement, customElements } = window
const observedAttributesSymbol = Symbol('observedAttributes')
const attributeChangedCacheSymbol = Symbol('attributeChangedCache')
const attributesHandler = { get: OOMElement.getAttribute, set: OOMElement.setAttribute }


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
    const isValidName = (/^[a-z][\w]+$/).test(name)

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
 * Вызов обработчиков изменения атрибутов,
 *  и кэширование изменений до вставки элемента в DOM
 *
 * @param {HTMLElement} instance
 * @param {string} name
 * @param {string} oldValue
 * @param {string} newValue
 */
function applyAttributeChangedCallback(instance, name, oldValue, newValue) {
  const observed = instance.constructor[observedAttributesSymbol]

  if (observed.has(name)) {
    if (newValue && newValue.startsWith('json::')) {
      newValue = JSON.parse(newValue.replace('json::', ''))
    }
    if (instance.isConnected) {
      instance[observed.get(name)](oldValue, newValue)
    } else {
      if (!(attributeChangedCacheSymbol in instance)) {
        instance[attributeChangedCacheSymbol] = new Set()
      }
      instance[attributeChangedCacheSymbol].add({
        name: observed.get(name),
        args: [oldValue, newValue]
      })
    }
  }
}


/**
 * Применение OOM шаблонизации
 *
 * @param {HTMLElement} instance
 */
function applyOOMTemplate(instance) {
  const attributeChanged = instance[attributeChangedCacheSymbol]
  let staticTemplate = instance.constructor.template
  let { template } = instance
  let templateOptions =
    (typeof staticTemplate === 'function' && staticTemplate.length > 0) ||
    (typeof template === 'function' && template.length > 0) ||
    null

  // TODO: Асинхронные шаблоны
  // TODO: Метод на экземпляре applyTemplate

  if (templateOptions) {
    templateOptions = Object.assign({}, customOptions.get(instance), {
      element: instance,
      attributes: new Proxy(instance, attributesHandler)
    })
  }

  if (template instanceof OOMAbstract) {
    template = template.clone()
  } else if (typeof template !== 'string') {
    if (staticTemplate instanceof OOMAbstract) {
      staticTemplate = staticTemplate.clone()
    } else if (typeof staticTemplate === 'function') {
      staticTemplate = instance.constructor.template(templateOptions)
    }
    if (typeof template === 'function') {
      if (templateOptions) {
        templateOptions.template = staticTemplate
      }
      template = instance.template(templateOptions) || staticTemplate
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

  if (attributeChanged instanceof Set) {
    for (const changed of attributeChanged) {
      instance[changed.name](...changed.args)
      attributeChanged.delete(changed)
    }
    delete instance[attributeChangedCacheSymbol]
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
 */
export function defineCustomElement(name, constructor, options) {
  if (Object.isPrototypeOf.call(HTMLElement, name)) {
    [constructor, options] = [name, constructor]
    name = OOMElement.resolveTagName(constructor.name)
  }

  const observedAttributes = getObservedAttributes(constructor.prototype, new Map())

  if (observedAttributes.size > 0) {
    constructor[observedAttributesSymbol] = observedAttributes
    Object.defineProperty(constructor, 'observedAttributes', {
      value: [...observedAttributes.keys(), ...(constructor.observedAttributes || [])]
    })
    constructor.prototype.attributeChangedCallback = (attributeChangedCallback =>
      function __attributeChangedCallback(name, oldValue, newValue) {
        applyAttributeChangedCallback(this, name, oldValue, newValue)
        if (attributeChangedCallback) attributeChangedCallback.call(this, name, oldValue, newValue)
      }
    )(constructor.prototype.attributeChangedCallback)
  }

  constructor.prototype.connectedCallback = (connectedCallback =>
    function __connectedCallback() {
      applyOOMTemplate(this)
      if (connectedCallback) connectedCallback.apply(this)
    }
  )(constructor.prototype.connectedCallback)

  customElements.define(name, constructor, options)
  customTagNames.set(constructor, name)
}
