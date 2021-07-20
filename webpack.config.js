require('dotenv/config')
const path = require('path')

const clientPath = path.join(__dirname, 'client/')
const serverPublicPath = path.join(__dirname, 'server/public/')

module.exports = {
  entry: clientPath,
  output: {
    path: serverPublicPath
  },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    publicPath: '/',
    contentBase: serverPublicPath,
    watchContentBase: true,
    stats: 'minimal',
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`,
      '/socket.io': {
        target: `http://localhost:${process.env.PORT}`,
        ws: true
      }
    }
  },
  performance: {
    hints: false
  }
}
