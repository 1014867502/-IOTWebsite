layui.define(['form', 'drawer', 'form','laypage','usertools'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        ,laypage=layui.laypage
        ,usertools=layui.usertools;

    var projectlist;
    var projectcount;
    var identity="";


    getProjectCount();
    pagerender();

    function pagerender(){
        laypage.render({
            elem: 'demo7'
            ,count: projectcount
            ,limit:5
            ,layout: ['prev', 'page', 'next','skip']
            ,theme: '#1E9FFF'
            ,jump: function(obj){
                debugger
                getUserProjects(obj.curr);
            }
        });
    }






    /**针对管理员进行创建项目**/
    function admincreateproject(){
        let projectlist=getAllProjects();
        let arrData=[];
        for (var i = 0; i < projectlist.length; i++) {
            var item = projectlist[i];
            var jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            arrData.push(jsonStr);
        }
        drawer.render({
            title: '添加项目',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#windowadmin"),
            btn: ['<i class="layui-icon">&#xe615;</i>提交', '重置'],
            success: function (layero, index) {
                var demo2 = xmSelect.render({
                    el: '#demo2',
                    radio: true,
                    clickClose: true,
                    data:arrData
                });
                $("#reset").click();
            },
            btn1: function (index, layero) {
                let data = form.val("example");
                debugger;
            },
            btn2: function (index, layero) {
                layer.close(index);
                return false;
            }
        });
    }

    /**针对普通用户和公司管理员**/
    function usercreateproject(){
        drawer.render({
            title: '添加项目',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            btn: ['<i class="layui-icon">&#xe615;</i>提交', '重置'],
            success: function (layero, index) {
                $("#reset").click();
            },
            btn1: function (index, layero) {
                form.on('submit(formDemo)', function(data){
                    debugger
                    $.ajax({
                        url:'/manage/addproject',
                        data:{
                            comid:projetid,
                            projectname:data.field.title,
                            userid:userid
                        },
                        async:false,
                        success:function () {
                            getUserProjects(1);
                            getProjectCount();
                        }
                    })
                    layer.close(index);
                });
                let data = form.val("example");
                $("#btn1").click();
                debugger;
            },
            btn2: function (index, layero) {
                layer.close(index);
                return false;
            }
        });
    }

    /**添加项目**/
    $("#add_device").click(function () {
        debugger
        switch(identity){
            case "user":
                usercreateproject();
                break;
            case "admin":
                admincreateproject();
        }
    })



    $(".projects").mouseover(function () {

    })

    /**获取项目数量信息**/
    function getProjectCount() {
        $.ajax({
            url:'/manage/getAllCompanyList',
            type: 'GET',
            async:false,
            success: function (data) {
                debugger
                projectcount=data.data.length;
                $("#companycount").html("<span>"+projectcount+"</span>");
                debugger
                identity=judgeidentity();
            }
        })
    }


    //根据页码获取分页信息
    function getUserProjects(no) {
        $.ajax({
            url: '/manage/getAllCompanyPage',
            data:{
                pageno:no
            },
            type: 'GET',
            success: function (data) {
                debugger
                var thisNode=document.getElementById("list2");
                if(thisNode.childNodes.length>0){
                    thisNode.innerHTML = "";
                }
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
                "                                <div class=\"projectname\">" + item.agentName + "</div>\n" +
                "                                <div style=\"display: flex;justify-content: space-between;margin-top: 10px;color: #00f0ff;width: 150px\">\n" +
                "                                    <span><a style='color: #00f0ff' href='/company/CompanyDetail?agentNumber="+item.agentNumber+"'>编辑</a></span>\n" +
                "                                    <span class='delete' id='"+item.agentNumber+"'>删除</span>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                // "                            <div style=\"display: flex;margin: auto;\">\n" +
                // "                                <ul style=\"display: flex ;margin: auto;\">\n" +
                // "                                    <li class=\"little\">\n" +
                // "                                        <div>公司名称</div>\n" +
                // "                                        <div style=\"font-size: 20px\">" + item.agentname + "</div>\n" +
                // "                                    </li>\n" +
                // "                                    <li class=\"little\">\n" +
                // "                                        <div>设备数量</div>\n" +
                // "                                        <div style=\"font-size: 20px\">" + item.devicenum + "</div>\n" +
                // "                                    </li>\n" +
                // "                                    <li class=\"little\">\n" +
                // "                                        <div>创建时间</div>\n" +
                // "                                        <div>" + item.createtime + "</div>\n" +
                // "                                    </li>\n" +
                // "                                </ul>\n" +
                // "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>"
            $('#list2').append(innerHTML);

        }
        $(".delete").click(function () {
            let val=$(this).attr("id");
            layer.open({
                type: 1
                ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                ,id: 'layerDemo' //防止重复弹出
                ,content: '<div style="padding: 20px 100px;">是否删除</div>'
                ,btn: ['确定','取消']
                ,btnAlign: 'c' //按钮居中
                ,shade: 0 //不显示遮罩
                ,yes: function(){
                    layer.closeAll();
                },btn1: function (index, layero) {
                    deletproject(val);
                },
                btn2: function (index, layero) {
                    layer.close(index);
                    return false;
                }
            });
        })
    }

    function getAllProjects(){
        let companys=[];
        $.ajax({
            url:'/manage/getallproject',
            type:'get',
            async:false,
            success:function(data){
                companys=data.data;
            }
        });
        return companys;
    }


    function judgeidentity(){
        let identity="";
        $.ajax({
            url:'/manage/judgeidentity',
            async:false,
            type:'get',
            success:function(data){
                debugger
                identity=data.data;
            }
        });
        return identity;
    }

    /**删除项目**/
    function deletproject(projectid){
        $.ajax({
            url:"/manage/deleteproject",
            data:{
                projectid:projectid
            },
            async:false,
            success:function(data){
                getProjectCount();
                laypage.render({
                    elem: 'demo7'
                    ,count:projectcount
                    ,limit:5
                    ,layout: ['prev', 'page', 'next','skip']
                    ,theme: '#1E9FFF'
                    ,jump: function(obj){
                        debugger
                        getUserProjects(obj.curr);
                    }
                });
            }
        })

    }

    exports('selectproject', {})
});