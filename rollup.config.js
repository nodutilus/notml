import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import { terser } from 'rollup-plugin-terser'

export default [{
  input: 'src/notml.js',
  output: { file: 'notml.js', format: 'esm' },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    babel({ plugins: ['@babel/plugin-proposal-class-properties'] }),
    cleanup({ comments: 'none' })
  ]
}, {
  input: 'notml.js',
  output: { file: 'notml.min.js', format: 'esm', compact: true },
  plugins: [terser()]
}]
