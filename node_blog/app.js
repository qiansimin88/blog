var express = require('express');
var path = require('path');
//处理收藏夹图标
var favicon = require('serve-favicon');
//写日志的中间件
var logger = require('morgan');
//解析cookie req.cookie属性存放客户端提交过来的cookie
//res.cookie(key, value)写回客户端
var cookieParser = require('cookie-parser');
//处理请求体 req.body 存放post的请求体
var bodyParser = require('body-parser');
//引入session中间件 req.session
var session = require('express-session')
//引入mongo链接中间件 把session传入  存入session的时候 就会保存到数据库了
var MongoStrore = require('connect-mongo')(session)
//flash模块
var flash = require('connect-flash')

var config = require('../config')
//主页路由
var routes = require('./routes/index');
//用户路由
var users = require('./routes/users');
//文章的路由
var articles = require('./routes/articles');

//test
var tests = require('./routes/test')

var app = express();

//设置开发环境
app.set('env', process.env.ENV)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//指定html模板的渲染引擎
app.engine('html', require('ejs').__express)

// uncomment after placing your favicon in /public 有图标的话就把下面这行取消注释
app.use(favicon(path.join(__dirname, 'public', 'images', 'logo.ico')));
//日志记录中间件 打印到控制台的
app.use(logger('dev'));

//解析请求体

//处理content-type = json的请求体
app.use(bodyParser.json());
//处理content-type = urlencoded的请求体 
app.use(bodyParser.urlencoded({ extended: false }));

//处理cookie的中间件 req.cookie res.cookie(key, value)
app.use(cookieParser());
app.use(session({
  secret: 'qsm',  
  resave:true,    //每次响应结束都保存
  saveUninitialized:true,  //保存新创建但未初始化的
  store: new MongoStrore({  //指定session存储的位置
    url: config.dbUrl    //指定数据库的路径
  })
}))

//依赖session  必须写在session模块的后面
app.use(flash())
 //注入session到模板的中间件
 //获得session里面的user (登录过后session会存入user属性)  有的话登录了  没有的话 没登录
  //并且是从数据库取得  网页关掉也没关系
app.use((req, res, next) => {
  //res.local就是渲染模板的时候给模板的对象
  res.locals.isLogin = req.session.user
  res.locals.success = req.flash('success').toString()
  //每个页面都设置空的搜索字段 防止报错
  res.locals.searchword = '' 
  res.locals.error = req.flash('error').toString()
  next()
})  


//设置静态文件服务中间价
app.use(express.static(path.join(__dirname, 'public')));



//设置html的头部activeclass中间件
app.use((req, res, next) => {
  var activeActive = req.originalUrl
  res.locals.activeActive = activeActive
  next()
})


//配置路由处理函数   /的走routers函数处理  /users的走users函数处理
app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);
app.use('/test', tests);




// 捕获404并转发到错误处理中间件
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理  因为NExt只会向下一个中间件跳转  所有执行了开发时的时候就不会执行生成环境的错误处理了
// 除非开发环境下的中间件  也有netx（）

//开发时的错误处理
// 打印出错误的堆栈  
if (app.get('env') === 'development') {
  //错误处理中间件 有四个参数    

  //如果有中间件出错 会把请求交给错误处理中间件处理
  app.use(function(err, req, res, next) {
    //设置中间件
    res.status(err.status || 500);
    //渲染模板
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生成环境下的错误处理
// 不向用户保罗错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}   //不显示错误信息
  });
});


module.exports = app;
