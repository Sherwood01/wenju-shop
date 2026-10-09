const config = require('../../config.js');

Page({
  data: {
    shopAppId: config.shopAppId,
    shopName: config.shopName || '学伴文具品质优选店',
    shopNotice: config.shopNotice || '今日营业中 · 满49元包邮 · 极速电子面单闪电发货',
    bannerList: config.bannerList || [],
    navCategories: config.navCategories || [],
    featuredProducts: config.featuredProducts || [],
    // 展示模式：'showcase' 为百货精选货架，'whole_store' 为小店整店模式
    currentMode: 'showcase',
    swiperCurrent: 0
  },

  onLoad() {
    console.log('学伴文具店首页加载，小店AppID:', this.data.shopAppId);
  },

  // 轮播图切换监听
  onSwiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  // 切换浏览模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      currentMode: mode
    });
  },

  // 从首页金刚区跳转到分类页
  navigateToCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.setStorageSync('target_category_id', categoryId);
    wx.switchTab({
      url: '/pages/goods/goods'
    });
  },

  // 页面下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 600);
  }
});
