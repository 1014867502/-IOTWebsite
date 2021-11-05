layui.define(['form', 'drawer', 'table','station_locate_func'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        ,locatefunc=layui.station_locate_func
        , form = layui.form

    getDeviceSetting(templatename);

    var locatedata;
    var fourhidepara;
    var basehidepara;
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

    $("#reset").click(function () {
        getDeviceSetting(templatename);
    })

    $("#changename").click(function () {
        changename();
    })

    $("#savemodel").click(function () {
        if(form.doVerify("formDemo")){
            saveModel();
            updateModel();
        }
    })

    form.on('switch(coordcvt_enable)', function (data) {
        if (this.checked) {
            document.getElementById("locate_content").innerHTML = locatefunc.locatetxt;
        } else {
            document.getElementById("locate_content").innerHTML = "";
        }
        locatefunc.updatedata("base");
        form.render();
    })

    form.on('switch(coordcvt_seven_use)', function (data) {
        if (this.checked) {
            document.getElementById("seven_use").innerHTML = locatefunc.sevenuse;
        } else {
            document.getElementById("seven_use").innerHTML = "";
        }
        locatefunc.updatedata("seven");
        form.render();
    })

    form.on('switch(coordcvt_four_use)', function (data) {
        if (this.checked) {
            document.getElementById("four_use").innerHTML = locatefunc.fouruse;
        } else {
            document.getElementById("four_use").innerHTML = "";
        }
        locatefunc.updatedata("four");
        form.render();
    })

    form.on('select(datumselect)', function (data) {
        switch (data.value) {
            case "WGS84":
                $("#coordvt_dst_datum_da").val("6378137");
                $("#coordvt_dst_datum_df").val("298.257223563");
                break;
            case "BEIJING54":
                $("#coordvt_dst_datum_da").val("6378245");
                $("#coordvt_dst_datum_df").val("298.3");
                break;
            case "XIAN80":
                $("#coordvt_dst_datum_da").val("6378140");
                $("#coordvt_dst_datum_df").val("298.257");
                break;
            case "CGCS2000":
                $("#coordvt_dst_datum_da").val("6378137");
                $("#coordvt_dst_datum_df").val("298.257222101");
                break;
            case "CUSTOM":
                $("#coordvt_dst_datum_da").val("");
                $("#coordvt_dst_datum_df").val("");
                break;
        }
        if(data.value!="CUSTOM"){
            $('#coordvt_dst_datum_da').attr('disabled',true);
            $('#coordvt_dst_datum_df').attr('disabled',true);
            $("#coordvt_dst_datum_da").addClass('layui-disabled');
            $('#coordvt_dst_datum_df').addClass('layui-disabled');
        }else{
            $('#coordvt_dst_datum_da').attr('disabled',false);
            $('#coordvt_dst_datum_df').attr('disabled',false);
            $("#coordvt_dst_datum_da").removeClass('layui-disabled');
            $('#coordvt_dst_datum_df').removeClass('layui-disabled');
        }
    })

    form.on('select(modeselect)',function (data) {
        switch(data.value){
            case "0":
                document.getElementById("projnorth").innerHTML=locatefunc.projnorth;
                document.getElementById("projeast").innerHTML=locatefunc.projeast;
                document.getElementById("projscale").innerHTML=locatefunc.projscale;
                document.getElementById("projlat").innerHTML=locatefunc.projlat;
                document.getElementById("projheight").innerHTML=locatefunc.projheight;
                break;
            case "1":
                document.getElementById("projnorth").innerHTML="";
                document.getElementById("projeast").innerHTML="";
                document.getElementById("projscale").innerHTML="";
                document.getElementById("projlat").innerHTML="";
                document.getElementById("projheight").innerHTML="";
                break;
            case "2":
                document.getElementById("projnorth").innerHTML=locatefunc.projnorth;
                document.getElementById("projeast").innerHTML=locatefunc.projeast;
                document.getElementById("projscale").innerHTML=locatefunc.projscale;
                document.getElementById("projlat").innerHTML=locatefunc.projlat;
                document.getElementById("projheight").innerHTML=locatefunc.projheight;
                break;
            case "3":
                document.getElementById("projnorth").innerHTML=locatefunc.projnorth;
                document.getElementById("projeast").innerHTML=locatefunc.projeast;
                document.getElementById("projscale").innerHTML=locatefunc.projscale;
                document.getElementById("projlat").innerHTML=locatefunc.projlat;
                document.getElementById("projheight").innerHTML="";
                break;
            case "4":
                document.getElementById("projnorth").innerHTML=locatefunc.projnorth;
                document.getElementById("projeast").innerHTML=locatefunc.projeast;
                document.getElementById("projscale").innerHTML=locatefunc.projscale;
                document.getElementById("projlat").innerHTML=locatefunc.projlat;
                document.getElementById("projheight").innerHTML="";
                break;
        }
        if (locatedata.coordcvtProjParam != null) {
            let coordvt_proj = locatedata.coordcvtProjParam.split('|');
            $("#corrdcvt_proj_mode_select").val(coordvt_proj[0]);
            $("#coordvt_proj_centralmeridian").val(coordvt_proj[1]);
            $("#coordvt_proj_scale").val(coordvt_proj[2]);
            $("#coordvt_proj_north").val(coordvt_proj[3]);
            $("#coordvt_proj_east").val(coordvt_proj[4]);
            $("#coordvt_proj_height").val(coordvt_proj[5]);
            $("#coordvt_proj_lat").val(coordvt_proj[6]);
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
            arr.push(setting.auxiliary.substring(1, setting.auxiliary.length));
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
                layer.msg("提交成功");
            }
        })
    }


    /**提交模组**/
    function changename(){
        layer.open({
            type: 1
            ,id: 'layerDemo' //防止重复弹出
            , title: ['修改模板名称']
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
        data1.coordcvt_enable = (data1.coordcvt_enable != "on") ? 0 : 1;
        data1.coordcvt_seven_use = (data1.coordcvt_seven_use != "on") ? 0 : 1;
        data1.coordcvt_four_use = (data1.coordcvt_four_use != "on") ? 0 : 1;
        if(data1.coordcvt_enable!=1){
            if (locatedata.coordcvtDstDatum != null) {
                let coordcvt_dst = locatedata.coordcvtDstDatum.split('|');
                data1.coordcvt_dst_datum_select=coordcvt_dst[0];
                data1.coordvt_dst_datum_da=coordcvt_dst[1];
                data1.coordvt_dst_datum_df=coordcvt_dst[2];
            }

            /*投影参数*/
            if (locatedata.coordcvtProjParam != null) {
                let coordvt_proj = locatedata.coordcvtProjParam.split('|');
                data1.coordcvt_dst_datum_select=coordvt_proj[0];
                let tmp=data1.coordvt_proj_centralmeridian;
                tmp=(tmp*Math.PI/180);
                data1.coordvt_proj_centralmeridian=tmp;
                data1.coordvt_proj_scale=coordvt_proj[2];
                data1.coordvt_proj_north=coordvt_proj[3];
                data1.coordvt_proj_east=coordvt_proj[4];
                data1.coordvt_proj_height=coordvt_proj[5];
                data1.coordvt_proj_lat=coordvt_proj[6];
            }
        } else{
            let tmp=data1.coordvt_proj_centralmeridian;
            tmp=(tmp*Math.PI/180);
            data1.coordvt_proj_centralmeridian=tmp;
        }

        if(data1.coordcvt_seven_use!=1){
            /*七参数*/
            if (locatedata.coordcvtSevenParam != null) {
                let coordvt_seven = locatedata.coordcvtSevenParam.split('|');
                data1.coordcvt_seven_tx=coordvt_seven[1];
                data1.coordcvt_seven_ty=coordvt_seven[2];
                data1.coordcvt_seven_tz=coordvt_seven[3];
                data1.coordcvt_seven_rx=coordvt_seven[4];
                data1.coordcvt_seven_ry=coordvt_seven[5];
                data1.coordcvt_seven_rz=coordvt_seven[6];
                data1.coordcvt_seven_scale=coordvt_seven[7];
            }
        }

        if(data1.coordcvt_four_use!=1){
            /*四参数*/
            if (locatedata.coordcvtFourParam != null) {
                let coordvt_four = locatedata.coordcvtFourParam.split('|');
                data1.coordcvt_four_tx=coordvt_four[1];
                data1.coordcvt_four_ty=coordvt_four[2];
                data1.coordcvt_four_rotate=coordvt_four[3];
                data1.coordcvt_four_scale=coordvt_four[4];
            }
        }

        let jsondata=locatefunc.datachange(basehidepara,fourhidepara,data1);
        parent.testmodel.locate= JSON.stringify(jsondata);
    }


    /*初始化*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/template/getDeviceByTemplate',
            data: {
                name: sn
            },
            success: function (data) {
                debugger
                let device = data.data;
                locatedata = device;
                locatefunc.setdevice(device);
                if(parent.window.writeright==0){
                    $("#changename").prop("disabled",true);
                    $("#errormsg").html("修改权限被限制");
                    $("#changename").addClass("layui-btn-disabled");
                    $("#savemodel").prop("disabled",true);
                    $("#savemodel").addClass("layui-btn-disabled");
                }
                if (device.coordcvtEnabled > 0) {
                    $("#coordcvt_enable").prop('checked', true);
                    document.getElementById("locate_content").innerHTML = locatefunc.locatetxt;
                } else {
                    $("#coordcvt_enable").prop('checked', false);
                    document.getElementById("locate_content").innerHTML = "";
                }
                if (device.coordcvtDstDatum != null) {
                    let coordcvt_dst = device.coordcvtDstDatum.split('|');
                    $("#coordcvt_dst_datum_select").val(coordcvt_dst[0]);
                    $("#coordvt_dst_datum_da").val(coordcvt_dst[1]);
                    $("#coordvt_dst_datum_df").val(coordcvt_dst[2]);
                    if(coordcvt_dst[0]!="CUSTOM"){
                        $('#coordvt_dst_datum_da').attr('disabled',true);
                        $('#coordvt_dst_datum_df').attr('disabled',true);
                        $("#coordvt_dst_datum_da").addClass('layui-disabled');
                        $('#coordvt_dst_datum_df').addClass('layui-disabled');
                    }else{
                        $('#coordvt_dst_datum_da').attr('disabled',false);
                        $('#coordvt_dst_datum_df').attr('disabled',false);
                        $("#coordvt_dst_datum_da").removeClass('layui-disabled');
                        $('#coordvt_dst_datum_df').removeClass('layui-disabled');
                    }
                }

                /*投影参数*/
                if (device.coordcvtProjParam != null) {
                    let coordvt_proj = device.coordcvtProjParam.split('|');
                    $("#corrdcvt_proj_mode_select").val(coordvt_proj[0]);
                    let tmp=parseFloat(coordvt_proj[1]);
                    tmp=(tmp*180/Math.PI).toFixed(10);
                    $("#coordvt_proj_centralmeridian").val(tmp);
                    $("#coordvt_proj_scale").val(coordvt_proj[2]);
                    $("#coordvt_proj_north").val(coordvt_proj[3]);
                    $("#coordvt_proj_east").val(coordvt_proj[4]);
                    $("#coordvt_proj_height").val(coordvt_proj[5]);
                    $("#coordvt_proj_lat").val(coordvt_proj[6]);
                    basehidepara = "|" + coordvt_proj[7] + "|" + coordvt_proj[8] + "|" + coordvt_proj[9];
                }

                /*七参数*/
                if (device.coordcvtSevenParam != null) {
                    let coordvt_seven = device.coordcvtSevenParam.split('|');
                    if (coordvt_seven[0] > 0) {
                        $("#coordcvt_seven_use").prop('checked', true);
                        document.getElementById("seven_use").innerHTML = locatefunc.sevenuse;
                    } else {
                        $("#coordcvt_seven_use").prop('checked', false);
                    }
                    $("#coordcvt_seven_tx").val(coordvt_seven[1]);
                    $("#coordcvt_seven_ty").val(coordvt_seven[2]);
                    $("#coordcvt_seven_tz").val(coordvt_seven[3]);
                    $("#coordcvt_seven_rx").val(coordvt_seven[4]);
                    $("#coordcvt_seven_ry").val(coordvt_seven[5]);
                    $("#coordcvt_seven_rz").val(coordvt_seven[6]);
                    $("#coordcvt_seven_scale").val(coordvt_seven[7]);
                }

                /*四参数*/
                if (device.coordcvtFourParam != null) {
                    let coordvt_four = device.coordcvtFourParam.split('|');
                    if (coordvt_four[0] > 0) {
                        $("#coordcvt_four_use").prop('checked', true);
                        document.getElementById("four_use").innerHTML = locatefunc.fouruse;
                    } else {
                        $("#coordcvt_four_use").prop('checked', false);
                    }
                    $("#coordcvt_four_tx").val(coordvt_four[1]);
                    $("#coordcvt_four_ty").val(coordvt_four[2]);
                    $("#coordcvt_four_rotate").val(coordvt_four[3]);
                    $("#coordcvt_four_scale").val(coordvt_four[4]);
                    fourhidepara = "|" + coordvt_four[5] + "|" + coordvt_four[6];
                }
                saveModel();
                form.render();
            }
        })
    }


    exports('template_locate', {})
});