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
	}
},{
	collection:'animes'
})

module.exports = mongoose.model('Anime', crawlerData);