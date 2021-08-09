const { customElements, HTMLStyleElement } = window


class OOMStyle extends HTMLStyleElement {

  update(media, ...styles) {
    if (typeof media === 'string') {
      this.setAttribute('media', media)
    } else {
      styles.unshift(media)
    }
  }

}


customElements.define('oom-style', OOMStyle, { extends: 'style' })


export { OOMStyle }
