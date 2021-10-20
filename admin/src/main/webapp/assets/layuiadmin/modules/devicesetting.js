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
    $("#devicename").html(machinedata);

    if(document.getElementById("deviceinfo")!=null){
        document.getElementById("deviceinfo").style.color="#00f0ff"
        document.getElementById("deviceinfo1").style.color="#00f0ff";
    }else{
        document.getElementById("fastsetting").style.color="#00f0ff"
        document.getElementById("fastsetting1").style.color="#00f0ff";
    }

    beforeselect="deviceinfo";

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
                document.getElementById("iframe_a").style.height="1200px";
                document.getElementById("iframe_a").src="/devicelist/fastsetting";

                break;

            case "deviceinfo" :
                document.getElementById("deviceinfo").style.color="#00f0ff";
                document.getElementById("deviceinfo1").style.color="#00f0ff";
                beforeselect="deviceinfo";
                document.getElementById("iframe_a").style.height="835px";
                document.getElementById("iframe_a").src="/devicelist/deviceinform?machinedata="+machinedata;
                break;
            case "devicesetting" :
                document.getElementById("devicesetting").style.color="#00f0ff";
                document.getElementById("devicesetting1").style.color="#00f0ff";
                beforeselect="devicesetting";
                document.getElementById("iframe_a").style.height="1956px";
                document.getElementById("iframe_a").src="/devicelist/stationsetting?machinedata="+machinedata;
                break;
            case "deviceorder":
                document.getElementById("deviceorder").style.color="#00f0ff";
                document.getElementById("deviceorder1").style.color="#00f0ff";
                beforeselect="deviceorder";
                document.getElementById("iframe_a").style.height="842px";
                document.getElementById("iframe_a").src="/devicelist/deviceorder?machinedata="+machinedata;
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
                document.getElementById("iframe_a").style.height="757px";
                document.getElementById("iframe_a").src="/devicelist/deviceother?machinedata="+machinedata;
                break;
        }

    }, false);

    form.on('radio(compute)', function(data) {
        iframechange();
    });
    form.on('radio(station)', function(data) {
        iframechange();
    });

    adaptauthority();

    /**根据权限显示不同页面内容**/
    function adaptauthority(){
        $.ajax({
            url:'/custom/getauthorById',
            async:false,
            success:function (data) {
                if(data.data=="superadmin"){
                    $("#deviceorder").css("display","block");
                }else{
                    $("#deviceorder").css("display","none");
                }
            }
        })
    }



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