var $oom=(function(){'use strict';const customTagNames = new Set();
const customElementTagName = new Map();
const customClasses = new Map();
const customOptions = new WeakMap();const { document, customElements: customElements$2, DocumentFragment, HTMLElement: HTMLElement$1 } = window;
const isOOMElementSymbol = Symbol('isOOMElement');
class OOMElement {
  static createProxy(args) {
    const wrapper =  () => { };
    wrapper.instance = new OOMElement(...args);
    return new Proxy(wrapper, OOMElement.proxyHandler)
  }
  static proxyApply({ instance }, _, args) {
    for (const arg of args) {
      const isChild =
        arg instanceof OOMElement ||
        arg instanceof HTMLElement$1 ||
        arg instanceof DocumentFragment ||
        typeof arg !== 'object' || !arg ||
        arg.constructor !== Object;
      if (isChild) {
        instance.append(arg);
      } else {
        OOMElement.setAttributes(instance.dom, arg);
      }
    }
  }
  static proxyGetter({ instance }, tagName, proxy) {
    if (tagName in instance) {
      if (typeof instance[tagName] === 'function') {
        return (...args) => {
          const result = instance[tagName](...args);
          return result === instance ? proxy : result
        }
      } else {
        return instance[tagName]
      }
    } else {
      return (...args) => {
        if (instance.dom instanceof DocumentFragment) {
          instance.append(new OOMElement(tagName, ...args));
        } else {
          proxy = OOMElement.createProxy([
            document.createDocumentFragment(),
            proxy.dom,
            new OOMElement(tagName, ...args)
          ]);
        }
        return proxy
      }
    }
  }
  static [Symbol.hasInstance](instance) {
    return instance && instance[isOOMElementSymbol]
  }
  static resolveTagName(tagName) {
    let result;
    if (typeof tagName === 'string' && tagName[0] === tagName[0].toUpperCase()) {
      result = tagName
        .replace((/^[A-Z]/), str => str.toLowerCase())
        .replace((/[A-Z]/g), str => `-${str.toLowerCase()}`);
    } else {
      result = tagName;
    }
    return result
  }
  static setAttribute(instance, attrName, attrValue) {
    const attrType = typeof attrValue;
    if (attrName === 'options' && customClasses.has(instance.constructor)) {
      customOptions.set(instance, attrValue);
    } else if (attrName === 'style' && attrType === 'object') {
      for (const name in attrValue) {
        instance.style[name] = attrValue[name];
      }
    } else {
      if (attrType === 'function') {
        instance[attrName] = attrValue;
      } else {
        if ((/[A-Z]/).test(attrName)) {
          attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`);
        }
        if (attrType === 'object') {
          instance.setAttribute(attrName, `json::${JSON.stringify(attrValue)}`);
        } else {
          instance.setAttribute(attrName, attrValue);
        }
      }
    }
  }
  static getAttribute(instance, attrName) {
    let attrValue;
    if (attrName === 'options' && customClasses.has(instance.constructor)) {
      attrValue = customOptions.get(instance, attrValue);
    } else {
      const ownValue = instance[attrName];
      if (typeof ownValue === 'function') {
        attrValue = ownValue;
      } else {
        if ((/[A-Z]/).test(attrName)) {
          attrName = attrName.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`);
        }
        attrValue = instance.getAttribute(attrName);
        if (attrValue && attrValue.startsWith('json::')) {
          attrValue = JSON.parse(attrValue.replace('json::', ''));
        }
      }
    }
    return attrValue
  }
  static setAttributes(instance, attributes = {}) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      OOMElement.setAttribute(instance, attrName, attrValue);
    }
  }
  [isOOMElementSymbol] = true
  dom
  get html() {
    const { dom } = this;
    let html = '';
    if (dom instanceof DocumentFragment) {
      for (const item of dom.children) {
        html += item.outerHTML;
      }
    } else {
      html = dom.outerHTML;
    }
    return html
  }
  constructor(tagName, ...args) {
    if (tagName instanceof HTMLElement$1 || tagName instanceof DocumentFragment) {
      this.dom = tagName;
    } else {
      if (customElementTagName.has(tagName)) {
        tagName = customElementTagName.get(tagName);
        customElements$2.get(tagName).options = attributes ? attributes.options : undefined;
      } else {
        tagName = OOMElement.resolveTagName(tagName);
        if (customTagNames.has(tagName)) {
          customElements$2.get(tagName).options = attributes ? attributes.options : undefined;
        }
      }
      this.dom = typeof tagName === 'undefined'
        ? document.createDocumentFragment()
        : document.createElement(tagName);
    }
    OOMElement.proxyApply({ instance: this }, null, args);
  }
  setAttribute(attrName, attrValue) {
    OOMElement.setAttribute(this.dom, attrName, attrValue);
    return this
  }
  setAttributes(attributes) {
    OOMElement.setAttributes(this.dom, attributes);
    return this
  }
  append(child) {
    if (child instanceof OOMElement) {
      this.dom.append(child.dom);
    } else if (typeof child !== 'undefined') {
      this.dom.append(child);
    }
    return this
  }
  oom(...args) {
    this.append(new OOMElement(...args));
    return this
  }
  clone() {
    const dom = document.importNode(this.dom, true);
    const element = new this.constructor(dom);
    const proxy = new Proxy(element, OOMElement.proxyHandler);
    return proxy
  }
}
OOMElement.proxyHandler = {
  apply: OOMElement.proxyApply,
  get: OOMElement.proxyGetter,
  set: () => false
};const { HTMLElement, customElements: customElements$1 } = window;
const observedAttributesSymbol = Symbol('observedAttributes');
const attributeChangedCacheSymbol = Symbol('attributeChangedCache');
const attributesHandler = {
  get: OOMElement.getAttribute,
  set: (...args) => {
    OOMElement.setAttribute(...args);
    return true
  }
};
function getObservedAttributes(proto, setters) {
  const properties = Object.getOwnPropertyNames(proto);
  const nestedProto = Reflect.getPrototypeOf(proto);
  if (Object.isPrototypeOf.call(HTMLElement, nestedProto.constructor)) {
    getObservedAttributes(nestedProto, setters);
  }
  for (const name of properties) {
    const { value } = Reflect.getOwnPropertyDescriptor(proto, name);
    const isFunction = typeof value === 'function';
    const isChanged = name.endsWith('Changed');
    const isValidName = (/^[a-z][\w]+$/).test(name);
    if (isFunction && isChanged && isValidName) {
      const attributeName = name
        .replace(/Changed$/, '')
        .replace(/[A-Z]/g, str => `-${str.toLowerCase()}`);
      setters.set(attributeName, name);
    }
  }
  return setters.size > 0 ? setters : null
}
function applyAttributeChangedCallback(instance, name, oldValue, newValue) {
  const observed = instance.constructor[observedAttributesSymbol];
  if (observed && observed.has(name)) {
    if (newValue && newValue.startsWith('json::')) {
      newValue = JSON.parse(newValue.replace('json::', ''));
    }
    if (instance.isConnected) {
      instance[observed.get(name)](oldValue, newValue);
    } else {
      if (!(attributeChangedCacheSymbol in instance)) {
        instance[attributeChangedCacheSymbol] = new Set();
      }
      instance[attributeChangedCacheSymbol].add({
        name: observed.get(name),
        args: [oldValue, newValue]
      });
    }
  }
}
function applyOOMTemplate(instance) {
  const attributeChanged = instance[attributeChangedCacheSymbol];
  let staticTemplate = instance.constructor.template;
  let { shadowRootInit, template } = instance;
  let root = instance;
  let templateOptions =
    (typeof staticTemplate === 'function' && staticTemplate.length > 0) ||
    (typeof template === 'function' && template.length > 0) ||
    null;
  if (templateOptions) {
    templateOptions = Object.assign({}, customOptions.get(instance), {
      element: instance,
      attributes: new Proxy(instance, attributesHandler)
    });
  }
  if (!(template instanceof OOMElement) && typeof template !== 'string') {
    if (staticTemplate instanceof OOMElement) {
      staticTemplate = staticTemplate.clone();
    } else if (typeof staticTemplate === 'function') {
      staticTemplate = instance.constructor.template(templateOptions);
    }
    if (typeof template === 'function') {
      if (templateOptions) {
        templateOptions.template = staticTemplate;
      }
      template = instance.template(templateOptions) || staticTemplate;
    } else {
      template = staticTemplate;
    }
  }
  if (shadowRootInit) {
    root = instance.attachShadow(shadowRootInit);
  }
  if (template instanceof OOMElement) {
    root.innerHTML = '';
    root.append(template.dom);
  } else if (typeof template === 'string') {
    root.innerHTML = template;
  }
  if (attributeChanged instanceof Set) {
    for (const changed of attributeChanged) {
      instance[changed.name](...changed.args);
      attributeChanged.delete(changed);
    }
    delete instance[attributeChangedCacheSymbol];
  }
}
function customClassFactory(constructor) {
  class OOMCustomElement extends constructor {
    static get observedAttributes() {
      return this[observedAttributesSymbol]
        ? [...this[observedAttributesSymbol].keys(), ...(super.observedAttributes || [])]
        : super.observedAttributes
    }
    constructor() {
      super(OOMCustomElement.options || {});
      delete OOMCustomElement.options;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      applyAttributeChangedCallback(this, name, oldValue, newValue);
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }
    connectedCallback() {
      applyOOMTemplate(this);
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
  }
  OOMCustomElement[observedAttributesSymbol] = getObservedAttributes(constructor.prototype, new Map());
  return OOMCustomElement
}
function defineCustomElement(name, constructor, options) {
  if (Object.isPrototypeOf.call(HTMLElement, name)) {
    [constructor, options] = [name, constructor];
    name = constructor.tagName || OOMElement.resolveTagName(constructor.name);
  }
  const customClass = customClasses.get(constructor) || customClassFactory(constructor);
  customElements$1.define(name, customClass, options);
  customClasses.set(customClass, constructor);
  customElementTagName.set(constructor, name);
  customTagNames.add(name);
}const { customElements } = window;
const oomOrigin = Object.assign(Object.create(null), {
  setAttributes: (...args) => {
    OOMElement.setAttributes(...args);
    return oom
  },
  define: (...args) => {
    defineCustomElement(...args);
    return oom
  },
  getDefined: (tagName) => {
    return customClasses.get(customElements.get(tagName))
  }
});
const oom = oomOrigin.oom = new Proxy(OOMElement, {
  apply: (_, __, args) => {
    return OOMElement.createProxy(args)
  },
  get: (_, tagName, proxy) => {
    return oomOrigin[tagName] || ((...args) => proxy(tagName, ...args))
  },
  set: () => false
});return oom;}());