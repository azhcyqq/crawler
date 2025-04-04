const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const detail = require('./mongoose.js')
const userSave = require('./user.js')
const userGet = require('./users.js')
mongoose.connect('mongodb://localhost:27017/anime');

router.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})
router.get('/getAnime',function(req,res){
	let name = new RegExp(req.query.name,"ig");
	let num = req.query.num;
	if(!!num){
		detail.find({},function(err,data){
			res.send(data)
			res.end();
		}).limit(num*1)
	}else if(!!name){
		detail.find({"name":name},function(err,data){
			res.send(data);
			res.end();
		})
	}else{
		detail.find({},function(err,data){
			res.send(data);
			res.end();
		}).limit(35)
	}
//	detail.find({"name":name},function(err,data){
})

router.get('/getCount',function(req,res){
	let tag = req.query.tag;
	detail.find({"tag":tag}).count(function(err,data){
		res.send({page:data});
		res.end();
	})
})

router.get('/gethottag',function(req,res){
	let tag = req.query.tag;
	detail.find({"tag":tag,"hot":1},function(err,data){
		res.send(data);
		res.end();
	}).limit(10)
})

router.get('/getTag',function(req,res){
	detail.distinct('tag',{},function(idontknow,data){
		console.log(data)
		res.send(data);
		res.end();
	})
})

router.get('/findTag',function(req,res){
	let skip = req.query.skip;
	let tag = req.query.tag;
	detail.find({"tag":tag},function(err,data){
		res.send(data);
		res.end();
	}).limit(20).skip(skip*20)
})

router.get('/findAlike',function(req,res){
	let tag = req.query.tag;
	detail.find({"tag":tag},function(err,data){
		res.send(data);
		res.end();
	}).limit(9)
})
router.get('/getlunbo',function(req,res){
	let num = req.query.num;
	if(!!!num){
		num=9
	}
	detail.aggregate([{$sample:{size:num*1}}]).exec(function(err,data){
		res.send(data);
		res.end();
	})
})

router.get('/gethot',function(req,res){
	let small = req.query.small;
	let num = small==1?15:6;
	let page = small==1?req.query.page:0;
	detail.find({"hot":1},function(err,data){
		res.send(data);
		res.end();
	}).limit(num*1).skip(page*10)
})


router.get('/getRank',function(req,res){
	detail.$where('this.rank>0').sort({'rank':-1}).limit(100).exec(function(err,data){
		res.send(data);
		res.end();
	})
})

router.get('/getweek',function(req,res){
	let dateWeek=[1,2,3,4,5,6,7]
	let num = 38;
	detail.find({"date":{$in:dateWeek}},function(err,data){
		res.send(data);
		res.end();
	}).limit(num)
})

router.get('/getsmallname',function(req,res){
	let reg = new RegExp(req.query.regname)
	detail.find({smallname:reg},function(err,data){
		res.send(data);
		res.end();
	}).limit(35)
})

router.get('/getaz',function(req,res){
	let az = req.query.az;
	detail.find({"az":az},function(err,data){
		res.send(data);
		res.end();
	})
})

router.post('/regiest',function(req,res){
	let body = req.body;
	console.log(body)
	new userSave({
		username:body.username,
		password:body.password,
		phone:body.phone,
		favority:body.favority
	}).save((err)=>{
		if(err){
			res.send({"ok":false})
			res.end();
		}
		res.send({"ok":true})
		res.end();
	})
})

router.get('/unitsure',function(req,res){
	let username = req.query.username;
	userGet.find({username:username},function(err,data){
		res.send(data)
		res.end();
	})
})

router.post('/login',function(req,res){
	let body = req.body;
	userGet.find({'username':body.username,'password':body.password},function(err,data){
		console.log(data)
		res.send(data);
		res.end();
	})
})

router.post('/getAnimeById',function(req,res){
	let id = req.body.id;
	detail.find({"unitID":{$in:id}},function(err,data){
		res.send(data);
		res.end();
	})
})
router.post('/update',function(req,res){
	let body = req.body;
	let name = req.query.name;
	if(name == undefined){
		name = body.username	
	}
	console.log(body)
	console.log(name)
	userGet.findOneAndUpdate({'username':body.username},{ $set: {username:name,phone:body.phone,favority:body.favority,collections: body.collections,seebefore: body.seebefore }},function(err,data){
		console.log(data)
		res.end();
	})
})

router.post('/gettuijian',function(req,res){
	let user = req.body;
	let i = Math.floor(Math.random()*10)
	detail.find({"tag":{$in:user.favority}},function(err,data){
		console.log(data)
		res.send(data);
		res.end();
	}).limit(10).skip(10*i)
})


router.post('/addComment',function(req,res){
	let body = req.body;
	console.log(body)
	detail.findOneAndUpdate({"unitID":body.unitID},{ $set:{"comment":body.comment} },function(data){
		console.log(data)
		res.end();
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
//获取总数
//detail.find({"tag":tag}).count(function(err,data){
//	console.log(data)
//})


//for(let i=0;i<2283;i++){
//	db.animes.update({},$set:{hot:Math.round(Math.random()*3)},{multi:false})
//}
