const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db/init');

// 获取订单列表
router.get('/', (req, res) => {
  const { status, page = 1, pageSize = 20 } = req.query;
  const db = readDb();
  let result = [...db.orders];

  if (status) {
    result = result.filter(o => o.status === status);
  }

  const total = result.length;
  const p = Number(page);
  const ps = Number(pageSize);
  const startIndex = (p - 1) * ps;
  const list = result.slice(startIndex, startIndex + ps);

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

// 创建新订单 (小程序端)
router.post('/', (req, res) => {
  const { total_amount, address_info, items } = req.body;
  if (!total_amount || !items) {
    return res.status(400).json({ code: 400, message: 'Invalid order parameters' });
  }

  const db = readDb();
  const newId = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1;
  const order_no = 'ORD' + Date.now() + Math.floor(1000 + Math.random() * 9000);

  const newOrder = {
    id: newId,
    order_no,
    total_amount: Number(total_amount),
    status: 'paid',
    address_info: address_info || {},
    items: Array.isArray(items) ? items : [],
    created_at: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  res.json({
    code: 0,
    data: newOrder,
    message: 'Order created successfully'
  });
});

// 更新订单状态 (发货/完成/取消)
router.put('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const db = readDb();
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ code: 404, message: 'Order not found' });
  }

  db.orders[idx].status = status;
  writeDb(db);

  res.json({ code: 0, message: 'Order status updated' });
});

module.exports = router;
