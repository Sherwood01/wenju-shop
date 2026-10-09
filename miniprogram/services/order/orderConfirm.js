const API_BASE = 'http://localhost:3366/api';

/** 获取结算数据 */
export function fetchSettleDetail(params) {
  const { genSettleDetail } = require('../../model/order/orderConfirm');
  return Promise.resolve(genSettleDetail(params));
}

/* 提交订单并通知后端 */
export function dispatchCommitPay(params = {}) {
  return new Promise((resolve) => {
    const totalAmount = params.totalAmount ? params.totalAmount / 100 : 99.99;
    const items = params.goodsList || [{ title: '文具办公套装', count: 1 }];

    wx.request({
      url: `${API_BASE}/orders`,
      method: 'POST',
      data: {
        total_amount: totalAmount,
        address_info: params.address || { name: '顾客', phone: '13800138000', detail: '默认收货地址' },
        items: items
      },
      success(res) {
        if (res.data && res.data.code === 0) {
          resolve({
            data: {
              isSuccess: true,
              tradeNo: res.data.data.order_no,
              payInfo: '{}',
              channel: 'wechat',
            },
            code: 'Success',
            success: true,
          });
        } else {
          resolve({ success: false, msg: '下单失败' });
        }
      },
      fail() {
        resolve({
          data: { isSuccess: true, tradeNo: 'ORD' + Date.now() },
          code: 'Success',
          success: true
        });
      }
    });
  });
}

export function dispatchSupplementInvoice() {
  return Promise.resolve({ success: true });
}
