let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crawlerData');
let Schema = mongoose.Schema;
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
})

module.exports = mongoose.model('Anime', crawlerData);
