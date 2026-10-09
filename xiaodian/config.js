let localConfig = {};
try {
  localConfig = require('./config.local.js');
} catch (e) {
  // 无本地私有文件时降级使用示例模板
  localConfig = require('./config.example.js');
}

module.exports = localConfig;
