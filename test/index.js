import './emulateDOM.js'
import { Test } from '@nodutilus/test'
import BasicBehavior from './1.basic-behavior.js'
// import TestOOM from './oom.js'


/** Общий тестовый класс */
class TestNotMLCore extends Test {

  static ['Базовое поведение'] = BasicBehavior

  // static TestOOM = TestOOM

}


Test.runOnCI(new TestNotMLCore())
