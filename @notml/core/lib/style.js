const { document, customElements, HTMLStyleElement } = window


class OOMStyle extends HTMLStyleElement {

  static updateStyle(style, styleName, source) {
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

  #prefix = ''

  #style = new Map()

  update(media, ...styles) {
    if (typeof media === 'string') {
      this.setAttribute('media', media)
    } else if (typeof media !== 'undefined') {
      styles.unshift(media)
    }
    for (const style of styles) {
      OOMStyle.updateStyle(this.#style, this.#prefix, style)
    }
  }

  /** Обновление содержимого элемента при вставке в DOM */
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
