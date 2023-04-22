import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'
import { viteSingleFile } from "vite-plugin-singlefile"
import viteCompression from 'vite-plugin-compression';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      //viteSingleFile(),
      viteCompression(),
      // https://github.com/bootstrap-vue/bootstrap-vue-next/tree/main/apps/docs/docs/getting-started
      Components({
          resolvers: [BootstrapVueNextResolver()]
      })
  ]
})
