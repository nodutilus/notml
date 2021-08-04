declare module '@notml/core' {

  /** Расширение базовых сущностей и типов для удобства использования в проверке типов */
  namespace basic {

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
    type OOMAttributeValue = string | Function | basic.CSSStyleDeclaration

    /** Справочник атрибутов для OOMElement */
    type OOMAttributes = {
      [x: string]: OOMAttributeValue
      /** CSS стили DOM элемента */
      style?: basic.CSSStyleDeclaration
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

  namespace CustomElement {

    type CustomElementCls = typeof CustomElement
    /** Класс пользовательского элемента, расширенный для работы с компонентами OOM */

    /**
     * Применение OOM шаблона пользовательского элемента
     */
    interface applyOOMTemplate {
      (instance: CustomElement): void
    }

    /**
     * Расширение пользовательского элемента возможностями OOM шаблонизатора.
     * Возвращает новый класс наследуемый от указанного базового или пользовательского класса элемента,
     * от которого можно наследовать класс нового элемента с поддержкой OOM
     */
    interface extendsCustomElement {
      (CustomElement: CustomElementCls): CustomElementCls
    }

    /**
     * Регистрирует переданный массив классов пользовательских элементов в customElements.define.
     * В качестве тега используется имя класса или `static tagName`
     */
    interface defineCustomElement {
      (...oomCustomElements: Array<CustomElementCls>): Array<CustomElementCls>
    }

  }

  /** Экземпляр пользовательского DOM элемента, расширенный для работы с компонентами OOM */
  class CustomElement extends HTMLElement {

    /** Имя класса пользовательского элемента */
    static name?: string

    /** Имя тега для регистрации пользовательского элемента */
    static tagName?: string

    /**
     * Имя тега встроенного DOM элемента который расширяется данным классом
     * @see customElements.define~options.extends {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#syntax}
     */
    static extendsTagName?: string

    new(): CustomElement

    /**
     * Содержимое пользовательского элемента, которое будет добавлено в его состав
     * в момент вставки пользовательского компонента в состав документа
     */
    template?: OOMElement.OOMChild

    /** Хук ЖЦ элемента срабатывающий при вставке элемента в DOM */
    connectedCallback(): void

  }

  namespace OOMProxy {

    /**
     * Создает новый OOM элемент согласно имени запрошенного атрибута родительского Proxy,
     * задем добавляет его в конец списка дочерних элементов
     */
    interface createElementProxy {
      (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): OOMElementProxy
    }

    /** Создает новый OOM элемент и оборачивает его в Proxy */
    interface apply {
      (_: any, __: any, args: OOMElement.OOMElementArgs): OOMElementProxy
    }

    /** Внутренний объект OOMProxy описывающий его базовые методы */
    interface origin {
      extends: (cls: typeof HTMLElement | CustomElement.CustomElementCls) => CustomElement.CustomElementCls
      define: CustomElement.defineCustomElement
    }

  }

  /** Proxy для работы с OOM элементом */
  interface OOMElementProxy extends OOMElement {
    (...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>): void
    //@ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createElementProxy
  }

  /** Общий Proxy для создания OOM элементов */
  interface OOMProxy extends OOMProxy.origin {
    (
      tagName?: OOMElement.OOMTagName,
      ...args: Array<OOMElement.OOMAttributes | OOMElement.OOMChild>
    ): OOMElementProxy
    //@ts-ignore  проверка типа индекса (ts 2411) не подходит, а определения типа "все кроме указанных" нет
    [tagName: string]: OOMProxy.createElementProxy
  }

  export const oom: OOMProxy

}
