const  mongoose = require('mongoose');
const Schema = mongoose.Schema
// Models 是从 Schema 编译来的构造函数。 它们的实例就代表着可以从数据库保存和读取的 documents。 从数据库创建和读取 document 的所有操作都是通过 model 进行的。
const bookschema = new Schema({
  title:{type:String,required:true},
  // ref引用哪个模型的字段
  author:{type:Schema.Types.ObjectId,ref:"Author",required:true},
  summary:{type:String,required:true},
  isbn:{type:String,required:true},
  genre:[{type:Schema.Types.ObjectId,ref:'Genre'}]
})
bookschema.virtual('url').get(function () {
  return '/catalog/book/'+this._id
})

module.exports = mongoose.model('Book',bookschema)
