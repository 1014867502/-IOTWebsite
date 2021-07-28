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
    var layerindex;
    var demo;//添加项目的公司列表
    var currentAgent;//当前公司编号

    function layerpage(){
        laypage.render({
            elem: 'demo7'
            ,count: projectcount
            ,limit:5
            ,layout: ['prev', 'page', 'next','skip']
            ,theme: '#1E9FFF'
            ,jump: function(obj){
                getUserProjects(obj.curr);
            }
        });
    }

    getProjectCount()
    judgeidentity();

    form.verify({
        editname:function (value) {
            let judge;
            $.ajax({
                url:'/project/getProjectByName',
                data: {
                    name: value
                },
                async:false,
                success:function (data) {
                    judge=data.data;
                }
            })
            if(judge!=null){
                return "已存在当前名称，请重新输入";
            }
        }
    });

    form.on('submit(formDemo)', function(data){
        let json=data.field;
        // let company=demo.getValue();
        $.ajax({
            url:'/manage/addproject',
            data:{
                // comid:company[0].value,
                comid:currentAgent,
                projectname:json.projectname,
            },
            async:false,
            success:function (data) {
                getProjectCount()
                layer.msg('提交成功');
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    /**针对管理员进行创建项目**/
    function admincreateproject(){
        let projectlist=getAllCompanys();
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
            success: function (layero, index) {
                demo = xmSelect.render({
                    el: '#demo2',
                    radio: true,
                    clickClose: true,
                    data:arrData
                });
                layerindex=index;
            },
        });
    }

    /**针对普通用户和公司管理员**/
    function usercreateproject(){
        // let company=getCurrentCompany();
        currentAgent=agentNum;
        drawer.render({
            title: '添加项目',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            success: function (layero, index) {
                // demo = xmSelect.render({
                //     el: '#demo2',
                //     radio: true,
                //     clickClose: true,
                //     data:arrData
                // });
                layerindex=index;
            },
        });

    }

    /**添加项目**/
    $("#add_device").click(function () {
        usercreateproject();
        // switch(identity){
        //     case "company":
        //
        //         break;
        //     case "admin":
        //         admincreateproject();
        // }
    })

    /**获取项目数量信息**/
    function getProjectCount() {
        $.ajax({
            url:'/project/getProjectByComId',
            data:{
                id:agentNum
            },
            type: 'GET',
            async:false,
            success: function (data) {
                projectcount=data.data;
                $("#projectcount").html("<span>"+projectcount.length+"</span>");
                layerpage();
            }
        })
    }


    //根据页码获取分页信息
    function getUserProjects(no) {
        $.ajax({
            url: '/project/getProjectPageByComId',
            data:{
                pageno:no,
                agentnum:agentNum
            },
            type: 'GET',
            success: function (data) {
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
        let real=data;
        for (let i = 0; i < real.length; i++) {
            let item = real[i];
            var innerHTML = "     <div class=\"layui-card\">\n" +
                "                <div class=\"cardbody\">\n" +
                "                    <div class=\"layui-card-body\">\n" +
                "                        <div class=\"projects\">\n" +
                "                            <div style=\"margin: auto;\">\n" +
                "                                <div class=\"projectname\">" + item.progroupname+ "</div>\n" +
                "                                <div style=\"display: flex;justify-content: space-between;padding-top: 10px;margin:auto;color: #00f0ff;width: 150px\">\n" +
                "                                    <span><a style='color: #00f0ff' href='/project/projectdetail?progroupid="+item.projectid+"'>编辑</a></span>\n" +
                "                                    <span class='delete' id='"+item.progroupname+"'>删除</span>\n" +
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

    function getAllCompanys(){
        let companys=[];
        $.ajax({
            url:'/manage/getallCompanys',
            type:'get',
            async:false,
            success:function(data){
                companys=data.data;
            }
        });
        return companys;
    }

    function getCurrentCompany(){
        let companys=[];
        $.ajax({
            url:'/company/getCurrentCom',
            type:'get',
            async:false,
            success:function(data){
                companys=data.data;
            }
        });
        return companys;
    }

    function judgeidentity(){
        $.ajax({
            url:'/manage/judgeidentity',
            async:false,
            type:'get',
            success:function(data){
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
                    ,limit:10
                    ,layout: ['prev', 'page', 'next','skip']
                    ,theme: '#1E9FFF'
                    ,jump: function(obj){
                        getUserProjects(obj.curr);
                    }
                });
            }
        })

    }


    exports('companyprojects', {})
});