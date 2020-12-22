import json from 'rollup-plugin-json';

export default {
  input: 'src/ast.js',
  output: {
    file: 'dist/ast.js',
    format: 'esm'
  },
  plugins: [json()]
}