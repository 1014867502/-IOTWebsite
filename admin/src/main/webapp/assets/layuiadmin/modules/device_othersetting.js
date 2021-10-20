layui.define(['table', 'form','laydate','carousel', 'echarts'],function (exports) {
    var table = layui.table
        ,form = layui.form
        ,laydate = layui.laydate
        ,echarts = layui.echarts
        , admin = layui.admin
        ,$ = layui.$;

    var finish;
    var latest=false;

    getUpdatedetail();
    rendertable();
    islatestversion();
    isDeviceOnline();

    $.ajax({
        url:'/devicelist/condevsocket',
        data:{
            machinesn: machinedata
        },
        success:function(){
            $("#deviceupdate").on('click',function () {
                if(!latest){
                    if(!parent.updatefinsih){
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



    /**发送更新命令**/
    function sendUpdateOrder() {
        let order="SET,DEVICE.FTP_UPDATE,GEO";
        let index;
        $.ajax({
            url: '/devicelist/sendorder',
            data: {
                order: order,
                machinesn: machinedata
            },
            success: function (data) {
                let result=data.data;
                layer.msg("设备已开始升级，请耐心等候");
                isupdatefinish();
                mounted();
                parent.layer.close(index);
                $("#cover").css('display','none');   //显示遮罩层
            }
        })
        layer.msg('正在执行，请稍后', {icon: 6});
        index = parent.layer.load();
        $("#cover").css('display','block'); //显示遮罩层
        let high2=parent.document.getElementById("iframe_a").style.height;
        $("#cover").css('height',high2);
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
                if(result!="fail"){
                    latest=true;
                    $("#tip").html("(已经是最新版本)");
                    $("#tip").css("color","#5FB878");
                }else{
                    $("#tip").html("(有最新版本可供更新)");
                    $("#tip").css("color","#FF5722");
                }
            }

        })
    }

    /**定时查询设备是否更新完成**/
    function isupdatefinish(){
        finish=window.setInterval(function(){
            $.ajax({
                url:'/devicelist/isLatestVersion',
                data:{
                    machinesn: machinedata
                },
                success: function (data) {
                    let result=data.data;
                    if(result){
                        layer.msg("已更新到最新版本");
                        getUpdatedetail();
                        rendertable();
                        islatestversion();
                        isDeviceOnline();
                        window.clearInterval(finish);
                    }
                }

            })
        },30000)
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
                console.log(res);
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
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

    function mounted() {
        window.addEventListener('unload',function () {
            parent.updatefinsih=false;
            window.clearInterval(finish);
        });
        window.onunload=function(){
            parent.updatefinsih=false;
            window.clearInterval(finish);
        };
        window.addEventListener('beforeunload',function (e) {
            parent.updatefinsih=false;
            window.clearInterval(finish);
        });
        window.onbeforeunload=function(){
            parent.updatefinsih=false;
            window.clearInterval(finish);
        }
    }

    exports('device_othersetting', {})
});