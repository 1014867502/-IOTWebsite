layui.define(['form', 'drawer', 'form','laypage'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        ,laypage=layui.laypage;

    var projectlist;

    laypage.render({
        elem: 'demo7'
        ,count: 100
        ,layout: ['prev', 'page', 'next','skip']
        ,theme: '#1E9FFF'
        ,jump: function(obj){
            debugger
            getUserProjects(obj.curr);
        }
    });

    $("#add_device").click(function () {
        drawer.render({
            title: 'test',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            btn: ['<i class="layui-icon">&#xe615;</i>提交', '重置'],
            success: function (layero, index) {
                $("#reset").click();
            },
            btn1: function (index, layero) {
                let data = form.val("example");
            },
            btn2: function (index, layero) {
                layer.close(index);
                return false;
            }
        });
    })

    $(".projects").mouseover(function () {

    })


    function getUserProjects(no) {
        $.ajax({
            url: '/manage/getuserproject',
            data:{
              pageno:no
            },
            type: 'GET',
            success: function (data) {
                debugger
                projectlist = data.data.list;
                showProjects(projectlist);
            }
        });
    }

    function showProjects(data) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            debugger
            var innerHTML = "     <div class=\"layui-card\">\n" +
                "                <div class=\"cardbody\">\n" +
                "                    <div class=\"layui-card-body\">\n" +
                "                        <div class=\"projects\">\n" +
                "                            <div style=\"margin: auto;\">\n" +
                "                                <div class=\"projectname\">" + item.progroupname + "</div>\n" +
                "                                <div style=\"display: flex;justify-content: space-between;margin-top: 10px;color: #00f0ff\">\n" +
                "                                    <span>编辑</span>\n" +
                "                                    <span>删除</span>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin: auto;\">\n" +
                "                                <ul style=\"display: flex ;margin: auto;\">\n" +
                "                                    <li class=\"little\">\n" +
                "                                        <div>所属公司</div>\n" +
                "                                        <div style=\"font-size: 20px\">" + item.agentname + "</div>\n" +
                "                                    </li>\n" +
                "                                    <li class=\"little\">\n" +
                "                                        <div>设备数量</div>\n" +
                "                                        <div style=\"font-size: 20px\">" + item.devicenum + "</div>\n" +
                "                                    </li>\n" +
                "                                    <li class=\"little\">\n" +
                "                                        <div>创建时间</div>\n" +
                "                                        <div>" + item.createtime + "</div>\n" +
                "                                    </li>\n" +
                "                                </ul>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>"
            $('#list').append(innerHTML);
        }
    }

    exports('selectproject', {})
});