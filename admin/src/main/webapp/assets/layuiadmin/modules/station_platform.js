layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form

    var locatedata;

    getDeviceSetting(machinesn);

    form.on('switch(onenet_enable)', function (data) {
        if (this.checked) {
            document.getElementById("onenetcontent").innerHTML = onenetcontent;
            if(locatedata.oneNetMode!=null){
                onenetshow(locatedata.oneNetMode);
            }else{
                onenetshow("0");
            }
            getDeviceSetting(machinesn);
        } else {
            document.getElementById("onenetcontent").innerHTML = "";
        }
        form.render();
    })

    form.on('switch(dz_iot_enable)', function (data) {
        if (this.checked) {
            document.getElementById("dzcontent").innerHTML =dznetcontent;
            getDeviceSetting(machinesn);
        } else {
            document.getElementById("dzcontent").innerHTML = "";
        }
        form.render();
    })

    form.on('select(onenet_mode)', function (data) {
        let select = data.value;
        onenetshow(select);
    });

    form.on('select(chongqing_mode)', function (data) {
        let select = data.value;
        chongqingshow(select);
    });

    form.on('submit(formDemo)',function (data) {
        let test=data.field;
        let jsondata={};


        if(test.dz_iot_enable=="on"){
            jsondata.dzIotEnabled=1;
            if(test.iot_gnss_data=="on"){
                jsondata.dzIotGnssData=1;
            }else {
                jsondata.dzIotGnssData=0;
            }
            if(test.iot_rtk_result=="on"){
                jsondata.dzIotRtkResult=1;
            }else{
                jsondata.dzIotRtkResult=0;
            }
            jsondata.dzIotHttp=test.iot_http;
            jsondata.dzIotId=test.iot_id;
            jsondata.dzIotIp=test.iot_ip;
            jsondata.dzIotKey=test.iot_key;
            jsondata.dzIotPort=test.iot_port;
        }else{
            jsondata.dzIotEnabled=0;
        }


        if(test.onenet_enable=="on"){
            jsondata.oneNetEnabled=1;
            jsondata.oneNetMode=test.onenet_mode;
            switch(test.onenet_mode){
                case "0":
                    jsondata.oneNetId=test.onenet_id;
                    jsondata.oneNetUser=test.onenet_user;
                    jsondata.oneNetKey=test.onenet_key;
                    jsondata.oneNetGnssData=test.onenet_data;
                    break;
                case "1":
                    jsondata.oneNetId=test.onenet_id;
                    jsondata.oneNetUser=test.onenet_user;
                    jsondata.oneNetKey=test.onenet_key;
                    break;
                case "2":
                    jsondata.oneNetUser=test.onenet_user;
                    jsondata.oneNetKey=test.onenet_key;
                    break;
            }
        }else{
            jsondata.oneNetEnabled=0;
        }

        jsondata.cqIotEnabled=test.chongqing_mode;
        switch(test.chongqing_mode){
            case "0":
                break;
            case "1":
                jsondata.cqIotUser=test.chongqing_iot_user;
                break;
            case "2":
                jsondata.cqIotTelecom=test.chongqing_iot_telecom;
                jsondata.cqIotId=test.chonqing_iot_id;
                jsondata.cqIotUser=test.chongqing_iot_user;
                jsondata.cqIotKey=test.chongqing_iot_key;
                break;
        }
        let stringtest=JSON.stringify(jsondata);
        $.ajax({
            url:'/devicelist/editSetting',
            data:{
                setting:stringtest,
                machinesn:machinesn
            },
            success:function (data) {
                getDeviceSetting(machinesn);
                alert(data.data);
            }
        })
    })

    //onenet平台的动态变化
    function onenetshow(select) {
        switch (select) {
            case "0":
                document.getElementById("onenetcontent1").innerHTML = devicecontent + productid + devicekey;
                document.getElementById("onenetcontent2").innerHTML = dataid;
                break;
            case "1":
                document.getElementById("onenetcontent1").innerHTML = devicecontent + productid + devicekey;
                document.getElementById("onenetcontent2").innerHTML = "";
                break;
            case "2":
                document.getElementById("onenetcontent1").innerHTML = productid + productkey;
                document.getElementById("onenetcontent2").innerHTML = "";
                break;
        }
        form.render();
    }

    //重庆平台的动态变化
    function chongqingshow(select){
        $("#chongqing_mode").val(select);
        switch(select){
            case "0":
                document.getElementById("chongqingcontent").innerHTML = "";
                break;
            case "1":
                document.getElementById("chongqingcontent").innerHTML = chongqingcontent;
                document.getElementById("chongqingsetting").innerHTML = chongqingcontent2;
                break;
            case "2":
                document.getElementById("chongqingcontent").innerHTML = chongqingcontent;
                document.getElementById("chongqingsetting").innerHTML = chongqingcontent1;
                break;
        }
        form.render();
    }

    /*初始化*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/devicelist/getDeviceSetting',
            data: {
                machineSerial: sn
            },
            success: function (data) {
                let device = data.data;
                locatedata=device;
                if(device.oneNetEnabled>0){
                        $("#onenet_enable").prop('checked',true);
                        document.getElementById("onenetcontent").innerHTML = onenetcontent;
                        onenetshow(device.oneNetMode);
                } else {
                        document.getElementById("onenetcontent").innerHTML = "";
                }
                $("#onenet_id").val(device.oneNetId);
                $("#onenet_user").val(device.oneNetUser);
                $("#onenet_key").val(device.oneNetKey);
                $("#onenet_data").val(device.oneNetGnssData)

                /*地灾平台*/
                if (device.dzIotEnabled>0) {
                    $("#dz_iot_enable").prop('checked',true);
                    document.getElementById("dzcontent").innerHTML =dznetcontent;

                } else {
                    document.getElementById("dzcontent").innerHTML = "";
                }
                $("#iot_ip").val(device.dzIotIp);
                $("#iot_port").val(device.dzIotPort);
                $("#iot_id").val(device.dzIotId);
                $("#iot_key").val(device.dzIotKey);
                $("#iot_http").val(device.dzIotHttp);
                if(device.dzIotGnssData>0){
                    $("#iot_gnss_data").prop('checked',true);
                }else{
                    $("#iot_gnss_data").prop('checked',false);
                }
                if(device.dzIotRtkResult>0){
                    $("#iot_rtk_result").prop('checked',true);
                }else{
                    $("#iot_rtk_result").prop('checked',false);
                }

                /*重庆平台*/
                chongqingshow(device.cqIotEnabled);
                $("#chongqing_iot_telecom").val(device.cqIotTelecom);
                $("#chongqing_iot_id").val(device.cqIotId);
                $("#chongqing_iot_key").val(device.cqIotKey);
                $("#chongqing_iot_user").val(device.cqIotUser);

                form.render();
            }
        })
    }


    var onenetcontent = " <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px;display: flex\" >\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px 10px;\">模式</label>\n" +
        "                                <div class=\"layui-input-block\" style=\"margin: 0;\">\n" +
        "                                    <select id=\"onenet_mode\" name=\"onenet_mode\" lay-filter=\"onenet_mode\" lay-verify=\"required\">\n" +
        "                                        <option value=\"0\">MQTT</option>\n" +
        "                                        <option value=\"1\">MQTT-S</option>\n" +
        "                                        <option value=\"2\">MQTT-S自注册</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                          <div id=\"onenetcontent1\" style='display: flex'></div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div id=\"onenetcontent2\" style='display: flex'></div>\n" +
        "                        </div>";

    var devicecontent = " <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_id' type=\"text\" name=\"onenet_id\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var productid = "  <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">产品ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_user' type=\"text\" name=\"onenet_user\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var devicekey = " <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_key' type=\"text\" name=\"onenet_key\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var productkey = " <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">产品KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_key' type=\"text\" name=\"onenet_key\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var dataid = "   <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">数据流ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_data' type=\"text\" name=\"onenet_data\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var dznetcontent=" <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">MQTT IP</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_ip' type=\"text\" name=\"iot_ip\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ip\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">MQTT 端口</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_port' type=\"text\" name=\"iot_port\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入端口\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_id' type=\"text\" name=\"iot_id\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_key' type=\"text\" name=\"iot_key\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">HTTP参数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_http' type=\"text\" name=\"iot_http\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label style=\"width: 90px;padding: 9px 12px;\" class=\"layui-form-label\">上传RTCM3.2</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id=\"iot_gnss_data\" type=\"checkbox\" name=\"iot_gnss_data\" lay-skin=\"switch\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label style=\"width: 114px;padding: 9px 6px;\" class=\"layui-form-label\">上传RTK解算结果</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id=\"iot_rtk_result\" type=\"checkbox\" name=\"iot_rtk_result\" lay-skin=\"switch\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var chongqingcontent="   <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
        "                            <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">参数设置</label>\n" +
        "                            <button type=\"button\" class=\"layui-btn btn_primary\">读取IMEI</button>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                          <div id=\"chongqingsetting\" style=\"display: flex\"></div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">产品ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_user' type=\"text\" name=\"chongqing_iot_user\" required\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var chongqingcontent1="   <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">运营商</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"chongqing_iot_telecom\" name=\"chongqing_iot_telecom\"\n" +
        "                                            lay-verify=\"required\">\n" +
        "                                        <option value=\"1\">电信</option>\n" +
        "                                        <option value=\"2\">移动</option>\n" +
        "                                        <option value=\"3\">联通</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_id' type=\"text\" name=\"chonqing_iot_id\" required\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">鉴权码</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_key' type=\"text\" name=\"chongqing_iot_key\" required\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var chongqingcontent2="  <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">NB IMEI</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_nb_imei' type=\"text\" name=\"chongqing_iot_nb_imei\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-select input-sm layui-btn-disabled\"\n" +
        "                                           disabled>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">NB IMSI</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_nb_imsi' type=\"text\" name=\"chongqing_iot_nb_imsi\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-select input-sm layui-btn-disabled\"\n" +
        "                                           disabled>\n" +
        "                                </div>\n" +
        "                            </div>";
    exports('station_platform', {})
});