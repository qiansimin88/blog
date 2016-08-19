var express = require('express');
var router = express.Router();

//数据库的模型
var Model = require('../models')
var Util = require('../../util')

/* GET users listing. */
//注册页面
router.get('/reg', function(req, res, next) {
   res.render('user/reg.html', { title: '注册' });
});
//接受注册的表单
router.post('/reg', function(req, res, next) {
    //post提价 有请求体 所以用req.body获得请求对象
    //MD5加密
    req.body.password = Util.md5(req.body.password)
    //保存到数据库有两张方法，model用create, entity用save
    Model.User.create(req.body, (err, doc) => {
      if(err) {
        req.flash('error', '用户注册失败')
        return console.log('保存失败了')
      }
      req.flash('success', '用户注册成功')
      console.log(`保存成功${doc}`)
      //跳转到登录页
      res.redirect('/users/login')
    })
});
//登录页面
router.get('/login', function(req, res, next) {
   res.render('user/login', { title: '登录' });
});

//登录时查询数据库
router.post('/login', (req, res, next) => {
  console.log(req.body)
  //加密为了和数据库已经加密的保持一致
  req.body.password = Util.md5(req.body.password)
  //在数据库中查询相应的usename和password 
  Model.User.findOne(req.body, (err, doc) => {
    if(err) {
      console.log(err)   
      req.flash('error', '用户登录失败')
      //出错就返回
      res.redirect('back')
    }else {
      //搜索到了就去首页
      if(doc) {
        //登录成功把查询到的user用户赋给session的user属性 因为有connect-mongo中间件 所以直接保存到数据库
        req.session.user = doc
        req.flash('success', '用户登录成功')
        res.redirect('/')
      }else {
        req.flash('error', '用户登录失败')
        //没搜索到 返回的是个Null  
        res.redirect('back')
      }
    }
  })
})

//退出
router.get('/logout', function(req, res, next) {
  req.session.user = null  //删除session的值 同时删除数据库的值
  req.flash('success', '退出登录成功')
  res.redirect('/')
});
 
module.exports = router;
