layui.define(['table','form', 'multiSelect'],function(exports){
    var $ = layui.$
        ,layer = layui.layer
        ,laytpl = layui.laytpl
        ,setter = layui.setter
        ,form = layui.form
        ,view = layui.view
        ,multiSelect = layui.multiSelect
        ,admin = layui.admin

    //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
    //……

    /**将课程套餐列表附加到指定的 select 组件*/
    renderCourseTypeListToSelect = function(storeId, selecter, defaultVal) {
        $(selecter).empty();
        admin.req({
            url:'/common/getCourseTypeListByStoreId/'+storeId,
            done:function (res) {
                var str = '<option value="">请选择</option>';
                $.each(res.data, function(i, item) {
                    if (defaultVal != '' && defaultVal == item.id) {
                        str += "<option value='" + item.id + "' selected>" + item.name + "</option>";
                    } else {
                        str += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }

                });
                $(str).appendTo(selecter);
                multiSelect.render();
            }
        })
    }

    /**将教练员列表附加到指定的 select 组件*/
    renderCoachListToSelect = function(storeId, selecter, defaultVal) {
        $(selecter).empty();
        admin.req({
            url:'/common/getCoachListByStoreId/'+storeId,
            done:function (res) {
                var str = '<option value="">请选择</option>';
                $.each(res.data, function(i, item) {
                    if (defaultVal != '') {
                        let selected = '';
                        let arrDefaultVal = defaultVal.split(',');
                        $.each(arrDefaultVal, function (j, defVal) {
                            if (defVal == item.id) {
                                selected = 'selected'
                            }
                        })
                        str += "<option value='" + item.id + "' " +selected+" >" + item.name + "</option>";
                    } else {
                        str += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $(str).appendTo(selecter);
                multiSelect.render();
            }
        })
    }

    /**将会员员列表附加到指定的 select 组件*/
    renderMemberListToSelect = function(storeId, selecter, defaultVal) {
        $(selecter).empty();
        admin.req({
            url:'/common/getMemberListByStoreId/'+storeId,
            done:function (res) {
                var str = '<option value="">请选择</option>';
                $.each(res.data, function(i, item) {
                    if (defaultVal != '' && defaultVal == item.id) {
                        str += "<option value='" + item.id + "' selected>" + item.name + "</option>";
                    } else {
                        str += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $(str).appendTo(selecter);
                multiSelect.render();
            }
        })
    }

    //在弹出窗口中触发父级页面按钮
    admin.events.triggerBtn = function(btn) {
        var TABS_BODY = 'layadmin-tabsbody-item'
        var ELEM_IFRAME = '.layadmin-iframe'
            ,length = $('.'+ TABS_BODY).length;

        if(admin.tabsPage.index >= length){
            admin.tabsPage.index = length - 1;
        }

        var iframe = admin.tabsBody(admin.tabsPage.index).find(ELEM_IFRAME);
        iframe[0].contentDocument.getElementById(btn).click();
    }

    //在弹出窗口中刷新父级页面表格
    admin.events.refreshTable = function(tableId) {
        var TABS_BODY = 'layadmin-tabsbody-item'
        var ELEM_IFRAME = '.layadmin-iframe'
            ,length = $('.'+ TABS_BODY).length;

        if(admin.tabsPage.index >= length){
            admin.tabsPage.index = length - 1;
        }

        var iframe = admin.tabsBody(admin.tabsPage.index).find(ELEM_IFRAME);
        var table = iframe[0].contentWindow.layui.table;
        table.reload(tableId,{})
    }

    checkNumber = function(input) {
        var re = /^\d+(?=\.{0,1}\d+$|$)/
        if (input == "" || !re.test(input)) {
            return false;
        }
        return true;
    }

    //退出
    admin.events.logout = function(){
        debugger
        //执行退出接口
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
    };


    //对外暴露的接口
    exports('common', {});
});