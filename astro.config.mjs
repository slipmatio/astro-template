import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'
import { unheadVueComposablesImports } from '@unhead/vue'
import { defineConfig } from 'astro/config'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import PackageJson from './package.json' with { type: 'json' }

process.env.VITE_APP_VERSION = PackageJson.version
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    vue({ appEntrypoint: '/src/app.ts', devtools: true }),
  ],
  vite: {
    plugins: [
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            '@/store': ['useStore'],
          },
          unheadVueComposablesImports,
        ],
        dts: 'auto-imports.d.ts',
        vueTemplate: true,
      }),
      Components({
        dts: 'components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorMaxWorkers: true,
    },
  },
})
