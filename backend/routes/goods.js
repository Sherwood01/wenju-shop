const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db/init');

// 获取商品列表 (支持 page, pageSize, category_id, keyword, is_put_on_sale)
router.get('/', (req, res) => {
  const { page = 1, pageSize = 20, category_id, keyword, is_put_on_sale } = req.query;
  const db = readDb();
  let result = [...db.goods];

  if (category_id) {
    result = result.filter(g => Number(g.category_id) === Number(category_id));
  }
  if (is_put_on_sale !== undefined && is_put_on_sale !== '') {
    result = result.filter(g => Number(g.is_put_on_sale) === Number(is_put_on_sale));
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    result = result.filter(g => g.title.toLowerCase().includes(kw));
  }

  // 关联分类名称
  const categoryMap = {};
  db.categories.forEach(c => categoryMap[c.id] = c.name);

  const formatted = result.map(g => ({
    ...g,
    category_name: categoryMap[g.category_id] || '未分类'
  }));

  const total = formatted.length;
  const p = Number(page);
  const ps = Number(pageSize);
  const startIndex = (p - 1) * ps;
  const list = formatted.slice(startIndex, startIndex + ps);

  res.json({
    code: 0,
    data: {
      list,
      total,
      page: p,
      pageSize: ps
    },
    message: 'Success'
  });
});

// 获取商品详情
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  const item = db.goods.find(g => g.id === id);
  if (!item) {
    return res.status(404).json({ code: 404, message: 'Goods not found' });
  }

  const category = db.categories.find(c => c.id === item.category_id);
  res.json({
    code: 0,
    data: {
      ...item,
      category_name: category ? category.name : '未分类'
    },
    message: 'Success'
  });
});

// 新增商品
router.post('/', (req, res) => {
  const { title, price, origin_price, category_id, stock = 100, thumb_url, images = [], description = '', is_put_on_sale = 1 } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({ code: 400, message: 'Title and price are required' });
  }

  const db = readDb();
  const newId = db.goods.length > 0 ? Math.max(...db.goods.map(g => g.id)) + 1 : 1;

  const newGoods = {
    id: newId,
    title,
    price: Number(price),
    origin_price: origin_price !== undefined ? Number(origin_price) : Number(price),
    category_id: category_id ? Number(category_id) : null,
    stock: Number(stock),
    thumb_url: thumb_url || '',
    images: Array.isArray(images) ? images : [images],
    description,
    is_put_on_sale: Number(is_put_on_sale),
    created_at: new Date().toISOString()
  };

  db.goods.unshift(newGoods);
  writeDb(db);

  res.json({ code: 0, data: newGoods, message: 'Goods created successfully' });
});

// 编辑商品
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  const idx = db.goods.findIndex(g => g.id === id);
  if (idx === -1) {
    return res.status(404).json({ code: 404, message: 'Goods not found' });
  }

  const { title, price, origin_price, category_id, stock, thumb_url, images, description, is_put_on_sale } = req.body;

  if (title !== undefined) db.goods[idx].title = title;
  if (price !== undefined) db.goods[idx].price = Number(price);
  if (origin_price !== undefined) db.goods[idx].origin_price = Number(origin_price);
  if (category_id !== undefined) db.goods[idx].category_id = Number(category_id);
  if (stock !== undefined) db.goods[idx].stock = Number(stock);
  if (thumb_url !== undefined) db.goods[idx].thumb_url = thumb_url;
  if (images !== undefined) db.goods[idx].images = Array.isArray(images) ? images : [images];
  if (description !== undefined) db.goods[idx].description = description;
  if (is_put_on_sale !== undefined) db.goods[idx].is_put_on_sale = Number(is_put_on_sale);

  writeDb(db);
  res.json({ code: 0, data: db.goods[idx], message: 'Goods updated successfully' });
});

// 上架/下架开关
router.patch('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { is_put_on_sale } = req.body;
  const db = readDb();
  const idx = db.goods.findIndex(g => g.id === id);
  if (idx === -1) {
    return res.status(404).json({ code: 404, message: 'Goods not found' });
  }

  db.goods[idx].is_put_on_sale = Number(is_put_on_sale);
  writeDb(db);

  res.json({ code: 0, message: 'Status updated successfully' });
});

// 删除商品
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  db.goods = db.goods.filter(g => g.id !== id);
  writeDb(db);

  res.json({ code: 0, message: 'Goods deleted successfully' });
});

module.exports = router;
