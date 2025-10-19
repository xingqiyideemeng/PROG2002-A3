const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const registrationsController = require('../controllers/registrationsController');

// 主页数据 - 获取当前和即将到来的活动
router.get('/events/home', eventsController.getHomeEvents);

// 搜索功能 - 根据条件筛选活动
router.get('/events/search', eventsController.searchEvents);

// 获取所有分类
router.get('/categories', eventsController.getCategories);

// 获取活动详情
router.get('/events/:id', eventsController.getEventDetails);

// 添加注册
router.post('/registrations', registrationsController.createRegistration);

// 获取指定 event 的所有注册
router.get('/registrations/event/:eventId', registrationsController.getRegistrationsByEvent);

module.exports = router;
