const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// 主页数据 - 获取当前和即将到来的活动
router.get('/events/home', eventsController.getHomeEvents);

// 搜索功能 - 根据条件筛选活动
router.get('/events/search', eventsController.searchEvents);

// 获取所有分类
router.get('/categories', eventsController.getCategories);

// 获取活动详情
router.get('/events/:id', eventsController.getEventDetails);

module.exports = router;