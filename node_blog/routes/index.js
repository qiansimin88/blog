var express = require('express');
//生成路由实例
var router = express.Router();
var models = require('../models')
var markdown = require('markdown').markdown
/* GET home page. */
router.get('/', function(req, res, next) {
  //获得session里面的user (登录过后session会存入user属性)  有的话登录了  没有的话 没登录
  //并且是从数据库取得  网页关掉也没关系


  //获得文章列表
  //因为articles集合里面的use字段是个字符串的objectID所有没什么用处可言
  //通过mongoose的自带的功能populate
 //先查找 然后把user字符串通过monggose自带的功能populate转成use对象
  models.Article.find({}).populate('user').exec((err, articles) => {
    if(err) {
      req.flash('eror', '网络出错')
      res.redirect('/')
    }else {
      //支持markdown
      articles.forEach((o, i) => {
        o.content = markdown.toHTML(o.content)
      })
      res.render('index', { articles: articles} );
    }
  })  
});

module.exports = router;
 