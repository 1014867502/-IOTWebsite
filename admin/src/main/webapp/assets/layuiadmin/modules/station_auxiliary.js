layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        ,table2=layui.table
        ,form=layui.form

    var locatedata;
    var layerindex;
    var sensorcomLF=[{name:"深圳米朗",value:1,cmd:"010300000002C40B"},{name:"湘银河",value:2,cmd:"AA7510000E000000000000000000000000000000C1"},
        {name:"南京葛南",value:3,cmd:""},{name:"北京基康",value:4,cmd:""},{name:"航空惯性",value:5,cmd:""},{name:"北斗云",value: 6,cmd: ""},
        {name:"上海建岩",value:7,cmd: "01030016000225CF"}];
    var sensorcomYL=[{name:"东方智感",value:1,cmd:""},{name:"国信华源",value:2,cmd:""},{name:"天圻",value: 3,cmd:""}];
    var sensorcomHS=[{name:"东方智感",value:1,cmd:""},{name:"中弘泰科",value:2,cmd:""}];
    var sensorcomQJ=[{name:"中弘泰科",value:1,cmd:"010300000006C5C8"},{name:"航空惯性",value:2,cmd:""},{name:"北斗云",value:3,cmd:""},{name:"深圳米朗",value: 4,cmd:""},
        {name:"湘银河",value: 5,cmd:""},{name:"南京葛南",value:6,cmd:""}];
    var sensorcomNW=[{name:"海川博通",value:1,cmd:"01030001000295CB"}];

    var index = top.layer.getFrameIndex(window.name);//获得layer弹出层索引
    top.layer.iframeAuto(index, 30);//layer弹出层自适应，改造的代码，源代码加上自己加的高度
    var topHeight = ($(top.window).height() - $(window).height())/2;//计算高度
    top.layer.style(index,{top:topHeight+"px"});//设置弹出层位置

    getDeviceSetting(machinesn);

    $("#reset").click(function () {
        getDeviceSetting(machinesn);
    })

    $("#savemodel").click(function () {
        saveModel();
        addModel();
    })


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
            rendersensortable();
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
        let jsondata=datatranform(test);
        let time=workday(test);
        let stringtest=JSON.stringify(jsondata);
        $.ajax({
            url:'/devicelist/editSetting',
            data:{
                setting:stringtest,
                machinesn:machinesn
            },
            success:function (data) {
                model=model+stringtest;
                getDeviceSetting(machinesn);
                alert(data.data);
            }
        })
    })

    form.on('submit(addSensor)',function (data) {
        let jsondata=data.field;
        let stringtest=JSON.stringify(jsondata);
        $.ajax({
            url:'/devicelist/addDeviceSensor',
            data:{
                json:stringtest,
                machinesn:machinesn
            },
            success:function (data) {
                rendersensortable();
                layer.close(layerindex);
            }
        })
    })

    form.on('select(type)',function (data) {
        let type=$("#sensor_type").val();
        document.getElementById("sensor_vender").innerHTML="";
        switch(type){
            case "LF":
                for(let j=0;j<sensorcomLF.length;j++){
                    let options="<option value="+sensorcomLF[j].value+">"+sensorcomLF[j].name+"</option>";
                    $("#sensor_vender").append(options);
                    $("#sensor_cmd").val(sensorcomLF[j].cmd);
                }
                break;
            case "YL":
                for(let j=0;j<sensorcomYL.length;j++){
                    let options="<option value="+sensorcomYL[j].value+">"+sensorcomYL[j].name+"</option>";
                    $("#sensor_vender").append(options);
                    $("#sensor_cmd").val(sensorcomYL[j].cmd);
                }
                break;
            case "HS":
                for(let j=0;j<sensorcomHS.length;j++){
                    let options="<option value="+sensorcomHS[j].value+">"+sensorcomHS[j].name+"</option>";
                    $("#sensor_vender").append(options);
                    $("#sensor_cmd").val(sensorcomHS[j].cmd);
                }
                break;
            case "QJ":
                for(let j=0;j<sensorcomQJ.length;j++){
                    let options="<option value="+sensorcomQJ[j].value+">"+sensorcomQJ[j].name+"</option>";
                    $("#sensor_vender").append(options);
                    $("#sensor_cmd").val(sensorcomQJ[j].cmd);
                }
                break;
            case "NW":
                for(let j=0;j<sensorcomNW.length;j++){
                    let options="<option value="+sensorcomNW[j].value+">"+sensorcomNW[j].name+"</option>";
                    $("#sensor_vender").append(options);
                    $("#sensor_cmd").val(sensorcomNW[j].cmd);
                }
                break;
        }
        form.render("select");
    })

    form.on('select(company)',function (data) {
        let type=$("#sensor_type").val();
        let company=data.value;
        switch(type){
            case "LF":
                for(let j=0;j<sensorcomLF.length;j++){
                  if(company==sensorcomLF[j].value){
                      $("#sensor_cmd").val(sensorcomLF[j].cmd);
                  }
                }
                break;
            case "YL":
                for(let j=0;j<sensorcomYL.length;j++){
                    if(company==sensorcomYL[j].value){
                        $("#sensor_cmd").val(sensorcomYL[j].cmd);
                    }
                }
                break;
            case "HS":
                for(let j=0;j<sensorcomHS.length;j++){
                    if(company==sensorcomHS[j].value){
                        $("#sensor_cmd").val(sensorcomHS[j].cmd);
                    }
                }
                break;
            case "QJ":
                for(let j=0;j<sensorcomQJ.length;j++){
                    if(company==sensorcomQJ[j].value){
                        $("#sensor_cmd").val(sensorcomQJ[j].cmd);
                    }
                }
                break;
            case "NW":
                for(let j=0;j<sensorcomNW.length;j++){
                    if(company==sensorcomNW[j].value){
                        $("#sensor_cmd").val(sensorcomNW[j].cmd);
                    }
                }
                break;
        }
    })

    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        let data = obj.data;
        if (obj.event === 'echarts') {
        }else if(obj.event === 'edit'){
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', {
                offset: '100px'
            },function(index){
                obj.del();
                let jsondata=JSON.stringify(data);
                $.ajax({
                    url:'/devicelist/delDeviceSensor',
                    data:{
                        machineserial:machinesn,
                        json:jsondata
                    },
                    async:false,
                    success:function () {
                        rendersensortable();
                        layer.close(index);
                    }
                });
            });
        }

    })

    //提交模板
    form.on('submit(example)',function () {
        debugger;
        let setting=parent.testmodel
        let jsondata=setting.compute.substring(0,setting.compute.length-1)+","+setting.locate.substring(1,setting.locate.length-1)+","
            +setting.plaform.substring(1,setting.plaform.length-1)+setting.auxiliary.substring(1,setting.auxiliary.length);
        let data1 = form.val("example");
        $.ajax({
            url:'/template/addTemplate',
            data:{
                json:jsondata,
                machinesn:machinesn,
                templatename:data1.templatename,
                type:"2"
            },
            async:false,
            success:function () {
                layer.msg("提交成功");
            }
        })
        layer.close(layerindex);
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
                                layerindex=index;
                            },
                        });
                    });
                    $("#sensor_power").val(device.extSensorPower);
                    rendersensortable();
                } else {
                    $("#sensor_enable").prop('checked',false);
                    document.getElementById("connectsensor").innerHTML = "";
                }

                /*定时*/
                if (device.scheduler!=null&&device.scheduler!="0") {
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
                saveModel();
                form.render();
            }
        })
    }

    /**添加模组**/
    function addModel(){
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['保存模板']
            , area: ['300px', '300px']
            , content: $("#window")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }

    /**保存模组**/
    function saveModel(){
        debugger
        let data1 = form.val("formDemo2");
        let jsondata=datatranform(data1);
        parent.testmodel.auxiliary=JSON.stringify(jsondata);
    }

    //将表格数据转化成类
    function datatranform(test){
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
        return jsondata;
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
        if(locatedata.scheduler!=null&&locatedata.scheduler!=0){
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
    
    /**加载传感器列表**/
    function rendersensortable() {
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , cellMinWidth: 80
            ,height:'400'
            ,request: {
                pageName: 'curr' //页码的参数名称，默认：page
                ,limitName: 'nums' //每页数据量的参数名，默认：limit
            }
            , url: '/devicelist/getDeviceSensorList'
            , where: {'machineserial': machinesn}
            , cols: [[
                  {field: 'interval', title: "间隔", align: 'center'}
                , {field: 'voltage', title: "电压", align: 'center'}
                , {field: 'bruad', title: "串口波特率", align: 'center'}
                , {field: 'sn', title: "编号", align: 'center'}
                , {field: 'type', title: "类型", align: 'center'}
                , {field: 'vender', title: "厂家", align: 'center'}
                , {field: 'cmd', title: "命令", align: 'center'}
                , {field: 'ref', title: "基准值", align: 'center'}
                , {title: '操作', align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            }
        });
    }

    /**初始化公司选这**/

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
        "                        <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px;width: 800px;\">\n" +
        "                            <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">传感器列表</label>"+
        "<script type=\"text/html\" id=\"barDemo\"><a class=\"layui-btn layui-btn-danger layui-btn-xs\" lay-event=\"del\">删除</a> </script>"+
        "                            <button class=\"layui-btn btn_primary\" id='add_sensor' type='button'>新增传感器</button>\n" +
        "                        </div>\n" +
        "                             <table class=\"layui-hide\" id=\"table-form\" lay-filter=\"table-form\"></table>"+
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
        "                                           placeholder=\"请输入数据\"\n" +
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