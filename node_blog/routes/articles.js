var express = require('express')
var router = express.Router()
//权限控制中间件
var auth = require('../middleware/auth')
//发表文章
router.get('/published',auth.needAuth, (req, res, next) => {
    res.render('published', {title: '发表文章', 'urlPath': 'published'})
})
//导出
module.exports = router 