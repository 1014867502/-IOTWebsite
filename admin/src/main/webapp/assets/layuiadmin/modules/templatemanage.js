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
    var companysearch;
    var companylist;
    var templateselected;
    var roletype;
    var projectlist;
    var windowindex;
    var newtype="0";//新建用户页面的用户类型
    var edittype="0"//修改用户页面
    var account;//编辑页面的用户账号
    var id;//当前用户的id

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

    /**批量删除模板**/
    $("#delete_template").on('click',function () {
        deletetemplatelist();
    })
    $("#add_template").on('click',function () {
        editbroadcast();
    })
    $("#add_fasttemplate").on('click',function () {
       layer.close(windowindex);
            if(webpremission.indexOf("0")>=0){
                location.href = '/template/setting?type=1&&model=0';
            }else{
                layer.msg("功能受限，无法创建模板!");
            }

    })
    $("#add_stationtemplate").on('click',function () {
        layer.close(windowindex);
        if(webpremission.indexOf("1")>=0){
            location.href = '/template/setting?type=2&&model=0';
        }else{
            layer.msg("功能受限，无法查看模板!");
        }
    })


    form.on('select(type2)',function(data){
        let type=data.value;
        edittype=type;
        if(type=="0"){
            document.getElementById("formprojectedit").innerHTML=" <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">用户允许访问项目</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div id=\"projectlist2\" class=\"xm-select-project\" style=\"width: 100%\"></div>\n" +
                "            </div>\n" +
                "        </div>";
            initprojectlist(agentNumber,"");
        }else{
            document.getElementById("formprojectedit").innerHTML="";
        }
    });

    form.on('submit(formDemo1)', function(data){
        let json=data.field;
        let company=companylist.getValue();
        json.agentNumber=company[0].value;
        let jsondata=JSON.stringify(data.field);
        let select=data.field.select;
        $.ajax({
            url:'/custom/save',
            data:{
                json:jsondata,
                select:select
            },
            async:false,
            success:function (data) {
                renderTable();
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

    form.on('submit(formDemo2)', function(data){
        let json=data.field;
        json.id=id;
        json.uPassword=json.editPassword;
        json.iRoleType=json.type2;
        let company=companylist.getValue();
        json.agentNumber=company[0].value;
        let jsondata=JSON.stringify(data.field);
        let select=data.field.select;
        $.ajax({
            url:'/custom/edit',
            data:{
                json:jsondata,
                select:select
            },
            async:false,
            success:function (data) {
                renderTable();
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

    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let companynum=companysearch.getValue('valueStr');
        let input = $("#account").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/template/searchAllTemplate'
            ,where:{'type':companynum,"content":input}
            , cols: [[
                {type: 'checkbox'}
                ,{field: 'id', title: "序号", align: 'center'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "创建人", align: 'center'}
                , {field: 'templateName', title: "模板名称", align: 'center'}
                , {field: 'type', title: "模板类型", align: 'center', templet: '#table-online-state'}
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
            },
            done: function () {
                table.on('checkbox(table-form)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    for(let k=0;k<data.length;k++){
                        let item=data[k];
                        delete item.templateOrder;
                    }
                    templateselected = JSON.stringify(data);
                });
            }
        });
    });

    renderTable();
    adaptauthority();
    getCompanyListByRole();

    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/template/showTemplateByRole'
            , cols: [[
                {type: 'checkbox'}
                ,{field: 'id', title: "序号", align: 'center'}
                , {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'uAccountNum', title: "创建人", align: 'center'}
                , {field: 'templateName', title: "模板名称", align: 'center'}
                , {field: 'type', title: "模板类型", align: 'center', templet: '#table-online-state'}
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
            },
            done: function () {
                table.on('checkbox(table-form)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    for(let k=0;k<data.length;k++){
                        let item=data[k];
                        delete item.templateOrder;
                    }
                    templateselected = JSON.stringify(data);
                });
            }
        });
    }



    function adaptauthority() {
        $.ajax({
            url: '/custom/getauthorById',
            async: false,
            success: function (data) {
                switch (data.data) {
                    case "user":
                        break;
                    case "companyadmin":
                        break;
                    case "superadmin":
                        break;
                }
                roletype=data.data;
                form.render("select");
            }
        })
    }

    //弹窗
    function editbroadcast() {
            layer.open({
                type: 1
                , title: ['添加模板']
                , area: ['350px', '150px']
                ,resize:false
                , content: $("#window")
                , success: function (layero, index) {
                    windowindex=index;
                }, yes: function (index, layero) {

                    let data = form.val('example')
                },
                btn2: function () {
                    $('#book')[0].reset();
                },
                cancel: function () {
                    $('#book')[0].reset();
                }
            });
    }

    /**获取当前角色的公司列表(主页上的)**/
    function getCompanyListByRole() {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                searchcompanylist(data.data);//搜索框公司列表
            }
        })
    }

    /**初始化当前搜索公司项目列表**/
    function searchcompanylist(json) {
        let selectdisabled=false;
        let projectData;
        let init;
        if(roletype!="superadmin"&&roletype!="admin"){
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
                if(i==0&&roletype!="superadmin"&&roletype!="admin"){
                    init=jsonStr.value;
                }
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

    /**批量删除**/
    function deletetemplatelist(){
        if(templateselected != null && templateselected.length > 2)
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
                    url: '/template/delTemplatelist',
                    data: {
                        json: templateselected,
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
            layer.msg("请选择删除的模板");
        }
    }

    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            if(data.type==1){
                if(webpremission.indexOf("0")>=0){
                    location.href = '/template/setting?templatename=' + data.templateName+"&&type="+data.type+"&&model=1";
                }else{
                    layer.msg("功能受限，无法查看模板!");
                }
            }else{
                if(webpremission.indexOf("1")>=0||webpremission.indexOf("5")>=0||webpremission.indexOf("6")>=0||webpremission.indexOf("7")>=0){
                    location.href = '/template/setting?templatename=' + data.templateName+"&&type="+data.type+"&&model=1";
                }else{
                    layer.msg("功能受限，无法查看模板!");
                }
            }
        } else if (obj.event === 'del') {
            layer.confirm('真的删除当前项吗？', function(index){
                obj.del();
                admin.req({
                    url:'/template/delTemplate',
                    data:{
                        id:data.id
                    },
                })
                layer.close(index);
            });
        }
    });

    // getCustomCount();
    exports('templatemanage',{})
});