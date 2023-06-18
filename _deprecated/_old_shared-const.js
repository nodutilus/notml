/**
 * Список все тегов зарегистрированных пользовательских элементов
 *
 * @type {Set<string>}
 */
export const customTagNames = new Set()
/**
 * Сопоставление класса пользовательского элемента и его тега
 *
 * @type {Map<HTMLElement,string>}
 */
export const customElementTagName = new Map()
/**
 * Связь динамических классов пользовательских элементов с классами определенными пользователем
 *
 * @type {Map<HTMLElement,HTMLElement>}
 */
export const customClasses = new Map()
/**
 * Хранилище опций для пользовательских компонентов
 *
 * @type {WeakMap<HTMLElement,Object<string,*>>}
 */
export const customOptions = new WeakMap()
