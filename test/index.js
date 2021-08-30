import './emulateDOM.js'
// @ts-ignore
import { Test } from '@nodutilus/test'
import BasicBehavior from './1.basic-behavior.js'
import BasicAPI from './2.basic-api.js'
import OOMStyle from './3.style.js'
import CustomElements from './4.custom-elements.js'
import AttachShadow from './5.attach-shadow.js'

// import TestOOM from './oom.js'


/** Общий тестовый класс */
class TestNotMLCore extends Test {

  static ['Базовое поведение'] = BasicBehavior
  static ['Базовое API для OOM элементов'] = BasicAPI
  static ['Генератор CSS in JS'] = OOMStyle
  static ['Пользовательские элементы'] = CustomElements
  static ['Теневой DOM'] = AttachShadow

  // static TestOOM = TestOOM

}


Test.runOnCI(new TestNotMLCore())
