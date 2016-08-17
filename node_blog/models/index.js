
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
    email: String
}))
