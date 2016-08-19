
//flase的原理

var req = {}

req.flash = function (key, value){
    if(value) {
        req[key] = value
    }else {
        return req[key]
    }
}

//赋值
req.flash('err', '失败')      
req.flash('success', '成功')

//取值
console.log(req.flash('err'))