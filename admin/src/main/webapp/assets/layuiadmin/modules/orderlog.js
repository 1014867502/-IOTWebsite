layui.define(['form','drawer','table'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,table2=layui.table;

    var agentNumber;
    var companysearch;
    var roletype;

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



    //监听页面表格查询
    $("#datasumbit").on('click', function () {
        let companynum=companysearch.getValue('valueStr');
        let input = $("#account").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/orderlog/searchAlllOrderLog'
            ,where:{'agentnum':companynum,"content":input}
            , cols: [[
                {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'machineSerial', title: "设备SN码", align: 'center'}
                , {field: 'workTime', title: "连接时间", align: 'center'}
                , {field: 'resSate', title: "离线数据状态", align: 'center'}
                , {field: 'funProperties', title: "离线数据内容", align: 'center'}
                , {field: 'setFromwork', title: "设置来源", align: 'center'}
                , {field: 'type', title: "连接状态", align: 'center', templet: '#table-online-state'}
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
            , url: '/orderlog/getAllOrderLog'
            , cols: [[
                {field: 'agentName', title: "隶属公司", align: 'center'}
                , {field: 'machineSerial', title: "设备SN码", align: 'center'}
                , {field: 'workTime', title: "连接时间", align: 'center'}
                , {field: 'resSate', title: "离线数据状态", align: 'center'}
                , {field: 'funProperties', title: "离线数据内容", align: 'center'}
                , {field: 'setFromwork', title: "设置来源", align: 'center'}
                , {field: 'type', title: "连接状态", align: 'center', templet: '#table-online-state'}
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


    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            location.href = '/template/setting?templatename=' + data.templateName+"&&type="+data.type;
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function(index){
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
    exports('orderlog',{})
});