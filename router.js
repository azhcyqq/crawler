//const express = reqire('express');
//const app = new express();
//const router = app.Router();
const mongoose = require('mongoose')
const detail = require('./mongoose.js')
mongoose.connect('mongodb://localhost:27017/crawlerData');

router.get('/',function(req,res){
	
})

module.exports = router;

detail.find({},function(err,doc){
	console.log(doc)
})

//new detail({
//	az:'a',
//	uris:[1,2,3,4],
//	play:[1,2,3,4],
//	titles:[1,2,3,4],
//	name:'',
//	introduce:'',
//	tag:[1,2,3,4],
//	img:''
//}).save();
