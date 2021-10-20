layui.define(['form','drawer','table','laydate'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,laydate=layui.laydate
        ,table2=layui.table;

    var agentNumber;
    var layerindex;
    var companylistfind;
    var companylist;
    var projectlist;
    var newtype="0";//新建用户页面的用户类型
    var edittype="0"//修改用户页面
    var account;//编辑页面的用户账号
    var id;//当前用户的id

    laydate.render({
        elem: '#datasave'
        ,format: 'yyyy-MM-dd'
        ,theme: '#01AAED'
        ,done: function(value, date, endDate){
            datetip();
        }
    });

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
        ,pass:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        confirmpass:function (value) {
            if($('input[name=uPassword]').val()!=value)
                return "两次密码输入不一致";
        },
        confirmeditpass:function (value) {
            if($('input[name=editPassword]').val()!=value)
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
        },
        editaccount:function (value) {
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
            if(judge!=null&&value!=judge.uAccountNum){
                return "已存在当前账号，请重新输入";
            }
        },
        search:function (value) {
            let searchtype = $("#searchtype").val();
            if(searchtype!=0&&value==""){
                return "查询内容不得为空，请重新输入";
            }
        }
    });

    /**添加用户页面**/
    form.on('select(type)',function(data){
        let type=data.value;
        newtype=type;
        if(type=="0"){
            document.getElementById("formproject").innerHTML=" <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">用户允许访问项目</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"projectlist\" class=\"xm-select-project\" style=\"width: 70%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            getprojectlist(agentnum);
            document.getElementById("datekeep").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 70%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"datasave\" placeholder=\"请输入账号到期时间\">\n" +
                "                </div>\n" +
                "            <span id=\"datetip\"></span></div>"
            laydate.render({
                elem: '#datasave'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    datetip();
                }
            });
        }else{
            document.getElementById("formproject").innerHTML="";
            document.getElementById("datekeep").innerHTML="";
        }
    });

    /**编辑用户页面**/
    form.on('select(type2)',function(data){
        let type=data.value;
        edittype=type;
        if(type=="0"){
            document.getElementById("formprojectedit").innerHTML=" <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">用户允许访问项目</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 70%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            initprojectlist(agentnum,"");
            document.getElementById("datechange").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 70%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"dataedit\" placeholder=\"请输入账号到期时间\">\n" +
                "                </div>\n" +
                "          <span id=\"edittip\"></span>    </div>"
            laydate.render({
                elem: '#dataedit'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    editdatetip();
                }
            });
        }else{
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
        }
    });

    form.on('submit(formDemo1)', function(data){//添加用户提交
        let json=data.field;
        let group;
        json.agentNumber=agentnum;
        json.iRoleType=json.type;
        let jsondata=JSON.stringify(data.field);
        if(json.type==0){
            group=json.select;
        }
        $.ajax({
            url:'/custom/save',
            data:{
                json:jsondata,
                select:group
            },
            async:false,
            success:function (data) {
                renderTable();
                layer.msg('提交成功');
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    form.on('submit(formDemo2)', function(data){//修改用户
        let json=data.field;
        let group;
        json.id=id;
        json.uPassword=json.editPassword;
        json.iRoleType=json.type2;
        json.agentNumber=agentnum;
        if(json.type2==0){
            group=json.select;
            if(json.accounttime==""){
                delete json.accounttime;
            }
        }
        else{
            let yy = new Date().getFullYear()+100
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            json.accounttime=yy+"-"+mm+"-"+dd;
        }
        let jsondata=JSON.stringify(data.field);
        $.ajax({
            url:'/custom/edit',
            data:{
                json:jsondata,
                select:group
            },
            async:false,
            success:function (data) {
                layer.msg('提交成功');
                renderTable();
                if(id==userid){
                    logout();
                }
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
                getprojectlist(agentnum);
                layerindex=index;
            },

        });
    })

    /**加载编辑页面**/
    function editwindow(data){
        $("#uaccountnum").val(data.uAccountNum);
        account=data.uAccountNum;
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
            initprojectlist(data.agentNumber,data.groupAssemble);
            document.getElementById("datechange").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 70%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"dataedit\" placeholder=\"请输入账号到期时间\">\n" +
                "                </div>\n" +
                "           <span id=\"edittip\"></span>   </div>"
            laydate.render({
                elem: '#dataedit'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    editdatetip();
                }
            });
            $("#dataedit").val(data.accounttime);
        }else{
            document.getElementById("formprojectedit").innerHTML="";
            document.getElementById("datechange").innerHTML="";
        }
        form.render();
    }
    //监听查询
    $("#datasumbit").on('click', function () {
        let searchtype = $("#searchtype").val();
        let input = $("#account").val();
        if(searchtype!=0&&input==""){
            return;
        }
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/custom/searchCustomByParam'
            , where: { 'content': input,'agentnumber':agentnum,'searchtype': searchtype,'userid':userid}
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "登录账号", align: 'center'}
                , {field: 'uRealName', title: "昵称", align: 'center'}
                , {field: 'cDept', title: "所属部门", align: 'center'}
                , {field: 'roleType', title: "用户类型", align: 'center', templet: '#usertype'}
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

    renderTable();
    // getcompanylistsearch();
    //表格刷新
    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-300'
            , url: '/custom/getCustomByComid'
            ,where:{'agentNumber':agentnum,'userid':userid}
            , cols: [[
                {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "登录账号", align: 'center'}
                , {field: 'uRealName', title: "昵称", align: 'center'}
                , {field: 'cDept', title: "所属部门", align: 'center'}
                , {field: 'roleType', title: "用户类型", align: 'center', templet: '#usertype'}
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

    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            drawer.render({
                title: '修改用户',  //标题
                offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                width: "600px", //r、l抽屉可以设置宽度
                content: $("#editwindow"),
                success :function (layero, index) {
                    editwindow(data);
                    id=data.id;
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


    /**获取项目列表(添加用户)**/
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
                initloadprojectlist(data.data,init);
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
        companylist = xmSelect.render({
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
                let change = data.change[0];
                if(edittype=="0"){
                    initprojectlist(change.value,"");
                }

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
        projectlist = xmSelect.render({
            el: '#projectlist',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerType: 'msg',
            theme: {
                color: '#01AAED',
            },
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
    function initloadprojectlist(json,init){
        var arrData = [];
        let proidinit=init.split(',');
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.progroupname;
            jsonStr.value = item.projectid;
            arrData.push(jsonStr);

        }
        projectlist = xmSelect.render({
            el: '#projectlist2',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerType: 'msg',
            initValue: proidinit,
            theme: {
                color: '#01AAED',
            },
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

    /**判断账号权限日期**/
    function datetip(){
        let date=$("#datasave").val();
        let date1=$("#dataedit").val();
        let curdate=new Date();
        let olddate=new Date(date);
        if(curdate<olddate){
            $("#datetip").html("账号权限有效");
            $("#datetip").css("color","#5FB878");
        }else{
            $("#datetip").html("账号权限已过期");
            $("#datetip").css("color","#ce1616");
        }

    }

    function editdatetip(){
        let curdate=new Date();
        let date1=$("#dataedit").val();
        let editdate=new Date(date1);
        if(curdate<editdate){
            $("#edittip").html("账号权限有效");
            $("#edittip").css("color","#5FB878");
        }else{
            $("#edittip").html("账号权限已过期");
            $("#edittip").css("color","#ce1616");
        }
    }

    function logout(){
        let second=10;
        parent.layer.open({
            type: 1
            ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            ,id: 'layerDemo' //防止重复弹出
            ,content: '<div style="padding: 20px 100px;">当前登录用户密码已修改，请重新登录!</div>'
            ,btn: ['立刻重新登录']
            ,btnAlign: 'c' //按钮居中
            ,moveType: 0
            ,closeBtn :0
            ,shade: 0.8 //不显示遮罩
            ,yes: function(){
                //                 clearInterval(timer);
                layer.closeAll();
                admin.req({
                    url: '/logout'
                    ,type: 'get'
                    ,data: {}
                    ,done: function(res){
                        //清空本地记录的 token，并跳转到登入页
                        admin.exit(function(){
                            location.href = '/toLogin';
                        });
                    }
                    ,parseData:function(res){
                        return {
                            "code":res.code,
                            "msg":res.msg,
                            "count": res.data == null ? 0 : res.data.totalRow,
                            "data": res.data == null ? {} :res.data.list
                        };
                    }
                });
                // var timer= setInterval(function () {
                //     clearInterval(timer);
                //     admin.exit(function(){
                //         location.href = '/toLogin';
                //     });
                //     second--;
                //     $("#second").html(second);
                //     if(second==0){
                //     }
                // },1000);
            },btn1: function (index, layero) {

            },
            btn2: function (index, layero) {

            }
        });
        //执行退出接口
    };


    // getCustomCount();
    exports('comusermanage',{})
});