import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'lib/index.cjs',
        format: 'cjs',
      },
      {
        file: 'lib/index.esm.js',
        format: 'es',
      },
      {
        file: 'lib/index.mjs',
        format: 'es',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: 'lib/index.d.ts',
    output: {
      file: 'lib/types.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

export default config;
