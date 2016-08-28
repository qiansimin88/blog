var express = require('express');
var router = express.Router();
//权限控制中间件
var auth = require('../middleware/auth')

//数据库的模型
var Model = require('../models')
var Util = require('../../util')
//存储图片等的中间件
var path = require('path')
var multer = require('multer')
var imageStoreURL = path.join(__dirname,'../public','uploads')

var markdown = require('markdown').markdown

//指定存储目录和文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageStoreURL)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })


/* GET users listing. */
//注册页面
router.get('/reg', auth.noAuth, function(req, res, next) {
   res.render('user/reg.html', { title: '注册', 'urlPath':'reg'});
});
//接受注册的表单
router.post('/reg', auth.noAuth, function(req, res, next) {
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
router.get('/login', auth.noAuth, function(req, res, next) {
   res.render('user/login', { title: '登录' });
});

//登录时查询数据库
router.post('/login', auth.noAuth, (req, res, next) => {
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

// 个人信息
router.get('/userinfo', auth.needAuth, (req, res, next) => {
  var userId = req.session.user 
  Model.User.findById(userId, (err, result) => {
    if(err) {
      req.flash('error', '查询失败')
      res.redirect('/')
    }
   res.render('user/info.html', { info: result });
  })
})

// 修改个人信息(目前只有头像)
router.post('/updateuserinfo',upload.single('avatar'), auth.needAuth, (req, res, next) => {
  var userId = req.session.user 
  var avatar = req.body
 if(req.file) {
        //存储文件的路径  为什么是/uploads  以‘/’开头呢  因为设置了静态文件服务器  /就是设置的public
       avatar.avatar = '/uploads/'+req.file.filename
  }
  console.log(avatar)
  
  Model.User.update(userId,avatar,(err, result) => {
    if(err) {
      req.flash('error', '查询失败')
      res.redirect('/')
    }
      res.redirect('/')
  })
})



//退出
router.get('/logout', auth.needAuth, function(req, res, next) {
  req.session.user = null  //删除session的值 同时删除数据库的值
  req.flash('success', '退出登录成功')
  res.redirect('/')
});
 
module.exports = router;
