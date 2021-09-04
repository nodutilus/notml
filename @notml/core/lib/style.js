const { document, customElements, HTMLStyleElement } = window


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

  /** @type {import('@notml/core').OOMStyle.ScopeName} */
  #scopeName = ''

  /** @type {import('@notml/core').OOMStyle.Style} */
  #style = new Map()

  /** @type {import('@notml/core').OOMStyle.update} */
  update(
    /** @type {import('@notml/core').OOMStyle.ScopeName | import('@notml/core').OOMStyle.StyleSource} */
    scopeName,
    /** @type {Array<import('@notml/core').OOMStyle.StyleSource>} */
    ...styles
  ) {
    if (typeof scopeName === 'string') {
      this.#scopeName = scopeName
    } else if (typeof scopeName !== 'undefined') {
      styles.unshift(scopeName)
    }
    for (const style of styles) {
      OOMStyle.updateStyle(this.#style, '', style)
    }
  }

  /** @type {import('@notml/core').OOMStyle.connectedCallback} */
  connectedCallback() {
    if (this.#style.size) {
      let textStyle = ''

      for (const [name, style] of this.#style) {
        const selector = (this.#scopeName && name.startsWith(this.#scopeName) && name) ||
          (this.#scopeName && name && `${this.#scopeName} ${name}`) ||
          this.#scopeName || name || '*'

        textStyle += `${selector}{ ${style.getAttribute('style') || ''} }`
      }

      this.innerHTML = textStyle
      this.#style.clear()
    }
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
