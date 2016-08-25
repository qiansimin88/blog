var express = require('express')
var router = express.Router()
var models = require('../models')
var path = require('path')
//存储图片等的中间件
var multer = require('multer')
var imageStoreURL = path.join(__dirname,'../public','uploads')
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

//权限控制中间件
var auth = require('../middleware/auth')
//发表文章页面
router.get('/published',auth.needAuth, (req, res, next) => {
    res.render('article/add_article', {title: '发表文章', 'urlPath': 'published'})
})


router.post('/add',auth.needAuth, upload.single('poster'),(req, res, next) => {
    //用了upload.single()之后就有req.file得到上传的文件了
    var article = req.body
    if(req.file) {
        //存储文件的路径  为什么是/uploads  以‘/’开头呢  因为设置了静态文件服务器  /就是设置的public
       article.poster = '/uploads/'+req.file.filename
    }
    //把session中的用户赋值给req.body
    article.user = req.session.user._id
    models.Article.create(article, (err, doc) => {
        if(err) {
            req.flash('error', '文章发表失败')
        }else {
            req.flash('success', '文章发表成功')
            res.redirect('/')
        }
    })
})
//导出
module.exports = router 