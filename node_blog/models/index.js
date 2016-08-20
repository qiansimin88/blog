
//这里是数据库定义的模型的地方
var mongoose = require('mongoose')
//获取数据库地址
var dbconfig = require('../../config')
//连接数据库
var db = mongoose.connect(dbconfig.dbUrl)

db.connection.on('open', () => {
    console.log('数据库连接成功，配置地址是'+dbconfig.dbUrl)
})


//注册用户的模型
exports.User = db.model('user', new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String
}))


//发表文章
exports.Article = db.model('article', new mongoose.Schema({
    //是一个对象ID类型， 引用上面的user模型 为什么是objectId类型呢  因为user字段是必须是数据库里面的才可以  比较特殊 
    // 不是随意写的
    user: {type: mongoose.Schema.Types.ObjectId , ref: 'user'},
    title: String,
    content: String,
    createAt: { type: Date, default: Date.now() },
}))