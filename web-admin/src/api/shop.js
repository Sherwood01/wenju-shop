import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3366/api' : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

// 分类 API
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// 商品 API
export const getGoodsList = (params) => api.get('/goods', { params });
export const getGoodsDetail = (id) => api.get(`/goods/${id}`);
export const createGoods = (data) => api.post('/goods', data);
export const updateGoods = (id, data) => api.put(`/goods/${id}`, data);
export const updateGoodsStatus = (id, is_put_on_sale) => api.patch(`/goods/${id}/status`, { is_put_on_sale });
export const deleteGoods = (id) => api.delete(`/goods/${id}`);

// 订单 API
export const getOrdersList = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// 上传 API
export const uploadFile = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
