const Author = require('../models/author')
const Book = require('../models/book')
var async =require('async')

const {body,validationResult,sanitizeBody} = require('express-validator') 

//显示完整作者列表
// exports.author_list = (req,res)=>{res.send('未实现：作者列表')}
exports.author_list = function (req,res,next) {
  Author.find()
  .sort([['family','ascending']])
  .exec(function (err,list_authors) {
    if(err){return next(err)}
    res.render('author_list',{title:'Author List',authors_list:list_authors})
  })
}
// 为每位作者显示详细信息的页面
exports.author_detail = (req,res) =>{
  async.parallel({
    author:cb=>{
      Author.findById(req.params.id)
      .exec(cb)
    },
    authors_books:cb=>{
      Book.find({'author':req.params.id},'title summary')
      .exec(cb)
    }
  },(err,result)=>{
    if(err){return next(err)}
    if(result.author==null){
      var err = new Error('Author not find')
      err.status = 404
      return next(err)
    }
    res.render('author_detail',{title:'Author Detail',author:result.author,author_books:result.authors_books})
  })
}
// 由get显示创建作者的表单
exports.author_create_get =(req,res)=>{res.render('author_form',{title:'Create Author'})}
// post处理作者创建操作
exports.author_create_post= [
  // 验证
  body('first_name').isLength({min:1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters'), //菊花链验证器
  body('family_name').isLength({min:1}).trim().withMessage('Family name must be specified.')
  .isAlphanumeric().withMessage('Family name has non-alphanumeric characters'), 
  body('date_of_birth','Invaild date of birth').optional({checkFalsy:true}).isISO8601(),//optional()函数是仅输入字段后运行验证
  body('date_of_death','Invaild date of death').optional({checkFalsy:true}).isISO8601(),
  // 消毒
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),
  // 请求
  (req,res,next)=>{
    const err = validationResult(req)
    if(!err.isEmpty()){
      // 有错误，将填充无误的部分填充到表单
      res.render('anthor_form',{title:'Create Author',author:req.body,errs:err.array()})
      return
    }else{
      // 无错误，创建新对象发送到接口
      var author = new Author({
        first_name:req.body.first_name,
        family_name:req.body.family_name,
        date_of_birth:req.body.date_of_birth,
        date_of_death:req.body.date_of_death
      })
      author.save(function (err) {
        if(err){return next(err)}
        res.redirect(author.url);//跳转详情页
      })
    }
  }
]

// post处理作者创建操作：只能删除未被book引用的author，如果是有book提示先删除book
exports.author_delete_get= (req,res,next)=>{
  async.parallel({
    author:cb=>Author.findById(req.params.id).exec(cb),
    authors_books:cb=>Book.findById({'author':req.params.id}).exec(cb)
  },(err,result)=>{
    if(err){return next(err)}
    if(result.author==null){
      //作者不存在就显示作者列表
      res.redirect('/catalog/authors')
    }
    res.render('author_delete',{title:'Delete Author',author:result.author,author_books:result.authors_books})
  }) 
}

// post处理删除操作
exports.author_delete_post =(req,res,next) =>{
  async.parallel({
    // 参数 post是req.body.属性  get是req.params.属性
    author:cb=>Author.findById(req.body.authorid).exec(cb),
    authors_books:cb=>Book.findById({'author':req.body.authorid}).exec(cb)
  },(err,result)=>{
    if(err){return next(err)}
    if(result.authors_books.length>0){
      // 有书渲染，不删除
      res.render('author_delete',{title:'Delete Author',author:result.author,author_books:result.authors_books})
      return
    }else{
      // 查到匹配文档然后删除
      Author.findByIdAndRemove(req.body.authorid,function deleteAuthor(err){
        if(err){return next(err)}
        res.redirect('/catalog/authors')
      })
    }
   })
}
// get 显示更新作者的表单
exports.author_update_get = (req,res)=>{res.send('未实现：作者更新表单的get')}
// post处理作者更新操作
exports.author_update_post = (req,res) =>{res.send('未实现：更新作者的post')}