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
        },
        HashMap:HashMap()
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


    function HashMap(){
        var length=0;
        var obj=new Object();

        this.isEmpty=function () {
            return length==0;
        }

        this.containKey=function (key) {
            return (key in obj);
        }

        this.containsValue=function (value) {
            for(var key in obj){
                if(obj[key]==value){
                    return true;
                }
            }
            return false;
        }

        this.put=function (key,value) {
            if(!this.containKey(key)){
                length++;
            }
            obj[key]=value;
        }

        this.get=function(key){
            return this.containKey(key)?obj[key]:null;
        }

        this.remove=function(key){
            if(this.containKey(key)&&(delete  obj[key])){
                length--;
            }
        }

        this.values=function () {
            var _values=new Array();
            for(var key in obj){
                _values.push(obj[key]);
            }
            return _values;
        }

        this.keySet=function(){
            var _keys=new Array();
            for(var key in obj){
                _keys.push(key);
            }
        }

        this.size=function(){
            return length;
        }

        this.clear=function () {
            length=0;
            obj=new Object();
        }
    }

    exports('usertools', obj)
});