var express = require('express')

var router = express.Router()
//发表文章
router.get('/published', (req, res, next) => {
    res.render('published', {title: '发表文章'})
})
//导出
module.exports = router 