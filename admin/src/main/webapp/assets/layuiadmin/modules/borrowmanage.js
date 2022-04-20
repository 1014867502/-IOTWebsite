layui.define(['form','drawer','table','laydate','layer','Global_variable','tree'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,laydate=layui.laydate
        ,layer=layui.layer
        ,table2=layui.table
        ,Global_variable=layui.Global_variable;

    var companylistadd;
    var layerindex;
    var editcompanylist;
    var editid=null;
    var devicelist;
    var devicetypelist;//设备外借状态
    var searchcompany;
    var datevalue="";



    rendertable();
    searchCompanyList(userid);
    searchdevicetype();
    getDeviceCount();


    renderdate("#datasave",currentdate);

    //日期时间范围
    laydate.render({
        elem: '#searchdate'
        ,type: 'date'
        ,range: true
        ,done: function(value, date, endDate){
            datevalue=value;
        }
    });


    form.verify({
        confirmsn:function (value) {
            let judge;
            $.ajax({
                url:'/devicelist/isExistMachineSerial',
                data: {
                    machineSerial: value
                },
                async:false,
                success:function (data) {
                    judge=data.data;
                }
            })
            if(judge=="false"||judge==null){
                return "不存在当前设备号，请重新输入";
            }
        },
        phone: [/^1[3456789]\d{9}$/
                ,'手机号输入错误'],
        text:[/^[^W_]{0,255}$/,'内容长度不得超过255个字符']
    });

    function rendertable(){
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height: 'full-200'
            , totalRow: true
            , url: '/borrow/getAllBorrow'
            , cols: [[
                {type: 'checkbox'}
                , {field: 'agentName', title: "借出公司", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'beginTime', title: "借出时间", align: 'center'}
                , {field: 'endTime', title: "到期时间", align: 'center'}
                , {field: 'lender', title: "借出人", align: 'center'}
                , {field: 'returnStatus', title: "借出状态", align: 'center', templet: '#table-online-state'}
                , {field: 'content', title: "备注", align: 'center'}
                , {fixed: 'right', title: '操作', width: 240, align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            }, done: function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    devicelist = JSON.stringify(data);
                });
            }
        });
    }



    //表格操作
    table.on('tool(table-from)', function (obj) {
        var data = obj.data;
       if (obj.event === 'edit') {
           drawer.render({
               title: '修改外借记录',  //标题
               offset: 'r',    //r:抽屉在右边、l:抽屉在左边
               width: "450px", //r、l抽屉可以设置宽度
               content: $("#editwindow"),
               success :function (layero, index) {
                   editid=data.id;
                   editwindow(data);
                   layerindex=index;
               },
           });
        } else if (obj.event === 'return') {
            layer.confirm('真的收回当前设备吗？',function(index){
                ajaxsend(obj.data.machineSerial,"/borrow/returndevice","归还成功","归还失败",rendertable);
            })
        }else if(obj.event==='del'){
           layer.confirm('真的删除当前项吗？', function(index){
               ajaxsend(obj.data.id,"/borrow/delete","删除成功","删除失败",obj.del());
               layer.close(index);
           });

        }
    });

    //提交添加外借设备
    form.on('submit(formDemo2)', function (data) {
        let json = data.field;
        $.ajax({
            url:'/borrow/isExistSn',
            data: {
                machineSerial: json.machineSerial
            },
            async:false,
            success:function (result) {
                if(result.msg=="false"||result==null){
                    layer.msg("不存在当前设备号或当前设备号重复，请重新输入",{icon:7});
                }else{
                    let company = companylistadd.getValue();
                    let nowDate = new Date();
                    let year = nowDate.getFullYear();
                    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
                        : nowDate.getMonth() + 1;
                    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
                        .getDate();
                    json.beginTime=year + "-" + month + "-" + day;
                    json.agentNumber = company[0].value;
                    let jsondata = JSON.stringify(json);
                    excueteaddDevice(jsondata);
                    layer.close(layerindex);
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                }
            }
        });

    });

    //提交修改外借设备
    form.on('submit(editsumbit)', function (data) {
        let json = data.field;
        let company = editcompanylist.getValue();
        json.agentNumber = company[0].value;
        json.id=editid;
        let jsondata = JSON.stringify(json);
        excuteeditDevice(jsondata);
        layer.close(layerindex);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    $("#datasumbit").on('click',function () {
        searchDevice();
    })
    
    //添加外借设备
    $("#add_device2").click(function () {
        drawer.render({
            title: '添加外借设备',  //标题
            offset: 'r',    //r:抽屉在右边、l:抽屉在左边
            width: "450px", //r、l抽屉可以设置宽度
            content: $("#addprowindow"),
            success: function (layero, index) {
                getCompanyListByRoleAdd(userid);
                layerindex = index;
            },
        });
    })

    /**批量收回设备**/
    $("#return_device").click(function () {
        if(devicelist != null && devicelist.length > 2)
        {
            layer.confirm('确实要收回吗?', {icon: 3, title:'提示'}, function(index1){
                ajaxsend(devicelist,'/borrow/returndevicelist',"收回成功","收回失败",rendertable);
                layer.close(index1);
                return false;
            });
        }
        else{
            layer.msg("请选择收回的设备");
        }
    })

    /**批量删除记录**/
    $("#delete_device").click(function(){
        if(devicelist != null && devicelist.length > 2)
        {
            layer.confirm('确实要删除吗?', {icon: 3, title:'提示'}, function(index1){
                $('div.layui-table-body table tbody input[name="layTableCheckbox"]:checked').each(function() { // 遍历选中的checkbox
                    let  n = $(this).parents('tbody tr').index()  // 获取checkbox所在行的顺序
                    //移除行
                    $('div.layui-table-body table tbody ').find('tr:eq(' + n + ')').remove()
                    //如果是全选移除，就将全选CheckBox还原为未选中状态
                    $('div.layui-table-header table thead div.layui-unselect.layui-form-checkbox').removeClass('layui-form-checked')
                })
                ajaxsend(devicelist,'/borrow/deletelist',"删除成功","删除失败");
                layer.close(index1);
                return false;
            });
        }
        else{
            layer.msg("请选择删除的记录");
        }
    })


    function excueteaddDevice(device) {
        if(device!=null){
            ajaxsend(device,'/borrow/add',"提交成功","提交失败",rendertable);
        }
    }

    function excuteeditDevice(device){
        if(device!=null){
            ajaxsend(device,'/borrow/edit',"提交成功","提交失败",rendertable);
            editid=null;
        }
    }

    function searchDevice(){
        let companynum=searchcompany.getValue('valueStr');
        let type=devicetypelist.getValue('valueStr');
        let input = $("#SN").val();
        let startdate;
        let enddate;
        if($("#searchdate").val()!=""){
            startdate= $("#searchdate").val().slice(0,10);
            enddate = $("#searchdate").val().slice(-10);
        }else{
             startdate= datevalue.slice(0,10);
             enddate = datevalue.slice(-10);
        }
        let lender=$("#searchlender").val();
        table.render({
            elem: '#table-form'
            , toolbar: '#table-form'
            , title: 'logdata'
            , height: 'full-200'
            , totalRow: true
            , url: '/borrow/search'
            ,where:{'content': input,'agentnumber':companynum,'begin':startdate,'status':type,'end':enddate,'lender':lender}
            , cols: [[
                {type: 'checkbox'}
                , {field: 'agentName', title: "借出公司", align: 'center'}
                , {field: 'machineSerial', title: "设备sn号", align: 'center'}
                , {field: 'machineName', title: "设备名称", align: 'center'}
                , {field: 'beginTime', title: "借出时间", align: 'center'}
                , {field: 'endTime', title: "到期时间", align: 'center'}
                , {field: 'lender', title: "借出人", align: 'center'}
                , {field: 'returnStatus', title: "借出状态", align: 'center', templet: '#table-online-state'}
                , {field: 'content', title: "备注", align: 'center'}
                , {fixed: 'right', title: '操作', width: 240, align: 'center', toolbar: '#barDemo'}
            ]]
            , limit: 50 //每页默认显示的数量
            , limits: [50, 100, 200]
            , id: 'table-form'
            , page: true
            , parseData: function (res) {
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": res.data == null ? 0 : res.data.totalRow,
                    "data": res.data == null ? {} : res.data.list
                };
            }, done: function () {
                table.on('checkbox(table-from)', function (obj) {
                    let checkStatus = table.checkStatus('table-form')
                        , data = checkStatus.data;
                    devicelist = JSON.stringify(data);
                });
            }
        });
    }


    //归还外借设备
    function excutereturn(smachineserial){
        ajaxsend(smachineserial,"/borrow/returndevice","归还成功","归还失败")
    }


    //封装ajax方法
    function ajaxsend(data,url,success,fail,successCallback,failcallback){
        if(data!=null){
            $.ajax({
                url:url,
                data:{
                    data:data
                },
                success:function (result) {
                    if(result.data="success"){
                        layer.msg(success);
                        successCallback();
                    }else{
                        failcallback();
                        layer.msg(fail);
                    }
                }
            })
        }
    }

    //搜索外借设备

    /**初始话编辑页面**/
    function editwindow(data){
        $.ajax({
            url:'/borrow/getDetailById',
            data:{
                data:data.id
            },
            success:function(result){
                let device=result.data;
                let begin=device.beginTime.toString().substring(0,10);
                let end=device.endTime.toString().substring(0,10);
                laydate.render({
                    elem: "#editdatasave"
                    ,min: currentdate()
                    ,format: 'yyyy-MM-dd'
                    ,theme: '#01AAED'
                });
                loadcompany(device.agentNumber);
                $("#editdate").val(begin);
                $("#editaccount").val(device.uAccountNum);
                $("#editcontent").val(device.content);
                $("#editmachineserial").val(device.machineSerial);
                $("#editdatasave").val(end);
                $("#editlender").val(device.lender);
                $("#editphoneNumber").val(device.phoneNumber);
                if(device.returnStatus!=0){
                    editcompanylist.update({ disabled: true });
                    $("#editdatasave").addClass("layui-btn-disabled");
                    $("#editdatasave").attr("disabled","disabled");
                    $("#returnstatus").removeClass("untreated");
                    $("#returnstatus").html("已归还");
                    $("#returnstatus").addClass("treated");
                }
            }
        })

    }

    function renderdate(node,mindate){
        laydate.render({
            elem: node
            ,min: mindate()
            ,format: 'yyyy-MM-dd'
            ,theme: '#01AAED'
            ,done: function(value, date, endDate){
            }
        });
    }

    /**获取当前角色的公司列表(添加设备上的)**/
    function searchCompanyList(userid) {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                rendercompanysearch(data.data);
            }
        })
    }

    /**获取当前角色的公司列表(添加设备上的)**/
    function getCompanyListByRoleAdd(userid) {
        $.ajax({
            url: '/manage/getCompanyListByRole',
            data: {
                userid: userid
            },
            async: false,
            success: function (data) {
                rendercompanyadd(data.data)
            }
        })
    }

    function rendercompanyadd(json) {
        let arrData = initarrary(json);
        companylistadd = xmSelect.render({
            el: '#companylistadd',
            radio: true,
            empty: '呀, 没有数据呢',
            layVerify: 'required',
            data: arrData,
            clickClose: true,
            theme: {
                color: '#01AAED',
            },
            style: {
                borderRadius: '6px',
            }
        })
    }

    /**渲染公司列表（搜索框上）**/
    function rendercompanysearch(json) {
        let initData = [{name:"全部公司",value:"all"}];
        let arrData = initarrary(json,initData);
        searchcompany = xmSelect.render({
            el: '#company',
            radio: true,
            empty: '呀, 没有数据呢',
            data: arrData,
            layVerify: 'required',
            initValue:["all"],
            clickClose: true,
            theme: {
                color: '#01AAED',
            },
            style: {
                borderRadius: '6px',
            }
        })
    }

    /**判断账日期**/
    function currentdate(){
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate()+1 : nowDate
            .getDate()+1;
        let result = year + "-" + month + "-" + day;
        return result;
    }

    /**获取公司列表(编辑页面初始化)**/
    function loadcompany(init){
        $.ajax({
            url:'/company/getAllCompany',
            async:false,
            success: function(data){
                loadcompanylist(data.data,init);
            }
        })
    }

    /**加载公司列表(编辑页面初始化)**/
    function loadcompanylist(json,init){
        let arrData = initarrary(json);
        editcompanylist = xmSelect.render({
            el: '#editcompanylist',
            data: arrData,
            layVerify: 'required',
            radio:true,
            clickClose:true,
            theme: {
                color: '#01AAED',
            },
            layVerType: 'msg',
            initValue: [init],
        })
    }

    /**初始化设备情况**/
    function searchdevicetype(){
        let typeData = [{name:"全部设备",value:"all"},{name:"外借中",value:"0"},{name:"已归还",value:"1"}];
        devicetypelist = xmSelect.render({
            el: '#online',
            data: typeData,
            layVerify: 'required',
            radio: true,
            empty: '呀, 没有数据呢',
            clickClose: true,
            initValue:["0"],
            layVerType: 'msg',
            theme: {
                color: '#1E9FFF',
            },
            style: {
                borderRadius: '6px',
            },
        })
    }

    /**初始化数组**/
    function initarrary(json,result){
        if(result==null){
            result=[];
        }
        for(let i=0;i<json.length;i++){
            let item = json[i];
            let jsonStr = {};
            jsonStr.name = item.agentName;
            jsonStr.value = item.agentNumber;
            result.push(jsonStr);
        }
        return result;
    }

    function getDeviceCount(){
        $.ajax({
            url:'/borrow/deviceCount',
            success:function(result){
                let device=result.data;
                $("#sumnum").html(device.totalexpire);
                $("#onlinenum").html(device.inexpire);
                $("#outnum").html(device.outexpire);
                $("#unprojnum").html(device.closeexpire);
                $("#newonlinenum").html(device.currentexpire);
            }
        })
    }

    exports('borrowmanage',{})
});