// 创建和设置express应用对象，
// require可以应用中间件，也可以引用node库
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog')
var app = express();

// view engine setup 选择pug模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// 调用中间件添加请求处理链
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 托管静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 处理路由+前缀
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog',catalogRouter);//访问藏书列表 的URL 为：/catalog/books/。

const mongoose = require("mongoose")
// process.env.MONGODB_URI从MONGODB_URI的环境变量中获取字符串【原本是硬编码】
const uri =process.env.MONGODB_URI|| "mongodb+srv://hiloy:12345msn@cluster0.tjrup.mongodb.net/library_db?retryWrites=true&w=majority";
mongoose.set('useNewUrlParser', true);
// 连接数据库
mongoose.connect(uri,{ useNewUrlParser: true,useUnifiedTopology: true })
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection
// 将连接绑定错误时间已获得提示
db.on('error',console.error.bind(console,'MongoDB连接错误'))
// 定义一个模式
// var Schema = mongoose.Schema; 
// var SomeModelSchema = new Schema({
//     a_string: String,
//     a_date: Date
// });
// // 使用模式“编译”模型
// const SomeModel = mongoose.model('SomeModel', SomeModelSchema);
// const schema = new Schema(
//   {
//     name: String,
//     binary: Buffer,
//     living: Boolean,
//     updated: { type: Date, default: Date.now },
//     age: { type: Number, min: 18, max: 65, required: true },
//     mixed: Schema.Types.Mixed,
//     _someId: Schema.Types.ObjectId,
//     array: [],
//     ofString: [String], // 其他类型也可使用数组
//     nested: { stuff: { type: String, lowercase: true, trim: true } }
//   })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
