const config = {
  projectName: 'yw-showcase',
  date: '2026-10-16',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  compiler: 'vite',
  framework: 'react',
  postcss: {
    pxtransform: {
      enable: true,
      config: {
        minRootSize: 20,
        maxRootSize: 24
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    outputRoot: 'dist',
    router: {
      mode: 'browser'
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      },
      pxtransform: {
        enable: true,
        config: {
          minRootSize: 20,
          maxRootSize: 24
        }
      }
    }
  }
}

module.exports = config
