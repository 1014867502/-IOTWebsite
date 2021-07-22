layui.define(['form', 'drawer'], function (exports) {
    var $ = layui.$
        , setter = layui.setter


    var obj = {
        judgeidentity: function ()
        {
            let identity="";
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
    };



    function judgeidentity(){
        let identity="";
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


    exports('usertools', obj)
});