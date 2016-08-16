var express = require('express');
var router = express.Router();

/* GET users listing. */
//注册
router.get('/reg', function(req, res, next) {
   res.render('user/reg.html', { title: '注册' });
});
//接受注册的表单
router.post('/reg', function(req, res, next) {
    var userInfo = req.body
});
//登录
router.get('/login', function(req, res, next) {
   res.render('login', { title: '登录' });
});
//退出
router.get('/logout', function(req, res, next) {
   res.render('logout', { title: '退出' });
});

module.exports = router;
