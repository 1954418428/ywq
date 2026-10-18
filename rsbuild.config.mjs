import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  source: {
    entry: {
      index: './src/main.jsx'
    }
  },
  html: {
    template: './index.html'
  },
  output: {
    distPath: {
      root: 'dist'
    },
    // 相对路径，便于部署在 GitHub Pages 的仓库子路径下
    assetPrefix: './',
    cleanDistPath: true
  },
  server: {
    host: '0.0.0.0',
    port: 10086
  }
})
