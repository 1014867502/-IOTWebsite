layui.define(['element', 'form', 'drawer', 'table','station_fastsetting_func','station_compute_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        ,fastsettingfunc=layui.station_fastsetting_func
        ,computefunc=layui.station_compute_func
        , element = layui.element;


    var device;
    var curdecive={};
    var form21 = ["devicestatus", "observedata"];
    var form22 = ["statusresult", "observedata"];
    var form12 = ["statusresult","basechange","basedownload","timerecord"];
    var form11 = ["basestation", "devicestatus", "basefilereturn","timerecord"];
    var formlist = ["basestation", "devicestatus", "basefilereturn", "basechange", "statusresult", "basedownload", "observedata","timerecord"];
    var beforeform;
    var beforemark;
    var beforemark2;
    var compute = 0;
    var station = 0;
    var mark = 0;
    var mark2=1;
    var doublebase = false;//双基站开关
    var downloadsource = 0;//基站数据来源的数据来源单选
    var layerindex;
    var socketdata;
    var connected=false;
    var index;

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

    init(machinesn);

    $("#reset").click(function () {
        getDeviceSetting(machinesn);
    })
    $("#savemodel").click(function () {
        if(form.doVerify("formDemo")){
            saveModel();
            addModel();
        }
    })
    form.on('radio(compute)', function (data) {
        compute = data.value;
        curdecive.rawSolution=compute;
        new Promise((resolve, reject) => {
            showform(compute, station);
            resolve();
        }).then(() => {
            height();
        });
    });
    form.on('radio(station)', function (data) {
        station = data.value;
        curdecive.rawMode=station;
        showform(compute, station);
        new Promise((resolve, reject) => {
            showform(compute, station);
            resolve();
        }).then(() => {
            height();
        });
    });
    form.on('select(rawRate)', function(data){
        curdecive.rawRate=data.value;
    });
    form.on('select(recordInterval)', function(data){
        curdecive.recordInterval=data.value;
    });
    form.on('radio(mark)', function (data) {
        mark = data.value;
        if(beforemark==null){
            if(mark==1){
                let lat=$("#baseLat").val();
                let lon=$("#baseLon").val();
                let height=$("#baseHeight").val();
                fastsettingfunc.altermark(mark);
                fastsettingfunc.computemark(lat,lon,height,mark);
                beforemark=1;
            }else{
                let x=$("#ecefx").val();
                let y=$("#ecefy").val();
                let z=$("#ecefz").val();
                fastsettingfunc.altermark(mark);
                fastsettingfunc.computemark(x,y,z,mark);
                beforemark=0;
            }
        }else{
            if(mark==1&&beforemark!=mark){
                let lat=$("#baseLat").val();
                let lon=$("#baseLon").val();
                let height=$("#baseHeight").val();
                fastsettingfunc.altermark(mark);
                fastsettingfunc.computemark(lat,lon,height,mark);
                beforemark=1;
            }
            else if(mark!=1&&beforemark!=mark){
                let x=$("#ecefx").val();
                let y=$("#ecefy").val();
                let z=$("#ecefz").val();
                fastsettingfunc.altermark(mark);
                fastsettingfunc.computemark(x,y,z,mark);
                beforemark=0;
            }
        }

    });
    form.on('radio(mark2)', function (data) {
        mark2 = data.value;
        if(beforemark2==null){
            if(mark2==1){
                let lat=$("#ecefLat").val();
                let lon=$("#ecefLon").val();
                let height=$("#ecefHeight").val();
                computefunc.altermark2(mark2);
                computefunc.computemark2(lat,lon,height,mark2);
                beforemark2=1;
            }else{
                let x=$("#coordinatesX").val();
                let y=$("#coordinatesY").val();
                let z=$("#coordinatesZ").val();
                computefunc.altermark2(mark2);
                computefunc.computemark2(x,y,z,mark2);
                beforemark2=0;
            }
        }else{
            if(mark2==1&&beforemark2!=mark2){
                let lat=$("#ecefLat").val();
                let lon=$("#ecefLon").val();
                let height=$("#ecefHeight").val();
                computefunc.altermark2(mark2);
                computefunc.computemark2(lat,lon,height,mark2);
                beforemark2=1;
            }
            else if(mark2!=1&&beforemark!=mark2){
                let x=$("#coordinatesX").val();
                let y=$("#coordinatesY").val();
                let z=$("#coordinatesZ").val();
                computefunc.altermark2(mark2);
                computefunc.computemark2(x,y,z,mark2);
                beforemark2=0;
            }
        }
    });

    form.on('radio(downloadsource)', function (data) {
        downloadsource = data.value;
        curdecive.ntrIpBase=data.value;
        device.ntrIpBase=data.value;
        fastsettingfunc.altersource(doublebase, downloadsource);
        listening();
    })
    form.on('switch(doublebase)', function (data) {
        if (this.checked) {
            doublebase = true;
            curdecive.secondBase=1;
        } else {
            doublebase = false;
            curdecive.secondBase=0;
        }

        let source = $('input[name="downloadsource"]:checked').val();
        fastsettingfunc.altersource(doublebase, source);
        listening();
    })
    form.on('submit(formDemo)', function (data) {
        let demo=data.field;
        let test = curdecive;
        if(mark==1){
            $.ajax({
                url:'/devicelist/xyztoblh',
                data:{
                    x:$("#ecefx").val(),
                    y:$("#ecefy").val(),
                    z:$("#ecefz").val()
                },
                async:false,
                success:function(res){
                    let data=res.data;
                    test.baseLon=data.DesB.toFixed(3);
                    test.baseLat=data.DesL.toFixed(3);
                    test.baseHeight=data.DesH.toFixed(3);
                }
            })
        }
        if(downloadsource==1&&demo.rawntripaddress!=null&&demo.rawntripport!=null&&demo.networkMountpoint1!=null&&demo.coreuse1!=null&&demo.corepass1){
            let address=(test.rawntripaddress!=null)?test.rawntripaddress:demo.rawntripaddress;
            let port=(test.rawntripport!=null)?test.rawntripport:demo.rawntripport;
            let point=(test.networkMountpoint1!=null)?test.networkMountpoint1:demo.networkMountpoint1;
            let user=(test.coreuse1!=null)?test.coreuse1:demo.coreuse1;
            let pass=(test.corepass1!=null)?test.corepass1:demo.corepass1;
            test.ntripArg=address+"|"+port+"|"+point+"|"+user+"|"+pass;
        }
        if(doublebase&&(demo.secondntripaddress!=null&&demo.secondntripport!=null&&demo.secondMountpoint1!=null&&demo.coreuse2!=null&&demo.corepass2!=null)){
            let address2=(test.secondntripaddress!=null)?test.secondntripaddress:demo.secondntripaddress;
            let port2=(test.secondntripport!=null)?test.secondntripport:demo.secondntripport;
            let point2=(test.secondMountpoint1!=null)?test.secondMountpoint1:demo.secondMountpoint1;
            let user2=(test.coreuse2!=null)?test.coreuse2:demo.coreuse2;
            let pass2=(test.corepass2!=null)?test.corepass2:demo.corepass2;
            test.secondArg=address2+"|"+port2+"|"+point2+"|"+user2+"|"+pass2;
        }
        let stringtest = JSON.stringify(test);
        $.ajax({
            url: '/devicelist/editSetting',
            data: {
                setting: stringtest,
                machinesn: machinesn
            },
            success: function (data) {
                curdecive={};
                getDeviceSetting(machinesn);
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
            }
        })
    })
    form.on('submit(example)',function () {
        let jsondata=parent.fastmodel;
        let data1 = form.val("example");
        $.ajax({
            url:'/template/addTemplate',
            data:{
                json:jsondata,
                machinesn:machinesn,
                templatename:data1.templatename,
                type:"1"
            },
            async:false,
            success:function () {
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
            }
        })
        layer.close(layerindex);
    })

    /**根据选项初始化页面**/
    function init(sn){
        $.ajax({
            url: '/devicelist/getDeviceSetting',
            data: {
                machineSerial: sn
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

    /**获取设备配置**/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/devicelist/getDeviceSetting',
            data: {
                machineSerial: sn
            },
            success: function (data) {
                device = data.data;
                if (device.rawName!=null) {
                    fastsettingfunc.setdevice(device);
                    if (device.rawName != null && device.rawName != "") {
                        $("#rawName").val(device.rawName);
                    } else {
                        $("#rawName").val(device.machineSerial);
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
                    if (device.rawRate != null & device.rawRate != "") {
                        $("#selectList").find("option[value=" + device.rawRate + "]").prop("selected", true);
                    }
                    let ntriparg = device.ntripArg;
                    if (writeright == 0) {
                        $("#fastsumbit").prop("disabled", true);
                        $("#errormsg").html("修改权限被限制");
                        $("#fastsumbit").addClass("layui-btn-disabled");
                        $("#savemodel").prop("disabled", true);
                        $("#savemodel").addClass("layui-btn-disabled");
                    }
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
                    if (device.secondBase > 0) {
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
                        if (device.ntrIpBase > 0) {
                            $("input[name=downloadsource][value='1']").prop("checked", true);
                            fastsettingfunc.altersource(doublebase, "1");
                        } else {
                            $("input[name=downloadsource][value='0']").prop("checked", true);
                            fastsettingfunc.altersource(doublebase, "0");
                        }
                    }
                    if (device.networkMountpointPass != "" && device.networkMountpointPass != null) {
                        let userpass = device.networkMountpointPass.toString().split("|");
                        $("#networkMountpointUse").val(userpass[0]);
                        $("#networkMountpointPass").val(userpass[1]);
                    }
                    saveModel();
                    listening();
                    form.render();
                }
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
            , content: $("#window")
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
        data2.nameType=0;
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
        if(data1.downloadsource==1&&data1.rawntripaddress!=null&&data1.rawntripport!=null&&data1.networkMountpoint1!=null&&data1.coreuse1!=null&&data1.corepass1){
            let address=(data1.rawntripaddress!=null)?data1.rawntripaddress:data1.rawntripaddress;
            let port=(data1.rawntripport!=null)?data1.rawntripport:data1.rawntripport;
            let point=(data1.networkMountpoint1!=null)?data1.networkMountpoint1:data1.networkMountpoint1;
            let user=(data1.coreuse1!=null)?data1.coreuse1:data1.coreuse1;
            let pass=(data1.corepass1!=null)?data1.corepass1:data1.corepass1;
            data1.ntripArg=address+"|"+port+"|"+point+"|"+user+"|"+pass;
            data1.ntrIpBase=1;
        }else{
            data1.ntrIpBase=0;
        }
        Object.assign(data2,data1);
        let stringtest=JSON.stringify(data1);
        parent.fastmodel=stringtest;
        height();
    }

    function listening() {
        $("#rawName").on("change",function () {
            curdecive.rawName=this.value;
        });
        $("#baseLat").on("change",function () {
            curdecive.baseLat=this.value;
        })
        $("#baseLon").on("change",function () {
            curdecive.baseLon=this.value;
        })
        $("#baseHeight").on("change",function () {
            curdecive.baseHeight=this.value;
        })
        $("#resultIp").on("change",function () {
            curdecive.resultIp=this.value;
        })
        $("#resultPort").on("change",function () {
            curdecive.resultPort=this.value;
        })
        $("#rawIp").on("change",function () {
            curdecive.rawIp=this.value;
        })
        $("#rawPort").on("change",function () {
            curdecive.rawPort=this.value;
        })
        $("#secondIp").on("change",function () {
            curdecive.secondIp=this.value;
        })
        $("#secondPort").on("change",function () {
            curdecive.secondPort=this.value;
        })
        $("#rawntripaddress").on("change",function () {
            curdecive.rawntripaddress=this.value;
        })
        $("#rawntripport").on("change",function () {
            curdecive.rawntripport=this.value;
        })
        $("#networkMountpoint1").on("change",function () {
            curdecive.networkMountpoint1=this.value;
        })
        $("#coreuse1").on("change",function () {
            curdecive.coreuse1=this.value;
        })
        $("#corepass1").on("change",function () {
            curdecive.corepass1=this.value;
        })
        $("#secondntripaddress").on("change",function () {
            curdecive.secondntripaddress=this.value;
        })
        $("#secondntripport").on("change",function () {
            curdecive.secondntripport=this.value;
        })
        $("#secondMountpoint1").on("change",function () {
            curdecive.secondMountpoint1=this.value;
        })
        $("#coreuse2").on("change",function () {
            curdecive.coreuse2=this.value;
        })
        $("#corepass2").on("change",function () {
            curdecive.corepass2=this.value;
        })
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
        /**判断当前设备是否在线**/
        isDeviceOnline(machinesn);
        getDeviceSetting(machinesn);
        form.render();
    }

    function isDeviceOnline(sn){
        $.ajax({
            url:'/devicelist/isDeviceOnline',
            data:{
                machineserial: sn
            },
            success: function (data) {
                let result=data.data;
                if(result=="online"){
                    $("#deviceonline").html("设备在线");
                    $("#deviceonline").css("color","#5FB878");
                    $("#deviceonline").css("margin","auto");
                    $("#deviceonline").css("margin-left","10px");
                    $("#curlocal").on('click',function () {
                        layer.msg('正在执行，请稍后', {icon: 6});
                        let high2=parent.document.getElementById("iframe_a").style.height;
                        index = parent.layer.load();
                        $("#cover").css('height',high2);
                        $("#cover").css('display','block'); //显示遮罩层
                        $.ajax({
                            url:'/devicelist/condevsocket',
                            data:{
                                machinesn:sn
                            },
                            success: function (res) {
                                let data=res.data
                                if(data=="连接成功"){
                                //     $.ajax({
                                //         url: '/devicelist/sendorder',
                                //         data: {
                                //             order: "",
                                //             machinesn: sn
                                //         },
                                //         success:function(res){
                                            if(res.data=="连接成功"||connected){
                                                connected=true;
                                                getcurlocal(machinesn);
                                                mounted();
                                            }
                                    //     }
                                    // })
                                }
                                else{
                                   layer.msg("连接服务器出错");
                                    $("#cover").css('display','none'); //显示遮罩层
                                    parent.layer.close(index);
                                }
                            }
                        })
                    })
                }else{
                    // $("#fastsumbit").addClass("layui-btn-disabled");
                    // $("#fastsumbit").attr("disabled","disabled");
                    $("#deviceonline").html("设备不在线！");
                    $("#deviceonline").css("margin","auto");
                    $("#deviceonline").css("margin-left","10px");
                    $("#deviceonline").css("color","#FF5722");
                    $("#curlocal").addClass("layui-btn-disabled");
                    $("#curlocal").attr("disabled","disabled");
                }
            }

        })
    }

    function getcurlocal(sn){
        let lon=sendorder(sn,"GET,GPS.POSITION.LON");
        let lat=sendorder(sn,"GET,GPS.POSITION.LAT");
        let height=sendorder(sn,"GET,GPS.POSITION.HEIGHT");
        $("#baseLat").val(lat);
        $("#baseLon").val(lon);
        $("#baseHeight").val(height);
        parent.layer.close(index);
        $("#cover").css('display','none');   //显示遮罩层
    }

    function sendorder(sn,order){
        $.ajax({
            url: '/devicelist/sendorder',
            data: {
                order: order,
                machinesn: sn
            },
            async:false,
            success:function(res){
                if(res.data=="设备结果返回超时"){

                }else{
                    let datalist=res.data.split(',');
                    let data=datalist[4].split('*');
                    socketdata=data[0];
                }
            }
        });
        return socketdata;
    }

    function closesocket() {
        connected=false;
        $.ajax({
            url: '/devicelist/closesocket',
            success: function (data) {

            }
        })
    }

    function height() {
        let height=$("#fastsetting").height()+50;
        parent.height=height;
        parent.setsettingheight(height);
    }

    function mounted() {
        window.addEventListener('unload',function () {
            closesocket();
        });
        window.onunload=function(){
            closesocket();
        };
        window.addEventListener('beforeunload',function (e) {
            closesocket();
        });
        window.onbeforeunload=function(){
            closesocket();
        }
    }

    exports('fastsetting', {})
});