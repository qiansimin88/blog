//第三方加密模块
var crypto = require('crypto')

//生成md5算法
var md5 = crypto.createHash('md5')


    //md5算法
    // 1.不同的输入产生不同的输出
    // 2.相同的输入一定会产生相同的输出
    // 3.从输出的摘要中无法推算出原始的值

//生成摘要 通过update来添加需要加密的字段 可以连续添加   通过digest来最后生成 hex表示16进制
var result =  md5.update('啊实打实的1').update('2').digest('hex')

console.log(result)
