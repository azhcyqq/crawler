const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const detail = require('./mongoose.js')
mongoose.connect('mongodb://localhost:27017/crawlerData');

router.get('/getAnime',function(req,res){
	console.log(req.params)
	let name = req.query.name;
	console.log(name)
	detail.find({"name":name},function(err,data){
		console.log(data)
//		res.end(data)
	})
})

router.get('/tag',function(req,res){
	detail.distinct('tag',{},function(idontknow,data){
		console.log(data)
//		res.end(data)
	})
})
module.exports = router;
//使用到的数据库操作方式
//仅返回查询键值
//detail.find({},'键值名',function(err,data){
//	console.log(data)
//})
//去重，获取标签
//detail.distinct("tag",{},function(req,res){
//	console.log(res)
//})
//aggregate组排序
//detail.aggregate([{ $group:{_id:"$az",num:{$sum:1}}},{ $sort:{ num:1 } }]).exec(function(err,res){
//	console.log(res)
//})
//模糊查找(以正则形式)
//detail.find({name:'/'+name+'/g'},function(err,data){
//	console.log(data)
//})
//或者
//let reg = name;
//detail.find({name:{$regex:reg,$option:'i'}},function(err,data){
//	console.log(data)
//})
