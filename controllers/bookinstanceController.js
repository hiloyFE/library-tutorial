const BookInstace = require('../models/bookinstance')

const {body,validationResult,sanitizeBody} = require('express-validator')
const Book = require('../models/book')
// 书籍详情

//显示完整作者列表
exports.book_instance_list=function (req,res,next) {
  BookInstace.find()
  .populate('book')
  .exec(function (err,list_bookinstance) {
    console.log(list_bookinstance);
    if(err){return next(err)}
    // render(模板名,数据)
    res.render('bookinstance_list',{title:'Book Instance List',book_instance_list:list_bookinstance})
  })
}
// exports.book_instance_list = (req,res)=>{res.send('未实现：作者列表')}
// 为每个类型显示详细信息的页面
exports.book_instance_detail = (req,res) =>{
  BookInstace.findById(req.params.id)
  .populate('book')
  .exec((err,result)=>{
    if(err){return next(err)}
    if(result==null){
      var err = new Errow('Book copy not found')
      err.status = 404
      return next(err)
    }
    res.render('bookinstance_detail',{title:'Book:',bookinstance:result})
  })
}
// 由get显示创建作者的表单
exports.book_instance_create_get =(req,res,next)=>{
  Book.find({},'title')
  .exec((err,books)=>{
    if(err){return next(err)}
    res.render('bookinstance_form',{title:'Create BookInstance',book_list:books})
  })
}
// post处理作者创建操作
exports.book_instance_create_post= [
  // 验证
  body('book','Book must be specified').isLength({min:1}).trim(),
  body('imprint','imprint must be specified').isLength({min:1}).trim(),
  body('due_back','Invail date').optional({ checkFalsy:true }).isISO8601(),
  // 消毒
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),
  // 请求
  (req,res,next)=>{
    const err = validationResult(req)
    const {book,imprint,status,due_back}= req.body
    var bookinstance = new BookInstace({
      book,imprint,status,due_back
    })
    if(!err.isEmpty()){
      Book.find({},'title')
      .exec((err,result)=>{
        if(err){return next(err)}
        res.render("bookinstance_form",{title:'Create BookInstance',book_list:result,selected_book:bookinstance.book._id,errs:err.Array(),bookinstance})
      })
      return
    }else{
      bookinstance.save(err=>{
        if(err){return next(err)}
          res.redirect(bookinstance.url)
        })
      }
    } 
]
// get处理作者删除操作
exports.book_instance_delete_get= (req,res)=>{res.send('未实现：创建表单的post')}
// post处理删除操作
exports.book_instance_delete_post =(req,res) =>{res.send('未实现：删除作者的post')}
// get 显示更新作者的表单
exports.book_instance_update_get = (req,res)=>{res.send('未实现：作者更新表单的get')}
// post处理作者更新操作
exports.book_instance_update_post = (req,res) =>{res.send('未实现：更新作者的post')}