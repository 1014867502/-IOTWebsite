layui.define(['form','drawer'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer;

    $("#add_device").click(function () {
        drawer.render({
            title: 'test',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window").html(),
            btn: ['<i class="layui-icon">&#xe615;</i>搜索', '重置'],
            success :function (layero, index) {
                debugger
                $("#reset").click();
            },
            btn1: function (index, layero) {

            },
            btn2: function (index, layero) {
                $(layero).find("form")[0].reset();//重置
                return false;
            }
        });
    })


    exports('devicemanage',{})
});