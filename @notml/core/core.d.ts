declare module '@notml/core' {

  /**
   * Имя тега DOM элемента для создания, сам DOM элемент,
   * или его функция конструктор, на основе которого будет создан OOM элемент
   */
  type OOMTagName = HTMLElement | DocumentFragment | string

  type OOMAttributeValue = string | Function | CSSStyleDeclaration

  type OOMChild = DocumentFragment | HTMLElement | OOMElement | OOMProxy

  interface OOMAttributes {
    [x: string]: OOMAttributeValue
    /** CSS стили DOM элемента */
    style: CSSStyleDeclaration
  }

  namespace OOMElement {

    /** Создание внешнего Proxy для работы с OOM элементом */
    interface createProxy {
      (
        /** Аргументы для конструктора OOMElement */
        args: [OOMTagName, ...any]
      ): OOMProxy
    }

  }


  /** Базовый класс для OOM элементов */
  class OOMElement {
    static createProxy: OOMElement.createProxy
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

  namespace OOMProxy {

    interface apply {
      (_: any, __: any, args: [OOMTagName, ...any]): OOMProxy
    }

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
