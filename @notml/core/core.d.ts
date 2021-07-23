declare module '@notml/core' {

  /** Набор ловушек для создания прокси-объекта для OOMElement с уточненным типом ключей */
  interface OOMProxyHandler<T extends object, U extends object> extends ProxyHandler<T> {
    get?<K extends keyof U & string>(target: T, name: K, receiver: U): U[K]
    set?<K extends keyof U & string>(target: T, name: K, value: U[K], receiver: U): boolean
  }

  /** Расширенный конструктор для создания прокси-объекта для OOMElement */
  interface OOMProxyConstructor extends ProxyConstructor {
    new <T extends object, U extends object>(target: T, handler: OOMProxyHandler<T, U>): U
  }

  namespace OOMElement {

    /** Имя тега DOM элемента для создания элемента */
    type TagName = string

    /**
     * Имя тега DOM элемента для создания элемента, сам DOM элемент,
     * или его функция конструктор, на основе которого будет создан OOM элемент
     */
    type OOMTagName = DocumentFragment | HTMLElement | string

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

    /**
     * Экземпляр DOM элемента, которым управляет OOM элемент
     */
    type DOMElement = DocumentFragment | HTMLElement

    /**
     * Добавление дочернего элемента для OOMElement в конец списка элементов.
     * Вернет замыкание на самого себя для использования чейнинга
     */
    interface append {
      (child: any): OOMElement
    }

  }

  /** Базовый класс для OOM элементов */
  class OOMElement {
    static createProxy: OOMElement.createProxy
    static proxyApply: OOMElement.proxyApply
    static proxyGetter: OOMElement.proxyGetter
    static proxyHandler: OOMElement.proxyHandler
    dom: OOMElement.DOMElement
    append: OOMElement.append
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
    [tagName: string]: OOMElementBuilder | OOMElement.DOMElement | Function
    oom: OOMProxy
    dom: OOMElement.DOMElement
    /** апдейт */
    update: (...args: any) => OOMProxy
  }

  export const oom: OOMProxy

}
