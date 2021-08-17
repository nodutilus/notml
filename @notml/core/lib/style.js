const { customElements, HTMLStyleElement } = window


class OOMStyle extends HTMLStyleElement {

  static updateStyle(target, source) {
  }

  #style = {}

  update(media, ...styles) {
    if (typeof media === 'string') {
      this.setAttribute('media', media)
    } else {
      styles.unshift(media)
    }
    for (const style of styles) {
      OOMStyle.updateStyle(this.#style, style)
    }
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
