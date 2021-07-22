declare module '@notml/core' {

  interface XProxyHandler<T extends object, U extends object> {
    apply?(target: T, thisArg: any, argArray: any[]): any;
    construct?(target: T, argArray: any[], newTarget: Function): object;
    defineProperty?(target: T, p: string | symbol, attributes: PropertyDescriptor): boolean;
    deleteProperty?(target: T, p: string | symbol): boolean;
    get?<K extends keyof U>(target: T, p: K, receiver: U): U[K];
    getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;
    getPrototypeOf?(target: T): object | null;
    has?(target: T, p: string | symbol): boolean;
    isExtensible?(target: T): boolean;
    ownKeys?(target: T): ArrayLike<string | symbol>;
    preventExtensions?(target: T): boolean;
    set?<K extends keyof U>(target: T, p: K, value: U[K], receiver: U): boolean;
    setPrototypeOf?(target: T, v: object | null): boolean;
  }

  interface ExtProxyConstructor {
    revocable<T extends object, U extends object>(target: T, handler: XProxyHandler<T, U>): { proxy: U; revoke: () => void; };
    new <T extends object, U extends object>(target: T, handler: XProxyHandler<T, U>): U;
  }

  namespace OOMElement {

    /**
     * Имя тега DOM элемента для создания, сам DOM элемент,
     * или его функция конструктор, на основе которого будет создан OOM элемент
     */
    type OOMTagName = HTMLElement | DocumentFragment | string

    /** Поддерживаемые значения атрибутов для OOMElement */
    type OOMAttributeValue = string | Function | CSSStyleDeclaration

    /** Справочник атрибутов для OOMElement */
    type OOMAttributes = {
      [x: string]: OOMAttributeValue
      /** CSS стили DOM элемента */
      style: CSSStyleDeclaration
    }

    /** Экземпляр элемента для вставки */
    type OOMChild = DocumentFragment | HTMLElement | OOMElement | OOMProxy

    /**
     * Аргументы вызова OOMProxy элемента - объекты с атрибутами элемента, или вложенные элементы.
     * Типы аргументов можно комбинировать в 1-ом вызове
     */
    type ProxyApplyArgs = Array<OOMAttributes | OOMChild>

    /** Аргументы для конструктора OOMElement */
    type OOMElementArgs = [OOMTagName, ...ProxyApplyArgs]

    /** Создание внешнего Proxy для работы с OOM элементом */
    interface createProxy {
      (args: OOMElementArgs): OOMProxy
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

interface OOMElement_proxyHandler {

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
