layui.define(['form','drawer','table'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,table2=layui.table;

    var agentNumber;
    var layerindex;

    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if(value === 'xxx'){
                alert('用户名不能为敏感词');
                return true;
            }
        }

        ,pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],

        confirmpass:function (value) {
            if($('input[name=uPassword]').val()!=value)
                return "两次密码输入不一致";
        },
        confirmaccount:function (value) {
            let judge;
            $.ajax({
                url:'/custom/getStaffByNum',
                data: {
                    accountname: value
                },
                async:false,
                success:function (data) {
                  judge=data.data;
                }
            })
            if(judge!=null){
                return "已存在当前账号，请重新输入";
            }
        }
    });

    form.on('select(type)',function(data){
        debugger
        let type=data.value;
        if(type=="0"){
            document.getElementById("formprojectedit").innerHTML=" <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">用户允许访问项目</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 70%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            getprojectlist(agentNumber);
        }else{
            document.getElementById("formprojectedit").innerHTML="";
        }
    });

    form.on('submit(formDemo1)', function(data){
        debugger
        let json=JSON.stringify(data.field);
        let select=data.field.select;
        $.ajax({
            url:'/custom/save',
            data:{
                json:json,
                select:select
            },
            async:false,
            success:function (data) {
                layer.msg('提交成功');
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    form.on('submit(formDemo2)', function(data){
        debugger
        let json=JSON.stringify(data.field);
        let select=data.field.select;
        $.ajax({
            url:'/custom/save',
            data:{
                json:json,
                select:select
            },
            async:false,
            success:function (data) {
                layer.msg('提交成功');
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    $("#add_device").click(function () {
        drawer.render({
            title: '添加用户',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            success :function (layero, index) {
                renderlayerTable();
                getcompanylist();
                layerindex=index;
            },

        });
    })

    //监听查询
    $("#datasumbit").on('click', function () {
        // var projectArr = projectid;
        var stats = $("#stats").val();
        var input = $("#SN").val();
        var id=projectid ,sn, snreal;
        // for (var i = 0; i < projectArr.length; i++) {
        //     id = projectArr[i].value;
        // }
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
            , height:'full-200'
            , totalRow: true
            , url: '/devicelist/getDeviceList'
            , where: {'projectid': projectid, 'sn': snreal, 'state': stats}
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
                console.log(res);
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            }
        });
    });

    /**未关联设备的查询**/
    $("#datasumbit2").on('click',function(){
        let stats = $("#stats2").val();
        let input = $("#SN2").val();
        let id2=projectid,sn2, snreal2;
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

    //表格刷新
    function renderTable(){
        debugger;
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-300'
            , url: '/custom/list'
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "登录账号", align: 'center'}
                , {field: 'uRealName', title: "昵称", align: 'center'}
                , {field: 'cDept', title: "所属部门", align: 'center'}
                , {field: 'roleType', title: "用户类型", align: 'center', templet: '#table-online-state'}
                , {fixed: 'right', title: '操作', width: 178, align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                debugger
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data
                };
            }
        });
    }

    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            debugger
            drawer.render({
                title: '修改用户',  //标题
                offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                width: "600px", //r、l抽屉可以设置宽度
                content: $("#editwindow"),
                success :function (layero, index) {
                    editwindow(data);
                    layerindex=index;
                },

            });
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function(index){
                obj.del();
                admin.req({
                    url:'/custom/delete',
                    data:{
                        id:data.id
                    },
                })
                layer.close(index);
            });
        }

    });

    function renderlayerTable(){
        debugger;
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
                debugger
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
                projectid:projectid
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
                debugger
                table2.on('checkbox(table3)', function(obj){
                    let checkStatus = table2.checkStatus('table3')
                        ,data = checkStatus.data;
                    connectdevice=JSON.stringify(data);
                });
            }
        });
    }

    function getDetailProject(){
        $.ajax({
            url:'/manage/getDetailProject',
            data:{
                projectid:projectid
            },
            async:false,
            success:function (data) {
                let item=data.data;
                agentNumber=item.agentnumber;

            }
        })
    }


    /**获取项目列表**/
    function getprojectlist(id){
        $.ajax({
            url:'/project/getProjectByComId',
            data:{
                id:id
            },
            async:false,
            success: function(data){
                loadprojectlist(data.data);
            }
        })
    }

    /**获取项目列表(初始化)**/
    function initprojectlist(id,init){
        $.ajax({
            url:'/project/getProjectByComId',
            data:{
                id:id
            },
            async:false,
            success: function(data){
                initprojectlist(data.data,init);
            }
        })
    }

    /**获取公司列表**/
    function getcompanylist(){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                loadcompanylist(data.data);
            }
        })
    }

    /**获取公司列表(初始化)**/
    function initcompany(init){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                initcompanylist(data.data,init);
            }
        })
    }


    /**加载公司列表**/
    function loadcompanylist(json){
        var arrData = [];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
       var companylist = xmSelect.render({
            el: '#companylist',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerify: 'required',
            radio:true,
            clickClose:true,
            layVerType: 'msg',
            model:{
                label:{
                    type:'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
            on: function(data){
                debugger
                let change = data.change[0];
                getprojectlist(change.value);
            },
        })
    }

    /**加载公司列表(初始化)**/
    function initcompanylist(json,init){
        var arrData = [];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
        var companylist = xmSelect.render({
            el: '#companylistedit',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerify: 'required',
            radio:true,
            clickClose:true,
            layVerType: 'msg',
            initValue: [init],
            model:{
                label:{
                    type:'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
            on: function(data){
                debugger
                let change = data.change[0];
                getprojectlist(change.value);
            },
        })
    }

    /**加载项目列表**/
    function loadprojectlist(json){
        var arrData = [];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.progroupname;
            jsonStr.value = item.projectid;
            arrData.push(jsonStr);
        }
       var projectlist = xmSelect.render({
            el: '#projectlist2',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerify: 'required',
            layVerType: 'msg',
            model:{
                label:{
                    type:'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
        })
    }

    /**加载项目列表(初始化)**/
    function initprojectlist(json,init){
        var arrData = [];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.progroupname;
            jsonStr.value = item.progroupid;
            arrData.push(jsonStr);
        }
        var projectlist = xmSelect.render({
            el: '#projectlist2',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerify: 'required',
            layVerType: 'msg',
            initValue: [init],
            model:{
                label:{
                    type:'block',
                    block: {
                        //最大显示数量, 0:不限制
                        showCount: 0,
                        //是否显示删除图标
                        showIcon: false,
                    }
                }
            },
        })
    }

    /**加载编辑页面**/
    function editwindow(data){
        $("#uaccountnum").val(data.uAccountNum);
        $("#urealname").val(data.uRealName);
        $("#cDpet").val(data.cDept);
        agentNumber=data.agentNumber;
        $("#roletype").find("option[value=" + data.iRoleType + "]").prop("selected", true);
        if(data.iRoleType=="0"){
            document.getElementById("formprojectedit").innerHTML="<div class=\"layui-form-item\">\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;padding: 9px 13px;\">可查看的项目</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 70%\"></div>\n" +
                "                </div>\n" +
                "            </div>";
            initcompany(data.agentNumber);
            initprojectlist(data.agentNumber,data.groupAssemble);
        }else{
            document.getElementById("formprojectedit").innerHTML="";
            initcompany(data.agentNumber);
        }
        form.render();
    }

    /**获取各类别用户数量**/
    function getCustomCount(){
        $.ajax({
            url:'/custom/getCountByType',
            async:false,
            success:function (data) {
                let customcount=data.data;
                document.getElementById("customers").innerText=customcount.sum;
                document.getElementById("Ordinaryusers").innerText=customcount.ordinaryusers;
                document.getElementById("comadmins").innerText=customcount.comadmins;
            }
        })
    }

    getCustomCount();
    exports('customermanage',{})
});