let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/crawlerDatanew');
let Schema = mongoose.Schema;
let userInfo = new Schema({
  username:{
    type:String
  },
  password:{
    type:String
  },
  phone:{
    type:Number
  },
  collections:{
    type:Array,
    default:[]
  },
  later:{
    type:Array,
    default:[],
  },
  seebefore:{
    type:Array,
    default:[]
  },
  summit:{
    type:Array,
    default:[]
  },
  favority:{
    type:Array,
    default:[]
  }
})
module.exports = mongoose.model('user',userInfo);
