import { mkdirSync, symlinkSync, existsSync } from 'fs'

mkdirSync('test/node_modules', { recursive: true })
if (!existsSync('test/node_modules/@notml')) {
  symlinkSync('../../@notml', 'test/node_modules/@notml', 'dir')
}

mkdirSync('webtest/node_modules', { recursive: true })
if (!existsSync('webtest/node_modules/@notml')) {
  symlinkSync('../../@notml', 'webtest/node_modules/@notml', 'dir')
}
