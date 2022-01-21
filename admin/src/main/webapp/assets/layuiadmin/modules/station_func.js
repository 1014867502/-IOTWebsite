/**为详细模板的共有方法**/
layui.define(['element', 'form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        , element = layui.element;

    /**弹窗位置**/
    function ScollPostion() { //滚动条位置
        var t, l, w, h;
        let node=parent.parent.parent.iframe2;
        if(node.document.documentElement&& node.document.documentElement.scrollTop) {
            t = node.document.documentElement.scrollTop;
            l = node.document.documentElement.scrollLeft;
            w = node.document.documentElement.scrollWidth;
            h = node.document.documentElement.scrollHeight;
        } else  {
            t = node.document.body.scrollTop;
            l = node.document.body.scrollLeft;
            w = node.document.body.scrollWidth;
            h = node.document.body.scrollHeight;
        }
        return {
            top: t,
            left: l,
            width: w,
            height: h
        };
    }

    var stationfunc= {
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        layerhieght: function () {
            return ScollPostion();
        },
    }

    exports('station_func', stationfunc)
});