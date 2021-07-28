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
    type OOMTagName = DocumentFragment | HTMLElement | string | typeof DocumentFragment | typeof HTMLElement

    /** Имя атрибута DOM элемента */
    type AttributeName = string

    /** Поддерживаемые значения атрибутов для OOMElement */
    type OOMAttributeValue = string | Function | CSSStyleDeclaration

    /** Справочник атрибутов для OOMElement */
    type OOMAttributes = {
      [x: string]: OOMAttributeValue
      /** CSS стили DOM элемента */
      style?: CSSStyleDeclaration
    }

    /** Экземпляр элемента для вставки */
    type OOMChild = string | DocumentFragment | HTMLElement | OOMElement | OOMElementProxy

    /**
     * Аргументы вызова OOMElementProxy элемента - объекты с атрибутами элемента, или вложенные элементы.
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
    } | { instance: OOMElement }

    /** Создание внешнего Proxy для работы с OOM элементом */
    interface createProxy {
      (args: OOMElementArgs): OOMElementProxy
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
      (wrapper: OOMElementWrapper, tagName: TagName, proxy: OOMElementProxy): any
    }

    /** Набор ловушек для создания OOMElementProxy */
    interface proxyHandler {
      apply: proxyApply
      get: proxyGetter
      set: () => boolean
    }

    /** Проверка на соответствие экземпляру OOMElement, в т.ч. обернутый в Proxy */
    interface hasInstance {
      (
        /** Экземпляр класса для проверки на соответствие OOMElement */
        instance: OOMElementProxy
      ): boolean
    }

    /**
     * Преобразование имени класса пользовательского элемента в имя html-тега.
     * Заглавные буквы класса заменяются на нижний регистр, с разделением частей имени через "-"
     */
    interface resolveTagName {
      (tagName: string): TagName
    }

    /**
     * Установка атрибута элемента.
     * Позволяет задавать методы, стили в виде объекта, и строковые атрибуты DOM элемента.
     */
    interface setAttribute {
      (instance: HTMLElement, attrName: AttributeName, attrValue: OOMAttributeValue): void
    }

    /**
     * Установка атрибутов элемента.
     * Работает аналогично setAttribute, но обновляет сразу несколько атрибутов
     */
    interface setAttributes {
      (instance: HTMLElement, attributes: OOMAttributes): void
    }

    /**
     * Получение атрибута элемента.
     * Возвращает значение аналогичное логике установки атрибутов в setAttribute
     */
    interface getAttribute {
      (instance: HTMLElement, attrName: AttributeName): OOMAttributeValue
    }

    type IsOOMElementSymbol = symbol

    /**
     * Свойство экземпляра для проверки на соответствие классу OOMElement,
     *  позволяющее выполнить instanceof для Proxy-объекта через метод класса Symbol.hasInstance
     */
    type isOOMElementSymbol = boolean

    /**
     * Экземпляр DOM элемента, которым управляет OOM элемент
     */
    type DOMElement = DocumentFragment | HTMLElement

    /**
     * HTML код DOM элемента, привязанного к OOMElement
     */
    type HTML = string

    /**
     * Создает экземпляр OOMElement по переданному тегу DOM или классу пользовательского элемента,
     * либо оборачивает в OOMElement существующий DOM элемент
     */
    interface constructor {
      (tagName: OOMElement.OOMTagName, ...args: OOMElement.ProxyApplyArgs): OOMElement
    }

    /**
     * Добавление дочернего элемента для OOMElement в конец списка элементов.
     * Вернет замыкание на самого себя для использования чейнинга
     */
    interface append {
      (child: any): OOMElement
    }

    /**
     * Клонирует DOM элемент и возвращает новый экземпляр OOM, содержащий копию DOM элемента
     */
    interface clone {
      (): OOMElementProxy
    }

  }

  /** Базовый класс для OOM элементов */
  class OOMElement {
    static createProxy: OOMElement.createProxy
    static proxyApply: OOMElement.proxyApply
    static proxyGetter: OOMElement.proxyGetter
    static proxyHandler: OOMElement.proxyHandler
    static [Symbol.hasInstance]: OOMElement.hasInstance
    static resolveTagName: OOMElement.resolveTagName
    static setAttribute: OOMElement.setAttribute
    static setAttributes: OOMElement.setAttributes
    static getAttribute: OOMElement.getAttribute
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/44512
    [OOMElement.IsOOMElementSymbol]: OOMElement.isOOMElementSymbol
    dom: OOMElement.DOMElement
    html: OOMElement.HTML
    constructor(tagName: OOMElement.OOMTagName, ...args: OOMElement.ProxyApplyArgs)
    append: OOMElement.append
    clone: OOMElement.clone
  }


  namespace OOMProxy {

    interface createElementProxy {
      (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMElementProxy
    }

    interface apply {
      (_: any, __: any, args: OOMElement.OOMElementArgs): OOMElementProxy
    }

  }

  interface OOMElementProxy extends OOMElement {
    (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): void
    [tagName: string]: OOMProxy.createElementProxy | any
  }

  /**
   * Proxy для работы с OOM элементом
   */
  interface OOMProxy {
    (tagName?: OOMElement.OOMTagName, ...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMElementProxy
    [tagName: string]: OOMProxy.createElementProxy
  }

  export const oom: OOMProxy

}
