
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
    title: String,          //标题
    content: String,        //文章内容
    poster: String,         //上传的图片
    pv: {type: Number, default: 0},    //浏览量
    createAt: { type: Date, default: Date.now() },      //创建时间
    comments: [                         //评论 数组类型因为会有很多评论
       {
        user: {type: mongoose.Schema.Types.ObjectId , ref: 'user'},
        content:String,
        createAt: {type: Date, default: Date.now}
       }
    ]
}))