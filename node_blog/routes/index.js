var express = require('express');
//生成路由实例
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //获得session里面的user (登录过后session会存入user属性)  有的话登录了  没有的话 没登录
  //并且是从数据库取得  网页关掉也没关系
  res.render('index', { title: 'Express'});
});

module.exports = router;
 