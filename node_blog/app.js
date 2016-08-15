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
//主页路由
var routes = require('./routes/index');
//用户路由
var users = require('./routes/users');

var app = express();

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

//设置静态文件服务中间价
app.use(express.static(path.join(__dirname, 'public')));


//配置路由处理函数   /的走routers函数处理  /users的走users函数处理
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
