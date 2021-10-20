layui.define(['form', 'drawer', 'table', 'upload'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form
        , upload = layui.upload
        , element = layui.element


    var projectlist;
    var projectcount;
    var identity = "";
    var agentNumber;
    var connectdevice = [];
    var templatedevice;//配置模板的设备
    var templatedata;//选中模板
    var Devicelist;
    var companylistadd;
    var layerindex;
    var companylist;
    var devicetypelist;
    var roletype;
    var layerindex2;//上传弹框编号
    var uploadindex;//上传文件编号
    var uploadbool = false;//上传文件个数
    var filename;
    var curprogress=0;//当前进度
    var once = true;//上传一次
    var progressfinish;

    form.verify({
        confirmserial: function (value) {
            let judge;
            $.ajax({
                url: '/devicelist/getDeviceBySerial',
                data: {
                    machineSerial: value
                },
                async: false,
                success: function (data) {
                    judge = data.data;
                }
            })
            if (judge != null) {
                return "已存在当前设备编号，请重新输入";
            }
        }
    });

    getDeviceCounts();
    adaptauthority();
    getCompanyListByRole(userid);
    mounted();

    function getDeviceCounts() {
        $.ajax({
            url: "/manage/getProDevCount",
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                let item = data.data;
                $("#sumnum").html(item.sum);
                $("#onlinenum").html(item.oncount);
                $("#outnum").html(item.outcount);
            }
        })
    }

    $("#add_device").click(function () {
        if (templatedevice != null && templatedevice.length > 2) {
            drawer.render({
                title: '配置设备',  //标题
                offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                width: "600px", //r、l抽屉可以设置宽度
                content: $("#window"),
                btn: ['<i class="layui-icon">&#xe615;</i>配置设备', '取消'],
                success: function (layero, index) {
                    renderlayerTable();
                },
                btn1: function (index, layero) {
                    excutetemplate();
                    renderTable();
                    templatedevice = [];
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    layer.close(index);
                    return false;
                }
            });
        } else {
            layer.msg("请选择配置的设备");
        }

    })

    /*添加设备*/
    $("#add_device2").click(function () {
        drawer.render({
            title: '添加设备',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#addprowindow"),
            success: function (layero, index) {
                getCompanyListByRoleAdd(userid);
                layerindex = index;
            },
        });
    })

    $("#add_device3").on('click', function () {
        uploadopen();
    });

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let companynum=companylist.getValue('valueStr');
        let projectnum=projectlist.getValue('valueStr');
        let online=devicetypelist.getValue('valueStr');
        let stats = $("#search").val();
        let input = $("#SN").val();
        let id = 1, sn, snreal;
        if (companynum=="") {
            return;
        } else if (projectnum=="") {
            return;
        }
        else if(online==""){
        }  else{
            snreal = input;
        }
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height: 'full-200'
            , totalRow: true
            , url: '/devicelist/findDeviceByParam'
            , where: {'sn': snreal, 'state': online,'projectid':projectnum,'comid':companynum}
            , cols: [[
                {type: 'checkbox'}
                , {field: 'agentName', title: "所属公司", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'createTime', title: "登录时间", align: 'center'}
                , {field: 'onlineState', title: "在线状态", align: 'center', templet: '#table-online-state'}
                , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#barDemo'}
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
            }, done: function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    templatedevice = JSON.stringify(data);
                });
            }
        });
    });

    $("#selectall").on('click', function () {
        renderTable();
    });

    /**模板查询**/
    $("#datasumbit2").on('click', function () {
        let stats = $("#templatetype").val();
        let input = $("#SN2").val();
        if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空");
        } else {
            renderlayerTable();
        }
    });

    form.on('select(search)', function (data) {
        let value = data.value;
        if (value == 2) {
            $("#SN").attr("placeholder", "请输入公司名称");
        } else {
            $("#SN").attr("placeholder", "请输入设备sn号");
        }
    });

    renderTable();

    form.on('submit(formDemo2)', function (data) {
        let json = data.field;
        let company = companylistadd.getValue();
        json.agentNumber = company[0].value;
        json.onlineState = 0;
        let jsondata = JSON.stringify(json);
        $.ajax({
            url: '/devicelist/addDevice',
            data: {
                json: jsondata,
            },
            async: false,
            success: function (data) {
                layer.msg('提交成功');
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //每行记录的按钮事件
    table.on('tool(table-from)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid=' + proId + '&sn=' + data.devicenumber + '&type=' + data.typeid + '&stationname=' + data.name;
        } else if (obj.event === 'edit') {
            location.href = '/devicelist/setting?sn=' + data.machineSerial;
        } else if (obj.event === 'change') {
            editbroadcast(data.machineSerial);
        }

    });

    //模板执行
    function excutetemplate() {
        if (templatedata != null) {
            $.ajax({
                url: '/template/excuteTemplate',
                data: {
                    json: templatedevice,
                    sn: templatedata.templateName
                },
                async: false,
                success: function (res) {
                    let data = res.data;
                    if (data == "success") {
                        layer.msg("修改成功");
                    } else {
                        layer.msg(data);
                    }
                }
            })
        } else {
            layer.msg("请选择模板");
        }

    }

    //表格刷新
    function renderTable() {
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-200'
            , url: '/devicelist/getDeviceList'
            , where: {'userid': userid}
            , cols: [[
                {type: 'checkbox'}
                , {field: 'agentName', title: "所属公司", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'createTime', title: "登录时间", align: 'center'}
                , {field: 'onlineState', title: "在线状态", align: 'center', templet: '#table-online-state'}
                , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#barDemo'}
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
            }, done: function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    templatedevice = JSON.stringify(data);
                });
            }
        });
    }

    //模板表单
    function renderlayerTable() {
        let stats2 = $("#templatetype").val();
        let input = $("#SN2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-300'
            , url: '/template/searchAllTemplate'
            , where: {'content': input, 'type': stats2}
            , cols: [[
                {type: 'radio'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'templateName', title: "模板名称", align: 'center'}
                , {field: 'type', title: "模板类型", align: 'center', templet: '#modeltype'}

            ]]
            , limit: 20 //每页默认显示的数量
            , limits: [50, 100, 200]
            , page: true
            , parseData: function (res) {
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            }, done: function () {
                table.on('radio(table3)', function (obj) {
                    templatedata = obj.data;
                });
            }
        });
    }

    /**根据权限显示不同页面内容**/
    function adaptauthority() {
        $.ajax({
            url: '/custom/getauthorById',
            async: false,
            success: function (data) {
                switch (data.data) {
                    case "user":
                        $("#addequip").css("display", "none");
                        $("#add_device2").css("display", "none");
                        $("#add_device3").css("display", "none");
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n";
                        break;
                    case "companyadmin":
                        $("#add_device2").css("display", "none");
                        $("#add_device3").css("display", "none");
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n";
                        break;
                    case "superadmin":
                        $("#projectheader").css("display", "none");
                        document.getElementById("templateselect").innerHTML = "<select id=\"templatetype\" name=\"templatetype\" lay-verify=\"\" lay-filter=\"templatetype\">\n" +
                            "                                <option value=\"0\" selected>全部</option>\n" +
                            "                                <option value=\"1\">模板名称</option>\n" +
                            "                                <option value=\"2\">公司</option>\n" +
                            "                            </select>";
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n" +
                            "                        <a class=\"layui-btn layui-btn-danger layui-btn-xs\" lay-event=\"change\">设备迁移</a>";
                        break;
                }
                roletype=data.data;
                form.render("select");
            }
        })
    }

    /**获取当前角色的公司列表(主页上的)**/
    function getCompanyListByRole(userid) {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                loadcompanylist(data.data);
                searchcompanylist(data.data);
                searchdevicetype();
            }
        })
    }

    /**获取当前角色的公司列表(添加设备上的)**/
    function getCompanyListByRoleAdd(userid) {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                assignCompanyListadd(data.data);
            }
        })
    }

    /**渲染公司列表（添加设备上的）**/
    function assignCompanyListadd(json) {
        var arrData = [];
        if (json == null) {
            arrData = [];
        } else {
            for (var i = 0; i < json.length; i++) {
                var item = json[i];
                var jsonStr = {};

                jsonStr.name = item.agentName;
                jsonStr.value = item.agentNumber;
                if (i == 0) {
                    jsonStr.selected = true;
                }
                arrData.push(jsonStr);
            }
        }
        companylistadd = xmSelect.render({
            el: '#companylistadd',
            radio: true,
            empty: '呀, 没有数据呢',
            data: arrData,
            clickClose: true,
            theme: {
                color: '#01AAED',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            }
        })
    }

    //弹窗
    function editbroadcast(machinserial) {
        drawer.render({
            title: '设备迁移',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#devicechangewindow"),
            btn: ['迁移', '取消'],
            success: function (layero, index) {
                getCompanyListByRole(userid);
            },
            btn1: function (index, layero) {
                let data = companylist.getValue();
                if (data != null && data != "") {
                    updatedeviceagent(machinserial, data[0].value);
                    renderTable();
                    layer.close(index);
                } else {
                    layer.msg("公司选项不得为空");
                }
            },
            btn2: function (index, layero) {
                layer.close(index);
                return false;
            }
        });
    }

    /**设备迁移**/
    function updatedeviceagent(serial, agentnum) {
        $.ajax({
            url: '/devicelist/changeDeviceAgentBySerial',
            data: {
                machineserial: serial,
                agentnumber: agentnum
            },
            success: function () {
                layer.msg('迁移成功');
            }
        })
    }

    /**加载公司列表**/
    function loadcompanylist(json) {
        var arrData = [];
        var selectSn = "";
        for (var i = 0; i < json.length; i++) {
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
        companylist = xmSelect.render({
            el: '#companylist',
            data: arrData,
            layVerify: 'required',
            radio: true,
            empty: '呀, 没有数据呢',
            clickClose: true,
            layVerType: 'msg',
            theme: {
                color: '#1E9FFF',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            }
        })
    }

    /**上传文件弹窗**/
    function uploadopen() {
        //示范一个公告层
        layer.open({
            type: 1
            , title: false //不显示标题栏
            , closeBtn: true
            , shadeClose: false
            , area: ['600px', '400px']
            , offset: 'auto'
            , resize: false
            , shade: 0.3
            , id: 'LAY_layuipro' //设定一个id，防止重复弹出
            //,btnAlign: 'c'
            , content: $('#addswindow')
            , success: function (index,layero) {
                excuteupload();
                layerindex2=index;
            },
            cancel: function(index, layero){
                layer.confirm('确实要关闭么?', {icon: 3, title:'提示'}, function(index1){
                    layer.close(index1);
                    layer.close(index);
                });
                return false;
            }
            , end: function () {
                $("#testList").remove();
                $("#upload-" + uploadindex).remove();
                uploadbool = false;
                once = true;
                deleteupload();
                element.progress("sqlprogress","0%");
                $("#sqlprogress").css("display","none");
                if(curprogress!=100){
                    stopupload();
                }
            }
        });
    }

    /**上传方法**/
    function excuteupload() {
        var demoListView = $("#demoList");
        $("#uploadchoose").append("<button type=\"button\" class=\"layui-btn  layui-btn-sm layui-btn-normal\" id=\"testList\" style=\"margin-top: 6px;margin-left: 30px;\">选择数据文件</button>");
        let url = "/devicelist/fileupload?userid=" + userid;
        var uploadlistins = upload.render({
            elem: '#testList', // 文件选择
            acceptMime: '.csv',
            exts: 'csv',
            url: url,
            auto: false, // 设置不自动提交
            bindAction: '#uploadBtn', // 提交按钮
            choose: function (obj) {
                if (uploadbool) {
                    layer.msg("一次只能上传一个文件");
                    return;
                } else {
                    var files = this.files = obj.pushFile();
                    obj.preview(function (index, file, result) {
                        uploadindex = index;
                        filename = file.name;
                        var tr = $(['<tr id="upload-' + index + '">'
                            , '<td>' + file.name + '</td>'
                            , '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>'
                            , '<td><div class="layui-progress" lay-filter="progress-' + index + '"><div' +
                            ' class="layui-progress-bar" lay-percent=""></div></div></td>'
                            , '<td><button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                            , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                            , '</td></tr>'].join(''));

                        //单个重传
                        tr.find('.demo-reload').on('click', function () {
                            obj.upload(index, file);
                        })

                        //删除
                        tr.find('.demo-delete').on('click', function () {
                            delete files[index];
                            tr.remove();
                            uploadlistins.config.elem.next()[0].value = '';
                            uploadbool = false;
                            deleteupload();
                        })
                        demoListView.append(tr);
                        element.progress('progress-' + index, "0%");
                        uploadbool = true;
                    });
                }

            },
            done: function (res, index, upload) {
                let columnlist = res.data.split(',');
                if (columnlist.length < 4) {
                    layer.msg("文件列数低于4，不符合格式，请修改文件");
                    return;
                }
                if (once) {
                    once = false;
                    $("#columwindow").css("display", "block");
                    delete this.files[index];
                    // for(let i=0;i<columnlist.length;i++){
                    //     if($("#snnum").html()==columnlist[i]){
                    //         $("#machinesn").append("<option value='"+i+"' selected>"+columnlist[i]+"</option>");
                    //     }else{
                    //         $("#machinesn").append("<option value='"+i+"'>"+columnlist[i]+"</option>");
                    //     }
                    //    if($("#devicename").html()==columnlist[i]){
                    //        $("#machinename").append("<option value='"+i+"' selected>"+columnlist[i]+"</option>");
                    //    }
                    //    else{
                    //        $("#machinename").append("<option value='"+i+"'>"+columnlist[i]+"</option>");
                    //    }
                    //    if($("#connum").html()==columnlist[i]){
                    //        $("#agentnumber").append("<option value='"+i+"' selected>"+columnlist[i]+"</option>");
                    //    }else{
                    //        $("#agentnumber").append("<option value='"+i+"'>"+columnlist[i]+"</option>");
                    //    }
                    //     if($("#devicedate").html()==columnlist[i]){
                    //         $("#createtime").append("<option value='"+i+"' selected>"+columnlist[i]+"</option>");
                    //     }else{
                    //         $("#createtime").append("<option value='"+i+"'>"+columnlist[i]+"</option>");
                    //     }
                    // }
                    // form.on('submit(uploadsumbit)', function(data){//添加用户提交
                    //     let json=data.field;
                    //     let repeat=true;
                    //     let group=[];
                    //     group.push(json.createTime);
                    //     group.push(json.agentNumber);
                    //     group.push(json.machineSerial);
                    //     group.push(json.machineName);
                    //     group.push(filename)
                    //     let s = group.join(",")+",";
                    //     for(let i=0;i<group.length;i++) {
                    //         if (s.replace(group[i] + ",", "").indexOf(group[i] + ",") > -1) {
                    //             layer.msg("文件列名中有重复元素：");
                    //             repeat=false;
                    //             break;
                    //         }
                    //     }
                    //     if(repeat){
                    //         let jsondata=JSON.stringify(json);
                            $.ajax({
                                url:'/devicelist/fileinput',
                                data:{
                                    // json:jsondata,
                                    filename:filename,
                                    userid:userid
                                },
                                async:false,
                                success:function (data) {
                                    if(data.data=="文件上传成功！"){
                                        layer.msg(data.data);
                                    }else{
                                        layer.msg(data.data);
                                        window.clearInterval(progressfinish);
                                    }
                                }
                            });
                    $("#sqlprogress").css("display","block");
                    element.progress("sqlprogress","0%")
                    progressfinish=setInterval(function(){
                        $.ajax({
                            url:'/devicelist/progressuploadfile',
                            data:{
                                // json:jsondata,
                                filename:userid+filename,
                            },
                            success:function (data) {
                                curprogress=data.data;
                                if(data.data==100){
                                    layer.msg("导入成功");
                                    window.clearInterval(progressfinish);
                                }
                                element.progress("sqlprogress",data.data+"%")
                            }
                        })},3000);
                    //     }
                    // });
                }
                var tr = demoListView.find('tr#upload-' + index),
                    tds = tr.children();
                tds.eq(3).html('');
                form.render();
            },
            error: function (res) {
                var tr = demoListView.find('tr#upload-' + index),
                    tds = tr.children();
                tds.eq(3).find('.demo-reload').removeClass('layui-hide');
            },
            progress: function (n, elem, e, index) {
                console.log("进度：" + n + '%');
                element.progress('progress-' + index, n + '%');
            },
        });

    }

    /**删除upload的文件**/
    function deleteupload() {
        $.ajax({
            url: '/devicelist/deleteuploadfile',
            data: {
                filename: userid + filename,
            },
            success: function () {

            }
        })
    }

    /**中止当前执行**/
    function stopupload(){
        $.ajax({
            url: '/devicelist/fileinput',
            data: {
                stop:"stop",
            },
            success: function (res) {
                layer.msg(res.data);
            }
        })
    }

    /**导入警告**/
    function warnupload(){
        if(!once&&(curprogress<100||curprogress>0)){
            layer.confirm('正在导入数据,确实要关闭么?', {icon: 3, title:'提示'}, function(index1){
                layer.close(index1);
                layer.close(layerindex2);
            });
        }
    }

    /**根据用户**/

    /**渲染公司项目列表（主页上搜索的）**/
    function searchprojectlist(json) {
        let arrData = [{name:"全部项目",value:"all"}];
        let init="all";
        if(json!=null&&json.length>0){
            for(let i=0;i<json.length;i++){
                let item = json[i];
                let jsonStr = {};
                jsonStr.name = item.progroupname;
                jsonStr.value = item.projectid;
                arrData.push(jsonStr);
            }
        }
        projectlist = xmSelect.render({
            el: '#comproject',
            radio: true,
            empty: '呀, 没有数据呢',
            data: arrData,
            initValue:[init],
            layVerify: 'required',
            clickClose: true,
            theme: {
                color: '#01AAED',
            },
            style: {
                borderRadius: '6px',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            }
        })
    }

    /**初始化当前搜索公司项目列表**/
    function searchcompanylist(json) {
        let selectdisabled=false;
        let projectData;
        let init;
        if(roletype!="superadmin"){
             projectData = [];
             selectdisabled=true;
        }else{
            projectData = [{name:"全部公司",value:"all"}];
            init="all";
        }
        if(json.length>0){
            for (let i = 0; i < json.length; i++) {
                let item = json[i];
                let jsonStr = {};
                jsonStr.name = item.agentName;
                jsonStr.value = item.agentNumber;
                projectData.push(jsonStr);
                if(i==0&&roletype!="superadmin"){
                    init=jsonStr.value;
                    $.ajax({
                            url:'/project/getProjectsById',
                            async:false,
                            success:function(res){
                                searchprojectlist(res.data);
                            }
                        })
                    }
                else{
                    searchprojectlist();
                     }
            }
        }
        companylist = xmSelect.render({
            el: '#company',
            data: projectData,
            layVerify: 'required',
            radio: true,
            empty: '呀, 没有数据呢',
            clickClose: true,
            initValue:[init],
            disabled:selectdisabled ,
            layVerType: 'msg',
            theme: {
                color: '#1E9FFF',
            },
            style: {
                borderRadius: '6px',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
            on: function(data){
                //可以return一个数组, 代表想选中的数据
                //change, 此次选择变化的数据,数组
                let change = data.change[0];
                $.ajax({
                    url:'/project/getProjectByComId',
                    data:{
                        id:change.value
                    },
                    async:false,
                    success:function(res){
                        searchprojectlist(res.data);
                    }
                })
            },
        });
    }

    /**初始化设备情况**/
    function searchdevicetype(){
        let typeData = [{name:"全部设备",value:"all"},{name:"离线",value:"0"},{name:"在线",value:"1"}];
        devicetypelist = xmSelect.render({
            el: '#online',
            data: typeData,
            layVerify: 'required',
            radio: true,
            empty: '呀, 没有数据呢',
            clickClose: true,
            initValue:["all"],
            layVerType: 'msg',
            theme: {
                color: '#1E9FFF',
            },
           style: {
               borderRadius: '6px',
           },
            model: {
                label: {
                    type: 'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            }
        })
    }

    function mounted() {
        window.addEventListener('unload',function () {
            warnupload();
        });
        window.onunload=function(){
            warnupload();
        };
        window.addEventListener('beforeunload',function (e) {
            warnupload();
        });
        window.onbeforeunload=function(){
            warnupload();
        }
    }


    exports('projectindex', {})
});