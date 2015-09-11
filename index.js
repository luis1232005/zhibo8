var fetchUrl  = require('fetch').fetchUrl;
var cheerio = require('cheerio');

console.log("-");
fetchUrl('http://www.zhibo8.cc/',{},function(err,meta,body){
    if(err){
        //todo д����־
        return ;
    }

    var html = body.toString('utf-8');

    $ = cheerio.load(html);

    function formatData(item){
        var date = $(".titlebar h2",item).attr('title')

        var items = [];
        $(".content li",item).each(function(){
            var cls = $(this).attr('label') || '';
            if(cls.indexOf('����') || cls.indexOf('����')){
                var linkEls = $("a",$(this)),
                    links = [];

                linkEls.each(function(){
                    links.push({
                        href: $(this).attr('href'),
                        txt: $(this).text()
                    })
                });

                //����������ı�
                linkEls.html('');

                //�ж�
                items.push({
                    title: $(this).text(),
                    links: links
                })
            }
        });

        console.log(items);
    }

    $(".box").each(function(){
        var day = $(".titlebar h2",$(this)).attr('title');

        formatData($(this));
    });
});