const config = require('../../config.js');

Page({
  data: {
    shopAppId: config.shopAppId,
    // 侧边栏分类
    categories: [
      { id: 'all', name: '全部商品', count: 1 },
      { id: 'pen', name: '经典书写', count: 1 },
      { id: 'book', name: '灵感本册', count: 0 },
      { id: 'storage', name: '桌面收纳', count: 0 },
      { id: 'craft', name: '美工手帐', count: 0 }
    ],
    selectedCategoryId: 'all',

    // 原始商品池
    allProducts: config.featuredProducts || [],
    // 当前过滤展示的商品
    filteredProducts: []
  },

  onLoad() {
    this.initProducts();
  },

  onShow() {
    // 检查是否有从首页金刚区点击带来的目标分类
    const targetCat = wx.getStorageSync('target_category_id');
    if (targetCat) {
      this.setData({
        selectedCategoryId: targetCat
      });
      wx.removeStorageSync('target_category_id');
      this.filterCategory(targetCat);
    } else {
      this.filterCategory(this.data.selectedCategoryId);
    }
  },

  initProducts() {
    this.setData({
      filteredProducts: this.data.allProducts
    });
  },

  // 侧边栏点击切换分类
  onSelectCategory(e) {
    const catId = e.currentTarget.dataset.id;
    this.setData({
      selectedCategoryId: catId
    });
    this.filterCategory(catId);
  },

  // 过滤商品逻辑
  filterCategory(catId) {
    if (catId === 'all') {
      this.setData({
        filteredProducts: this.data.allProducts
      });
    } else {
      const list = this.data.allProducts.filter(p => p.category === catId);
      // 若当前分类下暂无商品，展示全部作为兜底推荐
      this.setData({
        filteredProducts: list.length > 0 ? list : this.data.allProducts
      });
    }
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  }
});
