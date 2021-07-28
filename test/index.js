import './emulateDOM.js'
// @ts-ignore
import { Test } from '@nodutilus/test'
import BasicBehavior from './1.basic-behavior.js'
import CustomElements from './2.custom-elements.js'
import BasicAPI from './3.basic-api.js'
// import TestOOM from './oom.js'


/** Общий тестовый класс */
class TestNotMLCore extends Test {

  static ['Базовое поведение'] = BasicBehavior
  static ['Пользовательские элементы'] = CustomElements
  static ['Базовое API для OOM элементов'] = BasicAPI

  // static TestOOM = TestOOM

}


Test.runOnCI(new TestNotMLCore())
