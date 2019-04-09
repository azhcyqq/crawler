const crawler = require('crawler');
var c = new crawler({
	jQuery:true,
	maxConnections:100
});

var azAnima = [];
for(let i = 0 ; i<26 ;i++)
{
	
	let str = 'a';
	let newStr = str.charCodeAt();
	newStr+=i
	newStr = String.fromCharCode(newStr)
	azAnima.push('http://www.dilidili.name/'+newStr+'/')
}
//var arr = ['http://www.dilidili.name/watch3/76463/','http://www.dilidili.name/watch3/68945/']

for(var i = 0;i<azAnima.length;i++)
{
	c.queue({
		uri:azAnima[i],
		callback:function(){
			console.log('a')
		}
	})
}
