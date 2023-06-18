const { document, customElements, HTMLStyleElement } = window
/** @type {WeakMap<OOMStyle, {scopeName: import('@notml/core').OOMStyle.ScopeName, style:import('@notml/core').OOMStyle.Style}>} */
const privateOOMStyleMap = new WeakMap()

/** @type {import('@notml/core').OOMStyle} */
class OOMStyle extends HTMLStyleElement {

  /** @type {import('@notml/core').OOMStyle.updateStyle} */
  static updateStyle(
    /** @type {import('@notml/core').OOMStyle.Style} */
    style,
    /** @type {import('@notml/core').OOMStyle.StyleName} */
    styleName,
    /** @type {import('@notml/core').OOMStyle.StyleSource} */
    source
  ) {
    let styleCollection = style.get(styleName)

    for (const [propName, propValue] of Object.entries(source)) {
      if (propValue && typeof propValue === 'object' && propValue.constructor === Object) {
        // Рекурсивно разворачиваем вложенное описание стилей в плоский список
        OOMStyle.updateStyle(style, styleName ? `${styleName} ${propName}` : propName, propValue)
      } else {
        if (!styleCollection) {
          styleCollection = document.createElement('div')
          style.set(styleName, styleCollection)
        }
        if (propName in styleCollection.style) {
          styleCollection.style[propName] = propValue
        } else {
          // @ts-ignore Игнорируем типы, метод приводит любые значения к строке
          styleCollection.style.setProperty(propName, propValue)
        }
      }
    }
  }

  /** Добавляем инициализацию приватных данных класса */
  constructor() {
    const privateSlots = {
      scopeName: '',
      style: new Map()
    }

    super()
    privateOOMStyleMap.set(this, privateSlots)
  }

  /** @type {import('@notml/core').OOMStyle.update} */
  update(
    /** @type {import('@notml/core').OOMStyle.ScopeName | import('@notml/core').OOMStyle.StyleSource} */
    scopeName,
    /** @type {Array<import('@notml/core').OOMStyle.StyleSource>} */
    ...styles
  ) {
    const privateSlots = privateOOMStyleMap.get(this)

    if (typeof scopeName === 'string') {
      privateSlots.scopeName = scopeName
    } else if (typeof scopeName !== 'undefined') {
      styles.unshift(scopeName)
    }
    for (const style of styles) {
      OOMStyle.updateStyle(privateSlots.style, '', style)
    }
  }

  /** @type {import('@notml/core').OOMStyle.connectedCallback} */
  connectedCallback() {
    const privateSlots = privateOOMStyleMap.get(this)

    if (privateSlots.style.size) {
      let textStyle = ''

      for (const [name, style] of privateSlots.style) {
        const selector = (privateSlots.scopeName && name.startsWith(privateSlots.scopeName) && name) ||
          (privateSlots.scopeName && name && `${privateSlots.scopeName} ${name}`) ||
          privateSlots.scopeName || name || '*'

        textStyle += `${selector}{ ${style.getAttribute('style') || ''} }`
      }

      this.innerHTML = textStyle
      privateSlots.style.clear()
    }
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
