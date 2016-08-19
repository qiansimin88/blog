//权限控制  不同的路由 需要不同的权限   这里写中间件

//登陆后才可以访问
exports.needAuth = function (req, res, next) {
    if(!!req.session.user) {
        next()
    }else {
        req.flash('error', '当前页面必须登录才可以访问')
        res.redirect('/users/login')
    }
}

//未登录才可以看到的页面
exports.noAuth = function (req, res, next) {
    if(!!!req.session.user) {
        next()
    }else {
        req.flash('error', '当前页面必须未登录才可以访问')
        res.redirect('/')
    }
}