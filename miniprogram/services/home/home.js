const API_BASE = 'http://localhost:3366/api';

/** 获取首页数据 */
export function fetchHome() {
  return new Promise((resolve) => {
    // 获取分类作为 Tab 栏
    wx.request({
      url: `${API_BASE}/categories`,
      method: 'GET',
      success(res) {
        let tabList = [
          { text: '精选推荐', key: 0 },
          { text: '热销笔类', key: 1 },
          { text: '精美本册', key: 2 },
          { text: '桌面收纳', key: 3 }
        ];

        if (res.data && res.data.code === 0 && res.data.data.length) {
          tabList = res.data.data.map((c, idx) => ({
            text: c.name,
            key: c.id
          }));
        }

        resolve({
          swiper: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1585336261026-6757692e4ee3?auto=format&fit=crop&w=1000&q=80',
          ],
          tabList,
          activityImg: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
        });
      },
      fail() {
        resolve({
          swiper: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
          ],
          tabList: [{ text: '精选推荐', key: 0 }],
          activityImg: '',
        });
      }
    });
  });
}
