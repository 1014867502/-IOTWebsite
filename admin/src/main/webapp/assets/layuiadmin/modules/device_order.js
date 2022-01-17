layui.define(['table', 'form','laydate','carousel'],function (exports) {
    var table = layui.table
        ,form = layui.form
        ,laydate = layui.laydate
        ,echarts = layui.echarts
        , admin = layui.admin
        ,$ = layui.$;

    var device={};
    var websocket;
    var websocketuse=false;
    var orderlist;


    var index2 = parent.layer.load();
    $("#cover").css('display','block');
    layer.msg('正在执行，请稍后', {icon: 6});
    let high2=parent.document.getElementById("iframe_a").style.height;
    $("#cover").css('height',high2);
    $.ajax({
        url:'/devicelist/condevsocket',
        data:{
            machinesn: machinedata
        },
        success: function (data) {
            if ('WebSocket' in window) {
                websocket = new WebSocket("ws://8.134.94.147:8080/websocket");
                websocket.onopen = function () {
                    layer.msg("服务器连接成功");
                }
                websocket.onerror = function () {
                    layer.msg("WebSocket连接发生错误");
                };
                websocketuse=true;
            }
            else {
                alert('当前浏览器 Not support websocket,请升级浏览器');
            }
            let result=data.data;
            let time=getcurrent();
            let text=document.getElementById("returninform");
            text.value=text.value+"\n"+time+"\n"+"命令执行结果："+data.data;
            parent.layer.close(index2);
            $("#cover").css('display','none');   //显示遮罩层
            initcon(result);
        }
    })


    function initcon(result){
        $.post('/devicelist/getDeviceSetting?machineSerial='+machinedata,function(res){
            let device =res.data;
            let index;
                if (device.connectState > 0) {
                    $("#warn").removeClass("layui-btn-disabled");
                    // $.ajax({
                    //     url: '/devicelist/sendorder',
                    //     data: {
                    //         order: "",
                    //         machinesn: machinedata
                    //     },
                    //     async:true,
                    //     success: function (data) {
                    //         let result=data.data;
                    //         let time=getcurrent();
                    //         let text=document.getElementById("returninform");
                    //         text.value=text.value+"\n"+time+"\n"+"命令执行结果："+data.data;
                    //         parent.layer.close(index);
                    //         $("#cover").css('display','none');   //显示遮罩层
                    //     }
                    // });
                } else {
                    let time = getcurrent();
                    document.getElementById("online").innerHTML = "（设备不在线！）";
                    $("#btn").addClass("layui-btn-disabled");
                    orderlist.update({disabled: true});
                    $("#btn").attr("disabled", "disabled");
                    $("#text").attr("disabled", "disabled");
                    $("#text").addClass("layui-btn-disabled");
                }
        });
    }

    function isonline(data){
        let connect=new Date(data);
        let now=new Date();
        let total=(now.getTime()-connect.getTime())/1000;
        let hour=total/3600;
        if(hour<1){
            return true;
        }else{
            return false;
        }
    }


    // $("#test").on('click',function () {
    //     $.ajax({
    //         url: '/devicelist/sendorder',
    //         data: {
    //             order: "",
    //             machinesn: machinedata
    //         },
    //         success: function (data) {
    //             let time=getcurrent();
    //             let text=document.getElementById("returninform");
    //             text.value=text.value+"\n"+time+"\n"+"命令执行结果："+data.data;
    //             document.getElementById("btn").style.display="inline";
    //             document.getElementById("test").style.display="none";
    //         }
    //     })
    // })

    form.on('submit(formDemo)', function (data) {
        let demo=data.field;
        let order=demo.order;
        let index;
        if ('WebSocket' in window) {
            websocket = new WebSocket("ws://8.134.94.147:8080/websocket");
            websocket.onopen = function () {
                websocket.send(machinedata+"@"+order+"@"+userid);
            }
            websocket.onerror = function () {
                layer.msg("WebSocket连接发生错误");
            };
            websocket.onmessage = function (event) {
                let time=getcurrent();
                let text=document.getElementById("returninform");
                text.value=text.value+"\n"+time+"\n"+"命令执行结果："+event.data;
            }
            websocketuse=true;
        }
        else {
            alert('当前浏览器 Not support websocket,请升级浏览器');
        }
        //接收到消息的回调方法

        // $.ajax({
        //     url: '/devicelist/sendorder',
        //     data: {
        //         order: order,
        //         machinesn: machinedata
        //     },
        //     success: function (data) {
        //         let time=getcurrent();
        //         let text=document.getElementById("returninform");
        //         text.value=text.value+"\n"+time+"\n"+"命令执行结果："+data.data;
        //         parent.layer.close(index);
        //         $("#cover").css('display','none');   //显示遮罩层
        //     }
        // })
        // layer.msg('正在执行，请稍后', {icon: 6});
        // index = parent.layer.load();
        // $("#cover").css('display','block'); //显示遮罩层
        // let high=parent.document.getElementById("iframe_a").height;
        // let high2=parent.document.getElementById("iframe_a").style.height;
        // $("#cover").css('height',high2);
    })

    mounted();
    getorders();

    /**获取命令**/
    function getorders(){
        $.ajax({
            url:'/devicelist/deviceorders',
            async:false,
            success:function(res){
                let data=res.data;
                selectorder(data);
            }
        })
    }


    /**命令下拉框**/
    function selectorder(json) {
        var arrData = [];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.name;
            jsonStr.value = item.value;
            arrData.push(jsonStr);
        }
        orderlist = xmSelect.render({
            el: '#orderlist',
            data: arrData,
            direction: 'down',
            radio:true,
            theme: {
                color: '#0081ff',
            },
            clickClose:true,
            layVerType: 'msg',
            on: function(data){
                let change = data.change[0];
                $("#text").val(change.value);
            },
        })
    }

    function getcurrent() {
        let dateTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1
        let dd = new Date().getDate()
        let hh = new Date().getHours()
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
            :
            new Date().getMinutes()
        let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
            :
            new Date().getSeconds()
        dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
        console.log(dateTime)
        return dateTime
    }

    //获取设备和项目的详细信息
    function getProjectDetail1() {
        $.ajax({
            url:'/devicelist/getDeviceDetailBySn',
            data:{
                machinesn:machinedata
            },
            success:function (res) {
                let data=res.data;
                if(data.proGroupName!=""){
                    document.getElementById("project").innerHTML="<b>所属项目：</b><a href='/project/projectdetail?progroupid="+data.progroupid+"&&agentnum="+data.agentNumber+"' target=\"_parent\" style='color: #1e9fff'>"+data.proGroupName+"</a>";
                }else{
                    document.getElementById("project").innerHTML="<b>所属项目：</b><span >无所属项目</span><br>";
                }
                $("#sncode").html(data.machineSerial);
                document.getElementById("company").innerHTML="<b>所属公司：</b><a href='/company/CompanyDetail?agentNumber="+data.agentNumber+"&&projectid="+data.progroupid+"' target=\"_parent\" style='color: #1e9fff'>"+data.agentName+"</a>";
            }
        })
    }

    function closesocket() {
        websocket.close();
        $.ajax({
            url: '/devicelist/closesocket',
            success: function (data) {

            }
        })
    }


    function mounted() {
        window.addEventListener('unload',function () {
            closesocket();
        });
        window.onunload=function(){
            closesocket();
        };
        window.addEventListener('beforeunload',function (e) {
            closesocket();
        });
        window.onbeforeunload=function(){
            closesocket();
        }
    }




    exports('device_order', {})
});