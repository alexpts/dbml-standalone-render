import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVue3Resolver } from 'unplugin-vue-components/resolvers'
import { viteSingleFile } from "vite-plugin-singlefile"


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      viteSingleFile(),
      // https://cdmoro.github.io/bootstrap-vue-3/getting-started/#installation-vue-js
      Components({
          resolvers: [BootstrapVue3Resolver()]
      })
  ]
})