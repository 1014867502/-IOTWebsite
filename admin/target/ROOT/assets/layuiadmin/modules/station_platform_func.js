layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form

    var locatedata = {};
    var layerindex;
    var chongqingturn = false;


    /**更新模组**/
    function updateModel() {

        let setting = parent.testmodel
        let jsondata = setting.compute.substring(0, setting.compute.length - 1);
        if (setting.locate != null) {
            jsondata += "," + setting.locate.substring(1, setting.locate.length - 1);
        }
        if (setting.plaform != null) {
            jsondata += "," + setting.plaform.substring(1, setting.plaform.length - 1);
        }
        if (setting.auxiliary != null) {
            jsondata += "," + setting.auxiliary.substring(1, setting.auxiliary.length);
        }
        $.ajax({
            url: '/template/updateTemplate',
            data: {
                json: jsondata,
                templatename: templatename,
                type: "2"
            },
            async: false,
            success: function () {
                layer.open({
                    title: '提交'
                    , skin: 'demo-class'
                    , offset: 'auto'
                    , content: '提交成功'
                });
            }
        })
    }

    //将表格数据转化成类
    function datatranform(test) {
        let jsondata = {};
        if (test.dz_iot_enable == "on") {
            if (test.iot_gnss_data == "on") {
                jsondata.dzIotGnssData = 1;
            } else {
                jsondata.dzIotGnssData = 0;
            }
            if (test.iot_rtk_result == "on") {
                jsondata.dzIotRtkResult = 1;
            } else {
                jsondata.dzIotRtkResult = 0;
            }
            jsondata.dzIotHttp = test.iot_http;
            jsondata.dzIotId = test.iot_id;
            jsondata.dzIotIp = test.iot_ip;
            jsondata.dzIotKey = test.iot_key;
            jsondata.dzIotPort = test.iot_port;
            jsondata.dzIotEnabled = 1;
        } else {
            jsondata.dzIotEnabled = 0;
        }
        if (test.onenet_enable == "on") {
            jsondata.oneNetMode = test.onenet_mode;
            switch (test.onenet_mode) {
                case "0":
                    jsondata.oneNetId = test.onenet_id;
                    jsondata.oneNetUser = test.onenet_user;
                    jsondata.oneNetKey = test.onenet_key;
                    jsondata.oneNetGnssData = test.onenet_data;
                    break;
                case "1":
                    jsondata.oneNetId = test.onenet_id;
                    jsondata.oneNetUser = test.onenet_user;
                    jsondata.oneNetKey = test.onenet_key;
                    break;
                case "2":
                    jsondata.oneNetUser = test.onenet_user;
                    jsondata.oneNetKey = test.onenet_key;
                    break;
            }
            jsondata.oneNetEnabled = 1;
        } else {
            jsondata.oneNetEnabled = 0;
        }
        switch (test.chongqing_mode) {
            case "0":
                break;
            case "1":
                jsondata.cqIotUser = test.chongqing_iot_user;
                break;
            case "2":
                jsondata.cqIotTelecom = test.chongqing_iot_telecom;
                jsondata.cqIotId = test.chonqing_iot_id;
                jsondata.cqIotUser = test.chongqing_iot_user;
                jsondata.cqIotKey = test.chongqing_iot_key;
                break;
        }
        if (test.chongqing_enable == "on") {
            jsondata.cqIotEnabled = test.chongqing_mode;
        } else {
            jsondata.cqIotEnabled = 0;
        }
        if (test.gk_enable == "on") {
            jsondata.gkCloudIp = test.gk_ip;
            jsondata.gkCloudPort = test.gk_port;
            jsondata.gkCloudChannel = test.gk_channel;
            jsondata.gkCloudId = test.gk_id;
            jsondata.gkCloudEnabled = 1;
        } else {
            jsondata.gkCloudEnabled = 0;
        }
        if (test.wuling_enable == "on") {
            jsondata.wuLingId = test.wuling_id;
            jsondata.wuLingUser = test.wuling_user;
            jsondata.wuLingKey = test.wuling_key;
            jsondata.wuLingInterval = test.wuling_interval;
            jsondata.wuLingEnabled = 1;
        } else {
            jsondata.wuLingEnabled = 0;
        }
        if (test.lianzhi_enable == "on") {
            jsondata.lianZhiIp = test.lianzhi_ip;
            jsondata.lianZhiPort = test.lianzhi_port;
            jsondata.lianZhiId = test.lianzhi_id;
            jsondata.lianZhiPhoneNum = test.lianzhi_phonenumber;
            jsondata.lianZhiGnssData = test.lianzhi_gnssdata;
            jsondata.lianZhiEnabled = 1;
        } else {
            jsondata.lianZhiEnabled = 0;
        }
        if (test.tgy_enable == "on") {
            jsondata.tgyIp = test.tgy_ip;
            jsondata.tgyPort = test.tgy_port;
            jsondata.tgyId = test.tgy_id;
            jsondata.tgyEnabled = 1;
        } else {
            jsondata.tgyEnabled = 0;
        }
        return jsondata;
    }


    //重庆平台的动态变化
    function chongqingshow(select) {
        $("#chongqing_mode").val(select);
        switch (select) {
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
                $("#chongqing_iot_telecom").val(locatedata.cqIotTelecom);
                $("#chongqing_iot_id").val(locatedata.cqIotId);
                $("#chongqing_iot_key").val(locatedata.cqIotKey);
                $("#chongqing_iot_user").val(locatedata.cqIotUser);
                break;
        }
        form.render();
    }

    /*初始化*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                let device = data.data;
                locatedata = device;
                if (device.oneNetEnabled > 0) {
                    $("#onenet_enable").prop('checked', true);
                    document.getElementById("onenetcontent").innerHTML = onenetcontent;
                    onenetshow(device.oneNetMode);
                } else {
                    $("#onenet_enable").prop('checked', false);
                    document.getElementById("onenetcontent").innerHTML = "";
                }
                $("#onenet_id").val(device.oneNetId);
                $("#onenet_user").val(device.oneNetUser);
                $("#onenet_key").val(device.oneNetKey);
                $("#onenet_data").val(device.oneNetGnssData)

                /*地灾平台*/
                if (device.dzIotEnabled > 0) {
                    $("#dz_iot_enable").prop('checked', true);
                    document.getElementById("dzcontent").innerHTML = dznetcontent;
                } else {
                    $("#dz_iot_enable").prop('checked', false);
                    document.getElementById("dzcontent").innerHTML = "";
                }
                $("#iot_ip").val(device.dzIotIp);
                $("#iot_port").val(device.dzIotPort);
                $("#iot_id").val(device.dzIotId);
                $("#iot_key").val(device.dzIotKey);
                $("#iot_http").val(device.dzIotHttp);
                if (device.dzIotGnssData > 0) {
                    $("#iot_gnss_data").prop('checked', true);
                } else {
                    $("#iot_gnss_data").prop('checked', false);
                }
                if (device.dzIotRtkResult > 0) {
                    $("#iot_rtk_result").prop('checked', true);
                } else {
                    $("#iot_rtk_result").prop('checked', false);
                }

                /*重庆平台*/
                if (device.cqIotEnabled > 0) {
                    $("#chongqing_enable").prop('checked', true);
                    document.getElementById("chongqing_select").innerHTML = chongqingselect;
                    if (!locatedata.cqIotEnabled > 0) {
                        $("#chongqing_mode").val("1");
                        chongqingshow("1");
                    } else {
                        if (locatedata.cqIotEnabled != null && locatedata.cqIotEnabled != "") {
                            $("#chongqing_mode").val(locatedata.cqIotEnabled);
                        }
                        chongqingshow(locatedata.cqIotEnabled);
                    }
                    $("#chongqing_iot_telecom").val(device.cqIotTelecom);
                    $("#chongqing_iot_id").val(device.cqIotId);
                    $("#chongqing_iot_key").val(device.cqIotKey);
                    $("#chongqing_iot_user").val(device.cqIotUser);
                } else {
                    document.getElementById("chongqing_select").innerHTML = "";
                    $("#chongqing_enable").prop('checked', false);
                }
                saveModel();
                form.render();
            }
        })
    }

    /**保存模组**/
    function saveModel() {
        let data1 = form.val("formDemo");
        let jsondata = datatranform(data1);
        delete jsondata.oneNetMode;
        delete jsondata.oneNetId;
        delete jsondata.oneNetUser;
        delete jsondata.onenet_key;
        delete jsondata.oneNetKey;
        delete jsondata.oneNetGnssData;
        delete jsondata.dzIotKey;
        delete jsondata.dzIotId;
        parent.testmodel.plaform = JSON.stringify(jsondata);
    }

    //onenet平台的动态变化
    function onenetshow(select) {
        if (select != null) {
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
                    document.getElementById("")
                    document.getElementById("onenetcontent2").innerHTML = "";
                    break;
            }
        } else {
            document.getElementById("onenetcontent1").innerHTML = devicecontent + productid + devicekey;
            document.getElementById("onenetcontent2").innerHTML = dataid;
        }

        form.render();
    }

    function onenetflush() {
        if (locatedata.oneNetMode != "" && locatedata.oneNetMode != null) {
            $("#onenet_mode").find("option[value=" + locatedata.oneNetMode + "]").prop("selected", true);
        }
        $("#onenet_id").val((locatedata.oneNetId != null) ? locatedata.oneNetId : "");
        $("#onenet_user").val((locatedata.oneNetUser != null) ? locatedata.oneNetUser : "");
        $("#onenet_key").val((locatedata.oneNetKey != null) ? locatedata.oneNetKey : "");
        $("#onenet_data").val((locatedata.oneNetGnssData != null) ? locatedata.oneNetGnssData : "");
    }

    function dzIotflush() {
        $("#iot_ip").val(locatedata.dzIotIp);
        $("#iot_port").val(locatedata.dzIotPort);
        $("#iot_id").val(locatedata.dzIotId);
        $("#iot_key").val(locatedata.dzIotKey);
        $("#iot_http").val(locatedata.dzIotHttp);
        if (locatedata.dzIotGnssData > 0) {
            $("#iot_gnss_data").prop('checked', true);
        } else {
            $("#iot_gnss_data").prop('checked', false);
        }
        if (locatedata.dzIotRtkResult > 0) {
            $("#iot_rtk_result").prop('checked', true);
        } else {
            $("#iot_rtk_result").prop('checked', false);
        }
    }

    function gkflush() {
        $("#gk_ip").val(locatedata.gkCloudIp);
        $("#gk_id").val(locatedata.gkCloudId);
        $("#gk_port").val(locatedata.gkCloudPort);
        $("#gk_channel").val(locatedata.gkCloudChannel);
    }

    function lianzhiflush() {
        $("#lianzhi_ip").val(locatedata.lianZhiIp);
        $("#lianzhi_port").val(locatedata.lianZhiPort);
        $("#lianzhi_id").val(locatedata.lianZhiId);
        $("#lianzhi_phonenumber").val(locatedata.lianZhiPhoneNum);
        $("#lianzhi_gnssdata").val(locatedata.lianZhiGnssData);
    }

    function wulingflush() {
        $("#wuling_id").val(locatedata.wuLingId);
        $("#wuling_user").val(locatedata.wuLingUser);
        $("#wuling_key").val(locatedata.wuLingKey);
        $("#wuling_interval").val(locatedata.wuLingInterval);
    }

    function tongganflush() {
        $("#tgy_id").val(locatedata.tgyId);
        $("#tgy_ip").val(locatedata.tgyIp);
        $("#tgy_port").val(locatedata.tgyPort);
    }

    var onenetcontent = " <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px;display: flex\" >\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px 10px;\">模式</label>\n" +
        "                                <div class=\"layui-input-block\" style=\"margin: 0;\">\n" +
        "                                    <select id=\"onenet_mode\" name=\"onenet_mode\" lay-filter=\"onenet_mode\" lay-verType='tips' lay-verify=\"required\">\n" +
        "                                        <option value=\"\"></option>\n" +
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
        "                                    <input id='onenet_id' type=\"text\" name=\"onenet_id\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var productid = "  <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">产品ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_user' type=\"text\" name=\"onenet_user\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var devicekey = " <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_key' type=\"text\" name=\"onenet_key\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var productkey = " <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">产品KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_key' type=\"text\" name=\"onenet_key\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var dataid = "   <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">数据流ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='onenet_data' type=\"text\" name=\"onenet_data\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var dznetcontent = " <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">MQTT IP</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_ip' type=\"text\" name=\"iot_ip\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ip\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">MQTT 端口</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_port' type=\"text\" name=\"iot_port\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入端口\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\" id='iotid_show'>\n" +
        "                                <label class=\"layui-form-label  \">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_id' type=\"text\" name=\"iot_id\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\" >\n" +
        "                            <div class=\"layui-form-item  fastinput\" id='iotkey_show'>\n" +
        "                                <label class=\"layui-form-label  \">设备KEY</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_key' type=\"text\" name=\"iot_key\" lay-verType='tips' lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入KEY\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">HTTP参数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='iot_http' type=\"text\" name=\"iot_http\" lay-verType='tips' \n" +
        "                                           placeholder=\"请输入http参数\"\n" +
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

    var chongqingcontent = "   <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
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
        "                                    <input id='chongqing_iot_user' type=\"text\" name=\"chongqing_iot_user\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var chongqingselect = "   <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px 10px;\">模式</label>\n" +
        "                        <div class=\"layui-input-block\" style=\"width: 300px\">\n" +
        "                            <select id=\"chongqing_mode\" name=\"chongqing_mode\" lay-verType='tips' lay-filter=\"chongqing_mode\"\n" +
        "                                    lay-verify=\"required\">\n" +
        "                                <option value=\"\"></option>\n" +
        "                                <option value=\"1\">NB-IOT</option>\n" +
        "                                <option value=\"2\">MQTT</option>\n" +
        "                            </select>\n" +
        "                        </div>\n" +
        "                        <div id=\"chongqingcontent\"></div>";

    var chongqingcontent1 = "   <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">运营商</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"chongqing_iot_telecom\" name=\"chongqing_iot_telecom\"\n" +
        "                                       lay-verType='tips'  lay-verify=\"required\">\n" +
        "                                        <option value=\"1\">电信</option>\n" +
        "                                        <option value=\"2\">移动</option>\n" +
        "                                        <option value=\"3\">联通</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_id' type=\"text\" name=\"chonqing_iot_id\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">鉴权码</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='chongqing_iot_key' type=\"text\" name=\"chongqing_iot_key\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入ID\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>";

    var chongqingcontent2 = "  <div class=\"layui-form-item  fastinput\">\n" +
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

    var wulingcontent = " <div style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='wuling_id' type=\"text\" name=\"wuling_id\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入ID\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">用户名</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='wuling_user' type=\"text\" name=\"wuling_user\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入用户名\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">密码</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='wuling_key' type=\"text\" name=\"wuling_key\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入密码\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">上报间隔（秒）</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"wuling_interval\" name=\"wuling_interval\"\n" +
        "                                       lay-verType='tips'  lay-verify=\"required\">\n" +
        "                                        <option value=\"\">请选择</option>\n" +
        "                                        <option value=\"3\">3秒间隔</option>\n" +
        "                                        <option value=\"5\">5秒间隔</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var lianzhicontent = "    <div  style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">服务器IP</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='lianzhi_ip' type=\"text\" name=\"lianzhi_ip\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入Ip\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">服务器端口</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='lianzhi_port' type=\"text\" name=\"lianzhi_port\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">设备ID</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='lianzhi_id' type=\"text\" name=\"lianzhi_id\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入设备ID\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">SIM卡号</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='lianzhi_phonenumber' type=\"text\" name=\"lianzhi_phonenumber\" lay-verType='tips'\n" +
        "                                           placeholder=\"请输入数据\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 89px;padding: 9px;\">回传RTCM3.2（后端解算）</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"lianzhi_gnssdata\" name=\"lianzhi_gnssdata\"\n" +
        "                                       lay-verType='tips'  lay-verify=\"required\">\n" +
        "                                        <option value=\"\">请选择</option>\n" +
        "                                        <option value=\"0\">关闭</option>\n" +
        "                                        <option value=\"1\">1秒间隔</option>\n" +
        "                                        <option value=\"5\">5秒间隔</option>\n" +
        "                                        <option value=\"15\">15秒间隔</option>\n" +
        "                                        <option value=\"30\">30秒间隔</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n"

    var gkcontent = "   <div  style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">服务器IP</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='gk_ip' type=\"text\" name=\"gk_ip\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required|ip\" placeholder=\"请输入Ip\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">服务器端口</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='gk_port' type=\"text\" name=\"gk_port\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">设备号</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='gk_id' type=\"text\" name=\"gk_id\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入设备号\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">通道</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='gk_channel' type=\"text\" name=\"gk_channel\" lay-verType='tips'\n" +
        "                                           lay-verify=\"required\" placeholder=\"请输入数据\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n";

        var tonggancontent="   <div style=\"display: flex;margin-top: 30px\">\n" +
            "                            <div class=\"layui-form-item  fastinput\">\n" +
            "                                <label class=\"layui-form-label  \">服务器IP</label>\n" +
            "                                <div class=\"layui-input-block\">\n" +
            "                                    <input id='tgy_ip' type=\"text\" name=\"tgy_ip\" required lay-verify=\"required|ip\"\n" +
            "                                           placeholder=\"请输入ip\"\n" +
            "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                            <div class=\"layui-form-item  fastinput\">\n" +
            "                                <label class=\"layui-form-label  \">服务器端口</label>\n" +
            "                                <div class=\"layui-input-block\">\n" +
            "                                    <input id='tgy_port' type=\"text\" name=\"tgy_port\" required lay-verify=\"required\"\n" +
            "                                           placeholder=\"请输入端口\"\n" +
            "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div style=\"display: flex;margin-top: 30px\">\n" +
            "                            <div class=\"layui-form-item  fastinput\">\n" +
            "                                <label class=\"layui-form-label  \">设备编码</label>\n" +
            "                                <div class=\"layui-input-block\">\n" +
            "                                    <input id='tgy_id' type=\"text\" name=\"tgy_id\" required lay-verify=\"required\"\n" +
            "                                           placeholder=\"请输入设备编码\"\n" +
            "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>"

    var platformfunc = {
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        onenetexhibit: function (data) {
            onenetshow(data);
        },
        chongqingexhibit: function (data) {
            chongqingshow(data);
        },
        datachange: function (data) {
            let json;
            json = datatranform(data);
            return json;
        },
        onenetupdate: function () {
            onenetflush();
        },
        dzIotupdate: function () {
            dzIotflush();
        },
        gkupdate: function () {
            gkflush();
        },
        lianzhiupdate: function () {
            lianzhiflush();
        },
        wulingupdate: function () {
            wulingflush();
        },
        tongganupdate:function(){
            tongganflush();
        },
        setdevice: function (data) {
            Object.assign(locatedata, data);
        },
        chongqingcontent: chongqingcontent,
        chongqingcontent2: chongqingcontent2,
        chongqingcontent1: chongqingcontent1,
        chongqingselect: chongqingselect,
        dznetcontent: dznetcontent,
        dataid: dataid,
        productkey: productkey,
        onenetcontent: onenetcontent,
        gkcontent: gkcontent,
        lianzhicontent: lianzhicontent,
        wulingcontent: wulingcontent,
        tonggancontent:tonggancontent
    }
    exports('station_platform_func', platformfunc)
});