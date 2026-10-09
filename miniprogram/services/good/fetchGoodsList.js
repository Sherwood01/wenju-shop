const API_BASE = 'http://localhost:3366/api';

/** 获取真实商品列表 */
export function fetchGoodsList(params = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/goods`,
      method: 'GET',
      data: {
        page: params.pageNo || params.page || 1,
        pageSize: params.pageSize || 20,
        keyword: params.keyword || '',
        category_id: params.categoryId || '',
        is_put_on_sale: 1
      },
      success(res) {
        if (res.data && res.data.code === 0) {
          const list = res.data.data.list.map(item => ({
            spuId: String(item.id),
            thumb: item.thumb_url,
            title: item.title,
            price: item.price * 100, // 小程序展示按分计算
            originPrice: item.origin_price ? item.origin_price * 100 : item.price * 100,
            tags: [item.category_name || '文具用品'],
            desc: item.description
          }));
          resolve({ spuList: list, total: res.data.data.total });
        } else {
          resolve({ spuList: [], total: 0 });
        }
      },
      fail(err) {
        console.error('获取商品列表失败:', err);
        resolve({ spuList: [], total: 0 });
      }
    });
  });
}
