const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
<<<<<<< HEAD
  // 本地开发时将 /api 请求代理到后端服务器，避免跨域
  devServer: {
    proxy: {
      '/api': {
        //target: 'http://127.0.0.1:4523/m1/6329391-6024776-default',    // 后端服务地址，根据实际情况修改
        target: 'http://8.146.210.243:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },       // 去掉请求前缀
      },
    },
  },
})
=======
  devServer: {
    proxy: {
      '/api': {
        target: 'http://8.146.210.243:8080',
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  }
})
>>>>>>> e2cbc24e081f447312927e5e94dd10a642156446
