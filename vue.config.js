// vue.config.js
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: '/',
  devServer: {
    port: 8082
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    externals: {
      'echarts': 'echarts'
    }
  }
}
