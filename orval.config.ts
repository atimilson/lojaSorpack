import { defineConfig } from 'orval';

export default defineConfig({
  mcnApi: {
    input: './swaggerApiPedido.json',
    output: {
      mode: 'split',
      target: './src/api/generated',
      client: 'swr',
      baseUrl: '',      
      prettier: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
}); 