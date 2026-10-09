const config = require('./config.js');

App({
  globalData: {
    shopAppId: config.shopAppId,
    miniAppId: config.miniAppId,
    shopName: config.shopName,
    featuredProducts: config.featuredProducts
  },

  onLaunch() {
    console.log('文具店小程序（微信小店版）启动成功');
    console.log('当前挂载微信小店 AppID:', this.globalData.shopAppId);
    
    // 检查基础库版本
    const systemInfo = wx.getSystemInfoSync();
    console.log('当前基础库版本:', systemInfo.SDKVersion);
  }
});
