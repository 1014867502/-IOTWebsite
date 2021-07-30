layui.define(['form','drawer','table'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,table2=layui.table;

    var agentNumber;
    var beforeselect="";
    iframechange();

    document.getElementById("fastsetting").style.color="#00f0ff"
    document.getElementById("fastsetting1").style.color="#00f0ff";
    beforeselect="fastsetting";

    var list = document.getElementById('menu');
    list.addEventListener('click', function (event) {
        event = event || window.event;
        let target2;
        var target = event.target.parentNode;
        if(target.childElementCount==2){
            target2=target;
        }else{
            target2=target.parentNode.parentNode;
        }
        if(beforeselect !== null && beforeselect !== undefined && beforeselect !== ''){
            document.getElementById(beforeselect).style.color=null;
            document.getElementById(beforeselect+"1").style.color=null;
        }
        switch (target2.id) {
            case "fastsetting" :
                document.getElementById("fastsetting").style.color="#00f0ff"
                document.getElementById("fastsetting1").style.color="#00f0ff";
                beforeselect="fastsetting";
                document.getElementById("iframe_a").style.height="1000px";
                document.getElementById("iframe_a").src="/devicelist/fastsetting";

                break;
            case "deviceinfo" :
                document.getElementById("deviceinfo").style.color="#00f0ff";
                document.getElementById("deviceinfo1").style.color="#00f0ff";
                beforeselect="deviceinfo";
                // document.getElementById("iframe_a").src="/company/CompanyDetail";
                break;
            case "devicesetting" :
                document.getElementById("devicesetting").style.color="#00f0ff";
                document.getElementById("devicesetting1").style.color="#00f0ff";
                beforeselect="devicesetting";
                document.getElementById("iframe_a").style.height="1800px";
                document.getElementById("iframe_a").src="/devicelist/stationsetting?machinedata="+machinedata;
                break;
            case "internetset":
                document.getElementById("internetset").style.color="#00f0ff";
                document.getElementById("internetset1").style.color="#00f0ff";
                beforeselect="internetset";
                // document.getElementById("iframe_a").src="/company/CompanyDetail";
                break;
            case "download":
                document.getElementById("download").style.color="#00f0ff";
                document.getElementById("download1").style.color="#00f0ff";
                beforeselect="download";
                // document.getElementById("iframe_a").src="/company/CompanyDetail";
                break;
            case "other":
                document.getElementById("other").style.color="#00f0ff";
                document.getElementById("other1").style.color="#00f0ff";
                beforeselect="other";
                // document.getElementById("iframe_a").src="/company/CompanyDetail";
                break;
        }

    }, false);

    form.on('radio(compute)', function(data) {
        iframechange();
    });
    form.on('radio(station)', function(data) {
        iframechange();
    });



    function  iframechange() {
        var iframes = document.getElementsByTagName('iframe_a');
        for (let i = 0, j = iframes.length; i < j; ++i) {
            // 放在闭包中，防止iframe触发load事件的时候下标不匹配
            (function(_i) {
                iframes[_i].onload = function() {
                    // 提前还原高度
                    this.setAttribute('height', 'auto'); // 或设为''
                    // 再在下一轮事件循环中设置新高度
                    setTimeout(function() {
                        iframes[_i].setAttribute('height', iframes[_i].contentWindow.document.body.scrollHeight);
                    }, 0);
                }
            })(i);
        }
        for (let i= 0, j = iframes.length; i < j; ++i) {
            // 放在闭包中，防止iframe触发load事件的时候下标不匹配
            (function(_i) {
                iframes[_i].onload = function() {
                    this.contentWindow.onbeforeunload = function() {
                        iframes[_i].setAttribute('height', 'auto');
                    };

                    this.setAttribute('height', this.contentWindow.document.body.scrollHeight);
                };
            })(i);
        }
    }

    exports('devicesetting',{})
});