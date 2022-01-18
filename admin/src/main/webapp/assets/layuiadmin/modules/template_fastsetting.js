layui.define(['element', 'form', 'drawer', 'table','station_fastsetting_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        ,fastsettingfunc=layui.station_fastsetting_func
        , element = layui.element;


    var device={};
    var form21 = ["devicestatus", "observedata"];
    var form22 = ["statusresult", "observedata"];
    var form12 = ["statusresult","basedownload","timerecord"];
    var form11 = ["devicestatus", "basefilereturn","timerecord"];
    var formlist = ["basestation", "devicestatus", "basefilereturn", "statusresult", "basedownload", "observedata","timerecord"];
    var beforeform;
    var compute = 0;
    var station = 0;
    var mark = 0;
    var doublebase = false;//双基站开关
    var downloadsource = 0;//基站数据来源的数据来源单选
    var layerindex;

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
        ,port:[
            /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
            ,'端口号有误'
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
    })

    if(type=="1"){
        init(templatename);
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo")){
                saveModel();
                updateModel();
            }
        })
    }else{
        showform(0,2);
        $("#savemodel").click(function () {
            if(form.doVerify("formDemo")){
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
    form.on('radio(compute)', function (data) {
        compute = data.value;
        showform(compute, station);
    });
    form.on('radio(station)', function (data) {
        station = data.value;
        showform(compute, station);
    });
    form.on('radio(mark)', function (data) {
        mark = data.value;
        fastsettingfunc.altermark(mark);
        fastsettingfunc.computemark();
    });
    form.on('radio(downloadsource)', function (data) {
        downloadsource = data.value;
        fastsettingfunc.altersource(doublebase, downloadsource);
    })
    form.on('switch(doublebase)', function (data) {
        if (this.checked) {
            doublebase = true;
        } else {
            doublebase = false;
        }
        let source = $('input[name="downloadsource"]:checked').val();
        fastsettingfunc.altersource(doublebase, source);
    })

    form.on('submit(example)',function () {
        let jsondata=parent.fastmodel;
        let data1 = form.val("example");
        $.ajax({
            url:'/template/addTemplate',
            data:{
                json:jsondata,
                templatename:data1.templatename,
                type:"1"
            },
            async:false,
            success:function () {
                let y = fastsettingfunc.layerhieght().top + 100;
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

    form.on('submit(save)',function () {
        let jsondata=parent.fastmodel;
        debugger
        let data1 = form.val("save");
        $.ajax({
            url:'/template/addTemplate',
            data:{
                json:jsondata,
                templatename:data1.templatename,
                type:"1"
            },
            async:false,
            success:function () {
                let y = fastsettingfunc.layerhieght().top + 100;
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
                getDeviceSetting(templatename);
            }});
    }

    form.on('submit(example)',function () {
        let setting=parent.testmodel
        let data1 = form.val("example");
        $.ajax({
            url:'/template/updateModelNameByName',
            data:{
                name:templatename,
                newname:data1.templatename,
                type:"1"
            },
            async:false,
            success:function () {
                layer.msg("修改成功");
            }
        })
        layer.close(layerindex);
    })

    /**获取设备配置**/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                device = data.data;
                if (device!=null) {
                    fastsettingfunc.setdevice(device);
                    if (device.rawName != null && device.rawName != "") {
                        $("#rawName").val(device.rawName);
                    } else {
                        $("#rawName").val(device.machineSerial);
                    }
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
                    $("#baseLon").val(device.baseLon);
                    $("#baseLat").val(device.baseLat);
                    if ($("#recordinterval") != null && device.recordInterval != "") {
                        $("#recordInterval").find("option[value=" + device.recordInterval + "]").prop("selected", true);
                    }
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
                    if (writeright == 0) {
                        $("#changename").prop("disabled", true);
                        $("#errormsg").html("修改权限被限制");
                        $("#changename").addClass("layui-btn-disabled");
                        $("#savemodel").prop("disabled", true);
                        $("#savemodel").addClass("layui-btn-disabled");
                    }
                    if (device.rawRate != null & device.rawRate != "") {
                        $("#selectList").find("option[value=" + device.rawRate + "]").prop("selected", true);
                    }
                    let ntriparg = device.ntripArg;
                    if (ntriparg != "" && ntriparg != null) {
                        let arg = ntriparg.split('|');
                        $("#rawntripaddress").val(arg[0]);
                        $("#rawntripport").val(arg[1]);
                        $("#networkMountpoint1").val(arg[2]);
                        $("#coreuse1").val(arg[3]);
                        $("#corepass1").val(arg[4]);
                    }
                    let secondarg = device.secondArg;
                    if (secondarg != "" && secondarg != null) {
                        let arg = secondarg.split('|');
                        $("#secondntripaddress").val(arg[0]);
                        $("#secondntripport").val(arg[1]);
                        $("#secondMountpoint1").val(arg[2]);
                        $("#coreuse2").val(arg[3]);
                        $("#corepass2").val(arg[4]);
                    }
                    if (device.secondBase != "0") {
                        $("#doublebase").prop('checked', true);
                        $("input[name='networkAddress']").val(device.networkAddress);
                        $("input[name='networkPort']").val(device.networkPort);
                        doublebase = true;
                        if (device.ntrIpBase > 0) {
                            $("input[name=downloadsource][value='1']").prop("checked", true);
                            fastsettingfunc.altersource(doublebase, "1");
                        } else {
                            $("input[name=downloadsource][value='0']").prop("checked", true);
                            fastsettingfunc.altersource(doublebase, "0");
                        }
                    } else {
                        doublebase = false;
                    }
                    if (device.networkMountpointPass != "" && device.networkMountpointPass != null) {
                        let userpass = device.networkMountpointPass.toString().split("|");
                        $("#networkMountpointUse").val(userpass[0]);
                        $("#networkMountpointPass").val(userpass[1]);
                    }
                    saveModel();
                    form.render();
                }
            }
        })
    }

    /**提交模组**/
    function changename(){
        let y = fastsettingfunc.layerhieght().top + 100;
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['修改模板名称']
            , area: ['300px', '300px']
            ,offset:y
            , content: $("#window")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }

    /**更新模组**/
    function updateModel(){
        let jsondata=parent.fastmodel;
        $.ajax({
            url:'/template/updateTemplate',
            data:{
                json:jsondata,
                templatename:templatename,
                type:"1"
            },success:function (res) {
                let y =fastsettingfunc.layerhieght().top + 100;
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: y
                    ,content: '提交成功'
                });
            }
        });
    }

    /**提交模组**/
    function addModel(){
        let y = fastsettingfunc.layerhieght().top + 100;
      layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['保存模板']
            ,offset:y
            , area: ['300px', '300px']
            , content: $("#savewindow")
            , success: function (layero, index) {
                layerindex=index;
            },
        });
    }

    /**保存模组**/
    function saveModel(){
        let data1 = form.val("formDemo");
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
        // if(downloadsource==1){
        //     data2.ntripArg= data1.rawntripaddress+"|"+data1.rawntripport+"|"+data1.networkMountpoint1+"|"+data1.coreuse1+"|"+data1.corepass1;
        // }
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
        let stringtest=JSON.stringify(data1);
        parent.fastmodel=stringtest;
    }

    function showform(data1, data2) {
        let no = data1.toString()
        let no1 = data2.toString();
        let no2 = no + no1;
        switch (no2) {
            case "02":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form11.length; k++) {
                            if (beforeform[i] != form11[k]) {
                                fastsettingfunc.delhtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form11;
                for (let i = 0; i < form11.length; i++) {
                    fastsettingfunc.inserthtml(form11[i]);
                }
                break;
            case "00":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form12.length; k++) {
                            if (beforeform[i] != form12[k]) {
                                fastsettingfunc.delhtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form12;
                for (let i = 0; i < form12.length; i++) {
                    fastsettingfunc.inserthtml(form12[i]);
                }

                break;
            case "12":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form21.length; k++) {
                            if (beforeform[i] != form21[k]) {
                                fastsettingfunc.delhtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form21;
                for (let i = 0; i < form21.length; i++) {
                    fastsettingfunc.inserthtml(form21[i]);
                }

                break;
            case "10":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form22.length; k++) {
                            if (beforeform[i] != form22[k]) {
                                fastsettingfunc.delhtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form22;
                for (let i = 0; i < form22.length; i++) {
                    fastsettingfunc.inserthtml(form22[i]);
                }
                break;
        }
        getDeviceSetting(templatename);
        form.render();
    }

    exports('template_fastsetting', {})
});