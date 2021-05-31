import { assert, Test } from '@nodutilus/test'
import { oom } from '@notml/core'

const { HTMLElement, HTMLButtonElement, customElements, document } = window


/** Проверка расширенной работы пользовательских элементов */
export default class CustomElements extends Test {

  /** Для удобства регистрации и переиспользования все опции define перенесены на класс */
  ['Регистрация пользовательского элемента']() {
    /** Имя тега забирается по названию класса */
    const MyElement1 = oom.extends(class MyElement1 extends HTMLElement { })
    /** Имя тега получается из статического свойства класса */
    const MyElement2 = oom.extends(class MyElement2 extends HTMLElement {

      static tagName = 'm-e-2'

    })
    /** Расширения базового тега так же выполняется через класс */
    const MyButton1 = oom.extends(class MyButton1 extends HTMLButtonElement {

      static extendsTagName = 'button'

    })

    assert.equal(oom(new MyElement1()).html, '<my-element1></my-element1>')
    assert.equal(oom(MyElement1).html, '<my-element1></my-element1>')
    assert.equal(oom.MyElement1().html, '<my-element1></my-element1>')
    assert.equal(oom('MyElement1').html, '<my-element1></my-element1>')
    assert.equal(customElements.get('my-element1'), MyElement1)

    assert.equal(oom(new MyElement2()).html, '<m-e-2></m-e-2>')
    assert.equal(oom(MyElement2).html, '<m-e-2></m-e-2>')
    assert.equal(oom['ME-2']().html, '<m-e-2></m-e-2>')
    assert.equal(oom('ME-2').html, '<m-e-2></m-e-2>')
    assert.equal(customElements.get('m-e-2'), MyElement2)

    assert.equal(oom(new MyButton1()).html, '<button is="my-button1"></button>')
    assert.equal(oom(MyButton1).html, '<button is="my-button1"></button>')
    assert.equal(oom.MyButton1().html, '<button is="my-button1"></button>')
    assert.equal(oom('MyButton1').html, '<button is="my-button1"></button>')
    assert.equal(customElements.get('my-button1'), MyButton1)
  }

  ['Работа с connectedCallback и template']() {
    const MyElement3 = oom.extends(class MyElement3 extends HTMLElement {

      template = oom('div')

    })
    const myElm3 = new MyElement3()

    assert.equal(myElm3.outerHTML, '<my-element3></my-element3>')

    document.body.innerHTML = ''
    document.body.append(myElm3)
    assert.equal(document.body.innerHTML, '<my-element3><div></div></my-element3>')
    document.body.innerHTML = ''

    assert.equal(myElm3.outerHTML, '<my-element3><div></div></my-element3>')
  }

}
