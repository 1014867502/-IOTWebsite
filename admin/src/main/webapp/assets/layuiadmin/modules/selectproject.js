layui.define(['form','drawer','form'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,table=layui.form;

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

    $(".projects").mouseover(function () {

    })

    exports('selectproject',{})
});