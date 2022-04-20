layui.define(['element', 'form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        , element = layui.element;

    var appauthority= [
        {name: '设备信息', value: 0},
        {name: '网络设置', value: 1},
        {name: '站点设置', value: 2},
        {name: '坐标系统', value: 3},
        {name: '外界传感器',value: 4},
        {name: '平台对接', value: 5},
        {name: '设备控制', value: 6},
        {name: '辅助功能', value: 7},
        {name: '配置日志', value: 8},
        {name: '固件升级', value: 9},
        {name: '设备日志', value: 10},
        {name: '指令调试功能', value: 11}
    ];


    var Global_variable={
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        appauthority:function () {
            return appauthority;
        },

    }
    exports('Global_variable',Global_variable)
});