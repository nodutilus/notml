import { OOMElement } from './factory.js'
import { OOMStyle } from './style.js'

const oomElementRedySymbol = Symbol('oomElementRedySymbol')
const { document, DocumentFragment, HTMLElement, customElements } = window
const oomCustomElementMap = new WeakMap()
const optionsDefaultsGlobals = Object.freeze({})
const extendsTagNameMap = new Map()


/** @type {import('@notml/core').CustomElement.applyOOMTemplate} */
function applyOOMTemplate(instance) {
  const { template } = instance

  if (template instanceof OOMElement) {
    instance.append(template.dom)
  } else if (template instanceof HTMLElement || template instanceof DocumentFragment) {
    instance.append(template)
  } else if (typeof template === 'string') {
    instance.innerHTML += template
  }
}


/** @type {import('@notml/core').CustomElement.resolveOptions } */
function resolveOptions(target, source) {
  let result

  if (source && typeof source === 'object') {
    if (source.constructor === Object || source.constructor === Array) {
      // Только простые объекты и массивы подвергаем копированию и заморозке,
      //  чтобы не сломать логику встроенных и пользовательских классов
      result = Object.assign(source instanceof Array ? [] : {}, target, source)
      for (const key in result) {
        result[key] = resolveOptions(null, result[key])
      }
      result = Object.freeze(result)
    } else {
      result = source
    }
  } else {
    result = typeof source === 'undefined' ? target : source
  }

  return result
}


/** @type {import('@notml/core').CustomElement.extendsCustomElement} */
function extendsCustomElement(CustomElement, optionsDefaults) {
  if (oomCustomElementMap.has(CustomElement) && typeof optionsDefaults === 'undefined') {
    return oomCustomElementMap.get(CustomElement)
  } else {
    /** @type {import('@notml/core').CustomElement} */
    class OOMCustomElement extends CustomElement {

      /** Создание элемента по шаблону при вставке в DOM */
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback()
        }
        if (!this[oomElementRedySymbol]) {
          this[oomElementRedySymbol] = false
          applyOOMTemplate(this)
        }
      }

      /** @type {import('@notml/core').CustomElement.constructor} */
      constructor(
        /** @type {import('@notml/core').CustomElement.Options<any>} */
        options
      ) {
        if (options && Object.isFrozen(options)) {
          super(options)
        } else {
          options = resolveOptions(OOMCustomElement.optionsDefaults, options)
          super(options)
          if (extendsTagNameMap.has(this.constructor)) {
            // Атрибут "is" предназначен для хранения имени тега пользовательского элемента,
            //  но он не заполняется при создании элементов из JS, поэтому проставляем его принудительно
            this.setAttribute('is', extendsTagNameMap.get(this.constructor))
          }
        }
        if (!Reflect.has(this, 'options')) {
          Object.defineProperty(this, 'options', {
            value: options,
            writable: false
          })
        }
      }

    }

    Object.defineProperty(OOMCustomElement, 'optionsDefaults', {
      value: resolveOptions(CustomElement.optionsDefaults, optionsDefaults) || optionsDefaultsGlobals,
      writable: false
    })

    if (typeof optionsDefaults === 'undefined') {
      oomCustomElementMap.set(CustomElement, OOMCustomElement)
    }

    return OOMCustomElement
  }
}


/** @type {import('@notml/core').CustomElement.defineCustomElement} */
function defineCustomElement(...oomCustomElements) {
  for (const CustomElement of oomCustomElements) {
    const tagName = CustomElement.tagName || OOMElement.resolveTagName(CustomElement.name)

    customElements.define(tagName, CustomElement, { extends: CustomElement.extendsTagName })
    if (CustomElement.extendsTagName) {
      extendsTagNameMap.set(CustomElement, tagName)
    }
    if (CustomElement.style instanceof OOMElement && CustomElement.style.dom instanceof OOMStyle) {
      if (CustomElement.extendsTagName) {
        CustomElement.style(`${CustomElement.extendsTagName}[is="${tagName}"]`)
      } else {
        CustomElement.style(tagName)
      }
      CustomElement.style.dom.setAttribute('oom-element', tagName)
      document.head.append(CustomElement.style.dom)
    }
  }

  return oomCustomElements
}


export {
  extendsCustomElement,
  defineCustomElement
}
