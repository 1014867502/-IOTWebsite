layui.define(['form','drawer','form'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table;

    $("#add_device").click(function () {
        drawer.render({
            title: 'test',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            btn: ['<i class="layui-icon">&#xe615;</i>提交', '重置'],
            success :function (layero, index) {
                $("#reset").click();
            },
            btn1: function (index, layero) {
               let data=form.val("example");
            },
            btn2: function (index, layero) {
               layer.close(index);
               return false;
            }
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
            , url: '/device/getDeviceList'
            , where: {'projectid': 1, 'sn': snreal, 'state': stats}
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
                , {field: 'serial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'date', title: "登录时间", align: 'center'}
                , {field: 'state', title: "处理状态", align: 'center', templet: '#table-online-state'}
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

    //表格刷新
    function renderTable(){
        debugger;
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/device/getDeviceList'
            , where: {'projectid':1,'state': stats}
            , cols: [[
                {field: 'id', title: "序号", align: 'center'}
                , {field: 'serial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'date', title: "登录时间", align: 'center'}
                , {field: 'state', title: "处理状态", align: 'center', templet: '#table-online-state'}
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
                    "data": res.data == null ? {} : res.data.list
                };
            }
        });
    }


    exports('devicemanage',{})
});