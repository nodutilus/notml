declare module '@notml/core' {

  interface ExtProxyHandler<T extends object, U extends object> {
    apply?(target: T, thisArg: any, argArray: any[]): any
    construct?(target: T, argArray: any[], newTarget: Function): object
    defineProperty?(target: T, p: string | symbol, attributes: PropertyDescriptor): boolean
    deleteProperty?(target: T, p: string | symbol): boolean
    get?<K extends keyof U>(target: T, p: K, receiver: U): U[K]
    getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined
    getPrototypeOf?(target: T): object | null
    has?(target: T, p: string | symbol): boolean
    isExtensible?(target: T): boolean
    ownKeys?(target: T): ArrayLike<string | symbol>
    preventExtensions?(target: T): boolean
    set?<K extends keyof U>(target: T, p: K, value: U[K], receiver: U): boolean
    setPrototypeOf?(target: T, v: object | null): boolean
  }

  interface ExtProxyConstructor {
    revocable<T extends object, U extends object>(target: T, handler: ExtProxyHandler<T, U>): { proxy: U; revoke: () => void }
    revocable<T extends object>(target: T, handler: ExtProxyHandler<T, any>): { proxy: T; revoke: () => void }
    new <T extends object, U extends object>(target: T, handler: ExtProxyHandler<T, U>): U
    new <T extends object>(target: T, handler: ExtProxyHandler<T, any>): T
  }

  namespace OOMElement {

    /** Имя тега DOM элемента для создания элемента */
    type TagName = string

    /**
     * Имя тега DOM элемента для создания элемента, сам DOM элемент,
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

    /**
     * Обертка для OOMElement, и сам элемент в instance.
     * Объявляется как функция для корректной работы Proxy и хука apply.
     */
    type OOMElementWrapper = {
      (): void
      instance: OOMElement
    }

    /** Создание внешнего Proxy для работы с OOM элементом */
    interface createProxy {
      (args: OOMElementArgs): OOMProxy
    }

    /**
     * Обновление атрибутов или добавление вложенных элементов для OOMElement,
     *  через перехват apply внешнего Proxy.
     * Поведение выбирается в зависимости от переданного типа аргументов
     */
    interface proxyApply {
      (wrapper: OOMElementWrapper, _: any, args: ProxyApplyArgs): void
    }

    /**
     * Перехват обращений к свойствам OOM элемента.
     * Методы и свойства объявленные в HTMLElement обеспечивают API взаимодействия с элементом.
     * Остальные обращения, используя цепочки вызовов, создают OOM элементы на одном уровне используя DocumentFragment.
     * Вернет метод или свойство из OOM элемента или фабрику для генерации DocumentFragment
     */
    interface proxyGetter {
      (wrapper: OOMElementWrapper, tagName: TagName, proxy: OOMProxy): any
    }

    /** Набор ловушек для создания OOMProxy */
    interface proxyHandler {
      apply: proxyApply
      get: proxyGetter
      set: () => boolean
    }

  }

  /** Базовый класс для OOM элементов */
  class OOMElement {
    static createProxy: OOMElement.createProxy
    static proxyApply: OOMElement.proxyApply
    static proxyGetter: OOMElement.proxyGetter
    static proxyHandler: OOMElement.proxyHandler
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
   * Proxy для работы с OOM элементом
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
