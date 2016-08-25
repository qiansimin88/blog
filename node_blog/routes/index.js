var express = require('express');
//生成路由实例
var router = express.Router();
var models = require('../models')
var markdown = require('markdown').markdown
/* GET home page. */
router.get('/', function(req, res, next) {
  //文章的分页
  var pageNum = req.query.pageNum || 1
  var pageSize = req.query.pageSize || 3
  //搜索关键字
  var searchword = req.query.searchword
  //创建一个过滤对象 给monggse使用
  var queryObj = {}
  if(searchword) {
    queryObj['title'] = new RegExp(searchword,'i')
    //关键字存入session方便每个页面都能使用  数据持久化
    req.session.searchword = searchword
    //同时给模板赋值
    res.locals.searchword = req.session.searchword
  }
  //获得session里面的user (登录过后session会存入user属性)  有的话登录了  没有的话 没登录
  //并且是从数据库取得  网页关掉也没关系


  //获得文章列表
  //因为articles集合里面的use字段是个字符串的objectID所有没什么用处可言
  //通过mongoose的自带的功能populate
 //先查找 然后把user字符串通过monggose自带的功能populate转成use对象
  models.Article.find(queryObj).skip(~~(pageNum-1)*pageSize).limit(~~pageSize).populate('user').exec((err, articles) => {
    if(err) {
      console.log(err)
      req.flash('eror', '网络出错')
    }else {
       //支持markdown
      articles.forEach((o, i) => {
        o.content = markdown.toHTML(o.content)
      })
      //取得查询出来的总数量
      models.Article.count(queryObj, function (err, count) {
         res.render('index', { 
           articles: articles,
           totalPage: Math.ceil(count / pageSize),    //总共多少页
           pageNum: ~~pageNum,   //当前页
           pageSize: ~~pageSize   //每页的条数
          });
      })
    }
  })  
});

module.exports = router;
 