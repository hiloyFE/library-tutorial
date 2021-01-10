const book = require('../models/book')
const Genre = require('../models/genre')
var async = require('async');

// 验证表单
const {body,validationResult} = require('express-validator')
// 消毒处理：防止干扰信息传入
const {sanitizeBody} = require('express-validator');
const genre = require('../models/genre');

//显示完整作者列表
exports.genre_list = (req,res)=>{
  Genre
  .find()
  .exec(function (err,list_genres) {
    if(err){ return next(err)}
    res.render('genre_list',{title:'Genre List',genres_list:list_genres})
  })
}
// 为每位作者显示详细信息的页面
exports.genre_detail = (req,res) =>{
  async.parallel({
    genre:cb=>{
      Genre.findById(req.params.id)
      .exec(cb)
    },

    genre_books:cb=>{
      book.find({'genre':req.params.id})
      .exec(cb)
    }
  },(err,result)=>{
    if(err){return next(err)}
    if(result.genre==null){
      var err = new Error('Genre not found')
      err.status = 404
      return next(err)
    }
    res.render('genre_detail',{title:'Genre Detail',genre:result.genre,genre_books:result.genre_books})
  })
}
// 由get显示创建作者的表单
exports.genre_create_get =(req,res)=>{res.render('genre_form',{title:'Create Genre'})}
// post处理作者创建操作
// 模式：我们运行验证器，然后运行消毒器，然后检查错误，并使用错误信息重新呈现表单，或保存数据。
exports.genre_create_post= [
  // 验证名字不为空 body(字段,错误提示)
  body('name','Genre name required').isLength({min:1}).trim(),
  // 名字 消毒-去除多余空格、转译html
  sanitizeBody('name').trim().escape(),
  //中间件函数 ——提取验证的错误
  (req,res,next)=>{
    // 请求中的错误
    const err = validationResult(req)
    // 用消毒的数据创建新的Genre对象
    var genre = new Genre({name:req.body.name})
    if(!err.isEmpty()){//有错误,重新渲染函数
      res.render('genre_form',{title:'Create Genre',genre,errors:err.array()})
      return
    }else{
      // 数据有效，检测数据是否已经存在
      Genre.findOne({'name':req.body.name})
      .exec((err,result)=>{
        if(err){ return next(err) }
        if(result){//已存在就重定向
          res.redirect(result.url)
        }else{//不存在就保存新种类
          genre.save(function (err) {
            if(err){return next(err)}
            res.redirect(genre.url)
          })
        }
      })
    }
  }
]

// get处理作者删除操作
exports.genre_delete_get= (req,res)=>{res.send('未实现：创建表单的post')}
// post处理删除操作
exports.genre_delete_post =(req,res) =>{res.send('未实现：删除作者的post')}
// get 显示更新作者的表单
exports.genre_update_get = (req,res)=>{res.send('未实现：作者更新表单的get')}
// post处理作者更新操作
exports.genre_update_post = (req,res) =>{res.send('未实现：更新作者的post')}