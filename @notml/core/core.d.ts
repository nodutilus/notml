declare module '@notml/core' {

  type OOMAttributeValue = string | Function | CSSStyleDeclaration

  interface OOMAttributes {
    [x: string]: OOMAttributeValue
    /** CSS стили DOM элемента */
    style: CSSStyleDeclaration
  }

  namespace IOOMElement {

    /** Создание внешнего Proxy для работы с OOM элементом */
    interface createProxy {
      (
        /** Аргументы для конструктора OOMElement */
        args: Array<any>
      ): OOMProxy
    }

  }


  /** Базовый класс для OOM элементов */
  class IOOMElement {
    static createProxy: IOOMElement.createProxy
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
   * Обертка для OOMElement
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
