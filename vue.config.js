module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
          asar: false,
          productName: "综合办公平台-交换中心",
          extraResources: {
            from: "./public/config.json",
            to: "./config.json"
          }
        
      }
    }
  }
}