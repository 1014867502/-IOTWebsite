layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        ,table2=layui.table
        ,form=layui.form

    var projectlist;
    var projectcount;
    var identity="";
    var agentNumber;
    var agentName;
    var connectdevice=[];
    var Devicelist;
    var comlist;
    var layerindex;

    getDeviceCounts();
    getDetailProject();
    adaptauthority();
    getCompanyListByRole();

    function getDetailProject(){
        $.ajax({
            url:'/company/getCompanyById',
            data:{
                agentNumber:agentnum
            },
            async:false,
            success:function (data) {
                let item=data.data;
                agentNumber=item.agentNumber;
                agentName=item.agentName;
                $("#comname").html(item.agentName);
                // $("#createtime").html(item.createtime);
            }
        })
    }

    function getDeviceCounts(){
        $.ajax({
            url:"/company/getCompanyCount",
            data:{
                agentNumber:agentnum
            },
            async:false,
            success:function (data) {
                let item =data.data;
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
            btn: ['<i class="layui-icon">&#xe615;</i>提交修改', '重置'],
            success :function (layero, index) {
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
            success :function (layero, index) {
                getCompanyListadd();
                layerindex=index;
            },
        });
    })

    /*旗下项目管理跳转*/
    $("#projectmanage").click(function () {
        location.href="/manage/companyprojects?agentnum="+agentnum;
    })

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        // let agentnum=Devicelist.getValue();
        let stats = $("#stats").val();
        let input = $("#SN").val();
        let id=1,sn, snreal;
        if (typeof (id) == "undefined") {
            layer.msg("项目不能为空");
            return;
        } else if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空" );
            return;
        } else {
            snreal = input;
        }
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/devicelist/searchDevice'
            , where: {'agentNumber': agentnum, 'sn': snreal, 'state': stats}
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
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
    $("#datasumbit2").on('click',function(){
        let stats = $("#stats2").val();
        let input = $("#SN2").val();
        let id2=projId,sn2, snreal2;
        if (typeof (id2) == "undefined") {
            layer.msg("项目不能为空");
            return;
        } else if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空" );
            return;
        } else {
            snreal = input;
        }
        searchUnconnectDev(input);
    });

    renderTable();

    form.on('submit(formDemo2)', function(data){
        let json=data.field;
        let company=companylistadd.getValue();
        json.agentNumber=company[0].value;
        let jsondata=JSON.stringify(json);
        $.ajax({
            url:'/devicelist/addDevice',
            data:{
                json:jsondata,
            },
            async:false,
            success:function (data) {
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
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            location.href = '/devicelist/setting?sn='+data.serial;
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function(index){
                admin.req({
                    url:'/devicelist/delConnectDev',
                    data:{
                        sn:data.serial
                    },
                    done:function (res) {
                        renderTable();
                        return false;
                    }
                })
                layer.close(index);
            });
        }

    });

    //表格刷新
    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/company/getAllDeviceByComid'
            , where: {'agentnum':agentnum}
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'createTime', title: "登录时间", align: 'center'}
                , {field: 'onlineState', title: "处理状态", align: 'center', templet: '#table-online-state'}
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


    function renderlayerTable(){
        var stats2 = $("#stats2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height:'full-300'
            , url: '/devicelist/searchUnconnectDev'
            , where: {'agentnum':agentNumber,'content':"",'type':stats2}
            , cols: [[
                {type:'checkbox'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                ,{ fixed: 'right', title:"状态", align:'center', toolbar: '#statusdemo'}
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
            },done: function () {
                table2.on('checkbox(table3)', function(obj){
                    let checkStatus = table2.checkStatus('table3')
                        ,data = checkStatus.data;
                    connectdevice=JSON.stringify(data);
                });
            }
        });
    }

    /**关联设备**/
    function updateConnect(data){
        $.ajax({
            url:"/devicelist/changeConDev",
            data:{
                connectdevice:data,
                projectid:projId
            },
            async:false,
            success:function () {
                layer.alert("修改成功");
            }
        })
    }

    /**搜索未关联设备**/
    function searchUnconnectDev(content){
        var stats2 = $("#stats2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height:'full-300'
            , url: '/devicelist/searchUnconnectDev'
            , where: {'agentnum':agentNumber,'content':content,'type':stats2}
            , cols: [[
                {type:'checkbox'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                ,{ fixed: 'onlineState', title:"状态", align:'center', toolbar: '#statusdemo'}
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
            },done: function () {
                table2.on('checkbox(table3)', function(obj){
                    let checkStatus = table2.checkStatus('table3')
                        ,data = checkStatus.data;
                    connectdevice=JSON.stringify(data);
                });
            }
        });
    }

    /**根据权限显示不同页面内容**/
    function adaptauthority(){
        $.ajax({
            url:'/role/getauthorById',
            async:false,
            success:function (data) {
                switch (data.data) {
                    case "user":
                        break;
                    case "companyadmin":
                        break;
                    case "superadmin":
                        break;
                }

            }
        })
    }

    /**获取当前角色的公司列表**/
    function getCompanyListByRole(){
        $.ajax({
            url:'/company/getCompanyById',
            data:{
                agentNumber:agentnum
            },
            async:false,
            success:function(data){
                assignCompanyList(data.data);
            }
        })
    }

    /**渲染公司列表**/
    function assignCompanyList(){
        var arrData = [];
        var jsonStr = {};
        jsonStr.name = agentName;
        jsonStr.value = agentNumber;
        jsonStr.selected = true;
        arrData.push(jsonStr);
        Devicelist = xmSelect.render({
            el: '#companylist',
            radio: true,
            data: arrData,
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

    /**获取当前角色的公司列表(添加设备内)**/
    function getCompanyListadd(){
        $.ajax({
            url:'/company/getCompanyById',
            data:{
                agentNumber:agentnum
            },
            async:false,
            success:function(data){
                assignCompanyadd(data.data);
            }
        })
    }

    /**渲染公司列表(添加设备内)**/
    function assignCompanyadd(){
        var arrData = [];
        var jsonStr = {};
        jsonStr.name = agentName;
        jsonStr.value = agentNumber;
        jsonStr.selected = true;
        arrData.push(jsonStr);
        comlist = xmSelect.render({
            el: '#companylistadd',
            radio: true,
            data: arrData,
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

    exports('CompanyDetail', {})
});