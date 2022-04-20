layui.define(['table', 'form','laydate','carousel', 'echarts'],function (exports) {
    var table = layui.table
        ,form = layui.form
        ,laydate = layui.laydate
        ,echarts = layui.echarts
        , admin = layui.admin
        ,$ = layui.$;

    var finish;
    var latest=false;
    var userid;
    var msgindex;
    var connected=false;
    var pending=false;
    var maxtime = 10 * 60; // 计时器的时间
    var timer;//定时器

    connectsocket();
    getUpdatedetail();
    rendertable();
    islatestversion();
    isDeviceOnline();



    $.ajax({
        url:'/devicelist/updateLatestVersion',
        data:{
            machineserial: machinedata
        },
        success:function(res){
            let data=res.data;
                if(data=="pending"){
                        parent.updatefinsih=true;
                    }else{
                        parent.updatefinsih=false;
                }
        }
    })

    /**连接服务器**/
    function connectsocket() {
        $.ajax({
            url:'/devicelist/condevsocket',
            data:{
                machinesn: machinedata
            },
            success:function(res){
                let connectdata=res.data;
                if(connectdata.result=="连接成功"){
                    userid=connectdata.userid;
                    connected=true;
                }
                $("#deviceupdate").on('click',function () {
                    if(!latest){
                        if(!parent.updatefinsih&&!pending){
                            sendUpdateOrder();
                            // layer.msg("设备发送命令");
                            parent.updatefinsih=true;
                        }else{
                            layer.msg("设备正在升级，请稍后");
                        }
                    }else{
                        layer.msg("已经是最新版本，无需升级");
                    }
                })
            }
        })
    }

    /**发送更新命令**/
    function sendUpdateOrder() {
        if(connected){
            let order="SET,DEVICE.FTP_UPDATE,GEO";
            $.ajax({
                url: '/devicelist/sendorder',
                data: {
                    order: order,
                    machinesn: machinedata,
                    userid:userid
                },
                success: function (data) {
                    let res=data.data;
                    if(res.indexOf("ERROR")>0){
                        layer.msg("更新失败");
                    }
                    else if(res.indexOf("OK")>0){
                        layer.msg("已更新到最新版本");
                    }
                    else{
                        layer.msg("设备结果返回超时");
                    }
                    window.clearInterval(finish);
                    window.clearInterval(timer);
                    layer.close(msgindex);
                    setTimeout(function(){
                        getUpdatedetail();
                        rendertable();
                        islatestversion();
                        isDeviceOnline();
                    },5000);

                    // $("#cover").css('display','none');   //显示遮罩层
                }
            })
           msgindex=layer.open({
                id:"msg",
                area: ['360px'],
                type: 1,
                closeBtn:0,
                resize:false,
                content: $('#msgload') //这里content是一个普通的String
            });
            timer = setInterval(CountDown, 1000);
            rendertable();
            isupdatefinish();
            mounted();
            // layer.msg('正在执行，请稍后', {icon: 6});
            // index = parent.layer.load();
            // $("#cover").css('display','block'); //显示遮罩层
            // let high2=parent.document.getElementById("iframe_a").style.height;
            // $("#cover").css('height',high2);
        }else{
            layer.msg("连接服务器失败，无法在线更新");
        }

    }

    /**判断设备是否在线**/
    function isDeviceOnline(){
        $.ajax({
            url:'/devicelist/isDeviceOnline',
            data:{
                machineserial: machinedata
            },
            success: function (data) {
                let result=data.data;
                if(result=="online"){
                    $("#connect").html("设备在线");
                    $("#connect").css("color","#5FB878");

                }else{
                    $("#connect").html("设备不在线！");
                    $("#connect").css("color","#FF5722");
                    $("#deviceupdate").addClass("layui-btn-disabled");
                    $("#deviceupdate").attr("disabled","disabled");
                }
            }

        })
    }

    /**判断设备是否是最新版本**/
    function islatestversion(){
        $.ajax({
            url:'/devicelist/isLatestVersion',
            data:{
                machinesn: machinedata
            },
            success: function (data) {
                let result=data.data;
                switch(result){
                    case "fail":
                        $("#tip").html("(有最新版本可供更新)");
                        $("#tip").css("color","#FF5722");
                        break;
                    case "ok":
                        latest=true;
                        $("#tip").html("(已经是最新版本)");
                        $("#tip").css("color","#5FB878");
                        break;
                    case "fail2":
                        $("#tip").html("(固件类型出错，无法升级)");
                        $("#tip").css("color","#FF5722");
                        $("#deviceupdate").addClass("layui-btn-disabled");
                        $("#deviceupdate").attr("disabled","disabled");
                        break;
                }
            }
        })
    }

    /**定时查询设备是否更新完成**/
    function isupdatefinish(){
        finish=window.setInterval(function(){
            $.ajax({
                url:'/devicelist/getDeviceUpdateLogBySerial',
                data:{
                    machineserial: machinedata
                },
                success: function (data) {
                    let result=data.data;
                    if(result.list[0].updateState==1){
                        layer.msg("已更新到最新版本");
                        window.clearInterval(finish);
                        window.clearInterval(timer);
                        layer.close(msgindex);
                        setTimeout(function(){
                            getUpdatedetail();
                            rendertable();
                            islatestversion();
                            isDeviceOnline();
                        },5000);
                    }else if(result.list[0].updateState==0){
                        layer.msg("更新失败");
                        window.clearInterval(finish);
                        window.clearInterval(timer);
                        layer.close(msgindex);
                        setTimeout(function(){
                            getUpdatedetail();
                            rendertable();
                            islatestversion();
                            isDeviceOnline();
                        },5000);
                    }
                }
            })
        },1*20*1000)
    }

    function rendertable(){
        table.render({
            elem: '#update-form'
            , title: 'logdata'
            , totalRow: true
            , url: '/devicelist/getDeviceUpdateLogBySerial'
            , where: {"machineserial":machinedata}
            , cols: [[
                {field: 'updateTime', title: "更新时间", align: 'center'}
                , {field: 'machineSerial', title: "设备号", align: 'center'}
                , {field: 'updateState', title: "更新状态", align: 'center',templet: function(d){
                        if(d.updateState==1){
                            return '<span class="updatestats-suc">升级成功</span>'
                        }else if(d.updateState==2){
                            return '<span class="updatestats-pend">升级中</span>'
                        }else{
                            return '<span class="updatestats-fai">升级失败</span>'
                        }
                    }}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'update-form'
            , page: true
            , parseData: function (res) {
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            },
            done: function(res, curr, count){
                if(document.getElementsByClassName("updatastats-pend").length>0){
                    pending=true;
                }
            }
        });
    }


    function getUpdatedetail(){
        $.ajax({
            url:'/devicelist/getDeviceUpdateDetail',
            data:{
                machineserial: machinedata
            },
            success:function (res) {
                let data=res.data.split(',');
                let time=data[0];
                let version=data[1];
                $("#version").html(version);
                $("#connecttime").html(time);
            }
        })
    }

    function closesocket() {
        $.ajax({
            url: '/devicelist/closesocket',
            data:{
                userid:userid
            },
            success: function (data) {
            }
        })
    }

    /**计时器**/

    function CountDown() {
        if (maxtime >= 0) {
          let  minutes = Math.floor(maxtime / 60);
          let  seconds = Math.floor(maxtime % 60);
          let  msg = "距离超时还有" + minutes + "分" + seconds + "秒";
          document.getElementById("timeload").innerHTML=msg;
            --maxtime;
        } else{
            parent.updatefinsih=false;
            maxtime=10*60;
            window.clearInterval(finish);
            window.clearInterval(timer);
            layer.close(msgindex);
            layer.msg("更新超时!");
        }
    }


    function mounted() {
        window.addEventListener('beforeunload',function (e) {
            parent.updatefinsih=false;
            window.clearInterval(finish);
        });

    }

    window.addEventListener('beforeunload',function (e) {
        closesocket();
    });

    exports('device_othersetting', {})
});