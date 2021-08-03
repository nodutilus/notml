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


/**
 * Регистрация пользовательского элемента с элементами OOM шаблонизатора
 *
 * @param {import('@notml/core').CustomElement} CustomElement Класс пользовательского элемента
 * @returns {import('@notml/core').CustomElement} Расширенный класс пользовательского элемента
 */
function extendsCustomElement(CustomElement) {
  if (oomCustomElementMap.has(CustomElement)) {
    return oomCustomElementMap.get(CustomElement)
  } else {
    /** @type {import('@notml/core').CustomElement} */
    class OOMCustomElement extends CustomElement {

      /** Создание элемента по шаблону при вставке в DOM */
      connectedCallback() {
        if (!this[oomElementRedySymbol]) {
          this[oomElementRedySymbol] = false
          applyOOMTemplate(this)
        }
        if (super.connectedCallback) {
          super.connectedCallback()
        }
      }

    }

    oomCustomElementMap.set(CustomElement, OOMCustomElement)

    return OOMCustomElement
  }
}


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
