const express = require('express')
const router = express.Router()

// 导入控制器模块
const book_controller = require('../controllers/bookController')
const author_controller = require('../controllers/authorController')
const genre_controller = require('../controllers/genreController')
const book_instance_controller = require('../controllers/bookinstanceController')

// 藏书路由
// 藏书编目主页
router.get('/',book_controller.index)
// get添加新藏书，此项必须位于显示藏书的路由(使用了id)之前
router.get('/book/create',book_controller.book_create_get)
// post添加新藏书
router.post('/book/create',book_controller.book_create_post)
// get删除藏书
router.get('/book/:id/delete',book_controller.book_delete_get)
// post删除藏书
router.post('/book/:id/delete',book_controller.book_delete_post)
// get更新藏书
router.get('/book/:id/update',book_controller.book_update_get)
// post更新藏书
router.post('/book/:id/update',book_controller.book_update_post)
// get请求藏书
router.get('/book/:id',book_controller.book_detail)
// get请求完整藏书列表
router.get('/books',book_controller.book_list)

// 藏书副本 
// get添加新藏书，此项必须位于显示藏书的路由(使用了id)之前
router.get('/bookinstance/create',book_instance_controller.book_instance_create_get)
// post添加新藏书
router.post('/bookinstance/create',book_instance_controller.book_instance_create_post)
// get删除藏书
router.get('/bookinstance/:id/delete',book_instance_controller.book_instance_delete_get)
// post删除藏书
router.post('/bookinstance/:id/delete',book_instance_controller.book_instance_delete_post)
// get更新藏书
router.get('/bookinstance/:id/update',book_instance_controller.book_instance_update_get)
// post更新藏书
router.post('/bookinstance/:id/update',book_instance_controller.book_instance_update_post)
// get请求藏书
router.get('/bookinstance/:id',book_instance_controller.book_instance_detail)
// get请求完整藏书列表
router.get('/bookinstances',book_instance_controller.book_instance_list)


// 藏书种类
router.get('/genre/create',genre_controller.genre_create_get)
// post添加新藏书
router.post('/genre/create',genre_controller.genre_create_post)
// get删除藏书
router.get('/genre/:id/delete',genre_controller.genre_delete_get)
// post删除藏书
router.post('/genre/:id/delete',genre_controller.genre_delete_post)
// get更新藏书
router.get('/genre/:id/update',genre_controller.genre_update_get)
// post更新藏书
router.post('/genre/:id/update',genre_controller.genre_update_post)
// get请求藏书
router.get('/genre/:id',genre_controller.genre_detail)
// get请求完整藏书列表
router.get('/genres',genre_controller.genre_list)

// 作者
router.get('/author/create',author_controller.author_create_get)
// post添加新藏书
router.post('/author/create',author_controller.author_create_post)
// get删除藏书
router.get('/author/:id/delete',author_controller.author_delete_get)
// post删除藏书
router.post('/author/:id/delete',author_controller.author_delete_post)
// get更新藏书
router.get('/author/:id/update',author_controller.author_update_get)
// post更新藏书
router.post('/author/:id/update',author_controller.author_update_post)
// get请求藏书
router.get('/author/:id',author_controller.author_detail)
// get请求完整藏书列表
router.get('/authors',author_controller.author_list)

module.exports= router