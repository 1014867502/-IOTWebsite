layui.define(['form','drawer','table','laydate'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,laydate = layui.laydate
        ,table2=layui.table;


    var roletype;
    var begin;
    var end;
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
        }else{
            document.getElementById("formprojectedit").innerHTML="";
        }
    });

    laydate.render({
        elem: '#test1' //指定元素
        ,range: true
        ,done: function(value, date, endDate){
            begin=date.year+"-"+date.month+"-"+date.date;
            end=endDate.year+"-"+endDate.month+"-"+endDate.date;
        }
    });


    //监听页面表格查询
    $("#datasumbit1").on('click', function () {
        let input = $("#account").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/orderlog/getOrderLogByDate'
            ,where:{'machineserial':machinedata,"begin":begin,'end':end}
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

    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/orderlog/getOrderLogBySn'
            ,where: {'machineserial':machinedata}
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
                form.render();
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






    //每行记录的按钮事件
    table.on('tool(table-form)', function (obj) {
        var data = obj.data;
        if (obj.event === 'echarts') {
            location.href = '/gnssdevice/gnssdatahome?projid='+proId+'&sn='+data.devicenumber+'&type='+data.typeid+'&stationname='+data.name;
        }else if(obj.event === 'edit'){
            location.href = '/template/setting?templatename=' + data.templateName+"&&type="+data.type;
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
    exports('device_orderlog',{})
});