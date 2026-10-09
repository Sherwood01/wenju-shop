const API_BASE = 'http://localhost:3366/api';

/** 获取单个商品详情 */
export function fetchGood(id) {
  return new Promise((resolve) => {
    wx.request({
      url: `${API_BASE}/goods/${id}`,
      method: 'GET',
      success(res) {
        if (res.data && res.data.code === 0) {
          const item = res.data.data;
          const detail = {
            spuId: String(item.id),
            title: item.title,
            primaryImage: item.thumb_url,
            images: item.images && item.images.length ? item.images : [item.thumb_url],
            minSalePrice: item.price * 100,
            maxLinePrice: item.origin_price ? item.origin_price * 100 : item.price * 100,
            soldNum: 100,
            spuStockQuantity: item.stock || 100,
            desc: [item.description || '精选优质文具，满足日常学习办公需求。'],
            specList: [],
            skuList: [
              {
                skuId: String(item.id),
                price: item.price * 100,
                stockQuantity: item.stock || 100,
              }
            ]
          };
          resolve(detail);
        } else {
          resolve(null);
        }
      },
      fail(err) {
        console.error('Fetch good detail failed:', err);
        resolve(null);
      }
    });
  });
}
