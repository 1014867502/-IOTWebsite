layui.define(['table'],function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , form = layui.form
        ,layer=layui.layer

    /**
     * 智图地图内容
     */
    var normalm1 = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm2 = L.tileLayer.chinaProvider('Geoq.Normal.Color', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm3 = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm4 = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm5 = L.tileLayer.chinaProvider('Geoq.Normal.Warm', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm6 = L.tileLayer.chinaProvider('Geoq.Normal.Cold', {
        maxZoom: 18,
        minZoom: 5
    });
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
        map.setView([lat, lon], 6);
    }



    function getAllprojectlocal(json){
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
                //map.addLayer(markerLayer);
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



    //获取项目数据
    $.ajax({
        url:'/devicelist/getAllLocalGnss',
        data:{
            agentnum: agentnum
        },
        success:function(res){
            getAllprojectlocal(res.data);
        }

    })

    //显示设备坐标点
    function showMarkerProject(json) {
        let markers = [];
        let myIcon;
        for (let i = 0; i < json.length; i++) {
            let station = json[i];
            for (let j = 0; j < station.length; j++) {
                let StationName = station[j].name;
                // if (false) {//判断是否为传感器
                //     switch (station[j].typeid) {//根据传感器类型来判断图标
                //         case 0:
                //             myIcon = L.icon({
                //                 stationname: StationName,
                //                 className: 'iconDiv',
                //                 iconUrl: '/assets/images/Raingauge.png',
                //                 iconSize: [48, 48],
                //                 iconAnchor: [25, 30],
                //             });
                //             break;
                //         case 1:
                //             myIcon = L.icon({
                //                 stationname: StationName,
                //                 className: 'iconDiv',
                //                 iconUrl: '/assets/images/Soilmoisture.png',
                //                 iconSize: [48, 48],
                //                 iconAnchor: [25, 30],
                //             });
                //             break;
                //         case 2:
                //             myIcon = L.icon({
                //                 stationname: StationName,
                //                 className: 'iconDiv',
                //                 iconUrl: '/assets/images/Accelerometer.png',
                //                 iconSize: [48, 48],
                //                 iconAnchor: [25, 30],
                //             });
                //             break;
                //     }
                // } else {
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
                // let statename = (station[j].onlinestate === 1) ? "在线" : "离线";
                // marker.on("click", function () {
                //     $("#markerContent tr:eq(0) td:eq(1)").html(station[j].stationname);
                //     $("#markerContent tr:eq(1) td:eq(1)").html(station[j].address);
                //     $("#markerContent tr:eq(2) td:eq(1)").html(station[j].devicecount);
                //     $("#markerContent tr:eq(3) td:eq(1)").html(station[j].profile);
                //     $("#markerContent tr:eq(4) td:eq(1)").html(station[j].incharge);
                //     $("#markerContent tr:eq(5) td:eq(1)").html(station[j].telephone);
                //     $("#markerContent tr:eq(6) td:eq(1)").html(statename);
                //     layer.open({
                //         type: 1,
                //         closeBtn: 0,
                //         shadeClose: true,
                //         title: false,
                //         content: $('#markerContent')
                //     });
                // });
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

    function sum(arr) {
        var s = 0;
        for (var i = arr.length - 1; i >= 0; i--) {
            s += arr[i];
        }
        return s;
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

            marker.on("click", function () {
                $.post('/project/getProjectById?projectid=' + json[i].projectid, function (res) {
                    projectdetail = json[i];
                    statename = (projectdetail.state === "1") ? "在线" : "离线";
                    $("#tableContent tr:eq(0) td:eq(1)").html(projectdetail.progroupname);
                    $("#tableContent tr:eq(1) td:eq(1)").html(projectdetail.devicenum);
                    $("#tableContent tr:eq(2) td:eq(1)").html(projectdetail.agentname);
                    if (!isNaN(projectdetail.lat) && typeof(projectdetail.lat)!="undefined" && projectdetail.lat!=0){
                        map.setView([projectlat, projectlon], 18);
                    }

                });
                layer.open({
                    type: 1,
                    closeBtn: 0,
                    shadeClose: true,
                    title: false,
                    content: $('#tableContent')
                });
            });
            markers.push(marker);
            latsum = 0;
            lonsum = 0;
            gnsslength=0;
        }
        projectLayer = L.layerGroup(markers);
        map.addLayer(projectLayer);
    }

    exports('projectmap', {})
});

