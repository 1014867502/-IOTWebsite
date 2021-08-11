layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form


    var projectlist;
    var projectcount;
    var identity = "";
    var agentNumber;
    var connectdevice = [];
    var Devicelist;
    var companylistadd;
    var layerindex;
    var companylist;

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

    // getCompanyListByRole(userid);


    function getDetailProject() {
        $.ajax({
            url: '/manage/getDetailProject',
            data: {
                projectid: projId
            },
            async: false,
            success: function (data) {
                let item = data.data;
                agentNumber = item.agentnumber;
                $("#devicenum").html(item.devicenum);
                $("#projectname").html(item.progroupname);
                $("#comname").html(item.agentname);
                $("#createtime").html(item.createtime);
            }
        })
    }

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
        drawer.render({
            title: '关联设备',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            btn: ['<i class="layui-icon">&#xe615;</i>提交修改', '取消'],
            success: function (layero, index) {
                renderlayerTable();
            },
            btn1: function (index, layero) {
                updateConnect(connectdevice);
                renderTable();
                layer.close(index);
            },
            btn2: function (index, layero) {
                layer.close(index);
                return false;
            }
        });
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

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let stats = $("#stats").val();
        let input = $("#SN").val();
        let id = 1, sn, snreal;
        if (typeof (id) == "undefined") {
            layer.msg("项目不能为空");
            return;
        } else if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空");
            return;
        } else {
            snreal = input;
        }
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height: 'full-200'
            , totalRow: true
            , url: '/devicelist/searchDevice'
            , where: {'sn': snreal, 'state': stats}
            , cols: [[
                {field: 'agentName', title: "所属公司", align: 'center'}
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
            }
        });
    });

    $("#selectall").on('click', function () {
        renderTable();
    });

    /**未关联设备的查询**/
    $("#datasumbit2").on('click', function () {
        let stats = $("#stats2").val();
        let input = $("#SN2").val();
        let id2 = projId, sn2, snreal2;
        if (typeof (id2) == "undefined") {
            layer.msg("项目不能为空");
            return;
        } else if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空");
            return;
        } else {
            snreal = input;
        }
        searchUnconnectDev(input);
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

    //表格刷新
    function renderTable() {
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-200'
            , url: '/devicelist/getDeviceList'
            , where: {'userid': userid}
            , cols: [[
                {field: 'agentName', title: "所属公司", align: 'center'}
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
            }
        });
    }

    function renderlayerTable() {
        var stats2 = $("#stats2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-300'
            , url: '/devicelist/searchUnconnectDev'
            , where: {'agentnum': agentNumber, 'content': "", 'type': stats2}
            , cols: [[
                {type: 'checkbox'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {fixed: 'right', title: "状态", align: 'center', toolbar: '#statusdemo'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
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
                table2.on('checkbox(table3)', function (obj) {
                    let checkStatus = table2.checkStatus('table3')
                        , data = checkStatus.data;
                    connectdevice = JSON.stringify(data);
                });
            }
        });
    }

    /**关联设备**/
    function updateConnect(data) {
        $.ajax({
            url: "/devicelist/changeConDev",
            data: {
                connectdevice: data,
                projectid: projId
            },
            async: false,
            success: function () {
                layer.alert("关联成功");
            }
        })
    }

    /**搜索未关联设备**/
    function searchUnconnectDev(content) {
        var stats2 = $("#stats2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-300'
            , url: '/devicelist/searchUnconnectDev'
            , where: {'agentnum': agentNumber, 'content': content, 'type': stats2}
            , cols: [[
                {type: 'checkbox'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {fixed: 'onlineState', title: "状态", align: 'center', toolbar: '#statusdemo'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
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
                table2.on('checkbox(table3)', function (obj) {
                    let checkStatus = table2.checkStatus('table3')
                        , data = checkStatus.data;
                    connectdevice = JSON.stringify(data);
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
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n";
                        break;
                    case "companyadmin":
                        $("#add_device2").css("display", "none");
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n";
                        break;
                    case "superadmin":
                        $("#projectheader").css("display", "none");
                        document.getElementById("select").innerHTML = "<select id=\"stats\" name=\"stats\" lay-verify=\"\" lay-filter=\"stats\">\n" +
                            "                                <option value=\"1\">在线</option>\n" +
                            "                                <option value=\"0\">离线</option>\n" +
                            "                                <option value=\"2\">公司</option>\n" +
                            "                                <option value=\"3\">全部</option>\n" +
                            "                            </select>";
                        document.getElementById("barDemo").innerHTML = "   <a class=\"layui-btn layui-btn-xs\" lay-event=\"edit\">编辑</a>\n" +
                            "                        <a class=\"layui-btn layui-btn-danger layui-btn-xs\" lay-event=\"change\">设备迁移</a>";
                        break;
                }
                form.render();

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

    /**渲染公司列表（主页上的）**/
    function assignCompanyList(json) {
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
        Devicelist = xmSelect.render({
            el: '#companylist',
            radio: true,
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

    exports('projectindex', {})
});