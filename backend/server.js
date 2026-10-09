const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3366;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态托管上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由挂载
const goodsRouter = require('./routes/goods');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const uploadRouter = require('./routes/upload');

app.use('/api/goods', goodsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/upload', uploadRouter);

// 健康检查根路由
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Wenju Shop Backend API Service',
    time: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Static files served on http://localhost:${PORT}/uploads`);
});
