var express = require('express')
var router = express.Router()
var models = require('../models')
//权限控制中间件
var auth = require('../middleware/auth')
//发表文章页面
router.get('/published',auth.needAuth, (req, res, next) => {
    res.render('article/add_article', {title: '发表文章', 'urlPath': 'published'})
})

//发表文章
router.post('/add',auth.needAuth, (req, res, next) => {
    var article = req.body

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