const API_BASE = 'http://localhost:3366/api';

/** 获取商品分类列表 */
export function getCategoryList() {
  return new Promise((resolve) => {
    wx.request({
      url: `${API_BASE}/categories`,
      method: 'GET',
      success(res) {
        if (res.data && res.data.code === 0) {
          const list = res.data.data.map(item => ({
            groupId: String(item.id),
            name: item.name,
            icon: item.icon,
            children: []
          }));
          resolve(list);
        } else {
          resolve([]);
        }
      },
      fail(err) {
        console.error('Fetch categories failed:', err);
        resolve([]);
      }
    });
  });
}
