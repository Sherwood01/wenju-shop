const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db/init');

// 获取分类列表
router.get('/', (req, res) => {
  const db = readDb();
  const list = [...db.categories].sort((a, b) => a.sort_order - b.sort_order);
  res.json({ code: 0, data: list, message: 'Success' });
});

// 新增分类
router.post('/', (req, res) => {
  const { name, icon, sort_order = 0 } = req.body;
  if (!name) {
    return res.status(400).json({ code: 400, message: 'Category name is required' });
  }

  const db = readDb();
  const newId = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
  const newCategory = { id: newId, name, icon: icon || '', sort_order: Number(sort_order) };

  db.categories.push(newCategory);
  writeDb(db);

  res.json({ code: 0, data: newCategory, message: 'Created successfully' });
});

// 更新分类
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, icon, sort_order } = req.body;

  const db = readDb();
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ code: 404, message: 'Category not found' });
  }

  if (name !== undefined) db.categories[idx].name = name;
  if (icon !== undefined) db.categories[idx].icon = icon;
  if (sort_order !== undefined) db.categories[idx].sort_order = Number(sort_order);

  writeDb(db);
  res.json({ code: 0, data: db.categories[idx], message: 'Updated successfully' });
});

// 删除分类
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  db.categories = db.categories.filter(c => c.id !== id);
  writeDb(db);
  res.json({ code: 0, message: 'Deleted successfully' });
});

module.exports = router;
