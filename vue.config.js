const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false
})

module.exports = {
  configureWebpack:{
    //起别名
    resolve: {
      alias: {
        'assets':'@/assets',
        'components':'@/components',
        'network':'@/network',
        'utils':'@/utils',
        'views':'@/views'
      }
    }
  }
}
