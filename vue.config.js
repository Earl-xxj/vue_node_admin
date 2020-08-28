const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  assetsDir: 'static',
  chainWebpack: config => {
    // 移除 prefetch 插件 关闭预加载模块
    config.plugins.delete('prefetch')

    config.resolve.alias
      .set('@', resolve('src'))
      .set('@c', resolve('src/components'))
      .set('@v', resolve('src/views'))

    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }

    // 对vue-cli内部的 webpack 配置进行更细粒度的修改
    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10K的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })]
      }
    }
  }
}
