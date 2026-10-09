const API_BASE = 'http://localhost:3366/api';

/** 获取小程序用户的订单列表 */
export function fetchOrders(params = {}) {
  return new Promise((resolve) => {
    wx.request({
      url: `${API_BASE}/orders`,
      method: 'GET',
      data: {
        page: params.parameter?.pageNo || 1,
        pageSize: params.parameter?.pageSize || 10,
        status: params.parameter?.orderStatus !== undefined && params.parameter?.orderStatus !== -1 ? params.parameter.orderStatus : ''
      },
      success(res) {
        if (res.data && res.data.code === 0) {
          const list = res.data.data.list.map(o => ({
            id: String(o.id),
            orderNo: o.order_no,
            status: o.status === 'paid' ? 10 : (o.status === 'shipped' ? 20 : 30),
            statusDesc: o.status === 'paid' ? '待发货' : (o.status === 'shipped' ? '已发货' : '已完成'),
            amount: o.total_amount * 100,
            goodsList: (o.items || []).map(item => ({
              spuId: '1',
              skuId: '1',
              thumb: item.thumb_url || item.thumb || 'https://images.unsplash.com/photo-1585336261026-6757692e4ee3?auto=format&fit=crop&w=300&q=80',
              title: item.title || item.name || '精选文具用品',
              price: (item.price || o.total_amount) * 100,
              quantity: item.quantity || item.count || 1,
            }))
          }));
          resolve({ data: { orders: list, total: res.data.data.total } });
        } else {
          resolve({ data: { orders: [], total: 0 } });
        }
      },
      fail() {
        resolve({ data: { orders: [], total: 0 } });
      }
    });
  });
}

export function fetchOrdersCount() {
  return Promise.resolve({
    data: [
      { tabType: 5, orderNum: 0 },
      { tabType: 10, orderNum: 1 },
      { tabType: 20, orderNum: 0 },
      { tabType: 30, orderNum: 0 },
    ]
  });
}
