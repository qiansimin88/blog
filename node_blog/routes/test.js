var express = require('express')
var router = express.Router()

router.get('/http', (req, res, next) => {
    res.render('test/test')
})

router.post('/xhrrequest', (req, res, next) => {
    console.log(req.body)
    res.send('sSA')
})


module.exports = router