const { document, customElements, HTMLStyleElement } = window


class OOMStyle extends HTMLStyleElement {

  static updateStyle(style, prefix, source) {
    for (const [name, value] of Object.entries(source)) {
      const styleName = prefix ? `${prefix} ${name}` : name

      if (value && typeof value === 'object' && value.constructor === Object) {
        if (!(styleName in style)) {
          style.set(styleName, document.createElement('div'))
        }
        OOMStyle.updateStyle(style, styleName, value)
      } else {
        style.get(prefix).style[name] = value
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
