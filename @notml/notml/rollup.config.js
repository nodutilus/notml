import resolve from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import { terser } from 'rollup-plugin-terser'


export default [{
  input: 'src/core.js',
  output: { file: 'core.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' })
  ]
}, {
  input: 'src/core-global.js',
  output: { file: 'core-global.js', format: 'iife', name: 'oom', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' })
  ]
}, {
  input: 'core.js',
  output: { file: 'core.min.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' }),
    terser()]
}, {
  input: 'src/core-global.js',
  output: { file: 'core-global.min.js', format: 'iife', name: 'oom', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' }),
    terser()
  ]
}]
