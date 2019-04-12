const express = require('express');
var bodyParser = require('body-parser');
const router = require('./router.js')
const app = new express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json())
app.use(router)

app.listen('9876',function(){
	console.log('服务器启动成功，接口可用')	
})
