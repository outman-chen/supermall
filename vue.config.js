module.exports={
  configureWebpack:{
    resolve:{
      //配置别名
      alias:{
        // @:src 默认
        // '@':'/src',
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views'
      }
    }
  }
}