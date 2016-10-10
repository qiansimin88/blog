var express = require('express')
var router = express.Router()
var models = require('../models')
var path = require('path')
//存储图片等的中间件
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

//权限控制中间件
var auth = require('../middleware/auth')
//发表文章页面
router.get('/published',auth.needAuth, (req, res, next) => {
    res.render('article/add_article', {title: '发表文章', 'urlPath': 'published', detail:''})
})

//新增或者编辑的修改提交
router.post('/add',auth.needAuth, upload.single('poster'),(req, res, next) => {
    //用了upload.single()之后就有req.file得到上传的文件了
    var article = req.body
    var _id = article._id

    if(req.file) {
        //存储文件的路径  为什么是/uploads  以‘/’开头呢  因为设置了静态文件服务器  /就是设置的public
       article.poster = '/uploads/'+req.file.filename
    }
    //把session中的用户赋值给req.body
    article.user = req.session.user._id
    //编辑修改
    if(!!_id) {
        models.Article.update({_id: _id}, article, (err, doc) => {
            if(err) {
                req.flash('error', '文章更新失败')
            }else {
                req.flash('success', '文章更新成功')
                res.redirect('/')
            }
        })
    }else {
     //新加文章
        models.Article.create(article, (err, doc) => {
            if(err) {
                req.flash('error', '文章发表失败')
            }else {
                req.flash('success', '文章发表成功')
                res.redirect('/')
            }
        })
    }
})


//文章详情
router.get('/detail/:_id', (req, res, next) => {
    var id = req.params._id
    // console.log(id)
    //访问的时候pv增加   $inc累加
    models.Article.update({_id: id}, {$inc: {pv:1}}, (err, result) => {
    //根据ID查询    这个表的一个集合有两个user  所以要Populate两次
        models.Article.findById(id).populate('user').populate('comments.user').exec((err, doc) => {
            doc.content = markdown.toHTML(doc.content)
            res.render('article/article_detail', {
                detail: doc
            })
        })  
    })
})

//删除文章
router.get('/delete/:_id', (req, res, next) => {
    var id = req.params._id
    // console.log(id)
    //根据ID查询
    models.Article.remove({ _id: id }, (err, result) => {
        if(result) {
            req.flash('success', '删除成功')
            res.redirect('/')
        }
    })  
})

//编辑文章
router.get('/edit/:_id', (req, res, next) => {
   var id = req.params._id
    // console.log(id)
    //根据ID查询
    models.Article.findById(id, (err, doc) => {
        res.render('article/add_article', {
            detail: doc
        })
    })  
})



//文章评论
router.post('/comment', auth.needAuth, function (req, res) {
   var user = req.session.user;
    //$push数组类型 就是添加一条的意思

  models.Article.update({_id:req.body._id},
        {$push:{
            comments:{
                    user:user._id,
                    content:req.body.content
            }
        }},function(err,result){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
   });
});

//查看文章列表
router.get('/articleList', (req, res) => {
    var num = req.query.number
    models.Article.find({}, null, {limit: ~~num}, (err, resulte) => {
        if(err) {
            res.json({
                errMsg: 'search error',
                errCode: err.statusCode
            })
        }
        res.json({
            result: resulte
        })
    })
})

//导出
module.exports = router 