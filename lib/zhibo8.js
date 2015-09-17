var fetchUrl  = require('fetch').fetchUrl;
var cheerio = require('cheerio');
var fs = require('fs-extra');
var path = require('path');

function run(){
    fetchUrl('http://www.zhibo8.cc/',{},function(err,meta,body){
        if(err){
            //todo 写入日志
            return ;
        }

        //console.log(body);

        var html = body.toString('utf-8');

        //console.log(html);

        $ = cheerio.load(html);

        function formatData(item){

            var items = [];
            $(".content li",item).each(function(){
                var cls = $(this).attr('label') || '';

                if(/.*(英超|NBA|欧冠|世界杯|美洲杯|亚冠|亚洲杯|西甲|德甲|意甲|欧联).*/gi.test(cls)){

                    var linkEls = $("a",$(this)),
                        links = [];

                    linkEls.each(function(){

                        if(!/.*(文字直播|手机看直播|比分直播|新服|美女直播).*/gi.test($(this).text())){
                            links.push({
                                href: $(this).attr('href'),
                                txt: $(this).text()
                            });
                        }
                    });

                    //console.log(links);

                    //清空连接中文本
                    linkEls.html('');

                    //判断
                    var title = $(this).text().replace(/^\s+|\s+$|\\n+/gi,'');
                    //console.log(title);
                    if(!!title && /.*(英超|NBA|欧冠|世界杯|美洲杯|亚冠|亚洲杯|西甲|德甲|意甲|欧联).*/gi.test(title)){
                        items.push({
                            title: title,
                            keywords : cls,
                            links: links
                        })
                    }
                }
            });

            return items;
        }

        //执行
        var dayitems = [];
        $(".box").each(function(){
            var date = $(".titlebar h2",$(this)).attr('title');
            var items;
            if(!!date){
                items = formatData($(this))||[];

                dayitems.push({
                    date: date,
                    items: items
                });
            }
        });

        var zbyPath = path.join(__dirname,"../db/zby1.json");
        fs.writeJSONSync(zbyPath,dayitems);
        console.log('抓取成功！内容已经保存到'+zbyPath);
    });
}

exports.run = run;