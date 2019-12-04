import fs from 'fs';
import { terser } from 'rollup-plugin-terser';

const files = fs.readdirSync('scripts').filter(f => f.endsWith('.js'));
const configs = files.map(file => ({
  input: `scripts/${file}`,
  output: {
    file: `_site/scripts/${file}`,
    format: 'iife',
    plugins: [terser()],
  },
}));

export default configs;
