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
    for (const [propName, propValue] of Object.entries(source)) {
      if (propValue && typeof propValue === 'object' && propValue.constructor === Object) {
        // Рекурсивно разворачиваем вложенное описание стилей в плоский список
        OOMStyle.updateStyle(style, styleName ? `${styleName} ${propName}` : propName, propValue)
      } else {
        if (!style.has(styleName)) {
          style.set(styleName, document.createElement('div'))
        }
        style.get(styleName).style[propName] = propValue
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
    let textStyle = ''

    for (const [name, style] of this.#style) {
      const selector = (this.#scopeName && name && `${this.#scopeName} ${name}`) ||
        this.#scopeName || name || '*'

      textStyle += `${selector}{ ${style.getAttribute('style')} }`
    }

    this.innerHTML = textStyle
    this.#style.clear()
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
