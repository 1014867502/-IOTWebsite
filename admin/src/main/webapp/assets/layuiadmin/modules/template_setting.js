layui.define(['element', 'form', 'drawer', 'table','template_compute','template_platform','template_auxiliary','template_locate'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        ,temlocate=layui.template_locate
        ,temauxiliary=layui.template_auxiliary
        ,templatform=layui.template_platform
        ,tempcompute=layui.template_compute
        , element = layui.element;


    // element.on('tab(demo)', function(data){
    //     console.log(this); //当前Tab标题所在的原始DOM元素
    //     switch (data.index) {
    //         case 1:
    //             tempcompute.checksavemodel();
    //             break;
    //         case 2:
    //             temlocate.checksavemodel();
    //             break;
    //         case 3:
    //             templatform.checksavemodel();
    //             break;
    //         case 4:
    //             temauxiliary.checksavemodel();
    //             break;
    //     }
    //     console.log(data.index); //得到当前Tab的所在下标
    //     console.log(data.elem); //得到当前的Tab大容器
    // });


    exports('template_setting',{})
});