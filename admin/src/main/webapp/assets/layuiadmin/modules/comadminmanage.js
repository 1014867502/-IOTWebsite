layui.define(['form','drawer','table','laydate','layer','Global_variable'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,laydate=layui.laydate
        ,layer=layui.layer
        ,Global_variable=layui.Global_variable
        ,table2=layui.table;

    var agentNumber;
    var layerindex;
    var userselected;
    var companylistfind;
    var companysearch;
    var companylist;
    var editcompanylist;
    var addcompanylist;//记录添加普通管理员选中的公司
    var editchargecominit;//记录当前普通管理员选中的公司
    var projectlist;
    var initappauthorities;//权限显示
    var initwebauthorities;
    var loadwebauthorities;
    var loadappauthorities;
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
                "                <div id=\"projectlist\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            if(agentNumber!=null){
                getprojectlist(agentNumber);
            }
            document.getElementById("datekeep").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 100%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"datasave\" placeholder=\"请输入账号到期时间\">\n" +
                "                </div>\n" +
                "            <span id=\"datetip\"></span></div>";
            document.getElementById("showwebright").innerHTML="    <div class=\"layui-form-item\" >\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"initwebauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>"
            document.getElementById("showeditright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"writeright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("showappright").innerHTML="     <div class=\"layui-form-item\" >\n" +
                "               <label class=\"layui-form-label\">app功能权限</label>\n" +
                "               <div class=\"layui-input-block\">\n" +
                "                   <div id=\"initappauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "               </div>\n" +
                "           </div>";
            if(agentNumber!=null){
                initcomauthority(agentNumber);
            }
            document.getElementById("addmanagecompanylist").innerHTML="";
            laydate.render({
                elem: '#datasave'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    datetip();
                }
            });
        }
        else if(type=="3"){
            if(agentNumber!=null){
                getprojectlist(agentNumber);
            }
            document.getElementById("addmanagecompanylist").innerHTML="";
            document.getElementById("showwebright").innerHTML="";
            document.getElementById("showeditright").innerHTML="";
            document.getElementById("datekeep").innerHTML="";
            document.getElementById("formproject").innerHTML="";
            if(document.getElementById("showappright")!=null){
                document.getElementById("showappright").innerHTML="     <div class=\"layui-form-item\" >\n" +
                    "               <label class=\"layui-form-label\">app功能权限</label>\n" +
                    "               <div class=\"layui-input-block\">\n" +
                    "                   <div id=\"initappauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                    "               </div>\n" +
                    "           </div>";
            }
            if(agentNumber!=null){
                initcomauthority(agentNumber);
            }
        }
        else if(type=="4"){
            document.getElementById("formproject").innerHTML="";
            document.getElementById("datekeep").innerHTML="";
            document.getElementById("addmanagecompanylist").innerHTML="<div class=\"layui-form-item\">\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;padding: 9px 13px;\">可查看的公司</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"addcompanylist\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>";
            document.getElementById("showwebright").innerHTML="";
            document.getElementById("showappright").innerHTML="";
            addchargecompanylist();
        }
        else{
            document.getElementById("showwebright").innerHTML="    <div class=\"layui-form-item\" >\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"initwebauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>"
            document.getElementById("showeditright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"writeright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("showappright").innerHTML="     <div class=\"layui-form-item\" >\n" +
                "               <label class=\"layui-form-label\">app功能权限</label>\n" +
                "               <div class=\"layui-input-block\">\n" +
                "                   <div id=\"initappauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "               </div>\n" +
                "           </div>";
            if(agentNumber!=null){
                initcomauthority(agentNumber);
            }
            document.getElementById("formproject").innerHTML="";
            document.getElementById("datekeep").innerHTML="";
            document.getElementById("addmanagecompanylist").innerHTML="";
        }
        form.render();
    });

    /**编辑用户页面**/
    form.on('select(type2)',function(data){
        let type=data.value;
        edittype=type;
        if(type=="0"){
            document.getElementById("formcompanyedit").innerHTML="";
            document.getElementById("formprojectedit").innerHTML=" <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">用户允许访问项目</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            initprojectlist(agentNumber,"");
            document.getElementById("editwebright").innerHTML=" <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"webauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";

            document.getElementById("datechange").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 100%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"dataedit\" placeholder=\"请输入账号到期时间\">\n" +
                "                 </div>\n" +
                "            <span id=\"edittip\"></span> </div>"
            document.getElementById("displaywriteright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"editwriteright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            loadcomauthority(agentNumber);
            laydate.render({
                elem: '#dataedit'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    editdatetip();
                }
            });
        }else if(type=="3"){
            document.getElementById("editwebright").innerHTML="";
            document.getElementById("displaywriteright").innerHTML="";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
            document.getElementById("formcompanyedit").innerHTML="";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            loadcomauthority(agentNumber);
        }else if(type=="4"){
            loadcompany(agentNumber);
            document.getElementById("editwebright").innerHTML=" <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"webauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            document.getElementById("displaywriteright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"editwriteright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("formcompanyedit").innerHTML="<div class=\"layui-form-item\">\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;padding: 9px 13px;\">可查看的公司</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"editchargecompanylist\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
            document.getElementById("editwebright").innerHTML="";
            document.getElementById("editappright").innerHTML="";
            editchargecompanylist(editchargecominit);
        }
        else{
            document.getElementById("editwebright").innerHTML=" <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"webauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            document.getElementById("displaywriteright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"editwriteright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            loadcomauthority(agentNumber);
            document.getElementById("formcompanyedit").innerHTML="";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
        }
        form.render();
    });

    form.on('submit(formDemo1)', function(data){//添加用户提交
        let json=data.field;
        let group;
        let right;
        let appright;
        let selectcom;
        let date=new Date();
        let company=companylist.getValue();
        json.agentNumber=company[0].value;
        json.iRoleType=json.type;
        if(initwebauthorities!=null){
            right=initwebauthorities.getValue('valueStr');
        }
        if(initappauthorities!=null){
            appright=initappauthorities.getValue('valueStr');
        }
        if(json.writePermission=="on"){
            json.writePermission=1;
        }else{
            json.writePermission=0;
        }
        if(json.type==0){
            group=projectlist.getValue('valueStr');
        }
        else if(json.type==4){
            selectcom=addcompanylist.getValue('valueStr');
            let yy = new Date().getFullYear()+100
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            json.accounttime=yy+"-"+mm+"-"+dd;
        }
        else{
            let yy = new Date().getFullYear()+100
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            json.accounttime=yy+"-"+mm+"-"+dd;
        }
        let jsondata=JSON.stringify(data.field);
        $.ajax({
            url:'/custom/save',
            data:{
                json:jsondata,
                select:group ,
                webright:right,
                appright:appright,
                selectcom:selectcom
            },
            async:false,
            success:function (data) {
                drawer.render({
                    title: '添加用户',  //标题
                    offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                    width: "450px", //r、l抽屉可以设置宽度
                    content: $("#window"),
                    success :function (layero, index) {
                        getcompanylist();
                        layerindex=index;
                    },
                });
                renderTable();
                form.render();
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
            }
        })

        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    form.on('submit(formDemo2)', function(data){//修改用户
        let json=data.field;
        let group;
        let right;
        let appright;
        let selectcom;
        json.id=id;
        json.uPassword=json.editPassword;
        json.iRoleType=json.type2;
        let company=companylist.getValue();
        json.agentNumber=company[0].value;
        if(loadwebauthorities!=null){
            right=loadwebauthorities.getValue('valueStr');
        }
        if(loadappauthorities!=null){
            appright=loadappauthorities.getValue('valueStr');
        }
        if(json.writePermission=="on"){
            json.writePermission=1;
        }else{
            json.writePermission=0;
        }
        if(json.type2==0){
            group=projectlist.getValue('valueStr');
            if(json.accounttime==""){
                delete json.accounttime;
            }
        }
        else if(json.type2==4){
            selectcom=editcompanylist.getValue('valueStr');
                let yy = new Date().getFullYear()+100
                let mm = new Date().getMonth() + 1
                let dd = new Date().getDate()
                json.accounttime=yy+"-"+mm+"-"+dd;
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
                select:group,
                webright:right,
                appright:appright,
                selectcom:selectcom
            },
            async:false,
            success:function (data) {
                drawer.render({
                    title: '修改用户',  //标题
                    offset: 'r',    //r:抽屉在右边、l:抽屉在左边
                    width: "450px", //r、l抽屉可以设置宽度
                    content: $("#editwindow"),
                    success :function (layero, index) {
                        editwindow(data);
                        id=data.id;
                        layerindex=index;
                    },

                });
                renderTable();
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
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
            width: "450px", //r、l抽屉可以设置宽度
            content: $("#window"),
            success :function (layero, index) {
                getcompanylist();
                layerindex=index;
                form.render();
            },
        });
    })

    $("#delete_user").click(function () {
        deleteuserlist();
    })

    $("#repassword_user").click(function(){
        repasswordlist();
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
            document.getElementById("formcompanyedit").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="<div class=\"layui-form-item\">\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;padding: 9px 13px;\">可查看的项目</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>";
            initprojectlist(data.agentNumber,data.groupAssemble);
            document.getElementById("datechange").innerHTML="<label class=\"layui-form-label\">账号时限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 100%\">\n" +
                "                    <input type=\"text\" class=\"layui-input\" lay-verify=\"required\" name=\"accounttime\" id=\"dataedit\" placeholder=\"请输入账号到期时间\">\n" +
                "                </div>\n" +
                "            <span id=\"edittip\"></span> </div>"
            laydate.render({
                elem: '#dataedit'
                ,format: 'yyyy-MM-dd'
                ,theme: '#01AAED'
                ,done: function(value, date, endDate){
                    editdatetip();
                }
            });
            document.getElementById("editwebright").innerHTML="<label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"webauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            $("#dataedit").val(data.accounttime);
        }
        else if(data.iRoleType=="3"){
            document.getElementById("editwebright").innerHTML="";
            document.getElementById("displaywriteright").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
        }
        else  if(data.iRoleType=="4"){
            let datainit=data.groupAgentNumber!=null?data.groupAgentNumber.split("@"):"";
            document.getElementById("formcompanyedit").innerHTML="<div class=\"layui-form-item\">\n" +
                "                <label class=\"layui-form-label\" style=\"width: 84px;padding: 9px 13px;\">可查看的公司</label>\n" +
                "                <div class=\"layui-input-block\">\n" +
                "                    <div id=\"editchargecompanylist\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "                </div>\n" +
                "            </div>";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
            document.getElementById("editwebright").innerHTML="";
            document.getElementById("editappright").innerHTML="";
            editchargecompanylist(datainit);
        }
        else{
            document.getElementById("editwebright").innerHTML=" <label class=\"layui-form-label\" style=\"width: 84px;\">网页功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"webauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            document.getElementById("displaywriteright").innerHTML=" <label class=\"layui-form-label\" style=\"padding: 10px 10px;width: 113px;\">修改设备功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <input id=\"editwriteright\" type=\"checkbox\" name=\"writePermission\" lay-skin=\"switch\" lay-filter=\"editdevice\">\n" +
                "            </div>";
            document.getElementById("editappright").innerHTML="    <label class=\"layui-form-label\">app功能权限</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"appauthority\" class=\"xm-select-demo\" style=\"width: 100%\"></div>\n" +
                "            </div>";
            document.getElementById("formcompanyedit").innerHTML="";
            document.getElementById("datechange").innerHTML="";
            document.getElementById("formprojectedit").innerHTML="";
        }
        loadcompany(data.agentNumber);
        form.render();
    }
    //监听查询
    $("#datasumbit").on('click', function () {
        let companynum=companysearch.getValue('valueStr');
        let input = $("#account").val();
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height:'full-200'
            , totalRow: true
            , url: '/custom/searchCustomByParam'
            , where: { 'content': input, 'agentnumber': companynum}
            , cols: [[
                {type: 'checkbox'}
                ,{field: 'id', title: "序号", align: 'center'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "登录账号", align: 'center'}
                , {field: 'uRealName', title: "昵称", align: 'center'}
                , {field: 'cDept', title: "所属部门", align: 'center'}
                ,{field:'accounttime',title: "账号过期日期",align: 'center'}
                , {field: 'roleType', title: "用户类型", align: 'center', templet: '#table-online-state'}
                , {fixed: 'right', title: '操作', width: 240, align: 'center', toolbar: '#barDemo'}
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
            },
            done: function () {
                table.on('checkbox(table-form)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    userselected = JSON.stringify(data);
                });
            }
        });
    });

    renderTable();
    getcompanylistsearch();
    // getcompanylistsearch();
    //表格刷新
    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/custom/list'
            ,where:{'userid':userid}
            , cols: [[
                {type: 'checkbox'}
                ,{field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "登录账号", align: 'center'}
                , {field: 'uRealName', title: "昵称", align: 'center'}
                , {field: 'cDept', title: "所属部门", align: 'center'}
                ,{field:'accounttime',title: "账号过期日期",align: 'center'}
                , {field: 'roleType', title: "用户类型", align: 'center', templet: '#table-online-state'}
                , {fixed: 'right', title: '操作', width: 240, align: 'center', toolbar: '#barDemo'}
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
            },
            done: function () {
                table.on('checkbox(table-form)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    userselected = JSON.stringify(data);
                });
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
                width: "450px", //r、l抽屉可以设置宽度
                content: $("#editwindow"),
                success :function (layero, index) {
                    editwindow(data);
                    id=data.id;
                    getwebauthority(id);
                    layerindex=index;
                },

            });
        } else if (obj.event === 'del') {
            layer.confirm('真的删除当前项吗？', function(index){
                obj.del();
                let id=data.id;
                admin.req({
                    url:'/custom/delete',
                    data:{
                        id:data.id
                    },
                    success:function(res){
                        let data=res.data;
                        if(data=="ok"){
                            layer.msg('删除成功');
                        }else{
                            layer.msg("删除失败");
                        }
                    }
                })
                if(id==userid){
                    logout();
                }
                layer.close(index);
            });
        }else if( obj.event==='repass'){
            layer.confirm('真的重置密码吗？', function(index){
                let id=data.id;
                admin.req({
                    url:'/custom/repassword',
                    data:{
                        uAccountname:data.uAccountNum
                    },
                    success:function(res){
                        let data=res.data;
                        if(data=="success"){
                            layer.msg('重置成功');
                        }else{
                            layer.msg("重置失败");
                        }
                    }
                })
                if(id==userid){
                    logout();
                }
                layer.close(index);
            });
        }
    });

    /**批量删除**/
    function deleteuserlist() {
        if(userselected != null && userselected.length > 2)
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
                    url: '/custom/deletelist',
                    data: {
                        json: userselected,
                    },
                    success: function (res) {
                        let data=res.data;
                        if(data=="ok"){
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
            layer.msg("请选择删除的用户");
        }
    }

    /**批量重置密码**/
    function repasswordlist() {
        if(userselected != null && userselected.length > 2)
        {
            layer.confirm('确实要重置密码吗?', {icon: 3, title:'提示'}, function(index1){
                $.ajax({
                    url: '/custom/repasswordlist',
                    data: {
                        json: userselected,
                    },
                    success: function (res) {
                        let data=res.data;
                        if(data=="success"){
                            layer.msg('重置成功');
                        }else{
                            layer.msg("重置失败");
                        }
                    }
                })
                layer.close(index1);
                return false;
            });
        }
        else{
            layer.msg("请选择重置密码的用户");
        }
    }


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

    /**获取公司列表**/
    function getcompanylist(){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                initcompanylist(data.data);
            }
        })
    }

    /**/

    /**加载普通管理员的公司列表**/
    function addchargecompanylist(){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                let json=data.data;
                var arrData = [];
                var selectSn ="";
                for(let i=0;i<json.length;i++){
                    var item = json[i];
                    var jsonStr = {};
                    jsonStr.name = item.agentName;
                    jsonStr.value = item.agentNumber;
                    arrData.push(jsonStr);
                }
                addcompanylist = xmSelect.render({
                    el: '#addcompanylist',
                    toolbar: {
                        show: true,
                    },
                    data: arrData,
                    layVerify: 'required',
                    theme: {
                        color: '#01AAED',
                    },
                    layVerType: 'msg',
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
                })
            }
        })

    }

    /**加载普通管理员的公司列表**/
    function editchargecompanylist(init){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                if(init==null){
                    init=[];
                }else{
                    editchargecominit=init;
                }
                let json=data.data;
                var arrData = [];
                var selectSn ="";
                for(let i=0;i<json.length;i++){
                    var item = json[i];
                    var jsonStr = {};
                    jsonStr.name = item.agentName;
                    jsonStr.value = item.agentNumber;
                    arrData.push(jsonStr);
                }
                editcompanylist = xmSelect.render({
                    el: '#editchargecompanylist',
                    toolbar: {
                        show: true,
                    },
                    data: arrData,
                    layVerify: 'required',
                    theme: {
                        color: '#01AAED',
                    },
                    layVerType: 'msg',
                    initValue: init,
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
                })
            }
        })

    }


    /**获取公司列表(搜索栏)**/
    function getcompanylistsearch(){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                loadcompanylistsearch(data.data);
            }
        })
    }

    /**获取公司列表(编辑页面初始化)**/
    function loadcompany(init){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                loadcompanylist(data.data,init);
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


    /**加载公司列表(新增用户)**/
    function initcompanylist(json){
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
            el: '#companylist',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerify: 'required',
            radio:true,
            clickClose:true,
            theme: {
                color: '#01AAED',
            },
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
                let change = data.change[0];
                agentNumber=change.value;
                if(document.getElementById("projectlist")!=null){
                    getprojectlist(change.value);
                }
                initcomauthority(agentNumber);
            },
        })
    }

    /**加载公司列表(编辑页面初始化)**/
    function loadcompanylist(json,init){
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
            theme: {
                color: '#01AAED',
            },
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
                agentNumber=change.value;
                let node=document.getElementById("projectlist2");
                if(edittype=="0"&&node!=null){
                    initprojectlist(change.value,"");
                }
                loadcomauthority(agentNumber);
            },
        })
    }


    /**加载项目列表**/
    function loadprojectlist(json){
        var arrData = [{name:"无",value:"0"}];
        var selectSn ="";
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.progroupname;
            jsonStr.value = item.projectid;
            arrData.push(jsonStr);
        }
        if(document.getElementById("projectlist")!=null) {
            projectlist = xmSelect.render({
                el: '#projectlist',
                toolbar: {
                    show: true,
                },
                data: arrData,
                theme: {
                    color: '#01AAED',
                },
                layVerType: 'msg',
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
                }, on: function (data) {
                    //arr:  当前多选已选中的数据
                    let arr = data.arr;
                    //change, 此次选择变化的数据,数组
                    let change = data.change;
                    //isAdd, 此次操作是新增还是删除
                    let isAdd = data.isAdd;
                    if (isAdd) {
                        if (arr.length == json.length + 1) {
                            if (change[0].value == "0" && arr[0].value != "0") {
                                arr.splice(0, arr.length - 1);
                            } else {
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i].value == "0") {
                                        arr.splice(i, 1);
                                    }
                                }
                            }
                        } else {
                            if (change.length > 0 && change[0].value == "0") {
                                arr.splice(0, arr.length - 1);
                            } else {
                                for (let k = 0; k < arr.length; k++) {
                                    if (arr[k].value == "0") {
                                        arr.splice(k, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
    }


    /**加载公司列表**/
    function loadcompanylistsearch(json){
        let selectdisabled=false;
        let projectData;
        let init;
        projectData = [{name:"全部公司",value:"all"}];
        init="all";
        if(json.length>0){
            for (let i = 0; i < json.length; i++) {
                let item = json[i];
                let jsonStr = {};
                jsonStr.name = item.agentName;
                jsonStr.value = item.agentNumber;
                projectData.push(jsonStr);
            }
        }
        companysearch = xmSelect.render({
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
            }
        });
    }


    /**获取用户权限**/
    function getwebauthority(id){
        if(id!=null){
            $.ajax({
                url:'/custom/getAuthority',
                data:{
                    userid:id
                },
                async:false,
                success: function(data){
                    if(data.data.writeright!=null&&data.data.writeright>0){
                        $("#editwriteright").prop('checked',true);
                    }else{
                        $("#editwriteright").prop('checked',false);
                    }
                    let webright=data.data.webauthority;
                    let appright=data.data.appauthority;
                    let comwebright=data.data.comwebauthor;
                    let comappright=data.data.comappauthor;
                    loadwebauthoritylist(webright,comwebright);
                    loadappauthoritylist(appright,comappright);
                    form.render();
                }
            })
        }else{
            loadwebauthoritylist();
            loadappauthoritylist();
        }

    }


    /**加载web权限列表(编辑用户)**/
    function loadwebauthoritylist(json,init) {
        if(document.getElementById("webauthority")!=null){
            let realdata;
            if(init==null||init==""){
                realdata=json;
            }else{
                realdata=init;
            }
            loadwebauthorities = xmSelect.render({
                el: '#webauthority',
                data:realdata,
                layVerify: 'required',
                theme: {
                    color: '#1E9FFF',
                },
                tips: '请选择网页功能权限',
                style: {
                    borderRadius: '6px',
                },
                toolbar: {
                    show: true,
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
            });
            if(json!=null&&json.length>0){
                loadwebauthorities.setValue(json);
            }
        }

    }

    /**获取当前公司web app权限内容*(编辑页面)**/
    function loadcomauthority(data){
        $.ajax({
            url:'/company/getComAuthor',
            data:{
                agentnum:data
            },
            success:function(res){
                loadwebauthoritylist(res.data.webauthority);
                loadappauthoritylist(res.data.appauthority);
            }
        })
    }

    /**获取当前公司web app权限内容*(添加页面)**/
    function initcomauthority(data){
        $.ajax({
            url:'/company/getComAuthor',
            data:{
                agentnum:data
            },
            success:function(res){
                initwebauthoritylist(res.data.webauthority);
                initappauthoritylist(res.data.appauthority);
            }
        })
    }

    /**加载web权限列表(创建用户)**/
    function initwebauthoritylist(json) {
        if(document.getElementById("initwebauthority")!=null) {
            initwebauthorities = xmSelect.render({
                el: '#initwebauthority',
                data: json,
                layVerify: 'required',
                theme: {
                    color: '#1E9FFF',
                },
                initValue: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                tips: '请选择网页功能权限',
                style: {
                    borderRadius: '6px',
                },
                toolbar: {
                    show: true,
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
            });
        }
    }

    /**加载app权限列表（编辑用户）**/
    function loadappauthoritylist(json,init) {
        if(document.getElementById("appauthority")!=null) {
            let realdata;
            if (init == null || init == "") {
                realdata = json;
            } else {
                realdata = init;
            }
            loadappauthorities = xmSelect.render({
                el: '#appauthority',
                data: realdata,
                layVerify: 'required',
                theme: {
                    color: '#1E9FFF',
                },
                toolbar: {
                    show: true,
                },
                tips: '请选择app功能权限',
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
            });
            if (json != null && json.length > 0) {
                loadappauthorities.setValue(json);
            }
        }
    }


    /**加载app权限列表(创建用户)**/
    function initappauthoritylist(json) {
        if(document.getElementById("initappauthority")!=null) {
            initappauthorities = xmSelect.render({
                el: '#initappauthority',
                data: json,
                layVerify: 'required',
                theme: {
                    color: '#1E9FFF',
                },
                toolbar: {
                    show: true,
                },
                initValue: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                tips: '请选择app功能权限',
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
            });
        }
    }

    /**加载项目列表(初始化)**/
    function initloadprojectlist(json,init){
        var arrData = [{name:"无",mutex:1,value:"0"}];
        let proidinit=init.split(',');
        for(var i=0;i<json.length;i++){
            var item = json[i];
            var jsonStr = {};
            jsonStr.name = item.progroupname;
            jsonStr.value = item.projectid;
            jsonStr.mutex=2;
            arrData.push(jsonStr);
        }
        projectlist = xmSelect.render({
            el: '#projectlist2',
            toolbar:{
                show: true,
            },
            data: arrData,
            layVerType: 'msg',
            theme: {
                color: '#01AAED',
            },
            initValue: proidinit,
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
            },on: function(data){
                //arr:  当前多选已选中的数据
                let arr = data.arr;
                //change, 此次选择变化的数据,数组
                let change = data.change;
                //isAdd, 此次操作是新增还是删除
                let isAdd = data.isAdd;
                if(isAdd) {
                    if (arr.length == json.length+1) {
                        if (change[0].value == "0"&&arr[0].value!="0") {
                            arr.splice(0,arr.length-1);
                        }else{
                            for (let i = 0; i < arr.length; i++) {
                                if (arr[i].value == "0") {
                                    arr.splice(i, 1);
                                }
                            }
                        }
                    } else {
                        if (change.length>0&&change[0].value == "0") {
                            arr.splice(0,arr.length-1);
                        }else{
                            for(let k=0;k<arr.length;k++){
                                if(arr[k].value=="0"){
                                    arr.splice(k,1);
                                }
                            }
                        }
                    }
                }
            }
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
    exports('comadminmanage',{})
});