import path from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  devtools: { enabled: true },
  compatibilityDate: '2025-12-10',
  alias: {
    '@poool/vue-access': path.resolve(__dirname, '../../src'),
  },
};
