const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let crawlerData = new Schema({
	az:{
		type:String,
		index:true
	},
	uris:{
		type:Array,
	},
	play:{
		type:Array,
	},
	titles:{
		type:Array,
	},
	smallname:{
		type:String,
		index:true
	},
	name:{
		type:String,
		index:true
	},
	introduce:{
		type:String,
	},
	img:{
		type:String,
	},
	tag:{
		type:Array,
		index:true
	},
	hot:{
		type:Number
	},
	date:{
		type:Number
	},
	rank:{
		type:Number
  	},
  	unitID:{
    	type:Number
  	},
  	comment:{
  		type:Array,
  	}
},{
	collection:'animes'
})

module.exports = mongoose.model('Anime', crawlerData);
