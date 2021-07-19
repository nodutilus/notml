declare module '@notml/core' {

  type OOMAttributeValue = string | Function | CSSStyleDeclaration

  interface OOMAttributes {
    [x: string]: OOMAttributeValue
    /** Тестовый атрибут */
    style: CSSStyleDeclaration
  }

  /** Базовый класс для OOM элементов */
  class OOMElement {
    /** Создание внешнего Proxy для работы с OOM элементом */
    static createProxy(): ProxyConstructor<OOMElement>
    static y : number
    x : string

  }

  interface OOMElementProxy {
    (    /** Атрибуты */
      ...attributes?: OOMAttributes,
      /** Дочерние элементы */
      ...childs?: HTMLElement): OOMElementProxy
    [tagName: string]: OOMElementBuilder
  }

  /** Генератор OOM элементов */
  interface OOMElementBuilder {
    (
      /** Атрибуты */
      ...attributes?: OOMAttributes,
      /** Дочерние элементы */
      ...childs?: HTMLElement
    ): OOMElementProxy
  }

  /**
   * это OOMProxy
   */
  interface OOMProxy {
    (tagName: string): OOMElementProxy
    [tagName: string]: OOMElementBuilder
    oom: OOMProxy,
    /** апдейт */
    update: (...args: any) => OOMProxy
  }

  export const oom: OOMProxy

}
