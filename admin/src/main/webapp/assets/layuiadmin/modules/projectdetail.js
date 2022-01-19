layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , form = layui.form
        , drawer = layui.drawer
        ,table2=layui.table


    var projectlist;
    var projectcount;
    var identity="";
    var devicetypelist;
    var machinelist;
    var agentNumber=agentnum;
    var progroupname;
    var agentName;
    var connectdevice=[];
    var Devicelist;
    var templatedevice;//配置模板的设备
    var selectdata=[];//选中的设备
    var templatedata;//选中模板

    getDeviceCounts();
    getDetailProject();
    adaptauthority();
    getCompanyListByRole();
    searchdevicetype();

    function getDetailProject(){
        $.ajax({
            url:'/manage/getDetailProject',
            data:{
                projectid:progroupid
            },
            async:false,
            success:function (data) {
                let item=data.data;
                $("#progroupname2").html(item.progroupname);
                $("#comname2").html(item.agentname);
                agentName=item.agentname;
                progroupname=item.progroupname;
                $("#comname2").attr("href","/company/CompanyDetail?agentNumber="+agentnum);
                $("#progroupname").html(item.progroupname);
                $("#createtime").html(item.createtime);
            }
        })
    }

    function getDeviceCounts(){
        $.ajax({
            url:"/project/getProDevByGroupId",
            data:{
                progroupid:progroupid
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

    $("#excute_template").click(function () {
        if (templatedevice != null && templatedevice.length > 2) {
            drawer.render({
                title: '配置设备',  //标题
                offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                width: "600px", //r、l抽屉可以设置宽度
                content: $("#templatewindow"),
                btn: ['<i class="layui-icon">&#xe615;</i>配置设备', '取消'],
                success: function (layero, index) {
                    rendertemplateTable();
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

    /**模板查询**/
    $("#datasumbit3").on('click', function () {
        let stats = $("#templatetype").val();
        let input = $("#SN2").val();
        if ((input.length == 0 || input == null) && (!stats == 2)) {
            layer.msg("输入不能为空");
        } else {
            rendertemplateTable();
        }
    });

    $("#add_device").click(function () {
        drawer.render({
            title: '关联设备',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            btn: ['<i class="layui-icon">&#xe615;</i>关联设备'],
            success :function (layero, index) {
                renderlayerTable();
            },
            btn1: function (index, layero) {
                updateConnect(connectdevice);
                renderTable();
                getCompanyListByRole()
                layer.close(index);
            },
        });
    })

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let agentnum=agentNumber;
        let online=devicetypelist.getValue('valueStr');
        let input = $("#SN").val();
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/devicelist/findDevice'
            , where: {'agentNumber': agentnum, 'sn': input, 'state':online,'groupid':progroupid}
            , cols: [[
                {type:'checkbox'}
                ,{field: 'agentName', title: "所属公司", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'createTime', title: "登录时间", align: 'center'}
                , {field: 'state', title: "在线状态", align: 'center', templet: '#table-online-state'}
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
            },done:function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    if(obj.type!=null&&obj.type=="all"){
                        if(obj.checked){
                            selectdata=data;
                        }else{
                            selectdata=[];
                        }
                    }else{
                        if(obj.checked){
                            selectdata.push(obj.data);
                        }else{
                            let k=0;
                            for (let i = 0; i < selectdata.length; i++) {
                                if (selectdata[i].machineSerial == obj.data.machineSerial){
                                    k=i;
                                }
                            }
                            selectdata.splice(k,1);
                        }
                    }
                    templatedevice = JSON.stringify(selectdata);
                });
            }
        });
    });

    $("#selectall").on('click', function () {
        renderTable();
    });

    $("#delete_device").on('click',function () {
        updateconnectlist(devicetypelist);
    })

    $("#delete_project").on("click",function(){
        layer.confirm('真的删除该项目吗？', function(index){
            admin.req({
                url:'/manage/deleteproject',
                data:{
                    projectid:progroupid
                },
                done:function (res) {
                    if(res.data=="删除成功"){
                        location.href="/company/CompanyDetail?agentNumber="+agentnum;
                    }
                    layer.msg(res.data);
                    return false;
                }
            })
            layer.close(index);
        });
    })

    /**未关联设备的查询**/
    $("#datasumbit2").on('click',function(){
        let stats = $("#stats2").val();
        let input = $("#SN2").val();
        let id2=progroupid,sn2, snreal2;
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

    $("#excute_update").on('click',function () {
        updatedevices();
    })

    renderTable();

    //每行记录的按钮事件
    table.on('tool(table-from)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            location.href = '/devicelist/setting?sn='+data.machineSerial;
        } else if (obj.event === 'del') {
            layer.confirm('真的取消关联吗？', function(index){
                admin.req({
                    url:'/devicelist/delConnectDev',
                    data:{
                        sn:data.machineSerial
                    },
                    done:function (res) {
                        getDeviceCounts();
                        renderTable();
                        return false;
                    }
                })
                layer.close(index);
            });
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
    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/project/getAllDeviceByGroupid'
            , where: {'progroupid':progroupid}
            , cols: [[
                {type:'checkbox'}
                ,{field: 'agentName', title: "所属公司", align: 'center'}
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
            },done:function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    if(obj.type!=null&&obj.type=="all"){
                        if(obj.checked){
                            selectdata=data;
                        }else{
                            selectdata=[];
                        }
                    }else{
                        if(obj.checked){
                            selectdata.push(obj.data);
                        }else{
                            let k=0;
                            for (let i = 0; i < selectdata.length; i++) {
                                if (selectdata[i].machineSerial == obj.data.machineSerial){
                                    k=i;
                                }
                            }
                            selectdata.splice(k,1);
                        }
                    }
                    templatedevice = JSON.stringify(selectdata);
                });
            }
        });
    }


    /**在线离线**/
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


    function renderlayerTable(){
        var stats2 = $("#stats2").val();
        table2.render({
            elem: '#table3'
            , title: 'logdata'
            , totalRow: true
            , height:'full-300'
            , url: '/devicelist/searchUnconnectDev'
            , where: {'agentnum':agentnum,'content':"",'type':stats2}
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


    //模板表单
    function rendertemplateTable() {
        let stats2 = $("#templatetype").val();
        let input = $("#SN3").val();
        table2.render({
            elem: '#table2'
            , title: 'logdata'
            , totalRow: true
            , height: 'full-300'
            , url: '/template/searchSettingTemplate'
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
                table.on('radio(table2)', function (obj) {
                    templatedata = obj.data;
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
                projectid:progroupid
            },
            async:false,
            success:function () {
                getDeviceCounts();
                layer.alert("关联成功");
            }
        })
    }

    /**设备批量删除**/
    function  updateconnectlist(data) {
        if(machinelist!=null&&machinelist.length>2){
            layer.confirm('确实要删除吗?', {icon: 3, title:'提示'}, function(index1){
                $('div.layui-table-body table tbody input[name="layTableCheckbox"]:checked').each(function() { // 遍历选中的checkbox
                    let  n = $(this).parents('tbody tr').index()  // 获取checkbox所在行的顺序
                    //移除行
                    $('div.layui-table-body table tbody ').find('tr:eq(' + n + ')').remove()
                    //如果是全选移除，就将全选CheckBox还原为未选中状态
                    $('div.layui-table-header table thead div.layui-unselect.layui-form-checkbox').removeClass('layui-form-checked')
                })
                $.ajax({
                    url: '/devicelist/delConnectDevlist',
                    data: {
                        json: machinelist,
                    },
                    success: function (res) {
                        let data=res.data;
                        if(data=="成功"){
                            layer.msg('取消关联成功');
                        }else{
                            layer.msg("取消关联失败");
                        }
                    }
                })
                layer.close(index1);
                return false;
            });
        }
        else{
            layer.msg("请选择取消关联的设备");
        }
    }

    /**关联设备**/
    function updateConnect(data){
        $.ajax({
            url:"/devicelist/changeConDev",
            data:{
                connectdevice:data,
                projectid:progroupid
            },
            async:false,
            success:function () {
                getDeviceCounts();
                layer.alert("关联成功");
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
            , where: {'agentnum':agentnum,'content':content,'type':stats2}
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

    /**根据权限显示不同页面内容**/
    function adaptauthority(){
        $.ajax({
            url:'/custom/getauthorById',
            async:false,
            success:function (data) {
                switch (data.data) {
                    case "user":
                        $("#crumb").css("display","none");
                        $("#crumb2").css("display","block");

                        let nickname=$("#nickName").html();
                        $("#comname3").html(progroupname);
                        $("#userproname").html("项目管理");

                        $("#comname3").attr("href","/project/projectdetail?agentnum="+agentnum+"&progroupid="+progroupid);
                        break;
                    case "companyadmin":
                        break;
                    case "superadmin":
                        document.getElementById("templateselect").innerHTML = "<select id=\"templatetype\" name=\"templatetype\" lay-verify=\"\" lay-filter=\"templatetype\">\n" +
                            "                                <option value=\"0\" selected>全部</option>\n" +
                            "                                <option value=\"2\">公司</option>\n" +
                            "                            </select>";
                        $("#excute_update").css("display","block");
                        break;
                    case "admin":
                        document.getElementById("templateselect").innerHTML = "<select id=\"templatetype\" name=\"templatetype\" lay-verify=\"\" lay-filter=\"templatetype\">\n" +
                            "                                <option value=\"0\" selected>全部</option>\n" +
                            "                                <option value=\"2\">公司</option>\n" +
                            "                            </select>";
                        break;
                }
                form.render("select");

            }
        })
    }

    /**获取当前角色的公司列表**/
    function getCompanyListByRole(){
        $.ajax({
            url:'/company/getCompanyListByGroupId',
            data:{
              projectid:progroupid
            },
            async:false,
            success:function(data){
                // assignCompanyList(data.data);
            }
        })
    }

    /**批量升级设备**/
    function updatedevices(){
        if (templatedevice != null && templatedevice.length > 2) {
            $.ajax({
                url: '/devicelist/updatedevices',
                data: {
                    json: templatedevice,
                },
                async: false,
                success: function (res) {
                    let data = res.data;
                    let str="   一共选中"+data.sum+"台设备。其中正在升级的有"+data.outcount+"台设备，升级完成有"+data.oncount+"台设备。无法升级有"+data.unprojcount+"台设备。"
                    layer.open({
                        title: '执行结果'
                        ,content: str
                    });
                }
            })
        }else{
            layer.msg("请选择要升级的设备");
        }
    }


    function assignCompanyList(json){
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
            empty: '呀, 没有数据呢',
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



    exports('projectdetail', {})
});