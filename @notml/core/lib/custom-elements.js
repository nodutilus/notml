import { OOMElement } from './factory.js'

const oomElementRedySymbol = Symbol('oomElementRedySymbol')
const { DocumentFragment, HTMLElement, customElements } = window


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
 * @param {typeof HTMLElement} CustomElement Класс пользовательского элемента
 * @returns {typeof CustomElement} Расширенный класс пользовательского элемента
 */
export function extendsCustomElement(CustomElement) {
  const tagName = CustomElement.tagName || OOMElement.resolveTagName(CustomElement.name)
  const OOMCustomElement = {
    [CustomElement.name]: class extends CustomElement {

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
  }[CustomElement.name]

  customElements.define(tagName, OOMCustomElement, { extends: CustomElement.extendsTagName })

  return OOMCustomElement
}
