import { OOMElement } from './factory.js'

const { HTMLElement, customElements } = window


/**
 * Регистрация пользовательского элемента с элементами OOM шаблонизатора
 *
 * @param {typeof HTMLElement} constructor Конструктор пользовательского элемента
 */
export function defineCustomElement(constructor) {
  const tagName = constructor.tagName || OOMElement.resolveTagName(constructor.name)

  customElements.define(tagName, constructor, { extends: constructor.extendsTagName })
}
