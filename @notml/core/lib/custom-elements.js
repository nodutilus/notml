import { OOMElement } from './factory.js'

const oomElementRedySymbol = Symbol('oomElementRedySymbol')
const { DocumentFragment, HTMLElement, customElements } = window
const oomCustomElementMap = new WeakMap()

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

function __mergeSimpleObjects(target, source) {
  let result = target

  switch (typeof source) {
    case 'object': {
      const sType = Object.prototype.toString.call(source)

      switch (sType) {
        case '[object Object]':
          for (const key in source) {
            target[key] = __mergeSimpleObjects(target[key] || {}, source[key])
          }
          break
        default:
          result = source
          break
      }
      break
    }
    case 'undefined':
      break
    default:
      result = source
      break
  }

  return result
}

/** @type {import('@notml/core').CustomElement.deepFreeze } */
function __deepFreeze(object) {
  for (const name of Object.getOwnPropertyNames(object)) {
    const value = object[name]

    if (value && typeof value === 'object') {
      __deepFreeze(value)
    }
  }

  return Object.freeze(object)
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
        options = {}
      ) {
        super()
        options = __mergeSimpleObjects(__mergeSimpleObjects({}, optionsDefaults || {}), options)

        Object.defineProperty(this, 'options', {
          value: __deepFreeze(options),
          writable: false
        })
      }

    }

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
  }

  return oomCustomElements
}


export {
  extendsCustomElement,
  defineCustomElement
}
