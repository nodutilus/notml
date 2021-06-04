declare module '@notml/core' {

  declare type OOMAttributeValue = string | Function

  declare interface OOMAttributes extends CSSStyleDeclaration {
    [x: string]: OOMAttributeValue
    /** Тестовый атрибут */
    test: CSSStyleDeclaration
  }

  /** Базовый класс для OOM элементов */
  declare class OOMElement {
    /** Создание внешнего Proxy для работы с OOM элементом */
    declare static createProxy(): ProxyConstructor<OOMElement>
  }

  declare interface OOMElementProxy {
    (    /** Атрибуты */
      ...attributes?: OOMAttributes,
      /** Дочерние элементы */
      ...childs?: HTMLElement): OOMElementProxy
    [tagName: string]: OOMElementBuilder
  }

  /** Генератор OOM элементов */
  declare interface OOMElementBuilder {
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
  declare interface OOMProxy {
    (tagName: string): OOMElementProxy
    [tagName: string]: OOMElementBuilder
    oom: OOMProxy,
    /** апдейт */
    update: (...args: any) => OOMProxy
  }

  declare export const oom: OOMProxy

}
