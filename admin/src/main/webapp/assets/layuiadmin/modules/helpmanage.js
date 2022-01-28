layui.define(['form','drawer','table','laydate','layer','Global_variable'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,laydate=layui.laydate
        ,layer=layui.layer
        ,table2=layui.table
        ,Global_variable=layui.Global_variable;

    var agentNumber;
    var layerindex;
    var userselected;
    var id;//当前用户的id


    renderTable();
    //表格刷新
    function renderTable(){
        var stats = $("#stats").val();
        table.render({
            elem: '#table-form'
            , title: 'logdata'
            , totalRow: true
            , height:'full-200'
            , url: '/version/getAll'
            , cols: [[
                {field: 'versionContent', title: "内容", align: 'center'}
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
        }else if(obj.event === 'download'){
            if(data.downloadUrl.indexOf("http")>=0){
                window.open(data.downloadUrl);
            }else{
                window.open("/version/downloadFile?filename="+data.downloadUrl,"_self");
            }
        }
    });

    exports('helpmanage',{})
});