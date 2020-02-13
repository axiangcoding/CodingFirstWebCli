// vue.config.js
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: '/',
  devServer: {
    port: 8887
  },
  productionSourceMap: true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'prod') {
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config['externals'] = { 'echarts': 'echarts' }
    } else {
      config['externals'] = { 'echarts': 'echarts' }
    }
  }
}
