const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const registrationsController = require('../controllers/registrationsController');
const categoriesController = require('../controllers/categoriesController');

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

// 管理员获取所有事件
router.get('/admin/events', eventsController.getAllEvents);

// 添加事件
router.post('/admin/events', eventsController.createEvent);

// 更新事件
router.put('/admin/events/:id', eventsController.updateEvent);

// 删除事件
router.delete('/admin/events/:id', eventsController.deleteEvent);

// 查看所有注册
router.get('/admin/registrations', registrationsController.getAllRegistrations);

// 删除任意注册
router.delete('/admin/registrations/:id', registrationsController.deleteRegistration);

// 更新注册信息
router.put('/admin/registrations/:id', registrationsController.updateRegistration);

// 添加分类
router.post('/admin/categories', categoriesController.createCategory);

// 更新分类
router.put('/admin/categories/:id', categoriesController.updateCategory);

// 删除分类
router.delete('/admin/categories/:id', categoriesController.deleteCategory);

module.exports = router;
