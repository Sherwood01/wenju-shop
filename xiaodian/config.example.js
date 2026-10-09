// 微信小店对接配置示例模板 (公开可提交，绝不包含真实 AppID)
module.exports = {
  shopAppId: 'YOUR_SHOP_APPID',
  miniAppId: 'YOUR_MINI_APPID',
  shopName: '学伴文具品质优选店',
  shopNotice: '今日营业中 · 满49元包邮 · 极速电子面单闪电发货',
  bannerList: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1585336261026-6757692e4ee3?auto=format&fit=crop&w=1200&q=80',
      title: '开学文具季 · 经典书写好物直降',
      sub: '精选0.5mm速干中性笔 & 荧光笔'
    }
  ],
  navCategories: [
    { id: 'all', name: '全部文具', icon: '✏️' },
    { id: 'pen', name: '经典书写', icon: '🖊️' },
    { id: 'book', name: '灵感本册', icon: '📓' },
    { id: 'storage', name: '桌面收纳', icon: '🗃️' },
    { id: 'craft', name: '美工手帐', icon: '🎨' }
  ],
  featuredProducts: [
    {
      productId: '10001670576194',
      title: '镇店之宝 · 爆款精选文具',
      category: 'pen',
      tag: '热销TOP1',
      desc: '顺滑流畅不墨渗，大容量速干墨水，点击直接半屏下单'
    }
  ]
};
