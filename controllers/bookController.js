// 引入models:由mongoose.Schema编译出来的构造函数，其实力代表可以冲数据库保存和读取documents。
var Book = require('../models/book')
var Author = require('../models/author')
var Genre = require('../models/genre')
var BookInstance = require('../models/bookinstance')
var async = require('async')
const {body,validationResult ,sanitizeBody}=require('express-validator')

exports.index= (req,res)=> {
  async.parallel({
    book_count:function (callback) {
      Book.count({},callback)
    },
    book_instance_count:function (callback) {
      BookInstance.count({},callback)
    },
    book_instance_availiable_count:function (callback) {
      BookInstance.count({status:'Available'},callback)
    },
    author_count:function (callback) {
      Author.count({},callback)
    },
    genre_count:function (callback) {
      Genre.count({},callback)
    }
  },function (err,results) {
    res.render('index',{title:'Local Library Home',error:err,data:results})
  })
}

// exports.index = (req,res)=>{res.send('未实现：站点首页')}
//显示完整作者列表
exports.book_list= (req,res,next)=> {
  // 查询：findOne()单个文件 find()是文档列表 count()是文档数量 update()是被修改的文档数量
  // 填充：popular()自动替换指定字段，可以填充document、纯对象3
  console.log(123); 
  // Author.find({}).exec(function (err,list) {
  //   console.log(list,999);
  // })
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    }); 
}

exports.book_detail = (req,res,next) =>{
  console.log(req.params.id);
  async.parallel({
       
    book:cb=>{
      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(cb)
    },
    book_instance:cb=>{
      BookInstance.find({'book':req.params.id})
      .exec(cb)
    }
  },(err,results)=>{
    if(err){return next(err)}
    if(results.book==null){
      var err = new Error('Book not found')
      err.status = 404
      return next(err)
    }
    console.log(results);
    res.render('book_detail',{title: 'Title', book: results.book, book_instances: results.book_instance}) 
  })
}
// 由get显示创建作者的表单
exports.book_create_get =(req,res,next)=>{
  async.parallel({//获取信息时，有链接到其他表单ref的属性时使用
    authors:cb=> {
      Author.find(cb)
    },
    genres:function (cb) {
      Genre.find(cb)
    }
  },(err,result)=>{//result包含parallel的两个变量
    if(err){return next(err)} 
    res.render('book_form',{title:'Create Book',authors:result.authors,genres:result.genres})
  })
}
// post处理作者创建操作
exports.book_create_post= [
  (req,res,next)=>{
     //genre是数组，但数据库返回的是字符串，要转化为数组才能验证
    if(!(req.body.genre instanceof Array)){
      if(typeof req.body.genre === 'undefined')
      req.body.genre=[]
      else 
      req.body.genre= new Array(req.body.genre)
    }
    next()
  },
  // 验证
  body('title','Title must not be empty.').isLength({min:1}).trim(),
  body('author','Author must not be empty.').isLength({min:1}).trim(),
  body('summary','Summary must not be empty.').isLength({min:1}).trim(),
  body('isbn','ISBN must mot be empty').isLength({min:1}).trim(),
  // 消毒
  sanitizeBody('*').trim().escape(),//通配符一次性匹配
  sanitizeBody('genre.*').escape(),//对于数组内部属性要通配符验证
  // 请求
  (req,res,next)=>{
    const err = validationResult(req)
    var book = new Book({
      title:req.body.title,
      author:req.body.author,
      summary:req.body.summary,
      isbn:req.body.isbn,
      genre:req.body.genre
    })
    if(!err.isEmpty()){
      // 获取关联表的信息
      async.parallel({
        authors:cb=>{
          Author.find(cb)
        },
        genres:cb=>{
          Genre.find(cb)
        }
      },(err,result)=>{
        if(err){return next(err)}
        // 标记已经检查过的种类，添加checked=‘true’参数
        for(let i = 0;i<result.genres.length;i++){
          if(book.genre.indexOf(results.genres[i]._id)>-1){
            result.genres[i].checked='true'
          }
        }
        res.render('book_form',{title:'Create Book',authors:result.authors,genres:result.genres,book:book,errs:errors.Array()})
      })
    }else{
      // 保存数据
      book.save(err=>{
        if(err){return next(err)}
        res.redirect(book.url)
      })
    }
  }
]
// get处理删除操作
exports.book_delete_get =(req,res) =>{res.send('未实现：删除作者的get')}
// post处理删除操作
exports.book_delete_post =(req,res) =>{res.send('未实现：删除作者的post')}
// get 显示更新作者的表单
exports.book_update_get = (req,res,next)=>{
  async.parallel({
    book:cb=>Book.findById(req.params.id).populate('author').populate('genre').exec(cb),
    authors:cb=>Author.find(cb),
    genres:cb=>Genre.find(cb)
  },(err,result)=>{
    if(err){return next(err)}
    if(result.book==null){
      var err = new Error('book not found')
      err.status = 404
      return next(err)
    }
    // 标记选中的种类
    for(var all_g_iter=0;all_g_iter<result.genres.length;all_g_iter++){
      for(var book_g_iter=0;book_g_iter<result.book.genre;book_g_iter++){
        if(result.genres[all_g_iter]._id.toString()==result.book.genre[book_g_iter]._id.toString()){
          results.genres[all_g_iter].checked='true'
        }
      }
    }
    res.render('book_form',{title:'update book',authors:result.authors,genres:result.genres,book:result.book})
  })
}
// post处理作者更新操作
exports.book_update_post = [
  // 将genre由string转化为数组
  (req,res,next)=>{
    console.log(req.body,777);
    if(!(req.body.genre instanceof Array)){
      if(typeof req.body.genre ==='undefined')
      req.body.genre=[]
      else 
      req.body.genre = new Array(req.body.genre)
    }
    next()
  },
  // 验证表单
  body('title','Title must not be empty.').isLength({min:1}).trim(),
  body('author','Author must not be empty.').isLength({min:1}).trim(),
  body('summary','summary must not be empty.').isLength({min:1}).trim(),
  body('isbn','isbn must not be empty.').isLength({min:1}).trim(),
  // 消毒
  sanitizeBody('title').trim().escape(),
  sanitizeBody('author').trim().escape(),
  sanitizeBody('summary').trim().escape(),
  sanitizeBody('isbn').trim().escape(),
  sanitizeBody('genre.*').trim().escape(),
  // 请求
  (req,res,next)=>{
    const err = validationResult(req)
    console.log(req.body,9900);
    var book =new Book({
      title:req.body.title,
      author:req.body.author,
      summary:req.body.summary,
      isbn:req.body.isbn,
      genre:(typeof req.body.genre === 'undefined') ? []:req.body.genre,
      _id:req.params.id
    })
    if(!err.isEmpty()){ 
      // 有错误的时候，渲染消毒后的信息
      async.parallel({
        authors:cb=>{
          Author.find(cb)
        },
        genres:cb=>{
          Genre.find(cb)
        }
      },(err,result)=>{
        console.log(result,556);
        if(err){return next(err)}
        for(let i=0;i<result.genre[i]._id;i++){
          if(book.genre.indexOf(result.genres[i]._id)>-1){
            result.genres[i].checked='true'
          }
        }
        res.render('book_form',{title:'Update Book',authors:result.authors,genres:result.genres,book,error:err.array()})
      })
    }else{
      // 数据有效，更新记录 req.params.id和req.body._id一致
      // findByIdAndUpdate(id,option,callback)根据id查询，传递option通过cb执行
      Book.findByIdAndUpdate(req.params.id,book,{},(err,result)=>{
        console.log(result,334);
        if(err){return next(err)}
        res.redirect(result.url)
      })

    }
  }
]
