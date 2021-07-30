layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        ,table2=layui.table
        ,form=layui.form

    getDeviceSetting(machinesn);

    form.on('switch(sensor_enable)', function (data) {
        if (this.checked) {
          document.getElementById("connectsensor").innerHTML=sensorcontent;
            /*添加设备*/
            $("#add_sensor").click(function () {

                drawer.render({
                    title: '添加设备',  //标题
                    offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                    width: "600px", //r、l抽屉可以设置宽度
                    content: $("#addprowindow"),
                    success :function (layero, index) {

                    },
                });
            })
            sensorflush();
        } else {
           document.getElementById("connectsensor").innerHTML="";
        }
        form.render();
    })

    form.on('switch(scheduler_enable)',function (data) {
        if(this.checked){
            document.getElementById("timeswitch").innerHTML=timecontent;
            schedulerflush();
        }else{
            document.getElementById("timeswitch").innerHTML="";
        }
        form.render();
    })

    form.on('switch(move_warn_enable)',function (data) {
        if(this.checked){
            document.getElementById("warning").innerHTML=warncontent;
            warnflush();
        }else{
            document.getElementById("warning").innerHTML="";
        }
        form.render();
    })

    form.on('submit(formDemo)',function (data) {
        let test=data.field;
        let jsondata={};
        if(test.sensor_enable==="on"){
            jsondata.extSensorEnabled="1";
            jsondata.extSensorPower=test.sensor_power;
        }else{
            jsondata.extSensorEnabled="0";
        }

        if(test.scheduler_enable==="on"){
            let weekday=workday(test);
            jsondata.scheduler=weekday+"|"+test.scheduler_start_time+"|"+test.scheduler_work_time+"|"+test.scheduler_powerlevel;
        }else{
            jsondata.scheduler="0";
        }

        if(test.move_warn_enable==="on"){
            jsondata.moveWarnEnabled="1";
            jsondata.moveWarnThreshold=test.move_warn_dx+"|"+test.move_warn_dy+"|"+test.move_warn_dz;
            jsondata.moveWarnMems=test.move_warn_mems;
            jsondata.moveWarnBaud=test.move_warn_baud;
            jsondata.moveWarnCmd=test.move_warn_cmd;
            jsondata.moveALiYunSms=test.move_warn_aliyun_ms;
        }else{
            jsondata.moveWarnEnabled="0";
        }

        let time=workday(test);
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
                if(device.extSensorEnabled>0){
                    $("#sensor_enable").prop('checked',true);
                    document.getElementById("connectsensor").innerHTML=sensorcontent;
                    /*添加设备*/
                    $("#add_sensor").click(function () {
                        drawer.render({
                            title: '添加设备',  //标题
                            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                            width: "600px", //r、l抽屉可以设置宽度
                            content: $("#addprowindow"),
                            success: function (layero, index) {
                            },
                        });
                    });
                    $("#sensor_power").val(device.extSensorPower);
                } else {
                    $("#sensor_enable").prop('checked',false);
                    document.getElementById("connectsensor").innerHTML = "";
                }

                /*定时*/
                if (device.scheduler!="0") {
                    $("#scheduler_enable").prop('checked',true);
                    let timepara=device.scheduler.split('|');
                    document.getElementById("timeswitch").innerHTML =timecontent;
                    let workdaystr=parseInt(timepara[0]).toString(2);
                    if(workdaystr.length<7){
                        for(let k=0;k<7-workdaystr.length;k++){
                            workdaystr="0"+workdaystr;
                        }
                    }
                    workdaystr=workdaystr.split('').reverse().join('');
                    for(let i=0;i<workdaystr.length;i++){
                        if(workdaystr.charAt(i)!=='0'){
                            let id=i+1;
                            let timeid="#week_"+id;
                            $(timeid).prop("checked",true);
                        }
                    }
                    $("#scheduler_start_time").val(timepara[1]);
                    $("#scheduler_run_time").val(timepara[2]);
                    $("#scheduler_powerlevel").val(timepara[3]);
                } else {
                    $("#scheduler_enable").prop('checked',false);
                    document.getElementById("timeswitch").innerHTML="";
                }


                /*触发报警*/
                if(device.moveWarnEnabled>0){
                    $("#move_warn_enable").prop('checked',true);
                    document.getElementById("warning").innerHTML=warncontent;
                    let movewarn=device.moveWarnThreshold.split("|");
                    $("#move_warn_dx").val(movewarn[0]);
                    $("#move_warn_dy").val(movewarn[1]);
                    $("#move_warn_dz").val(movewarn[2]);
                    $("#move_warn_mems").val(device.moveWarnMems);
                    $("#move_warn_baud").val(device.moveWarnBaud);
                    $("#move_warn_cmd").val(device.moveWarnCmd);
                }else{
                    $("#move_warn_enable").prop('checked',false);
                    document.getElementById("warning").innerHTML = "";
                }
                form.render();
            }
        })
    }

    /*工作时间显示*/
    function  workday(data) {
        let p=0;
        if(data.scheduler_week_1!=null){
            p=p+1;
        }if(data.scheduler_week_2!=null){
            p=p+2;
        }if(data.scheduler_week_3!=null){
            p=p+4;
        }if(data.scheduler_week_4!=null){
            p=p+8;
        }if(data.scheduler_week_5!=null){
            p=p+16;
        }if(data.scheduler_week_6!=null){
            p=p+32;
        }if(data.scheduler_week_7!=null){
            p=p+64;
        }
        return p;
    }

    //传感器刷新
    function sensorflush() {
        if(locatedata.extSensorEnabled>0){
            $("#sensor_power").val(locatedata.extSensorPower);
        }
    }

    //时间刷新
    function schedulerflush() {
        if(locatedata.scheduler!=0){
            let timepara1=locatedata.scheduler.split('|');
            let workday1=parseInt(timepara1[0]).toString(2);
            if(workday1.length<7){
                for(let k=0;k<7-workday1.length;k++){
                    workday1="0"+workday1;
                }
            }
            workday1=workday1.split('').reverse().join('');
            for(let i=0;i<workday1.length;i++){
                if(workday1.charAt(i)!=='0'){
                    let id=i+1;
                    let timeid="#week_"+id;
                    $(timeid).prop("checked",true);
                }
            }
            $("#scheduler_start_time").val(timepara1[1]);
            $("#scheduler_run_time").val(timepara1[2]);
            $("#scheduler_powerlevel").val(timepara1[3]);
        }
    }

    //警告刷新
    function  warnflush() {
        if(locatedata.moveWarnEnabled>0){
            let movewarn=locatedata.moveWarnThreshold.split("|");
            $("#move_warn_dx").val(movewarn[0]);
            $("#move_warn_dy").val(movewarn[1]);
            $("#move_warn_dz").val(movewarn[2]);
            $("#move_warn_mems").val(locatedata.moveWarnMems);
            $("#move_warn_baud").val(locatedata.moveWarnBaud);
            $("#move_warn_cmd").val(locatedata.moveWarnCmd);
        }
    }

    var sensorcontent="<div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\" >\n" +
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

    var timecontent=" <div id=\"chongqiselect\">\n" +
        "                            <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">开机日期</label>\n" +
        "                                <div class=\"layui-input-block\" style=\"display: flex\">\n" +
        "                                    <input type=\"checkbox\" id='week_1'  name=\"scheduler_week_1\"  title=\"星期一\">\n" +
        "                                    <input type=\"checkbox\" id='week_2'  name=\"scheduler_week_2\"  title=\"星期二\">\n" +
        "                                    <input type=\"checkbox\" id='week_3'  name=\"scheduler_week_3\"  title=\"星期三\">\n" +
        "                                    <input type=\"checkbox\" id='week_4'  name=\"scheduler_week_4\"  title=\"星期四\">\n" +
        "                                    <input type=\"checkbox\" id='week_5'  name=\"scheduler_week_5\"  title=\"星期五\">\n" +
        "                                    <input type=\"checkbox\" id='week_6'  name=\"scheduler_week_6\"  title=\"星期六\">\n" +
        "                                    <input type=\"checkbox\" id='week_7'  name=\"scheduler_week_7\"  title=\"星期日\">\n" +
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
        "                                    <select id=\"scheduler_run_time\" name=\"scheduler_work_time\" lay-verify=\"required\">\n" +
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
        "                                    <select id=\"scheduler_powerlevel\" name=\"scheduler_powerlevel\" lay-verify=\"required\">\n" +
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

    var warncontent=" <div style=\"display: flex;margin-top: 30px\">\n" +
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
    exports('station_auxiliary', {})
});