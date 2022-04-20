layui.define(['element', 'form', 'drawer', 'table','station_compute_func','station_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        ,computefunc=layui.station_compute_func
        ,stationfunc=layui.station_func
        , element = layui.element;


    var device={};
    var form21 = ["devicestatus", "observedata", "rawdatareturn"];
    var form22 = ["statusresult", "observedata", "rtksetting", "rawdatareturn"];
    var form12 = ["statusresult","statusresult2", "timerecord", "basedownload", "rawdatareturn", "rtksetting"];
    var form11 = ["devicestatus", "basefilereturn", "rawdatareturn", "timerecord"];
    var formlist = ["devicestatus", "basefilereturn", "statusresult", "basedownload", "observedata", "rtksetting",
        "statusresult2", "rawdatareturn", "timerecord"];
    var beforeform;
    var compute = 0;
    var station = 0;
    var mark = 0;
    var downloadsource = 0;//基站数据来源的数据来源单选
    var downloadsource2=0;
    var rtkturn = true;//rtk开关
    var rawdataturn = false;//原始数据上传开关
    var doublebase = false;//双基站开关
    var machineserial=templatename;
    var layerindex;

    $("#reset").click(function () {
        getDeviceSetting(templatename);
    })


    $("#changename").click(function () {
        changename();
    })


    form.verify({
        ip: [
            /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            , 'IP地址不符合规则'
        ],
        title: function (value) {
            if (value.length < 5) {
                return '标题至少得5个字符啊';
            }
        }
        ,name:[/^[a-zA-Z][0-9a-zA-Z]*$/,"开头只能为字母且内容只能由数字和字母组成"]
        , Ndouble: [
            /^[1-9]\d*$/
            , '只能输入整数哦'
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
        init(templatename);
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo1")){
                saveModel();
                updateModel();
            }
        })
    }else{
        let sn="init";
        init(sn);
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo1")){
                saveModel();
                addModel();
            }
        })
        $("#reset").css("display","none");
        $("#changename").css("display","none");
    }

    form.on('radio(compute)', function (data) {
        compute = data.value;
        new Promise((resolve, reject) => {
            showform(compute, station);
            resolve();
        }).then(() => {
            getDeviceSetting(machineserial);
            setIframeHeight();
        });
    });
    form.on('radio(station)', function (data) {
        station = data.value;
        new Promise((resolve, reject) => {
            showform(compute, station);
            resolve();
        }).then(() => {
            getDeviceSetting(machineserial);
            setIframeHeight();
        });
    });
    form.on('radio(mark)', function (data) {
        mark = data.value;
        computefunc.altermark(mark);
    });
    form.on('radio(downloadsource)', function (data) {
        downloadsource = data.value;
        device.ntrIpBase=data.value;
        new Promise((resolve, reject) => {
            changesoure(rtkturn, doublebase, downloadsource,downloadsource2);
            rtkcore();
            resolve();
        }).then(() => {
            setIframeHeight();
        });
        form.render();
    })
    form.on('radio(downloadsource2)', function (data) {
        downloadsource2 = data.value;
        device.secondNtripBase=data.value;
        new Promise((resolve, reject) => {
            changesoure(rtkturn, doublebase, downloadsource,downloadsource2);
            rtkcore();
            resolve();
        }).then(() => {
            setIframeHeight();
        });
        form.render();
    })
    /*监听双基站按钮*/
    form.on('switch(doublebase)', function (data) {
        if (this.checked) {
            doublebase = true;
            device.secondBase=1;
            downloadsource2=device.secondNtripBase;
            downloadsource=device.ntrIpBase;
            if(downloadsource2==0){
                document.getElementById("datasource2").innerHTML="<div class=\"layui-form-item\">\n" +
                    "                            <label class=\"layui-form-label\" style='padding: 8px 5px;width: 96px;'>基站2数据来源</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"0\" title=\"基站文件\" checked>\n" +
                    "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"1\" title=\"CORS数据\">\n" +
                    "                            </div>\n" +
                    "                        </div>\n" ;
            }else{
                document.getElementById("datasource2").innerHTML="<div class=\"layui-form-item\">\n" +
                    "                            <label class=\"layui-form-label\" style='padding: 8px 5px;width: 96px;'>基站2数据来源</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"0\" title=\"基站文件\">\n" +
                    "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"1\" title=\"CORS数据\"  checked>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" ;
            }
        } else {
            doublebase = false;
            document.getElementById("datasource2").innerHTML="" ;
            document.getElementById("cores2").innerHTML="" ;
            document.getElementById("secondbase").innerHTML="" ;
        }
        let source = $('input[name="downloadsource"]:checked').val();
        new Promise((resolve, reject) => {
            changesoure(rtkturn, doublebase, downloadsource,downloadsource2);
            rtkcore();
            resolve();
        }).then(() => {
            setIframeHeight();
        });
        form.render();
    })
    /*监听rtk数据按钮*/
    form.on('switch(rtkturn)', function (data) {
        if (this.checked) {
            rtkturn = true;
            document.getElementById("rtkcontent").innerHTML = computefunc.rtktxt;
            document.getElementById("rtkcontent").style.display = "block";
            document.getElementById("rtkcontent").style.marginTop = "30px";
            $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
            $("#imuWarn").find("option[value='" + device.imuWarn + "']").prop("selected", true);
            if(document.getElementById("rtkfront").innerHTML==""){
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkfront").innerHTML=computefunc.rtkpiror;
            }
            if(device.rtkPos!=""){
                $("#rtkPos").find("option[value=" + device.rtkPos.toString() + "]").prop("selected", true);
            }
            if(device.imuWarn!=""){
                $("#imuWarn").find("option[value=" + device.imuWarn + "]").prop("selected", true);
            }
            if(device.networkMode!=""){
                $("#networkMode").find("option[value=" + device.networkMode.toUpperCase() + "]").prop("selected", true);
            }
            $("input[name='networkAddress']").val(device.networkAddress);
            $("input[name='networkPort']").val(device.networkPort);
            rtkflush();
        } else {
            rtkturn = false;
            document.getElementById("rtkfront").innerHTML = ""
            document.getElementById("rtkfront").style.display = "none";
            document.getElementById("rtkcontent").innerHTML = "";
            document.getElementById("rtkcontent").style.display = "none";
        }
        new Promise((resolve, reject) => {
            rtkcore();
            resolve();
        }).then(() => {
            setIframeHeight();
        });
        form.render();
    })
    /*监听原始数据回传按钮*/
    form.on('switch(rawdataturn)', function (data) {
        if (this.checked) {
            rawdataturn = true;
            document.getElementById("rawdatacontent").innerHTML = computefunc.rawdatatxt;
            document.getElementById("rawdatacontent").style.display = "block";
            document.getElementById("rawdatacontent").style.marginTop = "30px";
            let rawreturndata={};
            rawreturndata.value=parseInt(device.rawBackEnabled);
            computefunc.rawdatabackupdate(rawreturndata);
            if(device.rawBackEnabled!=""){
                $("#rawBackEnabled").find("option[value=" + device.rawBackEnabled + "]").prop("selected", true);

            }
            if(device.rawBackGnssData!=null&&device.rawBackGnssData!=""){
                $("#rawBackGnssData").find("option[value=" + device.rawBackGnssData + "]").prop("selected", true);
            }

        } else {
            rawdataturn = false;
            document.getElementById("rawdatacontent").innerHTML="";
            document.getElementById("rawdatacontent").style.display = "none";
        }
        setIframeHeight();
        form.render();
    })
    /*监听原始数据回传的通信设置*/
    form.on('select(rawBackEnabled)', function (data) {
        computefunc.rawdatabackupdate(data);
    })
    /**监听rtk表单的模式**/
    form.on('select(networkMode)',function (data) {
        computefunc.decidertkmode(data.value);
        setIframeHeight();
    })
    form.on('checkbox(coresource)',function (data) {
        let source = $("#coredata1").prop("checked");
        let source2 = $("#coredata2").prop("checked");
        let oldstate=data.elem.checked;
        let elName=data.elem.name;
        $("input[name='"+elName+"']").prop("checked",false);
        $(this).prop("checked",true);
        if(!oldstate){
            $(this).prop("checked",false);
        }
        if(!source&&!source2){
            document.getElementById("rtkcontent").innerHTML=computefunc.rtkcoretxt;
            computefunc.decidertkmode("NTRIP");
            form.render();
        }else{
            document.getElementById("rtkcontent").innerHTML="";
        }
        form.render('checkbox');
    })
    /*监听表单提交*/
    form.on('submit(formDemo1)', function (data) {
        let test = data.field;
        let source = $("#coredata1").prop("checked");
        let source2 = $("#coredata2").prop("checked");
        if(source){
            test.networkAddress=test.rawntripaddress;
            test.networkPort=test.rawntripport;
            test.networkMountpoint=test.networkMountpoint1;
            test.networkMountpointUse=test.coreuse1;
            test.networkMountpointPass=test.corepass1;
        }
        if(source2){
            test.networkAddress=test.secondntripaddress;
            test.networkPort=test.secondntripport;
            test.networkMountpoint=test.secondMountpoint1;
            test.networkMountpointUse=test.coreuse2;
            test.networkMountpointPass=test.corepass2;
        }
        if(downloadsource==1){
            test.ntripArg= test.rawntripaddress+"|"+test.rawntripport+"|"+test.networkMountpoint1+"|"+test.coreuse1+"|"+test.corepass1;
        }
        if(doublebase){
            test.secondArg= test.secondntripaddress+"|"+test.secondntripport+"|"+test.secondMountpoint1+"|"+test.coreuse2+"|"+test.corepass2;
        }
        let stringtest = JSON.stringify(test);
        $.ajax({
            url: '/devicelist/editSetting',
            data: {
                setting: stringtest,
                machinesn: machinesn
            },
            success: function (data) {
                getDeviceSetting(data.data);
                let y = stationfunc.layerhieght().top + 100;
                layer.open({
                    title: '提交'
                    ,offset:y
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
            }
        })
    })

    form.on('submit(example)',function () {
        let setting=parent.testmodel;
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
                let y = stationfunc.layerhieght().top + 100;
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: y
                    ,content: '提交成功'
                });
            }
        })
        layer.close(layerindex);
    })

    /*获取配置数据*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                device = data.data;
                if (device.rawName!=null) {
                    let data2 = {};
                    Object.assign(data2, device);
                    computefunc.setdevic(device);
                    switch(device.nameType){
                        case 0:
                            $("input[name=nameType][value='0']").prop("checked", true);
                            break;
                        case 1:
                            $("input[name=nameType][value='1']").prop("checked", true);
                            break;
                        case 2:
                            $("input[name=nameType][value='2']").prop("checked", true);
                            break;
                    }
                    if (parent.window.writeright == 0) {
                        $("#changename").prop("disabled", true);
                        $("#errormsg").html("修改权限被限制");
                        $("#changename").addClass("layui-btn-disabled");
                        $("#savemodel").prop("disabled", true);
                        $("#savemodel").addClass("layui-btn-disabled");
                    }
                    if (device.rawName != null && device.rawName != "") {
                        $("#rawName").val(device.rawName);
                    } else {
                        $("#rawName").val(device.machineSerial);
                    }
                    $("#baseLon").val(device.baseLon);
                    $("#baseLat").val(device.baseLat);
                    $("#baseHeight").val(device.baseHeight);
                    $("#rawIp").val(device.rawIp);
                    $("#rawPort").val(device.rawPort)
                    $("#resultIp").val(device.resultIp);
                    $("#resultPort").val(device.resultPort);
                    $("#coordinatesX").val(device.coordinatesX);
                    $("#coordinatesY").val(device.coordinatesY);
                    $("#coordinatesZ").val(device.coordinatesZ);
                    $("#secondIp").val(device.scondIp);
                    $("#secondPort").val(device.scondPort);
                    $("#networkAddress").val(device.networkAddress);
                    $("#networkPort").val(device.networkPort);
                    if (device.rawRate != null & device.rawRate != "") {
                        $("#selectList").find("option[value=" + device.rawRate + "]").prop("selected", true);
                    }
                    let ntriparg = data2.ntripArg;
                    if (ntriparg != "" && ntriparg != null) {
                        let arg = ntriparg.split('|');
                        $("#rawntripaddress").val(arg[0]);
                        $("#rawntripport").val(arg[1]);
                        $("#networkMountpoint1").val(arg[2]);
                        $("#coreuse1").val(arg[3]);
                        $("#corepass1").val(arg[4]);
                    }
                    let secondarg = data2.secondArg;
                    if (secondarg != "" && secondarg != null) {
                        let arg = secondarg.split('|');
                        $("#secondntripaddress").val(arg[0]);
                        $("#secondntripport").val(arg[1]);
                        $("#secondMountpoint1").val(arg[2]);
                        $("#coreuse2").val(arg[3]);
                        $("#corepass2").val(arg[4]);
                    }

                    if (device.rawBackEnabled != "0") {
                        $("#rawdataturn").prop("checked", true);
                        if (device.rawBackEnabled != "") {
                            $("#rawBackEnabled").find("option[value=" + device.rawBackEnabled + "]").prop("selected", true);

                        }
                        if (device.rawBackGnssData != "") {
                            $("#rawBackGnssData").find("option[value=" + device.rawBackGnssData + "]").prop("selected", true);
                        }
                        let enabledata = {};
                        enabledata.value = parseInt(device.rawBackEnabled);
                        computefunc.rawdatabackupdate(enabledata);
                    } else {
                        rawdataturn = false;
                        $("#rawdataturn").prop("checked", false);
                        document.getElementById("rawdatacontent").innerHTML = "";
                        document.getElementById("rawdatacontent").style.display = "none";
                    }
                    let status2 = $("#resultMsg")
                    if (status2 != null) {
                        if (device.resultMsg != null && device.resultMsg != "") {
                            $("#resultMsg").find("option[value=" + device.resultMsg + "]").prop("selected", true);
                        }
                        if (device.resultImu != null && device.resultImu != "") {
                            $("#resultImu").find("option[value=" + device.resultImu + "]").prop("selected", true);
                        }
                        if (device.resultRs232 != null && device.resultRs232 != "") {
                            $("#resultRs232").find("option[value=" + device.resultRs232 + "]").prop("selected", true);
                        }
                    }
                    if ($("#recordinterval") != null && device.recordInterval != "") {
                        $("#recordInterval").find("option[value=" + device.recordInterval + "]").prop("selected", true);
                    }
                    if (device.secondBase != "0") {
                        $("#doublebase").prop('checked', true);
                        $("input[name='networkAddress']").val(device.networkAddress);
                        $("input[name='networkPort']").val(device.networkPort);
                        doublebase = true;
                        if (document.getElementById("datasource2") != null) {
                            document.getElementById("datasource2").innerHTML = "<div class=\"layui-form-item\">\n" +
                                "                            <label class=\"layui-form-label\" style='padding: 8px 5px;width: 96px;'>基站2数据来源</label>\n" +
                                "                            <div class=\"layui-input-block\">\n" +
                                "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"0\" title=\"基站文件\" checked>\n" +
                                "                                <input type=\"radio\" name=\"secondNtripBase\" lay-filter=\"downloadsource2\" value=\"1\" title=\"CORS数据\">\n" +
                                "                            </div>\n" +
                                "                        </div>\n";
                        }
                        let ntripbase = device.ntrIpBase.toString();
                        let secondntrip = device.secondNtripBase.toString();
                        if (ntripbase == null || ntripbase == "") {
                            ntripbase = "0";
                            device.ntripBase = "0";
                        }
                        if (secondntrip == null || secondntrip == "") {
                            secondntrip = "0";
                            device.secondNtripBase = "0";
                        }
                        switch (ntripbase + secondntrip) {
                            case "01":
                                $("input[name=secondNtripBase][value='1']").prop("checked", true);
                                device.secondNtripBase = "1";
                                break;
                            case "10":
                                $("input[name=ntrIpBase][value='1']").prop("checked", true);
                                device.ntrIpBase = "1";
                                break;
                            case "11":
                                $("input[name=ntrIpBase][value='1']").prop("checked", true);
                                $("input[name=secondNtripBase][value='1']").prop("checked", true);
                                device.ntrIpBase = "1";
                                device.secondNtripBase = "1";
                                break;
                        }

                        changesoure(rtkturn, doublebase, ntripbase, secondntrip);
                        if (document.getElementById("rtkfront") != null) {
                            rtkcore();
                        }
                    } else {
                        doublebase = false;
                        $("#doublebase").prop('checked', false);
                        if (document.getElementById("datasource2") != null) {
                            document.getElementById("datasource2").innerHTML = "";
                            document.getElementById("cores2").innerHTML = "";
                        }
                        let ntripbase = device.ntrIpBase.toString();
                        if (ntripbase == "1") {
                            $("input[name=ntrIpBase][value='1']").prop("checked", true);
                            device.ntrIpBase = "1";
                            if (device.rtkPos != "0") {
                                rtkturn = true;
                            }
                            changesoure(rtkturn, doublebase, "1", downloadsource2);
                            rtkcore();
                            form.render();
                        }
                    }
                    if (device.rtkPos != "0") {
                        rtkturn = true;
                        $("#rtkturn").prop("checked", true);
                        if (device.rtkPos != "") {
                            $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
                        }
                        if (device.imuWarn != "") {
                            $("#imuWarn").find("option[value='" + device.imuWarn + "']").prop("selected", true);
                        }
                        if (device.networkMode != "") {
                            $("#networkMode").find("option[value=" + device.networkMode.toUpperCase() + "]").prop("selected", true);
                        }
                        computefunc.decidertkmode(device.networkMode);
                        $("#networkAddress").val(device.networkAddress);
                        $("#networkPort").val(device.networkPort);
                        $("#networkMountpoint3").val(device.networkMountpoint);
                        $("#getConnectPoint3").click(function () {
                            computefunc.ConnectPoint3();
                        })
                        if (device.networkMountpointPass != "" && device.networkMountpointPass != null) {
                            $("#networkMountpointUse").val(device.networkMountpointUse);
                            $("#networkMountpointPass").val(device.networkMountpointPass);
                        }
                    } else {
                        rtkturn = false;
                        $("#rtkturn").prop("checked", false);
                        if (document.getElementById("rtkfront") != null) {
                            document.getElementById("rtkfront").innerHTML = "";
                            document.getElementById("rtkfront").style.display = "none";
                        }
                        if (document.getElementById("rtkcontent") != null) {
                            document.getElementById("rtkcontent").innerHTML = "";
                            document.getElementById("rtkcontent").style.display = "none";
                        }
                        if (document.getElementById("coreselect") != null) {
                            document.getElementById("coreselect").innerHTML = "";

                        }
                    }

                    saveModel();
                    // form.render();
                }
            }
        })
    }

    /**提交模组**/
    function addModel(){
        let y = stationfunc.layerhieght().top + 100;
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['保存模板']
            , area: ['300px', '300px']
            ,offset:y
            , content: $("#savewindow")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }
    /**保存模组**/
    function saveModel(){
        let data1 = form.val("formDemo1");
        let data2={};
        Object.assign(data2,device);
        data2.rawMode=station;
        data2.rawSolution=compute;
        delete data2.baseLon;
        delete data2.baseLat;
        delete data2.baseHeight;
        delete data2.coordinatesX;
        delete data2.coordinatesY;
        delete data2.coordinatesZ;
        let source = $("#coredata1").prop("checked");
        let source2 = $("#coredata2").prop("checked");
        if(source){
            data2.networkAddress=data1.rawntripaddress;
            data2.networkPort=data1.rawntripport;
            data2.networkMountpoint=data1.networkMountpoint1;
            data2.networkMountpointUse=data1.coreuse1;
            data2.networkMountpointPass=data1.corepass1;
        }
        if(source2){
            data2.networkAddress=data1.secondntripaddress;
            data2.networkPort=data1.secondntripport;
            data2.networkMountpoint=data1.secondMountpoint1;
            data2.networkMountpointUse=data1.coreuse2;
            data2.networkMountpointPass=data1.corepass2;
        }
        if(downloadsource==1){
            if(data1.rawntripaddress!=null||data1.rawntripport!=null||data1.networkMountpoint1||data1.coreuse1!=null||data1.corepass1){
                data2.ntripArg= data1.rawntripaddress+"|"+data1.rawntripport+"|"+data1.networkMountpoint1+"|"+data1.coreuse1+"|"+data1.corepass1;
            }else{
                data2.ntripArg=device.ntripArg;
            }

        }
        if(!rtkturn) {
            data2.rtkPos = 0;
        }
        if(!rawdataturn){
            data2.rawBackEnabled=0;
        }
        if(doublebase){
            if(data1.secondMountpoint1!=null||data1.corepass2!=null||data1.coreuse2!=null||data1.secondntripaddress!=null||data1.secondntripport){
                data2.secondArg= data1.secondntripaddress+"|"+data1.secondntripport+"|"+data1.secondMountpoint1+"|"+data1.coreuse2+"|"+data1.corepass2;
            }else{
                data2.secondArg=device.secondArg;
            }
            data2.secondBase=1;
        }else{
            data2.secondBase=0;
        }
        Object.assign(data2,data1);
        let stringtest=JSON.stringify(data2);
        parent.testmodel.compute=stringtest;
        setIframeHeight();
    }


    /**更新模组**/
    function updateModel(){
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
        $.ajax({
            url:'/template/updateTemplate',
            data:{
                json:jsondata,
                templatename:templatename,
                type:"2"
            },
            async:false,
            success:function () {
                let y = stationfunc.layerhieght().top + 100;
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: y
                    ,content: '提交成功'
                });
            }
        })
    }

    /**根据选项初始化页面**/
    function init(sn){
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                device = data.data;
                let solution=0;
                let mode=2;
                if (device.rawSolution > 0) {
                    solution=1;
                    $("input[name='rawSolution'][value='1']").prop("checked",true);
                }
                else{
                    $("input[name='rawSolution'][value='0']").prop("checked",true);
                }
                if (device.rawMode ==0) {
                    $("input[name='rawMode'][value='0']").prop("checked",true);
                    mode=0
                }else{
                    $("input[name='rawMode'][value='2']").prop("checked",true);
                }
                showform(solution,mode);
                compute=solution;
                station=mode;
                getDeviceSetting(sn);
            }});
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

    /*根据单选按钮组的变化显示不同内容*/
    function showform(data1, data2) {
        let no = data1.toString()
        let no1 = data2.toString();
        let no2 = no + no1;
        switch (no2) {
            case "02":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form11.includes(beforeform[i])) {
                            computefunc.delhtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form11;
                for (let i = 0; i < form11.length; i++) {
                    computefunc.inserthtml(form11[i]);
                }
                break;
            case "00":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form12.includes(beforeform[i])) {
                            computefunc.delhtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form12;
                for (let i = 0; i < form12.length; i++) {
                    computefunc.inserthtml(form12[i]);
                }
                if(type==1&&device.secondBase>0){
                    doublebase=true;
                    if(device.ntrIpBase>0){
                        downloadsource=1;
                    }else{
                        downloadsource=2;
                    }
                }else{
                    doublebase=false;
                }
                break;
            case "12":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form21.includes(beforeform[i])) {
                            computefunc.delhtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form21;
                for (let i = 0; i < form21.length; i++) {
                    computefunc.inserthtml(form21[i]);
                }
                break;
            case "10":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form22.includes(beforeform[i])) {
                            computefunc.delhtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form22;
                for (let i = 0; i < form22.length; i++) {
                    computefunc.inserthtml(form22[i]);
                }
                document.getElementById("rtkcontent").innerHTML = computefunc.rtktxt;
                document.getElementById("rtkcontent").style.display = "block";
                document.getElementById("rtkcontent").style.marginTop = "30px";
                if(device.rtkPos!=""){
                    $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
                }
                if(device.imuWarn!=""){
                    $("#imuWarn").find("option[value='" + device.imuWarn + "']").prop("selected", true);
                }
                if(device.networkMode!=""){
                    $("#networkMode").find("option[value=" + device.networkMode + "]").prop("selected", true);
                }
                rtkflush();
                break;
        }
        if(type==1){
            getDeviceSetting(machineserial);
        }else{
            getDeviceSetting("init");
        }
        form.render();
    }


    function rtkflush() {
        if (device.rtkPos > 0||rtkturn) {
            rtkturn = true;
            $("#rtkturn").prop("checked", true);
            if(device.rtkPos!=""){
                $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
            }
            if(device.imuWarn!=""){
                $("#imuWarn").find("option[value='" + device.imuWarn + "']").prop("selected", true);
            }
            if(device.networkMode!=""){
                $("#networkMode").find("option[value=" + device.networkMode.toUpperCase() + "]").prop("selected", true);
            }
            $("input[name='networkAddress']").val(device.networkAddress);
            $("input[name='networkPort']").val(device.networkPort);
            $("#networkMountpoint3").val(device.networkMountpoint);
            $("#getConnectPoint3").click(function () {
                computefunc.ConnectPoint3();
            })
            if(device.networkMountpointPass!=""&&device.networkMountpointPass!=null){
                $("#networkMountpointUse").val(device.networkMountpointUse);
                $("#networkMountpointPass").val(device.networkMountpointPass);
            }
        }
    }

    function changesoure(rtkturn, doubleturn, source1, source2) {
        doublebase = doubleturn;
        downloadsource = source1;
        downloadsource2 = source2;
        let order2;
        let rtknode = document.getElementById("rtkturn");
        let stationturn;
        if (doubleturn) {
            stationturn = 1;
            order2 = stationturn + downloadsource2.toString();
        }
        let order = stationturn + downloadsource.toString();
        let childnodes = document.getElementById("base");
        if (childnodes != null) {
            for (let i = 0; i < childnodes.childNodes.length; i++) {
                let childnode = childnodes.childNodes[i];
                childnode.innerHTML = "";
            }
            if (downloadsource == 0) {
                document.getElementById("cores").innerHTML = "";
                document.getElementById("base").innerHTML = "   <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex\">基站IP地址</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"rawIp\" type=\"text\" name=\"rawIp\" required\n" +
                    "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex \">基站端口</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"rawPort\" type=\"text\" name=\"rawPort\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                </div>";
                if (rtkturn) {
                    rtkshow(rtknode);
                }
            }
            else {
                document.getElementById("base").innerHTML = "";
                document.getElementById("cores").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                    " <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①IP地址</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"rawntripaddress\" type=\"text\" name=\"rawntripaddress\" lay-verType='tips'\n" +
                    "                                                   lay-verify=\"ip|required\" placeholder=\"请输入IP地址\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex \"style='padding: 9px 4px;width: 93px;'>CORS①端口</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"rawntripport\" type=\"text\" name=\"rawntripport\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①接入点</label>\n" +
                    "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                    "                                            <input id=\"networkMountpoint1\" type=\"text\" name=\"networkMountpoint1\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                    "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint1'>获取接入点</button>\n" +
                    "                                            <div id=\"corePoint1\" class=\"xm-select-demo\" style='width:140px'></div>\n" + "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①用户名</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"coreuse1\" type=\"text\" name=\"coreuse1\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS①密码</label>\n" +
                    "                                        <div class=\"layui-input-block\">\n" +
                    "                                            <input id=\"corepass1\" type=\"text\" name=\"corepass1\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "                                </div>";
                if (rtkturn) {
                    rtkshow(rtknode);
                }
            }
            switch (order2) {
                case "10":
                    document.getElementById("cores2").innerHTML = "";
                    document.getElementById("secondbase").innerHTML =" <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex\" style='width: 98px;padding: 6px 6px;'>第二基站IP地址</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" id='secondIp' name=\"secondIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex \" style='width: 98px;padding: 6px 6px;'>第二基站端口</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" id='secondPort' name=\"secondPort\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>";
                    document.getElementById("secondbase").style.display = "flex";
                    document.getElementById("secondbase").style.marginTop = "30px";
                    break;
                case "11":
                    document.getElementById("secondbase").innerHTML = "";
                    document.getElementById("cores2").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"secondntripaddress\" type=\"text\" name=\"secondntripaddress\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"secondntripport\" type=\"text\" name=\"secondntripport\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <input id=\"secondMountpoint1\" type=\"text\" name=\"secondMountpoint1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                        "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint2'>获取接入点</button>\n" +
                        "                                            <div id=\"corePoint2\" class=\"xm-select-demo\" style='width: 140px'></div>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\"style='padding: 9px 4px;width: 98px;' >CORS②用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"coreuse2\" type=\"text\" name=\"coreuse2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS②密码</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"corepass2\" type=\"text\" name=\"corepass2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>"
                    break;
            }
            $("#getConnectPoint1").click(function () {
                computefunc.ConnectPoint();
            })
            $("#getConnectPoint2").click(function () {
                computefunc.ConnectPoint2();
            })
            computefunc.downloadsourceupdate();
            rtkflush();
        }

    }

    function rtkshow(data) {
        if (data != null) {
            document.getElementById("coreselect").innerHTML = "";
            document.getElementById("rtkfront").innerHTML = rtkfront;
            document.getElementById("rtkcontent").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">通信协议</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\" lay-filter='networkMode'>\n" +
                "                                        <option value=\"\"></option>\n" +
                "                                        <option value=\"NTRIP\">NTRIP</option>\n" +
                "                                        <option value=\"PPP\">PPP</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin-top: 30px\">\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">IP地址</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
                "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">端口</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
                "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin-top: 30px\" id='rtkmodeselect'>\n" +
                "                            </div>";
        }
        rtkcore();
    }

    /*判断是否插入core选择框*/
    function rtkcore() {
        if (station == 0 && compute == 0) {
            let base = doublebase;
            let source = downloadsource;
            let source2=downloadsource2;
            let turn = rtkturn;
            let mode = $("#networkMode").val();
            if (base && source == 1&&source2==1 && turn) {
                document.getElementById("coreselect").innerHTML = "  <label class=\"layui-form-label\"></label>\n" +
                    "     <div class=\"layui-input-block\">\n" +
                    "          <input type=\"checkbox\" id='coredata1' name=\"coredata\"  lay-filter=\"coresource\" title=\"与CORS①数据同源\" lay-skin=\"primary\"  value=\"0\"  checked>" +
                    "          <input type=\"checkbox\" id='coredata2' name=\"coredata\"  lay-filter=\"coresource\" title=\"与CORS②数据同源\" lay-skin=\"primary\"  value=\"1\" >" +
                    "    </div>";
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkcontent").innerHTML = "";
                document.getElementById("rtkfront").innerHTML = computefunc.rtkpiror;
            } else if ((!base && source == 0 && turn) || (base && source == 0 && turn)) {
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkfront").innerHTML = "";
                document.getElementById("rtkfront").innerHTML = computefunc.rtkpiror;
                computefunc.decidertkmode(mode);
            } else if (!base && source == 1 && turn) {
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkfront").innerHTML = "";
                document.getElementById("rtkfront").innerHTML = computefunc.rtkpiror;
                computefunc.decidertkmode(mode);
            }else if (base && source == 1 && turn) {
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkfront").innerHTML = "";
                document.getElementById("rtkfront").innerHTML = computefunc.rtkpiror;
                computefunc.decidertkmode(mode);
            }
            else {
                document.getElementById("coreselect").innerHTML = "";
                // document.getElementById("rtkfront").innerHTML = "";
            }
        } else {
            let mode = $("#networkMode").val();
            if (mode != null) {
                computefunc.decidertkmode(mode);
            }

        }
    }

    /**保存当前页面模板（）**/
    function checksavemodel(){
            if(form.doVerify("formDemo1")){
                saveModel();
                return true;
            }else{
                layer.msg("解算设置页面有误！");
                return false;
            }
    }

    // function mounted() {
    //     parent.addEventListener('unload', function () {
    //         checksavemodel()
    //     });
    //     parent.addEventListener('beforeunload', function (e) {
    //         checksavemodel()
    //     });
    //     window.onbeforeunload = function () {
    //         checksavemodel()
    //     }
    // }

    function setIframeHeight() {
        let height=$("#templatecompute").height();
        height+=30;
        parent.setcomputeheight(height);
        parent.parent.setsettingheight(height);
    };

   var temcompute={
        checksavemodel:function () {
            checksavemodel();
        }
   }


    exports('template_compute',temcompute)
});