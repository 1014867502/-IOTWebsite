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
    var currentpage=0;


    getProjectCount();
    pagerender();

    form.verify({
        editaccount:function (value) {
            let judge;
            $.ajax({
                url:'/company/getCompanyByName',
                data: {
                    comname: value
                },
                async:false,
                success:function (data) {
                    judge=data.data;
                }
            })
            if(judge!=null){
                return "已存在当前账号，请重新输入";
            }
        }
    });


    function pagerender(){
            laypage.render({
                elem: 'demo7'
                ,count: projectcount
                ,limit:9
                ,layout: ['prev', 'page', 'next','skip']
                ,theme: '#1E9FFF'
                ,jump: function(obj){
                    getUserProjects(obj.curr);
                }
            });
    }


    /**添加项目**/
    $("#add_device").click(function () {
        drawer.render({
            title: '添加公司',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "600px", //r、l抽屉可以设置宽度
            content: $("#window"),
            success :function (layero, index) {
                layerindex=index;
            },
        });
    })

    form.on('submit(formDemo)', function(data){
        let json=data.field;
        let name=json.title;
        $.ajax({
            url:'/company/addCompany',
            data:{
                company:name,
            },
            async:false,
            success:function (data) {
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
                getProjectCount();
                laypage.render({
                    elem: 'demo7'
                    ,count:projectcount
                    ,limit:9
                    ,curr:currentpage
                    ,layout: ['prev', 'page', 'next','skip']
                    ,theme: '#1E9FFF'
                    ,jump: function(obj){
                        getUserProjects(obj.curr);
                    }
                });
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    form.on('submit(formDemo2)', function(data){
        let json=data.field;
        let name=json.title;
        $.ajax({
            url:'/company/addCompany',
            data:{
                company:name,
            },
            async:false,
            success:function (data) {
                layer.open({
                    title: '提交'
                    ,skin: 'demo-class'
                    ,offset: 'auto'
                    ,content: '提交成功'
                });
                getProjectCount();
                laypage.render({
                    elem: 'demo7'
                    ,count:projectcount
                    ,limit:9
                    ,curr:currentpage
                    ,layout: ['prev', 'page', 'next','skip']
                    ,theme: '#1E9FFF'
                    ,jump: function(obj){
                        getUserProjects(obj.curr);
                    }
                });
            }
        })
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    /**获取项目数量信息**/
    function getProjectCount() {
        $.ajax({
            url:'/manage/getAllCompanyList',
            type: 'GET',
            async:false,
            success: function (data) {
                projectcount=data.data.length;
                $("#companycount").html("<span>"+projectcount+"</span>");
                identity=judgeidentity();
            }
        })
    }


    //根据页码获取分页信息
    function getUserProjects(no) {
        currentpage=no;
        $.ajax({
            url: '/manage/getAllCompanyPage',
            data:{
                pageno:no
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
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            var innerHTML = "  <div class=\"layui-card\">\n" +
                "                            <div class=\"cardbody\">\n" +
                "                                <div class=\"layui-card-body\">\n" +
                "                                    <div class=\"projects\">\n" +
                "                                        <div style=\"margin: auto;\">\n" +
                "                                            <img width=\"30px\" src=\"/assets/images/icon_agent.png\"/>\n" +
                "                                            <div class=\"projectname\">"+item.agentname+"</div>\n" +
                "                                            <div style=\"margin-top: 10px\">\n" +
                "                                                <div style=\"display: flex\">\n" +
                "                                                    <img width=\"30px\" src=\"/assets/images/icon_selcompro.png\"/><span style=\"margin-left: 10px;margin-right: 10px;\">项目数量:<span style=\"font-size: 20px\">"+item.projectsum+"</span></span>\n" +
                "                                                    <img width=\"30px\" src=\"/assets/images/icon_selcomdev.png\"/><span style=\"margin-left: 10px;margin-right: 10px;\">设备总数:<span style=\"font-size: 20px\">"+item.devicesum+"</span></span>\n" +
                "                                                </div>\n" +
                // "                                                <div style=\"display: flex\">\n" +
                // "                                                    <img width=\"30px\" src=\"/assets/images/icon_deviceonline.png\"/><span style=\"margin-left: 10px;margin-right: 10px;\">设备在线数量:<span style=\"color: #00cca3;font-size: 20px\">"+item.onlinesum+"</span></span>\n" +
                // "                                                    <img width=\"30px\" src=\"/assets/images/icon_deviceout.png\"/><span style=\"margin-left: 10px;margin-right: 10px;\">设备离线数量:<span style=\"color: #F53C3C;font-size: 20px\">"+item.deadsum+"</span></span>\n" +
                // "                                                </div>\n" +
                "                                            </div>\n" +
                "                                        </div>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                                            <div class='editgroup'>\n" +
                "                                                <span class='editbutton edit' id=\"editbutton_"+item.agentnum+"\"><a class='buttonherf' href=\"/company/CompanyDetail?agentNumber="+item.agentnum+"\">编辑</a></span>\n" +
                "                                                <span class=\"editbutton delete\" id=\""+item.agentnum+"\"><a href='javascript:void(0)' class='buttonherf'>删除</a></span>\n" +
                "                                            </div>\n" +
                "                            </div>\n" +
                "                        </div>"
            $('#list2').append(innerHTML);
        }
        if(data.length<9){
            let length2=9-data.length;
            for(let j=0;j<length2;j++){
                $("#list2").append("<i style='width: 400px;margin: 15px;'></i>");
            }
        }
        $(".edit").click(function(){
            let val=$(this).attr("id");
            let id=val.split("_");
            location.replace("/company/CompanyDetail?agentNumber="+id[1]);
        })
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
                    deletproject(val);
                    layer.closeAll();
                },btn1: function (index, layero) {

                },
                btn2: function (index, layero) {
                    layer.close(index);
                    return false;
                }
            });
        })
    }



    function judgeidentity(){
        let identity="";
        $.ajax({
            url:'/manage/judgeidentity',
            async:false,
            type:'get',
            success:function(data){
                identity=data.data;
              if(identity=="superadmin"){
                  $("#add_device").css("display","block");
              }
            }
        });
        return identity;
    }

    /**删除项目**/
    function deletproject(projectid){
        $.ajax({
            url:"/company/deleteCom",
            data:{
                agentnum:projectid
            },
            async:false,
            success:function(data){
                getProjectCount();
                laypage.render({
                    elem: 'demo7'
                    ,count:projectcount
                    ,limit:9
                    ,curr:currentpage
                    ,layout: ['prev', 'page', 'next','skip']
                    ,theme: '#1E9FFF'
                    ,jump: function(obj){
                        getUserProjects(obj.curr);
                    }
                });
            }
        })

    }

    exports('selectproject', {})
});