layui.define(['form'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form


    form.verify({
        pass:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        confirmpass:function (value) {
            if($('input[name=password]').val()!=value)
                return "两次密码输入不一致";
        },
        correctpass:function (value) {
            let judge;
            $.ajax({
                url:'/custom/isCorrectPassword',
                data: {
                    oldpassword: value,
                    userid:userid
                },
                async:false,
                success:function (data) {
                    judge=data.data;
                }
            })
            if(judge!=null&&judge!="success"){
                return "密码错误";
            }
        },
    });

    form.on('submit(submitBtn)', function(data){//添加用户提交
        let json=data.field;
        $.ajax({
            url:'/custom/changePassword',
            data:{
                newpassword:json.password,
                userid:userid
            },
            async:false,
            success:function (data) {
                form.render();
                layer.msg('提交成功');
                logout();
            }
        })
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    function logout(){
        let second=10;
        parent.layer.open({
            type: 1
            ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            ,id: 'layerDemo' //防止重复弹出
            ,content: '<div style="padding: 20px 100px;">当前登录用户密码已修改，请重新登录!</div>'
            ,btn: ['立刻重新登录']
            ,btnAlign: 'c' //按钮居中
            ,moveType: 0
            ,closeBtn :0
            ,shade: 0.8 //不显示遮罩
            ,yes: function(){
                //                 clearInterval(timer);
                layer.closeAll();
                admin.req({
                    url: '/logout'
                    ,type: 'get'
                    ,data: {}
                    ,done: function(res){
                        //清空本地记录的 token，并跳转到登入页
                        admin.exit(function(){
                            location.href = '/toLogin';
                        });
                    }
                    ,parseData:function(res){
                        return {
                            "code":res.code,
                            "msg":res.msg,
                            "count": res.data == null ? 0 : res.data.totalRow,
                            "data": res.data == null ? {} :res.data.list
                        };
                    }
                });
                // var timer= setInterval(function () {
                //     clearInterval(timer);
                //     admin.exit(function(){
                //         location.href = '/toLogin';
                //     });
                //     second--;
                //     $("#second").html(second);
                //     if(second==0){
                //     }
                // },1000);
            },btn1: function (index, layero) {

            },
            btn2: function (index, layero) {

            }
        });
        //执行退出接口
    };

    exports('password',{})
});