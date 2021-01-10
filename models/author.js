var moment = require('moment')
const mongoose = require('mongoose')
// 定义模式，创建模式实例
const Schema = mongoose.Schema
const AuthorSchema = new Schema({
  // mongoose内置验证器：require、number【min\max】 
  // ObjectId：表示数据库中某一模型的特定实例。例如，一本书可能会使用它来表示其作者对象。它实际只包含指定对象的唯一 ID（_id） 。可以使用 populate() 方法在需要时提取相关信息。
  first_name:{type:String,required:true,max:100},
  family_name:{type:String,required:true,max:100},
  date_of_birth:{type:Date},
  date_of_death:{type:Date}
})
// 虚拟属性是可以获取和设置、但不会保存到 MongoDB 的文档属性。getter 可用于格式化或组合字段，而 setter 可用于将单个值分解为多个值从而便于存储。
// 虚拟name
AuthorSchema.virtual('name').get(function () {
  return this.first_name+','+this.family_name
})

AuthorSchema.virtual('lifespan').get(function () {
  return (this.data_of_death.getYear()-this.date_of_birth.getYear()).toString() 
})
AuthorSchema
.virtual('span_time')
.get(function () {
  // return (this.data_of_death.getYear()-this.date_of_birth).toString().fomat('YYYY-MM-DD')
  if(this.date_of_birth&&this.data_of_death){
    return moment(this.date_of_birth).format('MMMM.do,YYYY')+'-'+moment(this.data_of_death).format('MMMM.do,YYYY')
  }else if(this.date_of_birth){
    return moment(this.date_of_birth).format('MMMM.do,YYYY')
  }
})
AuthorSchema
  .virtual('due_back_formatted')
  .get(function () {
    return moment(this.due_back).format('MMMM.do,YYYY')//Do是第几天
  });
AuthorSchema.virtual('url').get(function () {
  return '/catalog/author/'+this._id
})
// 创建模型
module.exports = mongoose.model('Author',AuthorSchema)