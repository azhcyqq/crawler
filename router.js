const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const detail = require('./mongoose.js')
mongoose.connect('mongodb://localhost:27017/crawlerData');

router.get('/anime/:name',function(req,res){
	console.log(req.params)
	let name = req.params.name;
	detail.find({"name":name},function(err,data){
		console.log(data)
	})
})

router.get('/tag',function(req,res){
	detail.distinct('tag',{},function(idontknow,data){
		console.log(data)
		res.end(data)
	})
})

router.get('/baidu.com',function(req,res){
	console.log(req.query)
})
//
module.exports = router;
//仅返回查询键值
//detail.find({},'键值名',function(err,doc){
//	console.log(doc)
//})
//去重，获取标签
//detail.distinct("tag",{},function(req,res){
//	console.log(res)
//})
//for(let i=0;i<100;i++){
//	new detail({
//		az:'a',
//		uris:[1,2,3,4],
//		play:[1,2,3,4],
//		titles:[1,2,3,4],
//		name:'',
//		introduce:'',
//		tag:[i%2,i%3],
//		img:''
//	}).save();
//
//}
