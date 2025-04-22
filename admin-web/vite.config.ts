import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      babelPlugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
      ],
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'Admin Web',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },
})
