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
            success :function (layero, index) {
                $("#reset").click();
            }
        });
    })

    $("#reset").click(function () {
        debugger
        form.on('submit(formDemo1)', function(data){
            layer.msg(JSON.stringify(data.field));
            return false;
        });
    })


    exports('devicemanage',{})
});