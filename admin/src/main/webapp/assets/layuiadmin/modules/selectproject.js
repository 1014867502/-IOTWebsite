layui.define(['form', 'drawer', 'form','laypage','usertools'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        ,table = layui.table
        ,laypage=layui.laypage
        ,usertools=layui.usertools;

    var projectlist;//多选选中的项目json
    var agentNumber;
    var agentName;
    var connectdevice=[];
    var Devicelist;
    var comlist;
    var layerindex;
    var snreal;
    var projectcount;
    var identity="";
    var layerindex;
    var demo;//添加项目的公司列表

    form.verify({
        editname:function (value) {
            let judge;
            $.ajax({
                url:'/project/getProjectByName',
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
        , Lon: [
            /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,2})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,2}|180)$/
            , '经度输入有误'
        ]
        , Lat: [
            /^([0-8]?\d{1}\.\d{2}|90\.0{2}|[0-8]?\d{1}|90)$/
            , '纬度输入有误'
        ]
    });

    getDeviceCounts();
    getDetailProject();
    adaptauthority();
    // getCompanyListByRole();

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
                $("#comname2").html("项目管理");
                $("#comname2").attr("href","/manage/selectprojects");
            }
        })
    }

    function getDeviceCounts() {
        $.ajax({
            url: "/manage/getProDevCount",
            data: {
                userid: accountname
            },
            async: false,
            success: function (data) {
                let item = data.data;
                $("#sumnum").html(item.sum);
                $("#onlinenum").html(item.oncount);
                $("#outnum").html(item.outcount);
                $("#unprojnum").html(item.unprojcount);
                $("#newonlinenum").html(item.newcount);
            }
        })
    }



    /*添加设备*/
    $("#add_device2").click(function () {
        drawer.render({
            title: '添加设备',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#addprowindow"),
            success :function (layero, index) {
                // getCompanyListadd();
                layerindex=index;
            },
        });
    })

    /**删除公司**/
    $("#delete_company").click(function () {
        layer.confirm('真的删除当前公司吗？', function(index){
            admin.req({
                url:'/company/deleteCom',
                data:{
                    agentnum:agentnum
                },
                success:function (res) {
                    layer.msg(res.data);
                    location.href='/manage/selectcompany';
                    return false;
                }
            })
            layer.close(index);
        });
    })

    /**批量删除设备**/
    $("#delete_project").click(function(){
        deleteprojectlist();
    })

    /**针对管理员进行创建项目**/
    function admincreateproject(){
        let projectlist=getAllCompanys();
        let arrData=[];
        for (var i = 0; i < projectlist.length; i++) {
            var item = projectlist[i];
            var jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
        drawer.render({
            title: '添加项目',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#windowadmin"),
            success: function (layero, index) {
                 demo = xmSelect.render({
                    el: '#demo2',
                    radio: true,
                    clickClose: true,
                     layVerify: 'required',
                     empty: '呀, 没有数据呢',
                    data:arrData
                });
                layerindex=index;
            },
        });
    }

    /**针对普通用户和公司管理员**/
    function usercreateproject(){
        let company=getCurrentCompany();
        let arrData=[];
        let jsonStr={};
        jsonStr.name = company.agentName;
        jsonStr.value = company.agentNumber;
        arrData.push(jsonStr);
        drawer.render({
            title: '添加项目',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            success: function (layero, index) {
                demo = xmSelect.render({
                    el: '#demo',
                    radio: true,
                    theme: {
                        color: '#01AAED',
                    },
                    layVerify: 'required',
                    clickClose: true,
                    empty: '呀, 没有数据呢',
                    data:arrData
                });
                layerindex=index;
            },
        });
    }

    /**添加项目**/
    $("#add_device").click(function () {
        switch(identity){
            case "company":
                usercreateproject();
                break;
            case "admin":
                admincreateproject();
        }
    })


    $(".projects").mouseover(function () {

    })


    /**根据权限显示不同页面内容**/
    function adaptauthority(){
        $.ajax({
            url:'/custom/getauthorById',
            async:false,
            success:function (data) {
                switch (data.data) {
                    case "user":
                        break;
                    case "companyadmin":
                        $("#crumb").css("display","none");
                        $("#delete_company").css("display","none");
                        break;
                    case "superadmin":
                        break;
                }

            }
        })
    }


    function getAllCompanys(){
        let companys=[];
        $.ajax({
            url:'/manage/getallCompanys',
            type:'get',
            async:false,
            success:function(data){
                companys=data.data;
            }
        });
        return companys;
    }

    function getCurrentCompany(){
        let companys=[];
        $.ajax({
            url:'/company/getCurrentCom',
            type:'get',
            async:false,
            success:function(data){
                companys=data.data;
            }
        });
        return companys;
    }

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let input = $("#SN").val();
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/project/seekProjectsById'
            , where: {'userid': accountname, 'content': input}
            , cols: [[
                {type:'checkbox'}
                ,{field: 'progroupname', title: "项目名称", align: 'center'}
                , {field: 'devicenum', title: "设备总数", align: 'center'}
                , {field: 'createtime', title: "创建时间", align: 'center'}
                , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                projectcount=(res.data == null) ? 0 : res.data.totalRow;
                $("#projectcount").html(projectcount);
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
                    projectlist = JSON.stringify(data);
                });
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
        json.agentNumber=agentnum;
        json.onlineState=0;
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
            location.href = '/project/projectdetail?progroupid='+data.projectid+"&&agentnum="+agentnum+"";
        } else if (obj.event === 'del') {
            layer.confirm('真的删除该项目吗？', function(index){
                admin.req({
                    url:'/manage/deleteproject',
                    data:{
                        projectid:data.projectid
                    },
                    done:function (res) {
                        if(res.data=="删除成功"){
                            obj.del();
                        }
                        layer.msg(res.data);
                        return false;
                    }
                })
                layer.close(index);
            });
        }

    });

    //表格刷新
    function renderTable(){
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/project/getPageProjectById'
            ,where:{userid:accountname}
            , cols: [[
                {type:'checkbox'}
                ,{field: 'progroupname', title: "项目名称", align: 'center'}
                , {field: 'devicenum', title: "设备总数", align: 'center'}
                , {field: 'createtime', title: "创建时间", align: 'center'}
                , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                projectcount=(res.data == null) ? 0 : res.data.totalRow;
                $("#projectcount").html(projectcount);
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list,
                }
            },done:function(){
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    projectlist = JSON.stringify(data);
                });
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


    /**项目批量删除**/
    function deleteprojectlist(){
        if(projectlist != null && projectlist.length > 2)
        {
            layer.confirm('确实要删除吗?', {icon: 3, title:'提示'}, function(index1){
                $('div.layui-table-body table tbody input[name="layTableCheckbox"]:checked').each(function() { // 遍历选中的checkbox
                    let  n = $(this).parents('tbody tr').index()  // 获取checkbox所在行的顺序
                    //移除行
                    $('div.layui-table-body table tbody ').find('tr:eq(' + n + ')').remove()
                    //如果是全选移除，就将全选CheckBox还原为未选中状态
                    $('div.layui-table-header table thead div.layui-unselect.layui-form-checkbox').removeClass('layui-form-checked')
                })
                $.ajax({
                    url: '/project/deleteProjectList',
                    data: {
                        json: projectlist,
                    },
                    success: function (res) {
                        let data=res.data;
                        if(data=="成功"){
                            layer.msg('删除成功');
                        }else{
                            layer.msg("删除失败");
                        }
                    }
                })
                layer.close(index1);
                return false;
            });
        }
        else{
            layer.msg("请选择删除的项目");
        }
    }



    exports('selectproject', {})
});