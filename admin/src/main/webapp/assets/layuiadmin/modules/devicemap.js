layui.define(['table'],function (exports) {
    var SensorType = layui.SensorType;
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
        zoom: 20,
        layers: [Gaodimage],
        zoomControl: false
    });

    L.control.layers(baseLayers, null).addTo(map);
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);

    map.on('zoom', function(ev) {
        console.log("change");
    });


    // var baseLayer = L.tileLayer.colorizr("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     maxZoom: 18,
    //     minZoom: 3,
    //     //layers: [normalm6],
    //     colorize: function (pixel) {
    //         // 这个方法用来调整所有的图片上的rgb值，pixel是图片原有的rgb值
    //         pixel.r -= 20;
    //         pixel.g -= 27;
    //         pixel.b -= 67;
    //         // //pixel.a -= 0.25;
    //         return pixel;
    //     }
    // }).addTo(map);


    $("#mid-one").resize(function () {
        map.invalidateSize(true);
    });

    var proid =progroupid;

    var devicejson;

    //获取gnss设备位置数据
    // $.ajaxSettings.async = false;
    // $.post('/manage/getprojectGnssmapmark?projid=' + projetid, function (res) {
    //     devicejson = res.data;
    //     $.post('/sensordevice/getprojectSensormapmark?projid=' + projetid, function (res) {
    //         sensorjson = res.data;
    //         showDeviceMarker(devicejson, sensorjson);
    //     });
    // });
    // $.ajaxSettings.async = true;
    mapmarker();

    //地图加载设备和传感器位置
    async function mapmarker() {
        devicejson = await getDeviceMarkers();
        showDeviceMarker(devicejson);
    }

    function getDeviceMarkers() {
        let data=[];
        $.ajax({
            url: '/devicelist/getprojectGnssmapmark?projid=' + proid,//接口
            async: false,
            success: function (res) {
                data= res.data;
            }
        });
        return data;
    }

    var devlistLayer;

    function showDeviceMarker(devicejson) {
        var gnssmarkers = [];
        var alldevmarkers = [];
        if(devicejson!=null&&devicejson.length>0){
            for (let i = 0; i < devicejson.length; i++) {
                var station = devicejson[i];

                let $icon = L.icon({
                    stationname: station.sn,
                    className: 'iconDiv',
                    iconUrl: '/assets/images/Monitormachine.png',
                    iconSize: [48, 48],
                    iconAnchor: [25, 30],
                    //shadowAnchor: [4, 62],  // 相同的影子
                    //popupAnchor:  [1, -38] // 该点是相对于iconAnchor弹出信息的位置  这个是我手动调出来的，文档默认原始值是[-1，-76]，我是去一半值，取一半值调出来的
                })
                if (station.lat==0||station.lon==0)
                    continue;
                var marker = L.marker([station.transLat, station.transLon], {
                    icon: $icon
                });
                gnssmarkers.push(marker);
                alldevmarkers.push(marker);
            }
        }
        setgnssmarkers(gnssmarkers);
        devlistLayer = L.layerGroup(alldevmarkers);
        map.addLayer(devlistLayer);

        var center = getCenterCoord();
        map.setView([center.Lat, center.Lon], 15);
    }


    //放置所有设备的位置(针对gnss设备)
    function setgnssmarkers(markers) {
        if (markers==null||markers.length<1)
            return;
        for (let i = 0; i < markers.length; i++) {//以后循环要用let
            markers[i].on("mouseover", function () {
                let markera = markers[i];

                getDeviceDetail(markera,markers[i].options.icon.options.stationname);
                // markers[i].bindPopup().openPopup();
            });
            //节点点击触发图片显示
            markers[i].on("click", function () {
                let markera = markers[i];
                let s = "<div name='devimg'>" +
                    "<img src='/assets/images/'"+markers[i].options.icon.options.stationname+".jpg"+">" +
                    "</div>";
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: true
                    ,area: '800px;'
                    ,shade: 0.8
                    ,id: markers[i].options.icon.options.stationname //设定一个id，防止重复弹出
                    ,btnAlign: 'c'
                    ,moveType: 1 //拖拽模式，0或者1
                    ,content: "<div>" +
                        "<img src='/assets/images/"+markers[i].options.icon.options.stationname+".jpg'"+" style='width: 800px;height:600px'>" +
                        '</div>'
                });
            });
        }
    }

    //获取设备的详细信息用作显示图标显示的数据
    function getDeviceDetail(marker,name) {
        $.ajax({
            url: '/devicelist/getGnssDevicesBySn',
            data: {
                sn: name
            },
            success: function (res) {

                let sn = res.data.name;
                let device=res.data;
                let typename;
                let online;
                //判断设备类型
                if (res.data.typeid == 0) {
                    typename = "移动站";
                } else {
                    typename = "基准站";
                }
                if(device.onlinestate==0){
                    online="离线";
                }else{
                    online="在线";
                }
                //这里是可以随时改图片的路径
                let s ="<div style='width: 300px'>"+
                    "<div style='margin-top: 10px' class='layui-row'><div class='layui-col-md7'>测站编号："+device.devicenumber + "</div><div class='layui-col-md5'>设备类型："+"GNSS"+"</div></div>"+
                    "<div style='margin-top: 10px' class='layui-row'><div class='layui-col-md7'>设备SN："+device.sn + "</div><div class='layui-col-md5'>监测类型："+"地表位移"+"</div></div>"+
                    "<div style='margin-top: 10px' class='layui-row'><div class='layui-col-md7'>仪器型号："+device.name + "</div><div class='layui-col-md5'>运行状态："+online+"</div></div>"+
                    "<div name='local' style='margin-top: 10px' class='stationmarker'><img id='stationimg' src='/assets/images/devicesimages/"+sn+".jpg' style='width: 300px;height: 225px'></div></div>";
                var customOptions = {'maxWidth': 500}
                marker.bindPopup(s,customOptions).openPopup();
            },
            error: function (data) {
                alert("获取失败");
            }
        })
    }

    $('#stationimg').on("click",function () {

        layer.open({
            type: 1
            ,title: false //不显示标题栏
            ,closeBtn: true
            ,area: '800px;'
            ,shade: 0.8
            // ,id: markers[j].options.icon.options.stationname //设定一个id，防止重复弹出
            ,btnAlign: 'c'
            ,moveType: 1 //拖拽模式，0或者1
            ,content: "<div>" +
                "<img src='/assets/images/"+markers[j].options.icon.options.stationname+".jpg'"+" style='width: 800px;height: 600px'>" +
                '</div>'
        });
    })


    function getCenterCoord() {
        var lat = 0;
        var lon = 0;
        var count = 0;
        var curlat = 23;
        var curlon = 113;

        devlistLayer.eachLayer(function (layer) {
            if (layer._latlng.lat > 1 && layer._latlng.lng > 1) {
                lat += layer._latlng.lat;
                lon += layer._latlng.lng;

                count++;
            }
        });
        if (count == 0) {
            lat = curlat;
            lon = curlon;
        } else {
            lat = lat / count;
            lon = lon / count;
        }

        return {
            Lat: lat,
            Lon: lon
        }
    }

    exports('devicemap', {})
});

