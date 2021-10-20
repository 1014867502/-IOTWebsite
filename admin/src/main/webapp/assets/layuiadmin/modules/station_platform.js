layui.define(['form', 'drawer', 'table','station_platform_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        ,platformfunc=layui.station_platform_func
        , form = layui.form

    var locatedata;
    var layerindex;
    var chongqingturn=false;

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

    getDeviceSetting(machinesn);

    $("#reset").click(function () {
        getDeviceSetting(machinesn);
    })
    $("#savemodel").click(function () {
        if(form.doVerify("formDemo")){
            saveModel();
            addModel();
        }
    })

    form.on('switch(onenet_enable)', function (data) {
        if (this.checked) {
            document.getElementById("onenetcontent").innerHTML = platformfunc.onenetcontent;
            if(locatedata.oneNetMode!=null){
                platformfunc.onenetexhibit(locatedata.oneNetMode);
                platformfunc.onenetupdate();
            }else{
                platformfunc.onenetexhibit("0");
            }
        } else {
            document.getElementById("onenetcontent").innerHTML = "";
        }
        form.render();
    })

    form.on('switch(dz_iot_enable)', function (data) {
        if (this.checked) {
            document.getElementById("dzcontent").innerHTML =platformfunc.dznetcontent;
            platformfunc.dzIotupdate();
        } else {
            document.getElementById("dzcontent").innerHTML = "";
        }
        form.render();
    })

    form.on('select(onenet_mode)', function (data) {
        let select = data.value;
        platformfunc.onenetexhibit(select);
    });

    form.on('switch(chongqing_enable)',function (data) {
        if(this.checked){
            chongqingturn=true;
            document.getElementById("chongqing_select").innerHTML=platformfunc.chongqingselect;
            if(locatedata.cqIotEnabled=="0"){
                $("#chongqing_mode").val("1");
                platformfunc.chongqingexhibit("1");
            }else{
                $("#chongqing_mode").val(locatedata.cqIotEnabled);
                platformfunc.chongqingexhibit(locatedata.cqIotEnabled);
            }
            $("#chongqing_iot_telecom").val(locatedata.cqIotTelecom);
            $("#chongqing_iot_id").val(locatedata.cqIotId);
            $("#chongqing_iot_key").val(locatedata.cqIotKey);
            $("#chongqing_iot_user").val(locatedata.cqIotUser);
        }else{
            chongqingturn=false;
            document.getElementById("chongqing_select").innerHTML="";
        }
    })

    form.on('select(chongqing_mode)', function (data) {
        let select = data.value;
        platformfunc.chongqingexhibit(select);
    });

    form.on('submit(formDemo)',function (data) {
        let test=data.field;
        let jsondata=platformfunc.datachange(test);
        let stringtest=JSON.stringify(jsondata);
        $.ajax({
            url:'/devicelist/editSetting',
            data:{
                setting:stringtest,
                machinesn:machinesn
            },
            success:function (data) {
                getDeviceSetting(machinesn);
                alert("提交成功");
            }
        })
    })

    //提交模板
    form.on('submit(example)',function () {
        let setting=parent.testmodel
        let jsondata=setting.compute.substring(0,setting.compute.length-1)+","+setting.locate.substring(1,setting.locate.length-1)+","
            +setting.plaform.substring(1,setting.plaform.length-1)+","+setting.auxiliary.substring(1,setting.auxiliary.length);
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
                platformfunc.setdevice(device);
                isDeviceOnline(sn);
                if(device.oneNetEnabled>0){
                        $("#onenet_enable").prop('checked',true);
                        document.getElementById("onenetcontent").innerHTML = platformfunc.onenetcontent;
                        platformfunc.onenetexhibit(device.oneNetMode);
                } else {
                    $("#onenet_enable").prop('checked',false);
                        document.getElementById("onenetcontent").innerHTML = "";
                }
                $("#onenet_id").val(device.oneNetId);
                $("#onenet_user").val(device.oneNetUser);
                $("#onenet_key").val(device.oneNetKey);
                $("#onenet_data").val(device.oneNetGnssData)

                /*地灾平台*/
                if (device.dzIotEnabled>0) {
                    $("#dz_iot_enable").prop('checked',true);
                    document.getElementById("dzcontent").innerHTML =platformfunc.dznetcontent;
                } else {
                    $("#dz_iot_enable").prop('checked',false);
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
                if(device.cqIotEnabled>0){
                    $("#chongqing_enable").prop('checked',true);
                    document.getElementById("chongqing_select").innerHTML=platformfunc.chongqingselect;
                    if(!locatedata.cqIotEnabled>0){
                        $("#chongqing_mode").val("1");
                        platformfunc.chongqingexhibit("1");
                    }else{
                        $("#chongqing_mode").val(locatedata.cqIotEnabled);
                        platformfunc.chongqingexhibit(locatedata.cqIotEnabled);
                    }
                    $("#chongqing_iot_telecom").val(device.cqIotTelecom);
                    $("#chongqing_iot_id").val(device.cqIotId);
                    $("#chongqing_iot_key").val(device.cqIotKey);
                    $("#chongqing_iot_user").val(device.cqIotUser);
                }else{
                    document.getElementById("chongqing_select").innerHTML="";
                    $("#chongqing_enable").prop('checked',false);
                }
                saveModel();
                form.render();
            }
        })
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

                }else{
                    $("#platformsumbit").addClass("layui-btn-disabled");
                    $("#platformsumbit").attr("disabled","disabled");
                }
            }

        })
    }


    /**保存模组**/
    function saveModel(){
        let data1 = form.val("formDemo");
        let jsondata=platformfunc.datachange(data1);
        delete jsondata.oneNetMode;
        delete jsondata.oneNetId;
        delete jsondata.oneNetUser;
        delete jsondata.onenet_key;
        delete jsondata.oneNetKey;
        delete jsondata.oneNetGnssData;
        delete jsondata.dzIotKey;
        delete jsondata.dzIotId;
        parent.testmodel.plaform=JSON.stringify(jsondata);
    }

    exports('station_platform', {})
});