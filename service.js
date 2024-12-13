const Service = require('D:/nodejs/node_global/node_modules/node-windows').Service;
// 创建一个新的服务对象
const svc = new Service({
  name: 'MyNodeApp',
  description: 'My Node.js Application',
  script: 'C:\\HOMEPAGE\\proj\\eshop\\bin\\www' // 替换为你项目的启动脚本路径
});

// 监听安装事件
svc.on('install', function () {
  svc.start();
});

// 安装服务
svc.install();