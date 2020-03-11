import './emulateDOM.js'
import { Test } from '@nodutilus/test'
import TestOOM from './oom.js'


/** Общий тестовый класс */
class TestNotMLCore extends Test {

  static TestOOM = TestOOM

}


Test.runOnCI(new TestNotMLCore())
