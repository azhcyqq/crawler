let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crawlerData');
let Schema = mongoose.Schema;
let crawlerData = new Schema({
	az:{
		type:String
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
	},
	introduce:{
		type:String,
	},
	img:{
		type:String,
	},
	tag:{
		type:Array,
	}
})

module.exports = mongoose.model('Anime', crawlerData);
