import resolve from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'

export default [{
  input: 'src/core.js',
  output: { file: 'core.js', format: 'esm', compact: true },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    cleanup({ comments: 'none' })
  ]
}]
