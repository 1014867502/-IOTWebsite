function getIElanguage()
{
    var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
    lang = lang.substr(0, 2);
    //截取lang前2位字符
    if(lang == 'zh')
    {
        return "zh";
    }
    else
    {
        return "en";
    }
}

//写入cookie函数
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//获取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//setCookie('lan','hk');    繁体中文
//setCookie('lan','cn');    简体中文

loadProperties();
function loadProperties() {
    var lan = getIElanguage();
    console.log(lan);

    $.i18n.properties({
        name:'lang',    //属性文件名     命名格式： 文件名_国家代号.properties
        path:'/assets/i18n/',   //注意这里路径是你属性文件的所在文件夹
        mode:'map',
        language:lan,     //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
        callback:function(){

            console.log("i18n赋值中...");
            try {
                //初始化页面元素
                $('[data-i18n-placeholder]').each(function () {
                    $(this).attr('placeholder', $.i18n.prop($(this).data('i18n-placeholder')));
                });
                $('[data-i18n-title]').each(function () {
                    $(this).attr('title', $.i18n.prop($(this).data('i18n-title')));
                });
                // $('[data-i18n-href]').each(function () {
                //     $(this).attr('href', $.i18n.prop($(this).data('i18n-href')));
                // });
                // $('[href]').each(function () {
                //     $(this).attr('href', $(this).attr("href"));
                //     console.log($(this).attr("href"));
                // });
                $('[data-i18n-text]').each(function () {
                    //如果text里面还有html需要过滤掉
                    var html = $(this).html();
                    var reg = /<(.*)>/;
                    if (reg.test(html)) {
                        var htmlValue = reg.exec(html)[0];
                        $(this).html(htmlValue + $.i18n.prop($(this).data('i18n-text')));
                    }
                    else {
                        $(this).text($.i18n.prop($(this).data('i18n-text')));
                    }
                });
                $('[data-i18n-value]').each(function () {
                    $(this).val($.i18n.prop($(this).data('i18n-value')));
                });

                $("[data-locale]").each(function(){
                    console.log($(this).data("locale"));
                    console.log($.i18n.prop($(this).data("locale")));
                    $(this).html($.i18n.prop($(this).data("locale")));
                });
                $("[data-i18n-tips]").each(function(){
                    $(this).attr('lay-tips', $.i18n.prop($(this).data('i18n-tips')));
                });
            }
            catch(ex){
                console.log("i18n write error");
            }
            console.log("i18n写入完毕");

        }
    });
}

