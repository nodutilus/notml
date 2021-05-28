import './emulateDOM.js'
import { Test } from '@nodutilus/test'
import BasicBehavior from './1.basic-behavior.js'
import CustomElements from './2.custom-elements.js'
// import TestOOM from './oom.js'


/** Общий тестовый класс */
class TestNotMLCore extends Test {

  static ['Базовое поведение'] = BasicBehavior
  static ['Пользовательские элементы'] = CustomElements

  // static TestOOM = TestOOM

}


Test.runOnCI(new TestNotMLCore())
