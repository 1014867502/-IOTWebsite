layui.define(['jquery','layer'],function (exports) {
    var $=layui.$;
    var layer=layui.layer;
    var mod_name="drawer";
    var obj={
        render:(i)=>render(i),
    };

    $("body").append('<style type="text/css">\n' +
        '    .layui-layer .layui-layer-drawer{\n' +
        '        bottom: 0px;\n' +
        '        top:0px;\n' +
        '        border:none!important;\n' +
        '        box-shadow: 1px 1px 50px rgba(0,0,0,.3)!important;\n' +
        '        overflow: auto;\n' +
        '    }\n' +
        '    .layui-layer .layui-layer-drawer .layui-layer-content iframe{\n' +
        '        height: 100%!important;\n' +
        '    }\n' +
        '    .layui-layer layui-layer-drawer .layui-layer-title .layui-layer-content{\n' +
        '        top:0px;\n' +
        '        left: 0px;\n' +
        '        right:0;\n' +
        '        bottom: 0;\n' +
        '        height: auto !important;\n' +
        '    }\n' +
        '    .layui-anim-rl{\n' +
        '        -webkit-animation-name: layui-rl;\n' +
        '        animation-name: layui-rl;\n' +
        '    }\n' +
        '    @-webkit-keyframes layui-rl {\n' +
        '        from{\n' +
        '            -webkit-transform: translate3d(100%,0,0);\n' +
        '        }\n' +
        '        to{\n' +
        '            -webkit-transform: translate3d(0,0,0);\n' +
        '                 }\n' +
        '    }\n' +
        '    @keyframes layui-rl {\n' +
        '        from{\n' +
        '            transform: translate3d(100%,0,0);\n' +
        '        }to{\n' +
        '        transform: translate3d(0,0,0);\n' +
        '                 }\n' +
        '    }\n' +
        '    .layui-anim-lr{\n' +
        '        -webkit-animation-name: layui-lr;\n' +
        '        animation-name: layui-rl;\n' +
        '    }\n' +
        '    @-webkit-keyframes layui-lr {\n' +
        '        from{\n' +
        '            -webkit-transform: translate3d(-300px,0,0);\n' +
        '            opacity: 1;\n' +
        '        }\n' +
        '        to{\n' +
        '            -webkit-transform: translate3d(0,0,0);\n' +
        '            opacity: 1;\n' +
        '        }\n' +
        '    }\n' +
        '    @keyframes layui-lr {\n' +
        '        from{\n' +
        '            transform: translate3d(-300px,0,0);\n' +
        '        }\n' +
        '        to{\n' +
        '            transform: translate3d(0,0,0);\n' +
        '        }\n' +
        '    }\n' +
        '    \n' +
        '    .layui-anim-down{\n' +
        '        -webkit-animation-name: layui-down;\n' +
        '        animation-name: layui-down;\n' +
        '    }\n' +
        '    @-webkit-keyframes layui-down {\n' +
        '        from{\n' +
        '            -webkit-transform: translate3d(0,-300px,0);\n' +
        '            opacity: .3;\n' +
        '        }\n' +
        '        to{\n' +
        '            -webkit-transform: translate3d(0,0,0);\n' +
        '            opacity: 1;\n' +
        '        }\n' +
        '    }\n' +
        '    @keyframes layui-down {\n' +
        '        from{\n' +
        '            -webkit-transform: translate3d(0,-300px,0);\n' +
        '            opacity: .3;\n' +
        '        }\n' +
        '        to{\n' +
        '            -webkit-transform: translate3d(0,0,0);\n' +
        '            opacity: 1;\n' +
        '        }\n' +
        '    }\n' +
        '</style>');

    var render=function(e){
        if(e.offset=="r"){
            e.skin='layui-anim layui-anim-rl layui-layer-drawer';
            if(!e.area)
                e.area=e.width?[e.width,'100%']:['300px','100%'];
        }
        else if(e.offset=="l"){
            e.skin='layui-anim lyaui-anim-lr layui-layer-drawer';
            if(!e.area)
                e.area=e.width?[e.width,'100%']:['300px','100%'];
        }
        else if(e.offset="t"){
            e.skin='layui-anim layui-anim-down';
            if(!e.area)
                e.area=e.height?['100%',e.height]:['100%','300px'];
        }
        else if(e.offset=="b"){
            e.skin='layui-anim layui-anim-up';
            if(!e.area){
                e.area=e.height?['100%',e.height]:['100%','300px'];
            }
        }
        var success=e.success;
        e.success=function (layero,index) {
            if(e.top!=undefined)
                $(layero).css({top:e.top});
            if(e.bottom!=undefined)
                $(layero).css({bottom:e.bottom});
            success&&success(layero, index);
        }
        var end=e.end;
        e.end=function () {
            layer.closeAll("tips");
            end&&end(layero, index);
        };

        layer.open($.extend({
            type: 1
            ,title: false //不显示标题栏
            ,closeBtn: 1
            ,area: '336px;'
            ,anim:-1
            ,shade: 0.8
            ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
            ,btnAlign: 'c'
            ,isOutAnim:false
            ,moveType: 1 //拖拽模式，0或者1
            ,content: ''
        },e));
    }
    exports(mod_name,obj);
});