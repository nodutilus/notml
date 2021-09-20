import { OOMElement } from './factory.js'
import { OOMStyle } from './style.js'

const oomElementRedySymbol = Symbol('oomElementRedySymbol')
const { document, DocumentFragment, HTMLElement, HTMLHeadElement, customElements, ShadowRoot } = window
const oomCustomElementMap = new WeakMap()
const shadowRootOOMStyleMap = new WeakMap()
const optionsDefaultsGlobals = Object.freeze({})
const extendsTagNameMap = new Map()


/** @type {import('@notml/core').CustomElement.applyOOMTemplate} */
function applyOOMTemplate(instance) {
  const { attachShadow } = instance.constructor
  let { template } = instance
  const rootNode = instance.getRootNode()
  /** @type {import('@notml/core').CustomElement<any> | ShadowRoot} */
  let root = instance

  if (attachShadow) {
    root = instance.attachShadow(typeof attachShadow === 'object' ? attachShadow : { mode: 'open' })
  }

  // Клонирование стилей компонента во внутрь ShadowRoot
  if (rootNode instanceof ShadowRoot) {
    const { style } = instance.constructor

    if (style instanceof OOMElement && style.dom instanceof OOMStyle) {
      let styleSet = shadowRootOOMStyleMap.get(rootNode)

      if (!styleSet) {
        shadowRootOOMStyleMap.set(rootNode, (styleSet = new WeakSet()))
      }
      if (!styleSet.has(instance.constructor)) {
        /** @type {HTMLElement} */
        // @ts-ignore
        let head = rootNode.firstChild

        if (!(head instanceof HTMLHeadElement)) {
          head = document.createElement('head')
          rootNode.prepend(head)
        }

        head.append(style.clone().dom)
        styleSet.add(instance.constructor)
      }
    }
  }

  // Построение верстки компонента произвольным методом
  // Вернет void, если функция выполнила вставку дочерних элементов
  if (typeof instance.template === 'function' && !(template instanceof OOMElement)) {
    // @ts-ignore - проверка на instanceof OOMElement откидывает все Proxy типы
    template = instance.template(root)
  }

  if (template instanceof Promise) {
    instance[OOMElement.async] = template.then(asyncTemplate => {
      if (asyncTemplate instanceof OOMElement) {
        root.append(asyncTemplate.dom)
      } else if (asyncTemplate instanceof HTMLElement || asyncTemplate instanceof DocumentFragment) {
        root.append(asyncTemplate)
      } else if (typeof asyncTemplate === 'string') {
        root.innerHTML += asyncTemplate
      }
    }).catch(error => {
      const err = document.createElement('code')

      err.textContent = String(error.stack || error)
      root.append(err)
    })
  } else {
    if (template instanceof OOMElement) {
      root.append(template.dom)
    } else if (template instanceof HTMLElement || template instanceof DocumentFragment) {
      root.append(template)
    } else if (typeof template === 'string') {
      root.innerHTML += template
    }
  }
}


/** @type {import('@notml/core').CustomElement.resolveOptions } */
function resolveOptions(target, source, prevSources = new WeakSet()) {
  let result

  if (source && typeof source === 'object') {
    // Только простые объекты и массивы подвергаем копированию и заморозке,
    //  чтобы не сломать логику встроенных и пользовательских классов
    if (source.constructor === Object || source.constructor === Array) {
      // Для защиты от бесконечной рекурсии заменяем цикличные ссылки на undefined
      if (prevSources.has(source)) {
        return undefined
      }
      prevSources.add(source)
      result = Object.assign(source instanceof Array ? [] : {}, target, source)
      for (const key in result) {
        result[key] = resolveOptions(null, result[key], prevSources)
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
        if ('className' in this.constructor) {
          this.className = this.constructor.className
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
    const { tagName } = CustomElement

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
