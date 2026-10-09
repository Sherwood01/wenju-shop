const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'db.json');

// 纯中文初始化默认数据
const initialData = {
  categories: [
    { id: 1, name: "书写工具", icon: "https://img.icons8.com/color/96/pen.png", sort_order: 1 },
    { id: 2, name: "本册纸品", icon: "https://img.icons8.com/color/96/notebook.png", sort_order: 2 },
    { id: 3, name: "桌面收纳", icon: "https://img.icons8.com/color/96/pencil-case.png", sort_order: 3 },
    { id: 4, name: "美术美工", icon: "https://img.icons8.com/color/96/paint-palette.png", sort_order: 4 }
  ],
  goods: [
    {
      id: 1,
      title: "0.5mm 黑色速干按动中性笔 (5支装)",
      price: 12.99,
      origin_price: 15.99,
      category_id: 1,
      stock: 200,
      thumb_url: "https://images.unsplash.com/photo-1585336261026-6757692e4ee3?auto=format&fit=crop&w=600&q=80",
      images: ["https://images.unsplash.com/photo-1585336261026-6757692e4ee3?auto=format&fit=crop&w=600&q=80"],
      description: "顺滑流畅不墨渗，大容量速干墨水，适合日常学习与考试办公。",
      is_put_on_sale: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "A5 精美硬面网格手帐本",
      price: 18.50,
      origin_price: 22.00,
      category_id: 2,
      stock: 150,
      thumb_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"],
      description: "192页防出血加厚纸张，网格内页布局，自带丝带书签与封底口袋。",
      is_put_on_sale: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "马卡龙双头柔光荧光笔 (6色套装)",
      price: 9.99,
      origin_price: 12.99,
      category_id: 1,
      stock: 300,
      thumb_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      images: ["https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"],
      description: "柔和色彩不伤眼，不透过纸张。斜头与圆头双头设计。",
      is_put_on_sale: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "天然榉木实木桌面笔筒收纳盒",
      price: 14.00,
      origin_price: 16.50,
      category_id: 3,
      stock: 80,
      thumb_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      images: ["https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"],
      description: "天然榉木打造，质感温润，适合收纳各类笔具与桌面小杂物。",
      is_put_on_sale: 1,
      created_at: new Date().toISOString()
    }
  ],
  orders: []
};

function readDb() {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, re-initializing:", err);
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDb(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readDb,
  writeDb,
  initialData
};
