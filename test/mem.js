import '../test/emulateDOM.js'
import { memoryUsage } from 'process'
import { oom } from '../@notml/core/core.js'

let curRSS = 0
let maxRSS = 0

for (let index = 0; index < 10000; index++) {
  oom.div()
}

const initRSS = memoryUsage().rss
const wait = () => { return new Promise(resolve => { setTimeout(resolve, 1) }) }

(async () => {
  for (let index = 0; index < 10000; index++) {
    for (let index = 0; index < 10000; index++) {
      oom.div()
    }

    // node --expose_gc test/mem
    global.gc()

    await wait()
    curRSS = memoryUsage().rss
    curRSS = curRSS / initRSS * 100 ^ 0
    maxRSS = Math.max(maxRSS, curRSS)
    console.log(curRSS, '%', '/', maxRSS, '%')
  }
})()
