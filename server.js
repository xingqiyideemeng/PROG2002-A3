const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 修复路径配置
app.use(express.static(path.join(__dirname, '/client')));

// API 路由
app.use('/api', apiRoutes);

// 路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/pages/search.html'));
});

app.get('/event-details', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/pages/event-details.html'));
});

// 404 错误处理
app.use((req, res) => {
    res.status(404).send('页面未找到');
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 事件详情页面路由
app.get('/event-details', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/pages/event-details.html'));
});

// 处理事件详情API
app.get('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    // 这里调用您的事件详情控制器
    eventsController.getEventDetails(req, res);
});
