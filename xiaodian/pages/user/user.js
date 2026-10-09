const config = require('../../config.js');

Page({
  data: {
    shopAppId: config.shopAppId,
    shopName: config.shopName || '学伴文具品质优选店',
    orderTabs: [
      { id: 'all', icon: '📑', label: '全部订单' },
      { id: 'pay', icon: '💳', label: '待付款' },
      { id: 'ship', icon: '📦', label: '待发货' },
      { id: 'receive', icon: '🚚', label: '待收货' },
      { id: 'aftersale', icon: '🔄', label: '退换/售后' }
    ],
    faqList: [
      { q: '关于发货与快递时效', a: '每日16:00前订单当天从仓库发出，接入顺丰/中通电子面单，可在订单详情实时查看轨迹。' },
      { q: '7天无理由退换保障', a: '文具商品自签收之日起支持7天无理由退换，可在订单中心直接申请，享受官方退款极速审核。' },
      { q: '如何开具发票？', a: '在微信小店订单确认或详情页面中，勾选申请电子发票，付款后系统自动发送至您的邮箱。' }
    ],
    openedFaqIndex: null
  },

  onLoad() {
    console.log('个人中心加载');
  },

  // 展开/收起常见问题
  toggleFaq(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      openedFaqIndex: this.data.openedFaqIndex === index ? null : index
    });
  },

  // 打开微信小店订单详情或提示
  openStoreOrder() {
    if (wx.openStoreOrderDetail) {
      wx.openStoreOrderDetail({
        appid: this.data.shopAppId,
        success(res) {
          console.log('成功调起微信小店订单中心', res);
        },
        fail(err) {
          console.warn('调起小店订单中心返回:', err);
          wx.showModal({
            title: '我的小店订单',
            content: '在微信【我】->【服务】->【微信小店】或微信通知的【服务通知】中，也可以随时查看实时订单与物流轨迹！',
            showCancel: false,
            confirmText: '我知道了'
          });
        }
      });
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请升级微信客户端至最新版本以获得最流畅的小店订单体验。',
        showCancel: false
      });
    }
  }
});
