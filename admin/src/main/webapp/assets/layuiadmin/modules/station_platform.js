layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form


    form.on('switch(onenet_enable)', function (data) {
        debugger
        if (this.checked) {
            document.getElementById("onenetcontent").innerHTML = onenetcontent;
        } else {
            document.getElementById("onenetcontent").innerHTML = "";
        }
        form.render();
    })

    form.on('switch(dz_iot_enable)', function (data) {
        debugger
        if (this.checked) {
            document.getElementById("dzcontent").innerHTML =dznetcontent;
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

    function chongqingshow(select){
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