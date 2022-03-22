declare module '@notml/core' {

  namespace base {
    /** Набор ловушек для создания прокси-объекта для OOMElement с уточненным типом ключей */
    interface OOMProxyHandler<T extends object, U extends object> extends ProxyHandler<T> {
      get?<K extends keyof U & string>(target: T, name: K, receiver: U): U[K]
      set?<K extends keyof U & string>(target: T, name: K, value: U[K], receiver: U): boolean
    }

    /** Расширенный конструктор для создания прокси-объекта для OOMElement */
    interface OOMProxyConstructor extends ProxyConstructor {
      new <T extends object, U extends object>(target: T, handler: OOMProxyHandler<T, U>): U
    }

    /**
     * Модифицированный CSSStyleDeclaration из typescript/lib/lib.dom.d.ts (typescript@4.3.5)
     * с необязательным определением атрибутов для использования в OOMAttributeValue
     */
    interface CSSStyleDeclaration {
      alignContent?: string
      alignItems?: string
      alignSelf?: string
      alignmentBaseline?: string
      all?: string
      animation?: string
      animationDelay?: string
      animationDirection?: string
      animationDuration?: string
      animationFillMode?: string
      animationIterationCount?: string
      animationName?: string
      animationPlayState?: string
      animationTimingFunction?: string
      backfaceVisibility?: string
      background?: string
      backgroundAttachment?: string
      backgroundClip?: string
      backgroundColor?: string
      backgroundImage?: string
      backgroundOrigin?: string
      backgroundPosition?: string
      backgroundPositionX?: string
      backgroundPositionY?: string
      backgroundRepeat?: string
      backgroundSize?: string
      baselineShift?: string
      blockSize?: string
      border?: string
      borderBlockEnd?: string
      borderBlockEndColor?: string
      borderBlockEndStyle?: string
      borderBlockEndWidth?: string
      borderBlockStart?: string
      borderBlockStartColor?: string
      borderBlockStartStyle?: string
      borderBlockStartWidth?: string
      borderBottom?: string
      borderBottomColor?: string
      borderBottomLeftRadius?: string
      borderBottomRightRadius?: string
      borderBottomStyle?: string
      borderBottomWidth?: string
      borderCollapse?: string
      borderColor?: string
      borderImage?: string
      borderImageOutset?: string
      borderImageRepeat?: string
      borderImageSlice?: string
      borderImageSource?: string
      borderImageWidth?: string
      borderInlineEnd?: string
      borderInlineEndColor?: string
      borderInlineEndStyle?: string
      borderInlineEndWidth?: string
      borderInlineStart?: string
      borderInlineStartColor?: string
      borderInlineStartStyle?: string
      borderInlineStartWidth?: string
      borderLeft?: string
      borderLeftColor?: string
      borderLeftStyle?: string
      borderLeftWidth?: string
      borderRadius?: string
      borderRight?: string
      borderRightColor?: string
      borderRightStyle?: string
      borderRightWidth?: string
      borderSpacing?: string
      borderStyle?: string
      borderTop?: string
      borderTopColor?: string
      borderTopLeftRadius?: string
      borderTopRightRadius?: string
      borderTopStyle?: string
      borderTopWidth?: string
      borderWidth?: string
      bottom?: string
      boxShadow?: string
      boxSizing?: string
      breakAfter?: string
      breakBefore?: string
      breakInside?: string
      captionSide?: string
      caretColor?: string
      clear?: string
      clip?: string
      clipPath?: string
      clipRule?: string
      color?: string
      colorInterpolation?: string
      colorInterpolationFilters?: string
      columnCount?: string
      columnFill?: string
      columnGap?: string
      columnRule?: string
      columnRuleColor?: string
      columnRuleStyle?: string
      columnRuleWidth?: string
      columnSpan?: string
      columnWidth?: string
      columns?: string
      content?: string
      counterIncrement?: string
      counterReset?: string
      cssFloat?: string
      cssText?: string
      cursor?: string
      direction?: string
      display?: string
      dominantBaseline?: string
      emptyCells?: string
      fill?: string
      fillOpacity?: string
      fillRule?: string
      filter?: string
      flex?: string
      flexBasis?: string
      flexDirection?: string
      flexFlow?: string
      flexGrow?: string
      flexShrink?: string
      flexWrap?: string
      float?: string
      floodColor?: string
      floodOpacity?: string
      font?: string
      fontFamily?: string
      fontFeatureSettings?: string
      fontKerning?: string
      fontSize?: string
      fontSizeAdjust?: string
      fontStretch?: string
      fontStyle?: string
      fontSynthesis?: string
      fontVariant?: string
      fontVariantCaps?: string
      fontVariantEastAsian?: string
      fontVariantLigatures?: string
      fontVariantNumeric?: string
      fontVariantPosition?: string
      fontWeight?: string
      gap?: string
      glyphOrientationVertical?: string
      grid?: string
      gridArea?: string
      gridAutoColumns?: string
      gridAutoFlow?: string
      gridAutoRows?: string
      gridColumn?: string
      gridColumnEnd?: string
      gridColumnGap?: string
      gridColumnStart?: string
      gridGap?: string
      gridRow?: string
      gridRowEnd?: string
      gridRowGap?: string
      gridRowStart?: string
      gridTemplate?: string
      gridTemplateAreas?: string
      gridTemplateColumns?: string
      gridTemplateRows?: string
      height?: string
      hyphens?: string
      imageOrientation?: string
      imageRendering?: string
      inlineSize?: string
      justifyContent?: string
      justifyItems?: string
      justifySelf?: string
      left?: string
      letterSpacing?: string
      lightingColor?: string
      lineBreak?: string
      lineHeight?: string
      listStyle?: string
      listStyleImage?: string
      listStylePosition?: string
      listStyleType?: string
      margin?: string
      marginBlockEnd?: string
      marginBlockStart?: string
      marginBottom?: string
      marginInlineEnd?: string
      marginInlineStart?: string
      marginLeft?: string
      marginRight?: string
      marginTop?: string
      marker?: string
      markerEnd?: string
      markerMid?: string
      markerStart?: string
      mask?: string
      maskComposite?: string
      maskImage?: string
      maskPosition?: string
      maskRepeat?: string
      maskSize?: string
      maskType?: string
      maxBlockSize?: string
      maxHeight?: string
      maxInlineSize?: string
      maxWidth?: string
      minBlockSize?: string
      minHeight?: string
      minInlineSize?: string
      minWidth?: string
      objectFit?: string
      objectPosition?: string
      opacity?: string
      order?: string
      orphans?: string
      outline?: string
      outlineColor?: string
      outlineOffset?: string
      outlineStyle?: string
      outlineWidth?: string
      overflow?: string
      overflowAnchor?: string
      overflowWrap?: string
      overflowX?: string
      overflowY?: string
      overscrollBehavior?: string
      overscrollBehaviorBlock?: string
      overscrollBehaviorInline?: string
      overscrollBehaviorX?: string
      overscrollBehaviorY?: string
      padding?: string
      paddingBlockEnd?: string
      paddingBlockStart?: string
      paddingBottom?: string
      paddingInlineEnd?: string
      paddingInlineStart?: string
      paddingLeft?: string
      paddingRight?: string
      paddingTop?: string
      pageBreakAfter?: string
      pageBreakBefore?: string
      pageBreakInside?: string
      paintOrder?: string
      perspective?: string
      perspectiveOrigin?: string
      placeContent?: string
      placeItems?: string
      placeSelf?: string
      pointerEvents?: string
      position?: string
      quotes?: string
      resize?: string
      right?: string
      rotate?: string
      rowGap?: string
      rubyAlign?: string
      rubyPosition?: string
      scale?: string
      scrollBehavior?: string
      shapeRendering?: string
      stopColor?: string
      stopOpacity?: string
      stroke?: string
      strokeDasharray?: string
      strokeDashoffset?: string
      strokeLinecap?: string
      strokeLinejoin?: string
      strokeMiterlimit?: string
      strokeOpacity?: string
      strokeWidth?: string
      tabSize?: string
      tableLayout?: string
      textAlign?: string
      textAlignLast?: string
      textAnchor?: string
      textCombineUpright?: string
      textDecoration?: string
      textDecorationColor?: string
      textDecorationLine?: string
      textDecorationStyle?: string
      textEmphasis?: string
      textEmphasisColor?: string
      textEmphasisPosition?: string
      textEmphasisStyle?: string
      textIndent?: string
      textJustify?: string
      textOrientation?: string
      textOverflow?: string
      textRendering?: string
      textShadow?: string
      textTransform?: string
      textUnderlinePosition?: string
      top?: string
      touchAction?: string
      transform?: string
      transformBox?: string
      transformOrigin?: string
      transformStyle?: string
      transition?: string
      transitionDelay?: string
      transitionDuration?: string
      transitionProperty?: string
      transitionTimingFunction?: string
      translate?: string
      unicodeBidi?: string
      userSelect?: string
      verticalAlign?: string
      visibility?: string
      /** @deprecated */
      webkitAlignContent?: string
      /** @deprecated */
      webkitAlignItems?: string
      /** @deprecated */
      webkitAlignSelf?: string
      /** @deprecated */
      webkitAnimation?: string
      /** @deprecated */
      webkitAnimationDelay?: string
      /** @deprecated */
      webkitAnimationDirection?: string
      /** @deprecated */
      webkitAnimationDuration?: string
      /** @deprecated */
      webkitAnimationFillMode?: string
      /** @deprecated */
      webkitAnimationIterationCount?: string
      /** @deprecated */
      webkitAnimationName?: string
      /** @deprecated */
      webkitAnimationPlayState?: string
      /** @deprecated */
      webkitAnimationTimingFunction?: string
      /** @deprecated */
      webkitAppearance?: string
      /** @deprecated */
      webkitBackfaceVisibility?: string
      /** @deprecated */
      webkitBackgroundClip?: string
      /** @deprecated */
      webkitBackgroundOrigin?: string
      /** @deprecated */
      webkitBackgroundSize?: string
      /** @deprecated */
      webkitBorderBottomLeftRadius?: string
      /** @deprecated */
      webkitBorderBottomRightRadius?: string
      /** @deprecated */
      webkitBorderRadius?: string
      /** @deprecated */
      webkitBorderTopLeftRadius?: string
      /** @deprecated */
      webkitBorderTopRightRadius?: string
      /** @deprecated */
      webkitBoxAlign?: string
      /** @deprecated */
      webkitBoxFlex?: string
      /** @deprecated */
      webkitBoxOrdinalGroup?: string
      /** @deprecated */
      webkitBoxOrient?: string
      /** @deprecated */
      webkitBoxPack?: string
      /** @deprecated */
      webkitBoxShadow?: string
      /** @deprecated */
      webkitBoxSizing?: string
      /** @deprecated */
      webkitFilter?: string
      /** @deprecated */
      webkitFlex?: string
      /** @deprecated */
      webkitFlexBasis?: string
      /** @deprecated */
      webkitFlexDirection?: string
      /** @deprecated */
      webkitFlexFlow?: string
      /** @deprecated */
      webkitFlexGrow?: string
      /** @deprecated */
      webkitFlexShrink?: string
      /** @deprecated */
      webkitFlexWrap?: string
      /** @deprecated */
      webkitJustifyContent?: string
      webkitLineClamp?: string
      /** @deprecated */
      webkitMask?: string
      /** @deprecated */
      webkitMaskBoxImage?: string
      /** @deprecated */
      webkitMaskBoxImageOutset?: string
      /** @deprecated */
      webkitMaskBoxImageRepeat?: string
      /** @deprecated */
      webkitMaskBoxImageSlice?: string
      /** @deprecated */
      webkitMaskBoxImageSource?: string
      /** @deprecated */
      webkitMaskBoxImageWidth?: string
      /** @deprecated */
      webkitMaskClip?: string
      /** @deprecated */
      webkitMaskComposite?: string
      /** @deprecated */
      webkitMaskImage?: string
      /** @deprecated */
      webkitMaskOrigin?: string
      /** @deprecated */
      webkitMaskPosition?: string
      /** @deprecated */
      webkitMaskRepeat?: string
      /** @deprecated */
      webkitMaskSize?: string
      /** @deprecated */
      webkitOrder?: string
      /** @deprecated */
      webkitPerspective?: string
      /** @deprecated */
      webkitPerspectiveOrigin?: string
      webkitTapHighlightColor?: string
      /** @deprecated */
      webkitTextFillColor?: string
      /** @deprecated */
      webkitTextSizeAdjust?: string
      /** @deprecated */
      webkitTextStroke?: string
      /** @deprecated */
      webkitTextStrokeColor?: string
      /** @deprecated */
      webkitTextStrokeWidth?: string
      /** @deprecated */
      webkitTransform?: string
      /** @deprecated */
      webkitTransformOrigin?: string
      /** @deprecated */
      webkitTransformStyle?: string
      /** @deprecated */
      webkitTransition?: string
      /** @deprecated */
      webkitTransitionDelay?: string
      /** @deprecated */
      webkitTransitionDuration?: string
      /** @deprecated */
      webkitTransitionProperty?: string
      /** @deprecated */
      webkitTransitionTimingFunction?: string
      /** @deprecated */
      webkitUserSelect?: string
      whiteSpace?: string
      widows?: string
      width?: string
      willChange?: string
      wordBreak?: string
      wordSpacing?: string
      wordWrap?: string
      writingMode?: string
      zIndex?: string
      /** @deprecated */
      zoom?: string
    }

  }

  namespace OOMStyle {

    /**
     * Коллекция CSS селекторов и заданных для них правил,
     *  преобразуемых через атрибут style тега div из объектного представления в текстовый.
     * Для преобразования используется особенность работы класса CSSStyleDeclaration,
     *  см. HTMLElement.style (@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
     */
    type Style = Map<string, HTMLDivElement>

    /**
     * CSS селектор для указания правил
     */
    type StyleName = string

    /**
     * CSS селектор, который будет являться родительским для всех селекторов, описанных в коллекции
     */
    type ScopeName = string

    /**
     * Объект с правилами CSS определяется в формате CSSStyleDeclaration.
     * Может содержать вложенные объекты, преобразуемые в CSS селекторы согласно пути в объекте CSS правил
     */
    interface StyleSource extends base.CSSStyleDeclaration {
      [x: string]: string | StyleSource
    }

    /** Выполняет обновление коллекция CSS селекторов и их правил */
    interface updateStyle {
      (style: Style, styleName: StyleName, source: StyleSource): void
    }

    /**
     * Выполняет обновление коллекция CSS селекторов и их правил.
     * С поддержкой указания имени области действия в качестве необязательного 1го аргумента
     */
    interface update {
      (scopeName?: ScopeName | StyleSource, ...styles: Array<StyleSource>): void
    }

    /**
     * Выполняет обновление содержимого элемента при вставке в DOM.
     * Преобразует CSS селекторы из #style в текстовый вид CSS и записывает в innerHTML
     */
    interface connectedCallback {
      (): any
    }
  }

  /** Пользовательский элемент, наследуемый от style, для использования CSS-in-JS в шаблонах OOM */
  class OOMStyle extends HTMLStyleElement {
    static updateStyle: OOMStyle.updateStyle
    #scopeName: OOMStyle.ScopeName
    #style: OOMStyle.Style
    update: OOMStyle.update
    connectedCallback: OOMStyle.connectedCallback
  }

  namespace OOMElement {

    /** Имя тега DOM элемента для создания элемента */
    type TagName = string

    /**
     * Имя тега DOM элемента для создания элемента, сам DOM элемент,
     *  или его функция конструктор, на основе которого будет создан OOM элемент
     */
    type OOMTagName = DocumentFragment | HTMLElement | string | typeof DocumentFragment | typeof HTMLElement

    /** Имя атрибута DOM элемента */
    type AttributeName = string

    /** Поддерживаемые значения атрибутов для OOMElement */
    type OOMAttributeValue = string | boolean | Function | base.CSSStyleDeclaration

    /** Справочник атрибутов для OOMElement */
    type OOMAttributes = {
      [x: string]: OOMAttributeValue
      /** CSS стили DOM элемента */
      style?: base.CSSStyleDeclaration | string
      /** HTML разметка для вставки в DOM элемент */
      innerHTML?: string
      /** HTML разметка для вставки в DOM элемент */
      ['inner-html']?: string
    }

    /** Экземпляр элемента для вставки */
    type OOMChild = string | Node | DocumentFragment | HTMLElement | OOMElement | OOMFragmentProxy | OOMElementProxy | OOMTemplateProxy | OOMStyleProxy

    /** Функция-шаблон для генерации пользовательского компонента */
    interface TemplateFN {
      (
        /**
         * Для случаев когда компонент имеет теневой DOM,
         *  this будет самим компонентом, а root корнем теневого DOM
         */
        root: CustomElement<any> | ShadowRoot
      ): Promise<OOMElement.OOMChild | void> | OOMElement.OOMChild | void
    }

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
      (wrapper: OOMElementWrapper, _: any, args: ProxyApplyArgs): OOMElementProxy
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
    type DOMElement = DocumentFragment | HTMLElement | CustomElement<any>

    /**
     * HTML код DOM элемента, привязанного к OOMElement
     */
    type HTML = string

    /**
     * Ключ ссылки на Promise ожидающий завершения построения асинхронного компонента
     */
    type async = symbol

    /**
     * Заглушка для возможности вернуть OOMElementProxy из асинхронного метода,
     *  в противном случае Promise не завершается и код перестает исполняться
     * Вернет функция для обработки Promise,
     *  для асинхронных компонентов вернет Promise для ожидания построения шаблона,
     *  для синхронных вернет null
     */
    type then = () => Promise<void>

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
      (child: OOMChild): OOMElement
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
    static setAttribute: OOMElement.setAttribute
    static setAttributes: OOMElement.setAttributes
    static getAttribute: OOMElement.getAttribute
    static async: OOMElement.async
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/44512
    [OOMElement.IsOOMElementSymbol]: OOMElement.isOOMElementSymbol
    /** Ссылка на оригинальный DOM элемент */
    dom: OOMElement.DOMElement
    /** HTML код элемента, аналогично HTMLElement.outerHTML, но работает и для DocumentFragment */
    html: OOMElement.HTML
    /** Заглушка для возможности вернуть OOMElementProxy из асинхронного метода */
    then: OOMElement.then
    constructor(tagName: OOMElement.OOMTagName, ...args: OOMElement.ProxyApplyArgs)
    append: OOMElement.append
    clone: OOMElement.clone
  }

  namespace CustomElement {

    /** Базовый класс элемента OOM, который будет расширяться пользователем */
    interface CustomElementClsBase<T> {

      /** Объект с опциями компонента по умолчанию */
      readonly optionsDefaults: CustomElement.Options<T>

      new(options?: Options<T>): CustomElement<T>

    }

    /** Класс пользовательского элемента, расширенный для работы с компонентами OOM */
    interface CustomElementCls<T> extends CustomElementClsBase<T> {

      /** Имя тега для регистрации пользовательского элемента */
      tagName: string

      /**
       * Встроенное имя класса компонента,
       *  устанавливается в конструкторе и сохраняется при обновлении атрибута class через oom шаблонизатор
       */
      className?: string

      /**
       * Имя тега встроенного DOM элемента который расширяется данным классом
       * @see customElements.define~options.extends {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#syntax}
       */
      extendsTagName?: string

      /**
       * Коллекция CSS правил, описывающих стиль пользовательского компонента через oom.style.
       * При регистрации компонента через oom.define добавляться в документ в секцию <head>,
       *  автоматически добавляя для стилей имя области действия соответствующее имени тега элемента.
       */
      style?: OOMStyleProxy

    }

    /** Опции пользовательского компонента */
    type Options<T> = {
      readonly [K in keyof T]?: T[K]
    }

    /**
     * Объединяет опции по умолчанию с опциями пользователя,
     *  возвращая копию защищенную от изменения (только для базовых объектов и массивов).
     * Экземпляры пользовательских и сложных встроенных классов передаются по ссылке.
     */
    interface resolveOptions {
      (
        /** Исходный справочник опций по умолчанию */
        target: object,
        /** Пользовательский справочник опций */
        source: object,
        /**
         * Список обработанных объектов пользовательского справочника,
         *  используемый для выявления рекурсий.
         */
        prevSources?: WeakSet<any>
      ): object
    }

    /**
     * Создает экземпляр CustomElement
     */
    interface constructor {
      /** Имя тега для регистрации пользовательского элемента */
      tagName: string
      /**
       * Встроенное имя класса компонента,
       *  устанавливается в конструкторе и сохраняется при обновлении атрибута class через oom шаблонизатор
       */
      className?: string
      /** Включает создание теневого DOM внутри компонента */
      attachShadow?: boolean | ShadowRootInit
      /**
       * Коллекция CSS правил, описывающих стиль пользовательского компонента через oom.style.
       */
      style?: OOMStyleProxy
      (options: Options<any>): CustomElement<any>
    }

    /**
     * Применение OOM шаблона пользовательского элемента
     */
    interface applyOOMTemplate {
      (instance: CustomElement<any>): void
    }

    /**
     * Расширение пользовательского элемента возможностями OOM шаблонизатора.
     * Возвращает новый класс наследуемый от указанного базового или пользовательского класса элемента,
     * от которого можно наследовать класс нового элемента с поддержкой OOM
     */
    interface extendsCustomElement<T> {
      (CustomElement: CustomElementCls<T>, optionsDefaults?: CustomElement.Options<T>): CustomElementCls<T>
    }

    /**
     * Регистрирует переданный набор классов пользовательских элементов в customElements.define.
     * В качестве тега используется имя класса или `static tagName`
     */
    interface defineCustomElement {
      (...oomCustomElements: Array<CustomElementCls<any>>): Array<CustomElementCls<any>>
    }

  }

  /** Экземпляр пользовательского DOM элемента, расширенный для работы с компонентами OOM */
  class CustomElement<T> extends HTMLElement {

    /** Имя тега для регистрации пользовательского элемента */
    static tagName: string

    /**
     * Встроенное имя класса компонента,
     *  устанавливается в конструкторе и сохраняется при обновлении атрибута class через oom шаблонизатор
     */
    static className?: string

    /**
     * Имя тега встроенного DOM элемента который расширяется данным классом
     * @see customElements.define~options.extends {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#syntax}
     */
    static extendsTagName?: string

    /** Включает создание теневого DOM внутри компонента */
    static attachShadow?: boolean | ShadowRootInit

    /**
     * Коллекция CSS правил, описывающих стиль пользовательского компонента через oom.style.
     * При регистрации компонента через oom.define добавляться в документ в секцию <head>,
     *  автоматически добавляя для стилей имя области действия соответствующее имени тега элемента.
     */
    static style?: OOMStyleProxy

    /** Объект с опциями компонента по умолчанию */
    static readonly optionsDefaults: CustomElement.Options<any>

    /** Объект с опциями пользовательского компонента */
    readonly options: CustomElement.Options<T>

    /**
    * Создает экземпляр CustomElement
    */
    get constructor(): CustomElement.constructor

    /**
     * Содержимое пользовательского элемента, которое будет добавлено в его состав
     *  в момент вставки пользовательского компонента в состав документа
     */
    template?: Promise<OOMElement.OOMChild | void> | OOMElement.OOMChild | OOMElement.TemplateFN | void

    /**
     * Ссылка на асинхронное состояние готовности компонента.
     * void для синхронных компонентов, Promise, если template является асинхронной функцией
     */
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/44512
    [OOMElement.async]: Promise<void> | void

    /** Хук ЖЦ элемента срабатывающий при вставке элемента в DOM */
    connectedCallback(): void

  }

  namespace OOMProxy {

    /**
     * Создает новый OOM элемент согласно имени запрошенного атрибута,
     * затем добавляет его в конец списка дочерних элементов
     *
     * @example
     * oom.div({ class: 'header' }, ...childs)
     *
     * >>
     *   <div class="header">
     *     ...childs
     *   </div>
     */
    interface createElementProxy {
      (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMElementProxy
    }
    /**
     * Создает OOM элемент, добавляя его в верстку после текущего,
     *  и возвращает новый фрагмент документа содержащий оба элемента
     *
     * @example
     * const span = oom.span({ class: 'title' }, 'Link: ')
     * const fragment = span.a({ href: 'https://test.ok' }, 'test.ok')
     *
     * document.body.append(span.dom)
     *
     * >>
     *   <span class="title">Link: </span>
     *   <a href="https://test.ok">test.ok</a>
     */
    interface createElementToFragmentProxy {
      (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMFragmentProxy
    }
    /**
     * Создает и добавляет к фрагменту документа еще один OOM элемент
     *
     * @example
     * const fragment = oom().span({ class: 'title' }, 'Link: ')
     *
     * fragment.a({ href: 'https://test.ok' }, 'test.ok')
     *
     * document.body.append(component.dom)
     *
     * >>
     *   <span class="title">Link: </span>
     *   <a href="https://test.ok">test.ok</a>
     */
    interface createFragmentProxy {
      (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMFragmentProxy
    }

    /** Создает новый OOM элемент и оборачивает его в Proxy */
    interface apply {
      (_: any, __: any, args: OOMElement.OOMElementArgs): OOMElementProxy
    }

    interface CommonOrigin {

      /**
       * Создает экземпляр пользовательского элемента OOMStyle генерирующий таблицу селекторов и их правил.
       * OOMStyle является расширением тега style,
       *  преобразующий объектное представление CSS в текстовый, и заполняет содержимое style.
       * Для преобразования используется особенность работы класса CSSStyleDeclaration,
       *  см. HTMLElement.style (@see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
       *
       * @example
       * const style = oom.style({
       *   'fontSize': '10px',
       *   '.my-class': { background: 'red', fontSize: '12px' }
       * })
       *
       * document.head.append(style.dom)
       *
       * >>
       *   <style is="oom-style">
       *     *{ font-size: 10px; }
       *     .my-class{ background: red; font-size: 12px; }
       *   </style>
       */
      style: (
        scopeName?: OOMStyle.ScopeName | OOMStyle.StyleSource,
        ...styles: Array<OOMStyle.StyleSource>
      ) => OOMStyleProxy

      /**
       * Создает элемент шаблона контента - template
       * @see https://developer.mozilla.org/ru/docs/Web/HTML/Element/template
       *
       * @example
       * const tmpl = oom.template(oom.div())
       * // Клонируем содержимое шаблона через DOM API
       * const elm1 = oom.main(tmpl.dom.content.cloneNode(true))
       * // Клонируем сам шаблон через OOM API
       * const elm2 = oom.section(tmpl.clone())
       *
       * >>
       * elm1.dom.outerHTML === '<main><div></div></main>'
       * elm2.dom.outerHTML === '<section><template><div></div></template></section>'
       * tmpl.dom.outerHTML === '<template><div></div></template>'
       */
      template: (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>) => OOMTemplateProxy

      /** HTML код элемента, аналогично HTMLElement.outerHTML, но работает и для DocumentFragment */
      html: OOMElement.HTML

    }

    /** Внутренний объект OOMProxy описывающий его базовые методы */
    interface origin extends CommonOrigin {
      /**
       * Расширение пользовательского элемента возможностями OOM шаблонизатора.
       * Возвращает новый класс наследуемый от указанного базового или пользовательского класса элемента,
       * от которого можно наследовать класс нового элемента с поддержкой OOM
       *
       * @example
       * const optionsDefaults = { caption: '' }
       *
       * class MyButton extends oom.extends(HTMLButtonElement, optionsDefaults) {
       *   static tagName = 'my-butt'
       *   static extendsTagName = 'button'
       *   static style = oom.style({
       *     'button[is="my-butt"]': { fontSize: '12px' },
       *     'button[is="my-butt"].active': { color: 'yellow' },
       *     '.my-butt__caption': { color: 'red' }
       *   })
       *   template = oom.span({ class: 'my-butt__caption' }, this.options.caption)
       * }
       *
       * oom.define(MyButton)
       *
       * document.body.append(new MyButton({ caption: 'Жми тут' }))
       *
       * >>
       *   <html>
       *     <head>
       *       <style is="oom-style" oom-element="my-butt">
       *         button[is="my-butt"]{ font-size: 12px; }
       *         button[is="my-butt"].active{ color: yellow; }
       *         button[is="my-butt"] .my-butt__caption{ color: red; }
       *       </style>
       *     </head>
       *     <body>
       *       <button is="my-butt">
       *         <span class="my-butt__caption">Жми тут</span>
       *       </button>
       *     </body>
       *   </html>
       */
      extends<T, U>(
        CustomElement: CustomElement.CustomElementClsBase<T>,
        optionsDefaults?: CustomElement.Options<U>
      ): CustomElement.CustomElementClsBase<T & U>
      extends<T>(
        CustomElement: typeof HTMLElement,
        optionsDefaults?: CustomElement.Options<T>
      ): CustomElement.CustomElementClsBase<T>

      /**
       * Регистрирует переданный набор классов пользовательских элементов в customElements.define.
       * В качестве тега используется имя класса или `static tagName`
       */
      define: CustomElement.defineCustomElement
    }

    interface OOMElementOrigin extends CommonOrigin {
      /**
       * Добавление дочернего элемента к верстке в конец списка элементов.
       * Вернет замыкание на собственный OOMElementProxy для использования чейнинга
       *
       * @example
       * const mySpan = oom.span('My element new text')
       * const div = oom('div').append(mySpan)
       */
      append(child: OOMElement.OOMChild): OOMElementProxy
      /**
       * Клонирует элемент и возвращает новый экземпляр OOM, содержащий копию DOM элемента
       *
       * @example
       * const mySpan1 = oom.span('My element new text')
       * const mySpan2 = mySpan1.clone()
       */
      clone(): OOMElementProxy
      dom: CustomElement<any>
    }

    interface OOMFragmentOrigin extends CommonOrigin {
      /**
       * Добавление дочернего элемента к верстке в конец списка элементов.
       * Вернет замыкание на собственный OOMFragmentProxy для использования чейнинга
       *
       * @example
       * const mySpan = oom.span('My element').span('new text')
       * const div = oom('div').append(mySpan)
       */
      append(child: OOMElement.OOMChild): OOMFragmentProxy
      /**
       * Клонирует фрагмент и возвращает новый экземпляр OOM фрагмента, содержащий копию DOM элементов
       *
       * @example
       * const mySpan1 = oom.span('My element').span('new text')
       * const mySpan2 = mySpan1.clone()
       */
      clone(): OOMFragmentProxy
      dom: DocumentFragment
    }

    interface OOMStyleOrigin extends CommonOrigin {
      clone(): OOMStyleProxy
      dom: OOMStyle
    }

  }

  /** Proxy для работы с OOM элементом */
  interface OOMElementProxy extends OOMProxy.OOMElementOrigin {
    /**
     * Выполняет обновление атрибутов текущего элемента,
     *  а также добавление дочерних элемента к верстке в конец списка элементов.
     *
     * @example
     * const div = oom.div()
     *
     * div({ class: 'MyClass' },
     *   oom.span('My text'),
     *   oom.span('ok'))
     *
     * >>
     *   <div class="MyClass">
     *     <span>My text</span>
     *     <span>ok</span>
     *   </div>
     */
    (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMElementProxy
    // @ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createElementToFragmentProxy
  }

  /** Proxy для работы с элементом template */
  // @ts-ignore переопределение dom из OOMElementOrigin
  interface OOMTemplateProxy extends OOMElementProxy {
    // @ts-ignore проверка типа индекса в OOMElementProxy
    dom: HTMLTemplateElement
  }

  interface OOMFragmentProxy extends OOMProxy.OOMFragmentOrigin {
    /**
     * Выполняет добавление дочерних элемента к верстке в конец фрагмента документа.
     *
     * @example
     *   const fragment = oom()
     *
     *   fragment(oom.span('My text'), oom.span('ok'))
     *
     * >>
     *   <span>My text</span>
     *   <span>ok</span>
     */
    (...args: Array<OOMElement.OOMChild>): OOMFragmentProxy
    // @ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createFragmentProxy
  }

  /** Proxy для работы с OOMStyle элементом */
  interface OOMStyleProxy extends OOMProxy.OOMStyleOrigin {
    /**
     * Выполняет обновление селекторов и их правил в элементе OOMStyle,
     *  С поддержкой указания имени области действия в качестве необязательного 1го аргумента.
     *
     * **!ВАЖНО:** Обновление возможно только до вставки элемента в документ,
     *  т.к. после вставки объектная модель CSS будет очищена
     *
     * @example
     * const style = oom.style({ fontSize: '10px' })
     *
     * style({ '.my-class': { background: 'red', fontSize: '12px' } })
     *
     * document.body.append(style.dom)
     *
     * >>
     *   <style is="oom-style">
     *     *{ font-size: 10px; }
     *     .my-class{ background: red; font-size: 12px; }
     *   </style>
     */
    (
      scopeName?: OOMStyle.ScopeName | OOMStyle.StyleSource,
      ...styles: Array<OOMStyle.StyleSource>
    ): OOMStyleProxy
    // @ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createElementToFragmentProxy
  }

  /** Фабрика Proxy для создания OOM элементов и сопутствующее API */
  interface OOMProxy extends OOMProxy.origin {
    /**
     * Вернет новый экземпляр Proxy элемента для создания верстки
     *
     * @example
     * const component = oom('div', { class: 'link' }, oom
     *   .span({ class: 'title' }, 'Link: ')
     *   .a({ href: 'https://test.ok' }, 'test.ok'))
     *
     * document.body.append(component.dom)
     *
     * >>
     *   <div class="link">
     *     <span class="title">Link: </span>
     *     <a href="https://test.ok">test.ok</a>
     *   </div>
     */
    (
      tagName: HTMLElement | string | typeof HTMLElement,
      ...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>
    ): OOMElementProxy
    /**
     * Вернет новый экземпляр Proxy элемента для создания верстки
     *
     * @example
     * const component = oom()
     *   .span({ class: 'title' }, 'Link: ')
     *   .a({ href: 'https://test.ok' }, 'test.ok')
     *
     * document.body.append(component.dom)
     *
     * >>
     *   <span class="title">Link: </span>
     *   <a href="https://test.ok">test.ok</a>
     */
    (
      ...args: Array<OOMElement.OOMChild>
    ): OOMFragmentProxy
    (
      tagName: DocumentFragment | typeof DocumentFragment,
      ...args: Array<OOMElement.OOMChild>
    ): OOMFragmentProxy
    // @ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createElementProxy
  }

  /** Фабрика Proxy для создания OOM элементов и сопутствующее API */
  export const oom: OOMProxy

}
