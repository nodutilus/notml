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

  /** @type {import('@notml/core').OOMStyle.StyleName} */
  #prefix = ''

  /** @type {import('@notml/core').OOMStyle.Style} */
  #style = new Map()

  /** @type {import('@notml/core').OOMStyle.update} */
  update(
    /** @type {import('@notml/core').OOMStyle.Media} */
    media,
    /** @type {Array<import('@notml/core').OOMStyle.StyleSource>} */
    ...styles
  ) {
    if (typeof media === 'string') {
      this.setAttribute('media', media)
    } else if (typeof media !== 'undefined') {
      styles.unshift(media)
    }
    for (const style of styles) {
      OOMStyle.updateStyle(this.#style, this.#prefix, style)
    }
  }

  /** @type {import('@notml/core').OOMStyle.connectedCallback} */
  connectedCallback() {
    let textStyle = ''

    for (const [name, style] of this.#style) {
      textStyle += `${name}{ ${style.getAttribute('style')} }`
    }

    this.innerHTML = textStyle
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
