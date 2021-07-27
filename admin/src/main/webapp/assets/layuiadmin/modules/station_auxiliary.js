layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        ,table2=layui.table
        ,form=layui.form


    form.on('switch(onenet_enable)', function (data) {
        if (this.checked) {
          document.getElementById("connectsensor").innerHTML="<div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\" >\n" +
              "                            <div class=\"layui-form-item  fastinput\">\n" +
              "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">输出电源</label>\n" +
              "                                <div class=\"layui-input-block\">\n" +
              "                                    <select id=\"sensor_power\" name=\"sensor_power\" lay-verify=\"required\">\n" +
              "                                        <option value=\"0\">关闭</option>\n" +
              "                                        <option value=\"1\">5V</option>\n" +
              "                                        <option value=\"2\">12V</option>\n" +
              "                                    </select>\n" +
              "                                </div>\n" +
              "                            </div>\n" +
              "                        </div>\n" +
              "                        <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
              "                            <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">传感器列表</label>\n" +
              "                            <button class=\"layui-btn btn_primary\" id='add_sensor' type='button'>新增传感器</button>\n" +
              "                        </div>\n" +
              "                        <div style=\"display: flex;margin-top: 30px\">\n" +
              "                            <div class=\"layui-form-item  fastinput\">\n" +
              "                                <label class=\"layui-form-label  \">数据流ID</label>\n" +
              "                                <div class=\"layui-input-block\">\n" +
              "                                    <input id='onenet_data' type=\"text\" name=\"coordvt_dst_datum_da\" required lay-verify=\"required\"\n" +
              "                                           placeholder=\"请输入ID\"\n" +
              "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
              "                                </div>\n" +
              "                            </div>\n" +
              "                        </div>";
            /*添加设备*/
            $("#add_sensor").click(function () {
                debugger
                drawer.render({
                    title: '添加设备',  //标题
                    offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                    width: "600px", //r、l抽屉可以设置宽度
                    content: $("#addprowindow"),
                    success :function (layero, index) {

                    },
                });
            })
        } else {
           document.getElementById("connectsensor").innerHTML="";
        }
        form.render();
    })

    form.on('switch(chongqing_iot_turn)',function (data) {
        if(this.checked){
            document.getElementById("timeswitch").innerHTML=" <div id=\"chongqiselect\">\n" +
                "                            <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">开机日期</label>\n" +
                "                                <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_1\" name=\"scheduler_week_1\"  title=\"星期一\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_2\" name=\"scheduler_week_2\"  title=\"星期二\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_3\" name=\"scheduler_week_3\"  title=\"星期三\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_4\" name=\"scheduler_week_4\"  title=\"星期四\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_5\" name=\"scheduler_week_5\"  title=\"星期五\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_6\" name=\"scheduler_week_6\"  title=\"星期六\">\n" +
                "                                    <input type=\"checkbox\" lay-filter=\"scheduler_week_7\" name=\"scheduler_week_7\"  title=\"星期日\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">开机时间</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"scheduler_start_time\" name=\"scheduler_start_time\" lay-verify=\"required\">\n" +
                "                                        <option value=\"0\">00:00</option>\n" +
                "                                        <option value=\"4\">04:00</option>\n" +
                "                                        <option value=\"8\">08:00</option>\n" +
                "                                        <option value=\"12\">12:00</option>\n" +
                "                                        <option value=\"16\">16:00</option>\n" +
                "                                        <option value=\"20\">20:00</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">工作时间</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"scheduler_run_time\" name=\"chongqing_iot_telecom\" lay-verify=\"required\">\n" +
                "                                        <option value=\"2\">2小时</option>\n" +
                "                                        <option value=\"4\">4小时</option>\n" +
                "                                        <option value=\"8\">8小时</option>\n" +
                "                                        <option value=\"12\">12小时</option>\n" +
                "                                        <option value=\"24\">24小时</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">关机电量</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"scheduler_powerlevel\" name=\"scheduler_start_time\" lay-verify=\"required\">\n" +
                "                                        <option value=\"10\">10%</option>\n" +
                "                                        <option value=\"20\">20%</option>\n" +
                "                                        <option value=\"30\">30%</option>\n" +
                "                                        <option value=\"40\">40%</option>\n" +
                "                                        <option value=\"50\">50%</option>\n" +
                "                                        <option value=\"60\">60%</option>\n" +
                "                                        <option value=\"70\">70%</option>\n" +
                "                                        <option value=\"80\">80%</option>\n" +
                "                                        <option value=\"90\">90%</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>";
        }else{
            document.getElementById("timeswitch").innerHTML="";
        }
        form.render();
    })

    form.on('switch(dz_iot_enable)',function (data) {
        if(this.checked){
            document.getElementById("warning").innerHTML=" <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label  \">X位移阈值(mm)</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id='move_warn_dx' type=\"text\" name=\"move_warn_dx\" required lay-verify=\"required\"\n" +
                "                                           placeholder=\"请输入数据\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label  \">Y位移阈值(mm)</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id='move_warn_dy' type=\"text\" name=\"move_warn_dy\" required lay-verify=\"required\"\n" +
                "                                           placeholder=\"请输入数据\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label  \">H位移阈值(mm)</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id='move_warn_dz' type=\"text\" name=\"move_warn_dz\" required lay-verify=\"required\"\n" +
                "                                           placeholder=\"请输入KEY\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">MEMS倾斜</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"move_warn_mems\" name=\"move_warn_mems\" lay-verify=\"required\">\n" +
                "                                            <option value=\"0\">关闭</option>\n" +
                "                                            <option value=\"0.3\">0.3度</option>\n" +
                "                                            <option value=\"0.5\">0.5度</option>\n" +
                "                                            <option value=\"1\">1度</option>\n" +
                "                                            <option value=\"2\">2度</option>\n" +
                "                                            <option value=\"3\">3度</option>\n" +
                "                                            <option value=\"5\">5度</option>\n" +
                "                                            <option value=\"10\">10度</option>\n" +
                "                                        </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">串口输出</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"move_warn_baud\" name=\"move_warn_baud\" lay-verify=\"required\">\n" +
                "                                        <option value=\"9600\" selected>(RS485)9600 bps</option>\n" +
                "                                        <option value=\"19200\">(RS485)19200 bps</option>\n" +
                "                                        <option value=\"38400\">(RS485)38400 bps</option>\n" +
                "                                        <option value=\"115200\">(RS485)115200 bps</option>\n" +
                "                                        <option value=\"-9600\">(RS232)9600 bps</option>\n" +
                "                                        <option value=\"-19200\">(RS232)19200 bps</option>\n" +
                "                                        <option value=\"-38400\">(RS232)38400 bps</option>\n" +
                "                                        <option value=\"-115200\">(RS232)115200 bps</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item\" style=\"width: 100%\">\n" +
                "                                <label style=\"width: 84px;padding: 9px 12px;\" class=\"layui-form-label\">报警命令</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"move_warn_cmd\"  name=\"move_warn_cmd\" lay-skin=\"switch\"\n" +
                "                                           placeholder=\"格式：“报警命令”或“开始报警;结束报警”，支持16进制和文本命令\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item\" style=\"width: 100%\">\n" +
                "                                <label style=\"width: 98px;padding: 9px 5px;\" class=\"layui-form-label\">阿里云短信报警</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"move_warn_aliyun_ms\"  name=\"move_warn_aliyun_ms\" lay-skin=\"switch\"\n" +
                "                                           placeholder=\"参数：“接收手机号|AccessKeyId|AccessKeySecret|短信模板|短信签名”，不使用留空；\n" +
                "短信模板支持变量：name,title,North,East,Height,TotalNorth,TotalEast,TotalHeight,dX,dY,dZ,TotalX,TotalY,TotalZ\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>";
        }else{
            document.getElementById("warning").innerHTML="";
        }
        form.render();
    })



    exports('station_auxiliary', {})
});