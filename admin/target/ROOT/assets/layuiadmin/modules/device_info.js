layui.define(['table', 'form','laydate','carousel', 'echarts'],function (exports) {
    var table = layui.table
        ,form = layui.form
        ,laydate = layui.laydate
        ,echarts = layui.echarts
        , admin = layui.admin
        ,$ = layui.$;

    var device={};



    var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        maxZoom: 20,
        minZoom: 5
    });
    var Gaodimgem = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
        maxZoom: 20,
        minZoom: 5
    });
    var Gaodimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
        maxZoom: 20,
        minZoom: 5
    });
    var Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);


    var baseLayers = {
        // "智图地图": normalm1,
        // "智图多彩": normalm2,
        // "智图午夜蓝": normalm3,
        // "智图灰色": normalm4,
        // "智图暖色": normalm5,
        // "智图冷色": normalm6,
        // "天地图": normal,
        // "天地图影像": image,
        // "谷歌地图": normalMap,
        // "谷歌影像": satelliteMap,
        // "高德地图": Gaode,
        "高德影像": Gaodimage,

    }

    var map = L.map("map", {
        center: [23.234, 113.5923],
        zoom: 12,
        layers: [Gaodimage],
        zoomControl: false
    });

    L.control.layers(baseLayers, null).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);

    //控制地图自适应div
    $("#map").resize(function(){
        map.invalidateSize(true);
    });


    // 获取项目位置信息
    $.post('/devicelist/getDeviceSetting?machineSerial='+machinedata,function(res){
            Object.assign(device, res.data);
            exbitDeviceMarker(res.data);
            getProjectDetail1();
            projectdetailflush();
    });
    function exbitDeviceMarker(obj) {
        if(obj.positionLat==""||obj.positionLat==null){
            obj.positionLat=0;
        }
        if(obj.positionLon==""||obj.positionLon==null){
            obj.positionLon=0;
        }
        let LonLat = transform(obj.positionLon*1,obj.positionLat*1);
        let latlon=(obj.positionLon*1).toFixed(6)+"° "+(obj.positionLat*1).toFixed(6)+"°";
        $("#latlon").html(latlon);
        var myIcon = L.icon({
            iconUrl: '/assets/images/Monitormachine.png',
            iconSize:[48,48],
            iconAnchor:[10,30],
        });
        var marker=L.marker([LonLat.Lat, LonLat.Lon], {icon: myIcon});
        marker.addTo(map);
        marker.on("mouseover",function(){
            // getDeviceDetail1(marker,projId,obj.name);
        });
        map.setView([LonLat.Lat, LonLat.Lon],15);
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
                if(data.proGroupName!=""&&data.proGroupName!="未关联"){
                    document.getElementById("project").innerHTML="<b>所属项目：</b><a href='/project/projectdetail?progroupid="+data.progroupid+"&&agentnum="+data.agentNumber+"' target=\"_parent\" style='color: #1e9fff'>"+data.proGroupName+"</a>";
                }else{
                    document.getElementById("project").innerHTML="<b>所属项目：</b><span >无所属项目</span><br>";
                }
                $("#sncode").html(data.machineSerial);
                document.getElementById("company").innerHTML="<b>所属公司：</b><a href='/company/CompanyDetail?agentNumber="+data.agentNumber+"&&projectid="+data.progroupid+"' target=\"_parent\" style='color: #1e9fff'>"+data.agentName+"</a>";
            }
        })
    }

    function projectdetailflush(){
        networkstatus(device);
        $("#serial").html(device.machineSerial);
        $("#model").html(device.machineModel);
        $("#mcu").html(device.mcuVer);
        $("#firmwareVer").html(device.firmwareVer);
        $("#gpsfirmwareVer").html(device.gpsFirmwareVer);
        $("#gpsmodel").html(device.gpsModel);
        $("#hardware").html(device.hardwareVer);
        if(device.puwerLever!=null&&device!=""){
            $("#powerlevel").html(device.puwerLever+"%");
        }else{
            $("#powerlevel").html(device.puwerLever);
        }
        $("#connecttime").html(device.updateTime);
        $("#voltage").html(device.extVoltage);
        if(device.expireDate!=null){
            switch(device.expireDate){
                case "0":
                    device.expireDate="未注册";
                    break;
                case "-1":
                    device.expireDate="无需注册";
                    break;
                default:
                    let now=new Date().getTime();
                    let expire=new Date(device.expireDate).getTime();
                    if(expire-now<0){
                       device.expireDate=device.expireDate+"<span id=\"tip\">(注册已过期！)";
                        $("#tip").css("color","#F53C3C");
                    }
            }
            $("#expiredate").html(device.expireDate);

        }
        let space=device.insideSpace!=null?device.insideSpace.split("|"):"0|0".split("|");
        let valuespace=space[0]!=0?space[0]/(1024*1024):0;
        let initspace=space[1]!=0?space[0]/(1024*1024):0;
        $("#space").html(valuespace.toFixed(2)+"GB|"+initspace.toFixed(2)+"GB");
        device.timeZone!=null?$("#timezone").html(device.timeZone):$("#timezone").html(0);
        device.networkSignal_level!=null? signalqual(device.networkSignal_level):signalqual("0%");
        form.render("select");
    }

    /**信号强度**/
    function signalqual(data){
        let test=parseInt(data.replace("%"));
        switch (true) {
            case (test<=100&&test>70):
                $("#iconsignal").attr("src", "/assets/images/icon_signal_strong.png");
                $("#signallevel").html("强");
                break;
            case (test<=70&&test>30):
                $("#iconsignal").attr("src", "/assets/images/icon_signal_mid.png");
                $("#signallevel").html("中");
                break;
            case (test<=30&&test>0):
                $("#iconsignal").attr("src", "/assets/images/icon_signal_weak.png");
                $("#signallevel").html("弱");
                break;
            case (test==0):
                $("#iconsignal").attr("src", "/assets/images/icon_signal_no.png");
                $("#signallevel").html("无");
                break;
            default:
                $("#iconsignal").attr("src", "/assets/images/icon_signal_no.png");
                $("#signallevel").html("无");
                break;
        }
    }

    /**网络状态**/
    function networkstatus(data){
        if(data.connectState==1){
            $("#online").html("在线");
            $("#connectimg").attr("src", "/assets/images/icon_link.png");
            $("#connect").html("已连接");
        }else{
            $("#online").html("不在线");
            $("#connectimg").attr("src", "/assets/images/icon_dislink.png");
            $("#connect").html("未连接");
        }
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

    function transform(wgLon,wgLat)
    {
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
        var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
        var radLat = wgLat / 180.0 * Math.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
        var mgLat = wgLat + dLat;
        var mgLon = wgLon + dLon;
        return {
            Lat:mgLat,
            Lon:mgLon
        }
    }
    function transformLat(x,y)
    {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    function transformLon(x,y)
    {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
        return ret;
    }


    //
    // //获取当前设备的sn和名字
    // function getDevNameAddr() {
    //     $.ajax({
    //         url: '/manage/getDeviceNameSnById',
    //         data: {
    //             projectid:projId,
    //             sn:gnssSN
    //         },
    //         type: 'POST',
    //         success: function (res) {
    //             $("#stationname").html(res.data.name);
    //             $("#sncode").html(res.data.sn);
    //         },
    //         error: function (data) {
    //             layer.msg("获取失败");
    //         }
    //     })
    // }
    // //获取当前设备所在项目的名字和地址
    // function getProNameAddr() {
    //     $.ajax({
    //         url: '/manage/getProjectNameAddrById',
    //         data: {
    //             projectid:projId,
    //         },
    //         type: 'POST',
    //         success: function (res) {
    //             $("#projectname").html(res.data.name);
    //             $("#address").html(res.data.addr);
    //         },
    //         error: function (data) {
    //             layer.msg("获取失败");
    //         }
    //     })
    // }
    //
    // getDevNameAddr();
    // getProNameAddr();

    exports('device_info', {})
});