//此项目是针对某具体网站，对其视频的播放地址与具体数据进行爬取
//运用模块为crawler后续会作为接口传递数据
//2019/3/22  author:PRball

//暂时停用，测试其他功能
//引入mongoose模块
const Anime = require('./mongo.js')

//引入cheerio模块
const cheerio = require('cheerio')
//引用crawler爬虫模块
const crawler = require('crawler')
//引入iconv-lite字符编码模块
//已不用
const iconv = require('iconv-lite')
//引入文件模块
//测试用，已不用
const fs = require('fs')
//网站url数组a-z
const azAnima = [];
//url数组完成状态
const status = {}
//a-z网站url的内部url数组
const azUrlData = {};
//各视频影音的url地址合集
var animaData = {
	//分集地址
	uris: [],
	//播放地址
	play: [],
	//集数名称
	titles: [],
	//影音名称
	name: '',
	//简介
	introduce: '',
	//标题图片
	img: '',
	tag: [],
}
//记录错误数
let errNum = 0;
let numbercom = 0;
//状态数组下标
let iCalc = 0;
//全部数据的数组
var allData = {}
//分类下标作用
//allData[a:...,b:...:c...,...,z:...]中的abcd索引
var computed = 0;
//初始化网站url数组、a-z网站url内部url地址、url数组完成状态
//status{a-z:false}   azAnima[ www.dilidili/a/......www.dilidili/z/] azUrlData{a:[],b:[].......z:[]}
for(let i = 0; i < 26; i++) {

	let str = 'a';
	let newStr = str.charCodeAt();
	newStr += i
	newStr = String.fromCharCode(newStr)
	azUrlData[newStr] = []
	status[newStr] = false;
	allData[newStr] = []
	azAnima.push('http://www.dilidili.name/' + newStr + '/')
}
const c = new crawler({
	//允许cheerio的jq语法
	jQuery: true,
	encoding: 'utf8',
	//爬取池最大20
	maxConnections: 10,
	timeout: 5000
})
//c.queue(azAnima)

//利用闭包完成azAnima的网站内部url爬取并将数据保存至azUrlData内
//@azUrlData:{a:[......],b:[......]......z:[......]}
//完成爬取后改变各对应status为true
function getazUrl() {
	for(var i = 0; i < azAnima.length; i++) {
		function getit(i) {
			var num = i
			c.queue({
				uri: azAnima[num],
				callback: function(err, res, done) {
					let $ = res.$;
					let aList = $('.anime_list dl dt a')
					let a = String.fromCharCode('a'.charCodeAt() + num)
					let tagArr = []

					if(!!$('.anime_list').html()) {
						let changebody = $('.anime_list').html().replace(/(<b>&#x6807;&#x7B7E;&#xFF1A;<\/b>)+/g, '<i class="cherryboy">标签</i>');
						let c = cheerio.load(changebody)
						for(let j = 0; j < c('.cherryboy').length; j++) {
							let temparr = [];
							if(c('.cherryboy').parent()[j].children[1]) {
								for(let i = 1; i < c('.cherryboy').parent()[j].children.length; i++) {
									if(c('.cherryboy').parent()[j].children[i].children) {
										temparr.push(c('.cherryboy').parent()[j].children[i].children[0].data)
									}
								}
							}
							tagArr.push(temparr)

						}
					}
					//					console.log(tagArr)
					aList.each(function(index, item) {
						azUrlData[a].push({
							url: item.attribs.href,
							tag: tagArr[index]
						})
					})
					//					console.log(azUrlData)
					console.log('爬取' + a + '成功')
					done();
					status[a] = true;
				}
			})
		}
		getit(i);
	}
}
//判断status是否全部完成并执行azUrlData内部url的逐步爬取
function getDetail() {
	for(var i in status) {
		if(!status[i])
			return
	}
	clearInterval(timer)
	console.log('done')
	redo(0)
}

//封装promise函数
function getData(i) {
	//初始化code让其为a，后续增长为b，c直至z，做对应键值作用
	var code = String.fromCharCode('a'.charCodeAt() + i)
	//各分类长度
	var len = azUrlData[code].length;
	//状态数组
	var tempObj = []
	//初始化状态数组
	for(var i = 0; i < len; i++) {
		tempObj.push(false)
	}
	//返回promise函数
	return new Promise(function(resolve, reject) {
		//初始化数据（状态数组，分组长度）
		var tempArr = tempObj;
		var iLen = len;
		//iCalc状态数组的下标
		iCalc = 0;
		//无特殊作用，提示用
		computed = 0;
		//分类下标code
		//		let code = String.fromCharCode('a'.charCodeAt()+numbercom)
		//循环将uri地址推入爬虫池
		for(var j = 0; j < iLen; j++) {
			(function(j) {
				c.queue({
					//uri地址
					uri: azUrlData[code][j].url,
					//回调函数
					callback: function(err, res, done) {
						//获取网页体
						let $ = res.$;
						//判断是否存在（在某些请求失败或地址错误的情况下会获取失败返回$为undefined）
						if(!$) {
							//将对应状态数组改为真
							tempArr[iCalc] = true;
							//自增下标
							iCalc++
							console.log('不符合')
							//结束此爬虫状态
							done();
							return
						}
						//重定向data地址
						var data = JSON.stringify(animaData);
						data = JSON.parse(data)
						//获取uri分集地址
						$('.xfswiper1 li a').each(function(index, item) {
							data.uris.push(item.attribs.href)
						})
						//获取分集标题
						$('.clear li em').each(function(index, item) {
							data.titles.push(item.children[1].data)
						})
						var _done = done;
						//					getPlayAddress(data).then((res)=>{
						//						//成功
						//						
						////						获取播放地址
						//						data.play = res;	
						//						判断结构是否存在，某些情况下可能不存在，若不存在，直接跳过
						if(!$('h1') || !$('.d_label2') || !$('.detail dt img') || !$('.d_label2')[2] || !$('.d_label2')[2].children[1] || !$('.detail dt img')[0]) {
							//改变对应状态数组为真
							tempArr[iCalc] = true;
							//自增下标
							iCalc++
							console.log('不符合')
							//结束此爬虫状态
							_done();
							return
						}
						data.tag = azUrlData[code][j].tag
						//获取此影视的名称
						data.name = $('h1').text()
						//获取此影视的简介
						data.introduce = $('.d_label2')[2].children[1].data;
						//获取此影视的图片
						data.img = $('.detail dt img')[0].attribs.src;

						//将data对象推入allData数组暂存
						allData[code].push(data)
						//改变对应状态
						tempArr[iCalc] = true;
						//自增下标
						iCalc++
						console.log('爬取成功' + computed)
						//此项爬取完成，自增
						computed++;
						_done();
					}
				})

			})(j)
		}
		//定时器监听a-z每项的爬取是否完成
		var promiseTimer = setInterval(function() {
			//遍历状态数组，若存在false（未完成）直接return
			for(var i = 0; i < iLen; i++) {
				if(!tempArr[i])
					return
			}
			//若全部完成，清楚该定时器，执行下列代码
			clearInterval(promiseTimer);
			console.log('completed' + '    ' + code)
			numbercom++;
			resolve();
		}, 1000)
	})
}

//各分类（a-z）的具体集数爬取
function redo(i) {
	//递归至完成
	if(i > azAnima.length - 1) {
		getPlayAddress();
		//		fs.writeFile('index.html',JSON.stringify(allData),function(){
		//			console.log('done')
		//		})
		return
	}
	//封装的promise函数递归调用
	getData(i).then(() => {
		i++
		redo(i)
	})
}

//执行爬虫任务
getazUrl()

//监控各status是否全部完成
var timer = setInterval(getDetail, 1000)

//2019-3-21爬取各影音主地址
//2019-3-22爬取各影音分集地址
//2019-3-22完成全部影音分集地址 下周目标，分类a-z全部影音分集，并完成mp4视频播放地址爬取
//2019-4-9基本完成所有内容，等待爬取

function getPlayAddress() {
	let count = 0;
	let tempCount = 0;
	let tempCount_d = 0;
	for(let i in allData) {
		for(let j = 0; j < allData[i].length; j++) {
			for(let k = 0; k < allData[i][j].uris.length; k++) {
				(function(i, j, k) {
					c.queue({
						uri: allData[i][j].uris[k],
						callback: function(err, res, done) {
							let $　 = res.$;
							if(!$ || !$('#player_iframe') || !$('#player_iframe')[0]) {
								console.log('错误')
								if(i === 'z') {
									tempCount++;
									if(tempCount_d === allData[i][j].length - 1) {
										tempCount_d++;
									}
								}
								done();
								return
							}
							let video = $('#player_iframe')[0].attribs.src;
							allData[i][j].play[k] = video;
							console.log('爬取播放地址成功' + i + '中第' + j + '中的第' + k + '集' + (count++) + '个');
							done();
							if(i === 'z') {
								tempCount++;
								if(tempCount === allData[i].length - 1) {
									tempCount_d++
									if(tempCount_d === allData[i][j].length - 1) {
										console.log('全部爬取完成')
										fs.writeFile('index.html', JSON.stringify(allData), function(err) {
											if(err) {
												console.log('文件写入失败')
												return
											}
											console.log('写入成功啊啊啊啊啊啊')
										})
										saveDb();
									}
								}
							}
						}
					})
				})(i, j, k)
			}
		}
	}
}

//暂时停用，测试其他功能
//保存至mongodb数据库
function saveDb() {
	for(let i = 0; i < azAnima.length; i++) {
		var code = String.fromCharCode('a'.charCodeAt() + i)
		for(let j = 0; j < allData[code].length; j++) {
			(function(code, j) {
				new Anime({
					az: code,
					uris: allData[code][j].uris,
					play: allData[code][j].play,
					titles: allData[code][j].titles,
					name: allData[code][j].name,
					introduce: allData[code][j].introduce,
					img: allData[code][j].img,
					tag: allData[code][j].tag
				}).save((err, res) => {
					if(err) {
						console.log(err)
						errNum++
					} else {
						console.log('succeed')
					}
				})
			})(code, j)
		}
	}
}