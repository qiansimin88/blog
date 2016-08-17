//工具方法
var crypto = require('crypto')

//加密 MD5
exports.md5 = function (value) {
    return crypto.createHash('md5').update(value).digest('hex')
}