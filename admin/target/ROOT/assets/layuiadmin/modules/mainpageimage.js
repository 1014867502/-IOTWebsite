layui.define(['form','table','echarts','layer','usertools'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,table=layui.table
        ,echarts=layui.echarts
        ,layer=layui.layer
        ,tool=layui.usertools

    var  companylist;
    var  onlinecount={};

    getDeviceCounts();
    getBorrowDeviceCount();
    monthdevdata()
    getCompanyListByRole(userid);
    getcompanymap(1);
    companydevdata();
    devicetypedata();

    function getDeviceCounts() {
        $.ajax({
            url: "/manage/getProDevCount",
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                let item = data.data;
                onlinecount=data.data;
                $("#sumnum").html(item.sum);
                $("#onlinenum").html(item.oncount);
                $("#outnum").html(item.outcount);
            }
        })
    }

    function getBorrowDeviceCount(){
        $.ajax({
            url:'/borrow/deviceCount',
            success:function(result){
                let device=result.data;
                $("#unprojnum").html(device.totalexpire);
                $("#newonlinenum").html(device.closeexpire);
            }
        })
    }



    function monthdevdata(){
        // $.ajax({
        //     url:'/devicelist/getAddDeviceCount',
        //     success:function (res) {
        //         let data=res.data;
        //         let monthdata=[],devicecount=[];
        //         for(let i=0;i<onlinecount.length;i++){
        let onlinedevice={};
        onlinedevice.value=onlinecount.oncount;
        onlinedevice.name="在线设备";
        let outlinedevice={};
        outlinedevice.value=onlinecount.outcount;
        outlinedevice.name="离线设备";
        let devicedata=[];
        devicedata.push(onlinedevice);
        devicedata.push(outlinedevice);
                // }
                monthdev(devicedata);
            // }
        // })
    }

    function monthdev(devicecount) {
        let chartDom =document.getElementById('companydev') ;
        let myChart = echarts.init(chartDom,layui.echartsTheme);
        let option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '设备在线情况',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: devicecount
                }
            ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });

    }

    function projectmap(){
        let chartDom =document.getElementById('projectmap') ;
        let myChart = echarts.init(chartDom,layui.echartsTheme);
        let option;
        option = {
            title: {
                text: 'Nightingale Chart',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                top: 'bottom',
                data: [
                    'rose1',
                    'rose2',
                    'rose6',
                    'rose7',
                    'rose8'
                ]
            },
            series: [
                {
                    name: 'Area Mode',
                    type: 'pie',
                    radius: [20, 140],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: [
                        { value: 30, name: 'rose 1' },
                        { value: 28, name: 'rose 2' },

                        { value: 20, name: 'rose 6' },
                        { value: 18, name: 'rose 7' },
                        { value: 16, name: 'rose 8' }
                    ]
                }
            ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }

    function devicetypedata() {
        $.ajax({
            url:'/devicelist/getDeviceTypeCount',
            success:function (res) {
                let data=res.data;
                let devicetypedata=[],devicecount=[];
                for(let i=data.length-1;i>=0;i--){
                    let typedata={};
                    typedata.value=data[i].count;
                    typedata.name=data[i].type;
                    devicetypedata.push(data[i].type);
                    devicecount.push(typedata);
                }
                devicetype(devicetypedata,devicecount);
            }
        })
    }

    function devicetype(devicetypedata,devicecount){
        let chartDom =document.getElementById('devicetype') ;
        let myChart = echarts.init(chartDom,layui.echartsTheme);
        let option;
        option = {
            title: {
                text: '各类型设备占比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                top: 'bottom',
                data: devicetypedata
            },
            series: [
                {
                    name: 'Area Mode',
                    type: 'pie',
                    radius: [20, 140],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    data:devicecount
                }
            ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }


    function companydevdata(){
        $.ajax({
            url:'/devicelist/getAddCompanyCount',
            success:function (res) {
                debugger
                let data=res.data;
                let lines=new HashMap();
                let companydata=[],devicecount=[],date=[];
                for(let i=0;i<data.length;i++){
                    date.push(data[i].month);
                    let deviceline={};
                    for(let j=0;j<data[i].devices.length;j++){
                        let devices=data[i].devices[j];
                        let result = companydata.findIndex(ele => ele === devices.agentname)//3
                        if (result>-1) {
                            lines.get(devices.agentname).push(devices.count);
                        }else{
                            companydata.push(devices.agentname);
                            let line=[];
                            for(let k=0;k<i;k++){
                                line.push(0);
                            }
                            line.push(devices.count);
                            lines.put(devices.agentname,line);
                        }
                    }
                    for(let z=0;z<companydata.length;z++){
                        let comline=lines.get(companydata[z]);
                        if(comline.length<=i){
                            let linedata=lines.get(companydata[z]);
                            linedata.push(0);
                            lines.put(companydata[z],linedata);
                        }
                    }
                }
                for(let u=0;u<companydata.length;u++){
                    console.log(companydata[u]);
                    console.log(lines.get(companydata[u]));
                }
                debugger
                companydev(companydata,lines,date.reverse());
            }
        })
    }

    function set_series(companydata,data){
        let series=[];
        for(let i=0;i<companydata.length;i++){
            var item={
                name:companydata[i],
                data:data.get(companydata[i]).reverse(),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                }
            }
            series.push(item);
        }
        return series;
    }

    function companydev(companydata,lines,date){
        let chartDom =document.getElementById('monthdev') ;
        let myChart = echarts.init(chartDom,layui.echartsTheme);
        let option;
        let new_series=set_series(companydata,lines);
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: new_series
        };
        option && myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }

    function HashMap(){
        var length=0;
        var obj=new Object();

        this.isEmpty=function () {
            return length==0;
        }

        this.containKey=function (key) {
            return (key in obj);
        }

        this.containsValue=function (value) {
            for(var key in obj){
                if(obj[key]==value){
                    return true;
                }
            }
            return false;
        }

        this.put=function (key,value) {
            if(!this.containKey(key)){
                length++;
            }
            obj[key]=value;
        }

        this.get=function(key){
            return this.containKey(key)?obj[key]:null;
        }

        this.remove=function(key){
            if(this.containKey(key)&&(delete  obj[key])){
                length--;
            }
        }

        this.values=function () {
            var _values=new Array();
            for(var key in obj){
                _values.push(obj[key]);
            }
            return _values;
        }

        this.keySet=function(){
            var _keys=new Array();
            for(var key in obj){
                _keys.push(key);
            }
        }

        this.size=function(){
            return length;
        }

        this.clear=function () {
            length=0;
            obj=new Object();
        }
    }

        /**
         * 天地图内容
         */
        var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
                maxZoom: 18,
                minZoom: 5
            }),
            normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
                maxZoom: 18,
                minZoom: 5
            }),
            imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
                maxZoom: 18,
                minZoom: 5
            }),
            imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
                maxZoom: 18,
                minZoom: 5
            });

        var normal = L.layerGroup([normalm, normala]),
            image = L.layerGroup([imgm, imga]);
        /**
         * 谷歌
         */
        var normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
                maxZoom: 18,
                minZoom: 5
            }),
            satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
                maxZoom: 18,
                minZoom: 5
            });
        /**
         * 高德地图
         */
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
            "谷歌地图": normalMap,
            "谷歌影像": satelliteMap,
            "高德地图": Gaode,
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

        var projectLayer;
        var markerLayer;
        var projectPoint ={};

        function initialize(lat, lon) {
            map.setView([lat, lon], 1);
        }



        function getAllprojectlocal(json,agentnum){
            $.ajax({
                url:'/project/getAllProjects',
                data:{
                    agentnum:agentnum
                },
                success:function (res) {
                    projectPoint = computeMarker(res.data);
                    initialize(projectPoint.Lat, projectPoint.lon);
                    showProject(res.data);
                    showMarkerProject(json);
                    map.on('zoom', function (ev) {
                        if (map.getZoom() > 13) {
                            map.removeLayer(projectLayer);
                            map.addLayer(markerLayer);
                        } else {
                            map.addLayer(projectLayer);
                            map.removeLayer(markerLayer);
                        }
                    });
                }
            })
        }


        function getcompanymap(agentnumber){
            $.ajax({
                url:'/devicelist/getAllLocalGnss',
                data:{
                    agentnum: agentnumber
                },
                success:function(res){
                    getAllprojectlocal(res.data,agentnumber);
                }
            })
        }

        //获取项目数据

        //显示设备坐标点
        function showMarkerProject(json) {
            let markers = [];
            let myIcon;
            for (let i = 0; i < json.length; i++) {
                let station = json[i];
                for (let j = 0; j < station.length; j++) {
                    let StationName = station[j].name;
                    myIcon = L.icon({
                        stationname: StationName,
                        className: 'iconDiv',
                        iconUrl: '/assets/images/Monitormachine.png',
                        iconAnchor: [25, 30],
                        iconSize: [48, 48],
                    });
                    // }
                    if (station[j].transLat==null||station[j].transLon==null)
                        continue;
                    let marker = L.marker([station[j].transLat, station[j].transLon], {
                        icon: myIcon
                    });
                    marker.on("mouseover", function () {
                        let typename;
                        if (false){
                            //判断设备类型
                            for(let item in SensorType) {
                                if (station[j].typeid === SensorType[item]) {
                                    switch (item) {
                                        case "RAIN":
                                            typename = "雨量计";
                                            break;
                                        case "SOIL":
                                            typename = "含水率计";
                                            break;
                                        case "DIPANGLE":
                                            typename = "倾角计";
                                            break;
                                        case "COLLAPSE":
                                            typename = "崩塌计";
                                            break;
                                        case "MUD":
                                            typename = "泥位计";
                                            break;
                                        case "CRACK":
                                            typename = "裂缝计";
                                            break;
                                        case "DIPEX":
                                            typename = "声光报警器";
                                            break;
                                    }
                                }
                            }
                            //这里是可以随时改图片的路径
                            let s = "<b>传感器名称：" + StationName + "</b><br>传感器类型：" + typename + "<div name='local'  class='devicemarker'>" +
                                "<span></span>" +
                                "</div>";
                            marker.bindPopup(s).openPopup();
                        }else {
                            //判断设备类型
                            if (station[j].typeid == 0) {
                                typename = "移动站";
                            } else {
                                typename = "基准站";
                            }
                            //这里是可以随时改图片的路径
                            let s = "<b>设备名称：" + StationName + "</b><br>设备类型：" + typename + "<div name='local'  class='devicemarker'>" +
                                "<span></span>" +
                                "</div>";
                            ;
                            marker.bindPopup(s).openPopup();
                        }

                    });
                    markers.push(marker);
                }
            }
            markerLayer = L.layerGroup(markers);
        }

        //计算显示项目与项目的中间位置
        function computeMarker(json) {
            let latsum = 0, lonsum = 0, projectlat = 0, projectlon = 0;
            for (let i = 0; i < json.length; i++) {
                let curlat=parseFloat(json[i].proLatitude==null?"0":json[i].proLatitude);
                let curlon=parseFloat(json[i].proLongitude==null?"0":json[i].proLongitude);
                latsum = curlat + latsum;
                lonsum = curlon + lonsum;
            }
            projectlat = latsum / json.length;
            projectlon = lonsum / json.length;
            return {
                Lat: projectlat,
                lon: projectlon
            }
        }


        //显示项目坐标点
        function showProject(json) {
            let latsum = 0, lonsum = 0;
            let markers = [];
            let projectlat = 0;
            let projectlon = 0;
            let oldpid;//获取每组的项目id值
            let newpid = 0;
            let gnsslength=0;//只取gnss设备的数量
            for (let i = 0; i < json.length; i++) {
                projectlat = parseFloat(json[i].proLatitude==null?"0":json[i].proLatitude);
                projectlon = parseFloat(json[i].proLongitude==null?"0":json[i].proLongitude);

                if (isNaN(projectlat)||isNaN(projectlon))
                    continue;

                let myIcon = L.icon({
                    iconUrl: '/assets/images/Monitormachine.png',
                    iconSize: [48, 48],
                    iconAnchor: [10, 30],
                });
                let marker = L.marker([projectlat, projectlon], {
                    icon: myIcon
                });
                let projectid = newpid;
                let projectdetail;
                let statename;
                marker.on("mouseover", function () {
                    projectdetail = json[i];
                        statename = (projectdetail.state === "1") ? "在线" : "离线";
                        $("#tableContent tr:eq(0) td:eq(1)").html(projectdetail.progroupname);
                        $("#tableContent tr:eq(1) td:eq(1)").html(projectdetail.devicenum);
                        $("#tableContent tr:eq(2) td:eq(1)").html(projectdetail.agentname);
                        if (!isNaN(projectdetail.lat) && typeof(projectdetail.lat)!="undefined" && projectdetail.lat!=0){
                            map.setView([projectlat, projectlon], 18);
                        }
                        let s = "<p style='font-size: 10px;margin: 3px;'>项目名称：" + projectdetail.progroupname +
                            "</p><p style='font-size: 10px;margin: 3px;'>设备数量：" + projectdetail.devicenum
                            + "</p><p style='font-size: 10px;margin: 3px;'>所属公司：" + projectdetail.agentname +
                            "</p><div name='local'  class='devicemarker'>" +
                            "<span></span>" +
                            "</div>";
                        ;
                        marker.bindPopup(s).openPopup();
                    });
                markers.push(marker);
                latsum = 0;
                lonsum = 0;
                gnsslength=0;
            }
            projectLayer = L.layerGroup(markers);
            map.addLayer(projectLayer);
        }


    /**获取当前角色的公司列表(主页上的)**/
    function getCompanyListByRole(userid) {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                loadcompanylist(data.data,"#selectcompany");//弹出窗口内的公司列表
            }
        })
    }
    /**加载公司列表**/
    function loadcompanylist(json,el) {
        let arrData = [];
        let selectSn = "";
        for (let i = 0; i < json.length; i++) {
            let item = json[i];
            let jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
        companylist = xmSelect.render({
            el: el,
            data: arrData,
            layVerify: 'required',
            radio: true,
            filterable: true,
            empty: '呀, 没有数据呢',
            clickClose: true,
            initValue:[1],
            layVerType: 'msg',
            theme: {
                color: '#1E9FFF',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
            on: function(data){
                //arr:  当前多选已选中的数据
                let arr = data.arr;
                map.removeLayer(projectLayer);
                map.removeLayer(markerLayer);
                getcompanymap(arr[0].value);
            },
        })
    }

    exports('mainpageimage',{})
});