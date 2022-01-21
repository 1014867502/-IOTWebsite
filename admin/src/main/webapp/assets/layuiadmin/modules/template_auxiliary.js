layui.define(['form', 'drawer', 'table','station_auxiliary_func','station_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        ,table2=layui.table
        ,auxiliaryfunc=layui.station_auxiliary_func
        ,stationfunc=layui.station_func
        // ,templatform=layui.template_platform
        // ,temcompute=layui.template_compute
        // ,temlocate=layui.template_locate
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

    form.verify({
        ip: [
            /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            , 'IP地址不符合规则'
        ],
        title: function (value) {
            if (value.length < 5) {
                return '标题至少得5个字符啊';
            }
            l
        }
        , Ndouble: [
            /^[1-9]\d*$/
            , '只能输入整数哦'
        ]
        ,number:[
            /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,20})$)|^(([1-9]+)$)/
            ,"输入数字有误！"
        ]
        , Lon: [
            /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,2})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,2}|180)$/
            , '经度输入有误'
        ]
        , Lat: [
            /^([0-8]?\d{1}\.\d{2}|90\.0{2}|[0-8]?\d{1}|90)$/
            , '纬度输入有误'
        ]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        , content: function (value) {
            layedit.sync(editIndex);
        },templatename:function (value) {
            let judge;
            $.ajax({
                url:'/template/getTemplateByName',
                data: {
                    name: value
                },
                async:false,
                success:function (data) {
                    judge=data.data;
                }
            })
            if(judge!=null){
                return "已存在当前名称，请重新输入";
            }
        }
    });

    if(type==1){
        getDeviceSetting(templatename);
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo2")){
                saveModel();
                updateModel();
            }
        })
    }else{
        getDeviceSetting("init");
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo2")){
                saveModel();
                addModel();
            }
        })
        $("#reset").css("display","none");
        $("#changename").css("display","none");
    }


    $("#reset").click(function () {
        getDeviceSetting(templatename);
    })

    $("#changename").click(function () {
        changename();
    })



    form.on('switch(sensor_enable)', function (data) {
        if (this.checked) {
            document.getElementById("connectsensor").innerHTML=auxiliaryfunc.sensorcontent1;
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
            auxiliaryfunc.sensorupdate();
        } else {
            document.getElementById("connectsensor").innerHTML="";
        }
        form.render();
    })

    form.on('switch(scheduler_enable)',function (data) {
        if(this.checked){
            document.getElementById("timeswitch").innerHTML=auxiliaryfunc.timecontent;
            auxiliaryfunc.timeupdate();
        }else{
            document.getElementById("timeswitch").innerHTML="";
        }
        form.render();
    })

    form.on('switch(move_warn_enable)',function (data) {
        if(this.checked){
            document.getElementById("warning").innerHTML=auxiliaryfunc.warncontent;
            auxiliaryfunc.warnupdate();
        }else{
            document.getElementById("warning").innerHTML="";
        }
        form.render();
    })

    form.on('submit(formDemo)',function (data) {
        let test=data.field;
        let jsondata=auxiliaryfunc.datachange(test);
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
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: stationfunc.layerhieght().top + 100
                    ,content: '提交成功'
                });
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


    //提交模板
    form.on('submit(example)',function () {
        let data1 = form.val("example");
        $.ajax({
            url:'/template/updateModelNameByName',
            data:{
                name:templatename,
                newname:data1.templatename,
                type:"2"
            },
            async:false,
            success:function () {
                layer.msg("修改成功");
            }
        })
        layer.close(layerindex);
    })


    /*初始化*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                let device = data.data;
                if (device.rawName!=null) {
                    locatedata = device;
                    auxiliaryfunc.setdevice(device);
                    if (device.extSensorEnabled > 0) {
                        $("#sensor_enable").prop('checked', true);
                        document.getElementById("connectsensor").innerHTML = auxiliaryfunc.sensorcontent1;
                        /*添加设备*/
                        if (device.extSensorPower != "" && device.extSensorPower != null) {
                            $("#sensor_power").val(device.extSensorPower);
                        }
                    } else {
                        $("#sensor_enable").prop('checked', false);
                        document.getElementById("connectsensor").innerHTML = "";
                    }
                    if (parent.window.writeright == 0) {
                        $("#changename").prop("disabled", true);
                        $("#errormsg").html("修改权限被限制");
                        $("#changename").addClass("layui-btn-disabled");
                        $("#savemodel").prop("disabled", true);
                        $("#savemodel").addClass("layui-btn-disabled");
                    }
                    /*定时*/
                    if (device.scheduler != null && device.scheduler != "0") {
                        $("#scheduler_enable").prop('checked', true);
                        let timepara1 = device.scheduler.split('|');
                        document.getElementById("timeswitch").innerHTML = auxiliaryfunc.timecontent;
                        let workdaystr = parseInt(timepara1[0]).toString(2);
                        if (workdaystr.length < 7) {
                            for (let k = 0; k < 7 - workdaystr.length; k++) {
                                workdaystr = "0" + workdaystr;
                            }
                        }
                        workdaystr = workdaystr.split('').reverse().join('');
                        for (let i = 0; i < workdaystr.length; i++) {
                            if (workdaystr.charAt(i) !== '0') {
                                let id = i + 1;
                                let timeid = "#week_" + id;
                                $(timeid).prop("checked", true);
                            }
                        }
                        if (timepara1[1] != "" && timepara1[1] != null) {
                            $("#scheduler_start_time").val(timepara1[1]);
                        }
                        if (timepara1[2] != "" && timepara1[2] != null) {
                            $("#scheduler_run_time").val(timepara1[2]);
                        }
                        if (timepara1[3] != "" && timepara1[3] != null) {
                            $("#scheduler_powerlevel").val(timepara1[3]);
                        }
                    } else {
                        $("#scheduler_enable").prop('checked', false);
                        document.getElementById("timeswitch").innerHTML = "";
                    }


                    /*触发报警*/
                    if (device.moveWarnEnabled > 0) {
                        $("#move_warn_enable").prop('checked', true);
                        document.getElementById("warning").innerHTML = auxiliaryfunc.warncontent;
                        let movewarn = device.moveWarnThreshold.split("|");
                        $("#move_warn_dx").val(movewarn[0]);
                        $("#move_warn_dy").val(movewarn[1]);
                        $("#move_warn_dz").val(movewarn[2]);
                        if (locatedata.moveWarnMems != "" && locatedata.moveWarnMems != null) {
                            $("#move_warn_mems").val(locatedata.moveWarnMems);
                        }
                        if (locatedata.moveWarnBaud != "" && locatedata.moveWarnBaud != null) {
                            $("#move_warn_baud").val(locatedata.moveWarnBaud);
                        }
                        $("#move_warn_cmd").val(device.moveWarnCmd);
                    } else {
                        $("#move_warn_enable").prop('checked', false);
                        document.getElementById("warning").innerHTML = "";
                    }
                    saveModel();
                    form.render();
                }
            }
        })
    }

    /**提交模组**/
    function changename(){
        let y = stationfunc.layerhieght().top + 100;
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['修改模板名称']
            ,offset:y
            , area: ['300px', '300px']
            , content: $("#window")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }

    /**添加模板**/
    form.on('submit(save)',function () {
        let setting=parent.testmodel;
        let jsondata="";
        let arr=[];
        if(setting.compute!=null){
            arr.push(setting.compute.substring(1, setting.compute.length - 1));
        }
        if (setting.locate != null) {
            arr.push(setting.locate.substring(1, setting.locate.length - 1));
        }
        if (setting.plaform != null) {
            arr.push(setting.plaform.substring(1, setting.plaform.length - 1));
        }
        if (setting.auxiliary != null) {
            arr.push(setting.auxiliary.substring(1, setting.auxiliary.length-1));
        }
        for(let i=0;i<arr.length;i++){
            if(i==0){
                jsondata+="{"+arr[i];
            }else{
                jsondata+=","+arr[i];
                if(i==arr.length-1){
                    jsondata+="}";
                }
            }
        }
        let data1 = form.val("save");
        $.ajax({
            url:'/template/addTemplate',
            data:{
                json:jsondata,
                templatename:data1.templatename,
                type:"2"
            },
            async:false,
            success:function () {
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: stationfunc.layerhieght().top + 100
                    ,content: '提交成功'
                });
            }
        })
        layer.close(layerindex);
    })

    /**更新模组**/
    function updateModel(){
        let setting=parent.testmodel
        let jsondata="";
        let arr=[];
        if(setting.compute!=null){
            arr.push(setting.compute.substring(1, setting.compute.length - 1));
        }
        if (setting.locate != null) {
            arr.push(setting.locate.substring(1, setting.locate.length - 1));
        }
        if (setting.plaform != null) {
            arr.push(setting.plaform.substring(1, setting.plaform.length - 1));
        }
        if (setting.auxiliary != null) {
            arr.push(setting.auxiliary.substring(1, setting.auxiliary.length-1));
        }
        for(let i=0;i<arr.length;i++){
            if(i==0){
                jsondata+="{"+arr[i];
            }else{
                jsondata+=","+arr[i];
                if(i==arr.length-1){
                    jsondata+="}";
                }

            }
        }
        $.ajax({
            url:'/template/updateTemplate',
            data:{
                json:jsondata,
                templatename:templatename,
                type:"2"
            },
            async:false,
            success:function () {
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: stationfunc.layerhieght().top + 100
                    ,content: '提交成功'
                });
            }
        })
    }

    /**提交模组**/
    function addModel(){
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['保存模板']
            , area: ['300px', '300px']
            ,offset: stationfunc.layerhieght().top + 100
            , content: $("#savewindow")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }

    /**保存模组**/
    function saveModel(){
        let data1 = form.val("formDemo2");
        let jsondata=auxiliaryfunc.datachange(data1);
        parent.testmodel.auxiliary=JSON.stringify(jsondata);
    }

    /**保存当前页面模板（）**/
    function checksavemodel(){
            if(form.doVerify("formDemo")){
                saveModel();
                return true;
            }else{
                layer.msg("辅助功能页面有误！");
                return false;
            }
    }

    var temauxiliary = {
        checksavemodel: function () {
            checksavemodel();
        }
    }

    exports('template_auxiliary', temauxiliary)
});