import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import cleanup from 'rollup-plugin-cleanup'

export default [{
  input: 'src/core.js',
  output: { file: 'core.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    babel({ plugins: ['@babel/plugin-proposal-class-properties'] }),
    cleanup({ comments: 'none' })
  ]
}]
