layui.define(['form','message'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,message=layui.messagesend
        ,form = layui.form;

    form.render();

    $("#LAY-user-login-username").focus();
    $(':input').keyup(function(event) {
        if (event.keyCode == 13) {
            $("#submitBtn").click();
        }
    });

    //提交
    form.on('submit(LAY-user-login-submit)', function(obj){
        $("#submitBtn").addClass("disabled");
        $("#submitBtn").css("disabled","true");
        //请求登入接口
        admin.req({
            url: '/doLogin' //实际使用请改成服务端真实接口
            ,data: obj.field    ////当前容器的全部表单字段，名值对形式：{name: value}
            ,done: function(res){
                //请求成功后，写入 accessToken
                layui.data(setter.tableName, {
                    key: setter.request.tokenName
                    ,value: res.data.accessToken
                });
                //登入成功的提示与跳转
                layer.msg($.i18n.prop('web_login_success'), {
                    offset: '15px'
                    ,icon: 1
                    ,time: 1000
                }, function(){

                    location.href = '/'; //后台主页
                });
            }
            ,success:function(res) {
                if (res.code != 0) {
                    $('#LAY-user-get-vercode').click();
                }
                $("#submitBtn").removeClass("disabled");
                $("#submitBtn").css("disabled","false");
            }
        });

    });

    //更换图形验证码
    $('body').on('click', '#LAY-user-get-vercode', function(){
        var othis = $(this);
        this.src = '/captcha?t='+ new Date().getTime()
    });

    exports('login',{})
});