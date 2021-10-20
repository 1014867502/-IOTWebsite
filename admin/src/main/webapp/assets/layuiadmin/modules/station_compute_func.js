layui.define(['element', 'form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        , element = layui.element;


    var device={};
    var form21 = ["basestation", "devicestatus", "observedata", "rawdatareturn"];
    var form22 = ["statusresult", "observedata", "rtksetting", "rawdatareturn"];
    var form12 = ["statusresult","basechange","statusresult2", "timerecord", "basedownload", "rawdatareturn", "rtksetting"];
    var form11 = ["basestation", "devicestatus", "basefilereturn", "rawdatareturn", "timerecord"];
    var formlist = ["basestation", "devicestatus", "basefilereturn", "basechange", "statusresult", "basedownload", "observedata", "rtksetting",
        "statusresult2", "rawdatareturn", "timerecord"];
    var beforeform;
    var compute = 0;
    var station = 0;
    var mark = 0;
    var downloadsource = 0;//基站数据来源的数据来源单选
    var rtkturn = true;//rtk开关
    var rawdataturn = false;//原始数据上传开关
    var doublebase = false;//双基站开关
    var machineserial=machinesn;
    var layerindex;


    /*获取配置数据*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/devicelist/getDeviceSetting',
            data: {
                machineSerial: sn
            },
            success: function (data) {
                device = data.data;
                if(device.rawName!=null&&device.rawName!=""){
                    $("#rawName").val(device.rawName);
                }else{
                    $("#rawName").val(device.machineSerial);
                }
                $("#baseLon").val(device.baseLon);
                $("#baseLat").val(device.baseLat);
                $("#baseHeight").val(device.baseHeight);
                $("#rawIp").val(device.rawIp);
                $("#rawPort").val(device.rawPort)
                $("#resultIp").val(device.resultIp);
                $("#resultPort").val(device.resultPort);
                $("#coordinatesX").val(device.coordinatesX);
                $("#coordinatesY").val(device.coordinatesY);
                $("#coordinatesZ").val(device.coordinatesZ);
                $("#secondIp").val(device.scondIp);
                $("#secondPort").val(device.scondPort);
                $("#networkAddress").val(device.networkAddress);
                $("#networkPort").val(device.networkPort);
                $("#selectList").find("option[value=" + device.rawRate + "]").prop("selected", true);
                let ntriparg=device.ntripArg;
                if(ntriparg!=""&&ntriparg!=null){
                    let arg=ntriparg.split('|');
                    $("#rawntripaddress").val(arg[0]);
                    $("#rawntripport").val(arg[1]);
                    $("#networkMountpoint1").val(arg[2]);
                    $("#coreuse1").val(arg[3]);
                    $("#corepass1").val(arg[4]);
                }
                let secondarg=device.secondArg;
                if(secondarg!=""&&secondarg!=null){
                    let arg=secondarg.split('|');
                    $("#secondntripaddress").val(arg[0]);
                    $("#secondntripport").val(arg[1]);
                    $("#secondMountpoint1").val(arg[2]);
                    $("#coreuse2").val(arg[3]);
                    $("#corepass2").val(arg[4]);
                }
                if (device.rtkPos > 0) {
                    rtkturn = true;
                    $("#rtkturn").prop("checked", true);
                    $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
                    $("#imuWarn").find("option[value=" + device.imuWarn + "]").prop("selected", true);
                    $("#networkMode").find("option[value=" + device.networkMode + "]").prop("selected", true);
                    judgertkmode(device.networkMode);
                    $("#networkAddress").val(device.networkAddress);
                    $("#networkPort").val(device.networkPort);
                    $("#networkMountpoint3").val(device.networkMountpoint);
                    $("#getConnectPoint3").click(function () {
                        getConnectPoint3();
                    })
                }
                if (device.rawBackEnabled > 0) {
                    $("#rawdataturn").prop("checked", true);
                    $("#rawBackEnabled").find("option[value=" + device.rawBackEnabled + "]").prop("selected", true);
                    $("#rawBackGnssData").find("option[value=" + device.rawBackGnssData + "]").prop("selected", true);
                    let enabledata={};
                    enabledata.value=parseInt(device.rawBackEnabled);
                    rawdatabackflush(enabledata);
                }
                if(device.secondBase>0){
                    $("input[name='networkAddress']").val(device.networkAddress);
                    $("input[name='networkPort']").val(device.networkPort);
                }
                let status2 = $("#resultMsg")
                if (status2 != null) {
                    $("#resultMsg").find("option[value=" + device.resultMsg + "]").prop("selected", true);
                    $("#resultImu").find("option[value=" + device.resultImu + "]").prop("selected", true);
                    $("#resultRs232").find("option[value=" + device.resultRs232 + "]").prop("selected", true);

                }
                if ($("#recordinterval") != null) {
                    $("#recordInterval").find("option[value=" + device.recordInterval + "]").prop("selected", true);
                }
                if(device.networkMountpointPass!=""&&device.networkMountpointPass!=null){
                    let userpass=device.networkMountpointPass.toString().split("|");
                    $("#networkMountpointUse").val(userpass[0]);
                    $("#networkMountpointPass").val(userpass[1]);
                }
                saveModel();

            }
        })
    }

    /**保存模组**/
    function saveModel(){
        let data1 = form.val("formDemo");
        let data2={};
        Object.assign(data2,device)
        delete data2.baseLon;
        delete data2.baseLat;
        delete data2.baseHeight;
        delete data2.coordinatesX;
        delete data2.coordinatesY;
        delete data2.coordinatesZ;
        let source = $("#coredata1").prop("checked");
        let source2 = $("#coredata2").prop("checked");
        if(source){
            data2.networkAddress=data1.rawntripaddress;
            data2.networkPort=data1.rawntripport;
            data2.networkMountpoint=data1.networkMountpoint1;
            data2.networkMountpointUse=data1.coreuse1;
            data2.networkMountpointPass=data1.corepass1;
        }
        if(source2){
            data2.networkAddress=data1.secondntripaddress;
            data2.networkPort=data1.secondntripport;
            data2.networkMountpoint=data1.secondMountpoint1;
            data2.networkMountpointUse=data1.coreuse2;
            data2.networkMountpointPass=data1.corepass2;
        }
        if(downloadsource==1){
            data2.ntripArg= data1.rawntripaddress+"|"+data1.rawntripport+"|"+data1.networkMountpoint1+"|"+data1.coreuse1+"|"+data1.corepass1;
        }
        if(doublebase){
            data2.secondArg= data1.secondntripaddress+"|"+data1.secondntripport+"|"+data1.secondMountpoint1+"|"+data1.coreuse2+"|"+data1.corepass2;
        }
        let stringtest=JSON.stringify(data2);
        parent.testmodel.compute=stringtest;
    }


    /**获取接入点**/
    function getConnectPoint() {
        if($("#rawntripaddress").val()==""||$("#rawntripport").val()==""){
            layer.msg("IP地址和端口不得为空");
            return;
        }
        $.ajax({
            url:'/manage/getConnectPoint',
            data:{
                ip:$("#rawntripaddress").val(),
                port:$("#rawntripport").val()
            },
            success:function(data){
                let jsondata=data.data;
                let arrData = [];
                let init;
                for(let i=0;i<jsondata.length;i++){
                    let item = jsondata[i];
                    let jsonStr = {};
                    if(i==0){
                        init=item;
                    }
                    jsonStr.name = item;
                    jsonStr.value = item;
                    arrData.push(jsonStr);
                }
                var pointlist1 = xmSelect.render({
                    el: '#corePoint1',
                    data: arrData,
                    paging: true,
                    pageSize: 10,
                    initValue: [init],
                    radio:true,
                    clickClose:true,
                    theme: {
                        color: '#01AAED',
                    },
                    layVerType: 'msg',
                    model:{
                        label:{
                            type:'block',
                            block: {
                                //最大显示数量, 0:不限制
                                showCount: 0,
                                //是否显示删除图标
                                showIcon: false,
                            }
                        }
                    },
                    on: function(data){
                        $("#networkMountpoint1").val(data.change[0].value);
                    }
                })
            }
        })
    }

    function getConnectPoint2() {
        if($("#secondntripaddress").val()==""||$("#secondntripport").val()==""){
            layer.msg("IP地址和端口不得为空");
            return;
        }
        $.ajax({
            url:'/manage/getConnectPoint',
            data:{
                ip:$("#secondntripaddress").val(),
                port:$("#secondntripport").val()
            },
            success:function(data){
                let jsondata=data.data;
                let arrData = [];
                let init;
                if(jsondata!=null&&jsondata.length>0){
                    for(let i=0;i<jsondata.length;i++){
                        let item = jsondata[i];
                        let jsonStr = {};
                        if(i==0){
                            init=item;
                        }
                        jsonStr.name = item;
                        jsonStr.value = item;
                        arrData.push(jsonStr);
                    }
                }
                var pointlist2 = xmSelect.render({
                    el: '#corePoint2',
                    data: arrData,
                    paging: true,
                    pageSize: 10,
                    initValue: [init],
                    radio:true,
                    clickClose:true,
                    theme: {
                        color: '#01AAED',
                    },
                    layVerType: 'msg',
                    model:{
                        label:{
                            type:'block',
                            block: {
                                //最大显示数量, 0:不限制
                                showCount: 0,
                                //是否显示删除图标
                                showIcon: false,
                            }
                        }
                    },
                    on: function(data){
                        $("#networkMountpoint2").val(data.change[0].value);
                    }
                })
            }
        })
    }

    function getConnectPoint3() {
        if($("#networkAddress").val()==""||$("#networkPort").val()==""){
            layer.msg("IP地址和端口不得为空");
            return;
        }
        $.ajax({
            url:'/manage/getConnectPoint',
            data:{
                ip:$("#networkAddress").val(),
                port:$("#networkPort").val()
            },
            success:function(data){
                let jsondata=data.data;
                let arrData = [];
                let init;
                for(let i=0;i<jsondata.length;i++){
                    let item = jsondata[i];
                    let jsonStr = {};
                    if(i==0){
                        init=item;
                    }
                    jsonStr.name = item;
                    jsonStr.value = item;
                    arrData.push(jsonStr);
                }
                var pointlist3 = xmSelect.render({
                    el: '#corePoint3',
                    data: arrData,
                    paging: true,
                    pageSize: 10,
                    initValue: [init],
                    radio:true,
                    clickClose:true,
                    theme: {
                        color: '#01AAED',
                    },
                    layVerType: 'msg',
                    model:{
                        label:{
                            type:'block',
                            block: {
                                //最大显示数量, 0:不限制
                                showCount: 0,
                                //是否显示删除图标
                                showIcon: false,
                            }
                        }
                    },
                    on: function(data){
                        $("#networkMountpoint3").val(data.change[0].value);
                    }
                })
            }
        })
    }


    /*根据单选按钮组的变化显示不同内容*/
    function showform(form1,form2,form3,form4,data1, data2) {
        let no = data1.toString()
        let no1 = data2.toString();
        let no2 = no + no1;
        switch (no2) {
            case "02":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form1.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form1;
                for (let i = 0; i < form1.length; i++) {
                    innhtml(form1[i]);
                }
                break;
            case "00":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form2.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form2;
                for (let i = 0; i < form2.length; i++) {
                    innhtml(form2[i]);
                }

                break;
            case "12":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form3.includes(pirorform[i])) {
                            removehtml(pirorform[i]);
                        }
                    }
                }
                pirorform = form3;
                for (let i = 0; i < form3.length; i++) {
                    innhtml(form3[i]);
                }

                break;
            case "10":
                if (pirorform != null) {
                    for (let i = 0; i < pirorform.length; i++) {
                        if (!form2.includes(pirorform[i])) {
                            removehtml(pirorform[i]);
                        }
                    }
                }
                pirorform = form4;
                for (let i = 0; i < form4.length; i++) {
                    innhtml(form4[i]);
                }
                break;
        }

    }

    /**动态插入表单项**/
    function innhtml(select) {
        switch (select) {
            case "basestation":
                document.getElementById("basestation").innerHTML = "   <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\" style=\"margin-top: 12px;\"></div>\n" +
                    "                            <div style='display: flex'><span style='margin: auto'>基准站坐标</span>\n" +
                    "                                <button id='curlocal' type='button' style=\"margin-left: 50px\" class=\"layui-btn btn_primary\">获取当前坐标</button><span id='deviceonline'></span>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
                    "                            <label class=\"layui-form-label\">坐标类型</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"radio\" lay-filter=\"mark\" name=\"marktype\" value=\"0\" title=\"BLH\" checked>\n" +
                    "                                <input type=\"radio\" lay-filter=\"mark\" name=\"marktype\" value=\"1\" title=\"XYZ\" >\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex\" id=\"BLH\" >\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">纬度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='baseLat' type=\"text\" name=\"baseLat\" required lay-verify=\"stationLat\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='baseLon' type=\"text\" name=\"baseLon\" required lay-verify=\"stationLon\" placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">大地高</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='baseHeight' type=\"text\" name=\"baseHeight\" required lay-verify=\"number|required\" placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex\" id=\"XYZ\" ></div>";
                break;
            case "basefilereturn":
                document.getElementById(select).innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>基站文件回传</div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='rawIp' type=\"text\" name=\"rawIp\" required lay-verify=\"ip|required\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label  \">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='rawPort' type=\"text\" name=\"rawPort\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
            case "devicestatus":
                document.getElementById(select).innerHTML = "         <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>设备状态回传</div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='resultIp' type=\"text\" name=\"resultIp\" required lay-verify=\"ip|required\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"Nodouble|required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
            case "statusresult":
                document.getElementById(select).innerHTML = "  <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>状态结果回传</div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='resultIp' type=\"text\" name=\"resultIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div id=\"statusresult2\" style=\"display: flex;margin-top: 30px\">\n" +
                    "                        </div>";
                break;
            case "observedata":
                document.getElementById(select).innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                        <div class=\"circle\"></div>\n" +
                    "                        <div>观测数据回传</div>\n" +
                    "                    </div>\n" +
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"observeip\" required lay-verify=\"ip|required\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label  \">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"observeport\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
            case "basechange":
                document.getElementById(select).innerHTML = "     <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>变形基准坐标</div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">纬度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesX' type=\"text\" name=\"coordinatesX\" disabled   placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesY' type=\"text\" name=\"coordinatesY\" disabled  placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">大地高</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesZ' type=\"text\" name=\"coordinatesZ\" disabled  placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
            case "basedownload":
                document.getElementById(select).innerHTML = "   <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>基站数据下载</div>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"layui-form-item\">\n" +
                    "                            <label class=\"layui-form-label\">启用双基站</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"checkbox\" id='doublebase' name=\"doublebase\" lay-filter=\"doublebase\" lay-skin=\"switch\">\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"layui-form-item\">\n" +
                    "                            <label class=\"layui-form-label\">数据来源</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"radio\" name=\"downloadsource\" lay-filter=\"downloadsource\" value=\"0\" title=\"基站文件\" checked>\n" +
                    "                                <input type=\"radio\" name=\"downloadsource\" lay-filter=\"downloadsource\" value=\"1\" title=\"CORS数据\">\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div id=\"downcontent\">\n" +
                    "                            <div id=\"base\">" +
                    " <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label basecoreindex\">基站IP地址</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"rawIp\" type=\"text\" name=\"rawIp\" required\n" +
                    "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label basecoreindex \">基站端口</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"rawPort\" type=\"text\" name=\"rawPort\" required\n" +
                    "                                               lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </div></div>\n" +
                    "                            <div id=\"cores\"></div>\n" +
                    "                            <div id=\"cores2\"></div>\n" +
                    "                            <div id=\"secondbase\"></div>\n" +
                    "                        </div>"
                break;
            case "rtksetting":
                document.getElementById(select).innerHTML = " <div class=\"layui-card\">\n" +
                    "                    <div class=\"layui-form layui-card-header layuiadmin-card-header-auto\" style=\"display: flex\">\n" +
                    "                        加密监测设置\n" +
                    "                    </div>\n" +
                    "                    <div class=\"layui-card-body\">\n" +
                    "                        <div style=\"display: flex\">\n" +
                    "                            <div class=\"layui-form-item\">\n" +
                    "                                <label style=\"width: 86px;padding: 9px 10px;\" class=\"layui-form-label\">启用RTK解算</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id=\"rtkturn\" type=\"checkbox\" lay-filter='rtkturn' name=\"rtkturn\" lay-skin=\"switch\" checked>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div id=\"coreselect\">\n" +
                    "                            </div>\n" +
                    "\n" +
                    "                        </div>\n" +
                    "\n" +
                    "                        <div id='rtkfront' style=\"display: flex;margin-top: 30px;margin-bottom: 20px\">\n" +
                    "                           <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">RTK解算设置</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <select id=\"rtkPos\" name=\"rtkPos\" lay-filter='rtkPos' lay-verify=\"required\">\n" +
                    "                                        <option value=\"1\">正常模式（5分钟输出）</option>\n" +
                    "                                        <option value=\"2\">紧急模式（1秒输出）</option>\n" +
                    "                                        <option value=\"3\">紧急模式（5秒输出）</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
                    "                                    <select id=\"imuWarn\" name=\"imuWarn\" lay-filter='imuWarn' lay-verify=\"required\">\n" +
                    "                                        <option value=\"0\">关闭</option>\n" +
                    "                                        <option value=\"0.3\">0.3度</option>\n" +
                    "                                        <option value=\"0.5\">0.5度</option>\n" +
                    "                                        <option value=\"1\">1度</option>\n" +
                    "                                        <option value=\"2\">2度</option>\n" +
                    "                                        <option value=\"3\">3度</option>\n" +
                    "                                        <option value=\"5\">5度</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div id=\"rtkcontent\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\" style='margin-top: 30px'>\n" +
                    "                                <label class=\"layui-form-label\">通信协议</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <select id=\"networkMode\" name=\"networkMode\" lay-filter='networkMode' lay-verify=\"required\" lay-filter='networkMode'>\n" +
                    "                                        <option value=\"NTRIP\">NTRIP</option>\n" +
                    "                                        <option value=\"PPP\">PPP</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
                    "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">端口</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
                    "                                               lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div style=\"display: flex;margin-top: 30px\" id='rtkmodeselect'>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </div>";
                break;
            case "rawdatareturn":
                document.getElementById(select).innerHTML = " <div class=\"layui-card\"> <div class=\"layui-form layui-card-header layuiadmin-card-header-auto\" style=\"display: flex\">\n" +
                    "                    原始数据回传\n" +
                    "                </div>\n" +
                    "                <div class=\"layui-card-body\">\n" +
                    "                    <div class=\"layui-form-item\">\n" +
                    "                        <label style=\"width: 104px;\" class=\"layui-form-label\">启用数据回传</label>\n" +
                    "                        <div class=\"layui-input-block\">\n" +
                    "                            <input id=\"rawdataturn\" type=\"checkbox\" name=\"rawdataturn\" lay-filter=\"rawdataturn\" lay-skin=\"switch\">\n" +
                    "                        </div>\n" +
                    "                    </div><div id='rawdatacontent'>\n"+
                    "<div class=\"layui-form-item  fastinput\">\n" +
                    "                            <label class=\"layui-form-label\">通讯设置</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <select id=\"rawBackEnabled\" name=\"rawBackEnabled\" lay-filter='rawBackEnabled' lay-verify=\"required\">\n" +
                    "                                    <option value=\"0\">关闭</option>\n" +
                    "                                    <option value=\"1\">TCP客户端</option>\n" +
                    "                                    <option value=\"2\">TCP服务端</option>\n" +
                    "                                    <option value=\"3\">Ntrip基站</option>\n" +
                    "                                    <option value=\"10\">RS485串口</option>\n" +
                    "                                    <option value=\"11\">RS232串口</option>\n" +
                    "                                </select>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"layui-form-item  fastinput\" style='margin-top: 30px'>\n" +
                    "                            <label class=\"layui-form-label\">数据类型</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <select id=\"rawBackGnssData\" name=\"rawBackGnssData\" lay-filter='rawBackGnssData' lay-verify=\"required\">\n" +
                    "                                    <option value=\"0\">GNSS原始数据</option>\n" +
                    "                                    <option value=\"1\">RTCM3.2数据</option>\n" +
                    "                                </select>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "<div id='rawdatabackcontent'>"+
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">IP地址</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id=\"rawBackAddress\" type=\"text\" name=\"rawBackAddress\" required\n" +
                    "                                           lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id=\"rawBackPort\" type=\"text\" name=\"rawBackPort\" required\n" +
                    "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div></div>";
                break;
            case "statusresult2":
                document.getElementById(select).innerHTML = "  <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 85px;padding: 9px 11px;\">结果回传协议</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left:110px \">\n" +
                    "                                    <select id=\"resultMsg\" name=\"resultMsg\" lay-filter='resultMsg' lay-verify=\"required\">\n" +
                    "                                        <option value=\"GEOPOS\">GEOPOS</option>\n" +
                    "                                        <option value=\"GEOSMS\">GEOSMS</option>\n" +
                    "                                        <option value=\"BDTL\">BDTL</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 132px\">内置传感器数据输出</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left: 162px\">\n" +
                    "                                    <select id=\"resultImu\" name=\"resultImu\" lay-filter='resultImu' lay-verify=\"required\">\n" +
                    "                                        <option value=\"0\">关闭</option>\n" +
                    "                                        <option value=\"60\">1分钟</option>\n" +
                    "                                        <option value=\"300\">5分钟</option>\n" +
                    "                                        <option value=\"600\">10分钟</option>\n" +
                    "                                        <option value=\"900\">15分钟</option>\n" +
                    "                                        <option value=\"1800\">30分钟</option>\n" +
                    "                                        <option value=\"3600\">1小时</option>\n" +
                    "                                        <option value=\"7200\">2小时</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 150px\">解算结果数据串口输出</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
                    "                                    <select id=\"resultRs232\" name=\"resultRs232\" lay-filter='resultRs232' lay-verify=\"required\">\n" +
                    "                                        <option value=\"0\">关闭</option>\n" +
                    "                                        <option value=\"9600\">(RS485)9600 bps</option>\n" +
                    "                                        <option value=\"38400\">(RS485)38400 bps</option>\n" +
                    "                                        <option value=\"115200\">(RS485)115200 bps</option>\n" +
                    "                                        <option value=\"-9600\">(RS232)9600 bps</option>\n" +
                    "                                        <option value=\"-38400\">(RS232)38400 bps</option>\n" +
                    "                                        <option value=\"-115200\">(RS232)115200 bps</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>";
                break;
            case "timerecord":
                document.getElementById(select).innerHTML = "<div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">记录时长</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <select id=\"recordInterval\" name=\"recordInterval\" lay-verify=\"required\">\n" +
                    "                                        <option value=\"3600\">1小时</option>\n" +
                    "                                        <option value=\"7200\">2小时</option>\n" +
                    "                                        <option value=\"14400\">4小时</option>\n" +
                    "                                        <option value=\"21600\">6小时</option>\n" +
                    "                                        <option value=\"28800\">8小时</option>\n" +
                    "                                        <option value=\"43200\">12小时</option>\n" +
                    "                                        <option value=\"86400\">24小时</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>"
                break;
        }

    }

    function changemark(type) {
            switch (type) {
                case "0":
                    document.getElementById("XYZ").innerHTML = "";
                    document.getElementById("BLH").innerHTML =  "<div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">纬度</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='baseLat' type=\"text\" name=\"baseLat\" required lay-verify=\"stationLat\" placeholder=\"请输入纬度\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">经度</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='baseLon' type=\"text\" name=\"baseLon\" required lay-verify=\"stationLon\" placeholder=\"请输入经度\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">大地高</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='baseHeight' type=\"text\" name=\"baseHeight\" required lay-verify=\"number|required\" placeholder=\"请输入大地高\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n";
                    break;
                case "1":
                    document.getElementById("BLH").innerHTML = "";
                    document.getElementById("XYZ").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">X</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='ecefx' type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入X坐标\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">Y</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='ecefy' type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入Y坐标\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label\">Z</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input id='ecefz' type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入Z坐标\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>";
                    break;
            }
            markcompute();
    }

    function changesoure(doubleturn, type) {
        doublebase=doubleturn;
        downloadsource=type;
        let rtknode = document.getElementById("rtkturn");
        let stationturn;
        if (doubleturn) {
            stationturn = 1;
        } else {
            stationturn = 0;
        }
        let order = stationturn + type;
        let childnodes = document.getElementById("downcontent");
        if (childnodes != null) {
            for (let i = 0; i < childnodes.childNodes.length; i++) {
                let childnode = childnodes.childNodes[i];
                childnode.innerHTML = "";
            }
            switch (order) {
                case "00":
                    document.getElementById("base").innerHTML = "   <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">基站IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawIp\" type=\"text\" name=\"rawIp\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \">基站端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawPort\" type=\"text\" name=\"rawPort\" required\n" +
                        "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    rtkshow(rtknode);
                    break;
                case "01":
                    document.getElementById("cores").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        " <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawntripaddress\" type=\"text\" name=\"rawntripaddress\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \"style='padding: 9px 4px;width: 93px;'>CORS①端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawntripport\" type=\"text\" name=\"rawntripport\" required\n" +
                        "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <input id=\"networkMountpoint1\" type=\"text\" name=\"networkMountpoint1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                        "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint1'>获取接入点</button>\n" +
                        "                                            <div id=\"corePoint1\" class=\"xm-select-demo\" style='width:140px'></div>\n" +                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"coreuse1\" type=\"text\" name=\"coreuse1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS①密码</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"corepass1\" type=\"text\" name=\"corepass1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    rtkshow(rtknode);
                    break;
                case "10":
                    document.getElementById("base").innerHTML = "<div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">基站IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawIp\" type=\"text\" name=\"rawIp\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \">基站端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawPort\" type=\"text\" name=\"rawPort\" required\n" +
                        "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    document.getElementById("secondbase").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex\" style='width: 98px;padding: 6px 6px;'>第二基站IP地址</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" id='secondIp' name=\"secondIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex \" style='width: 98px;padding: 6px 6px;'>第二基站端口</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" id='secondPort' name=\"secondPort\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>";
                    document.getElementById("secondbase").style.display = "flex";
                    document.getElementById("secondbase").style.marginTop = "30px";
                    rtkshow(rtknode);
                    break;
                case "11":
                    document.getElementById("cores").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawntripaddress\" type=\"text\" name=\"rawntripaddress\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \"style='padding: 9px 4px;width: 93px;'>CORS①端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawntripport\" type=\"text\" name=\"rawntripport\" required\n" +
                        "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <input id=\"networkMountpoint1\" type=\"text\" name=\"networkMountpoint1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                        "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint1'>获取接入点</button>\n" +
                        "                                            <div id=\"corePoint1\" class=\"xm-select-demo\" style='width: 140px'></div>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS①用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"coreuse1\" type=\"text\" name=\"coreuse1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS①密码</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"corepass1\" type=\"text\" name=\"corepass1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    document.getElementById("cores2").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"secondntripaddress\" type=\"text\" name=\"secondntripaddress\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"secondntripport\" type=\"text\" name=\"secondntripport\" required\n" +
                        "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <input id=\"secondMountpoint1\" type=\"text\" name=\"secondMountpoint1\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                        "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint2'>获取接入点</button>\n" +
                        "                                            <div id=\"corePoint2\" class=\"xm-select-demo\" style='width: 140px'></div>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\"style='padding: 9px 4px;width: 98px;' >CORS②用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"coreuse2\" type=\"text\" name=\"coreuse2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS②密码</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"corepass2\" type=\"text\" name=\"corepass2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>"
                    if (rtknode != null) {
                        document.getElementById("rtkcontent").innerHTML = "";
                    }
                    break;
            }
            $("#getConnectPoint1").click(function () {
                getConnectPoint();
            })
            $("#getConnectPoint2").click(function () {
                getConnectPoint2();
            })
            downloadsourceflush();
            rtkflush();
        }

    }

    /**动态删除表单项**/
    function removehtml(select) {
        if (formlist.includes(select)) {
            let node = document.getElementById(select);
            if (node != null) {
                document.getElementById(select).innerHTML = "";
            }

        }
    }

    function rtkshow(data) {
        if (data != null) {
            document.getElementById("coreselect").innerHTML = "";
            document.getElementById("rtkfront").innerHTML = rtkfront;
            document.getElementById("rtkcontent").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">通信协议</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\" lay-filter='networkMode'>\n" +
                "                                        <option value=\"NTRIP\">NTRIP</option>\n" +
                "                                        <option value=\"PPP\">PPP</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin-top: 30px\">\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">IP地址</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
                "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">端口</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
                "                                               lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin-top: 30px\" id='rtkmodeselect'>\n" +
                "                            </div>";
        }
        rtkcore();
    }

    function rtkflush() {
        if (device.rtkPos > 0) {
            rtkturn = true;
            $("#rtkturn").prop("checked", true);
            $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
            $("#imuWarn").find("option[value=" + device.imuWarn + "]").prop("selected", true);
            $("#networkMode").find("option[value=" + device.networkMode + "]").prop("selected", true);
            $("input[name='networkAddress']").val(device.networkAddress);
            $("input[name='networkPort']").val(device.networkPort);
            if(device.networkMountpointPass!=""&&device.networkMountpointPass!=null){
                let userpass=device.networkMountpointPass.toString().split("|");
                $("#networkMountpointUse").val(userpass[0]);
                $("#networkMountpointPass").val(userpass[1]);
            }
            $("#networkMountpoint3").val(device.networkMountpoint);
            $("#getConnectPoint3").click(function () {
                getConnectPoint3();
            })
        }
    }

    function markcompute(lat,lon,height,mark) {
        if(mark==1){
            $.ajax({
                url:'/devicelist/blhtoxyz',
                data:{
                    lat:lat,
                    lon:lon,
                    height:height
                },
                async:false,
                success:function(res){
                    let data=res.data;
                    try {
                        $("#ecefx").val(data.EcefX.toFixed(3));
                        $("#ecefy").val(data.EcefY.toFixed(3));
                        $("#ecefz").val(data.EcefZ.toFixed(3));
                        form.render();
                    } catch(err) {
                        //处理错误
                    }
                }
            })
        }else{
            $.ajax({
                url:'/devicelist/xyztoblh',
                data:{
                    x:lat,
                    y:lon,
                    z:height
                },
                async:false,
                success:function(res){
                    let data=res.data;
                    try {
                        $("#baseLat").val(data.DesB.toFixed(3));
                        $("#baseLon").val(data.DesL.toFixed(3));
                        $("#baseHeight").val(data.DesH.toFixed(3));
                        form.render();
                    } catch(err) {
                        //处理错误
                    }

                }
            })
        }

    }

    function downloadsourceflush() {
        $("#rawIp").val(device.rawIp);
        $("#rawPort").val(device.rawPort)
        $("#secondIp").val(device.secondIp);
        $("#secondPort").val(device.secondPort);
        $("#networkAddress").val(device.networkAddress);
        $("#networkPort").val(device.networkPort);
        let ntriparg=device.ntripArg;
        if(ntriparg!=""&&ntriparg!=null){
            let arg=ntriparg.split('|');
            $("#rawntripaddress").val(arg[0]);
            $("#rawntripport").val(arg[1]);
            $("#networkMountpoint1").val(arg[2]);
            $("#coreuse1").val(arg[3]);
            $("#corepass1").val(arg[4]);
        }
        let secondarg=device.secondArg;
        if(secondarg!=""&&secondarg!=null){
            let arg=secondarg.split('|');
            $("#secondntripaddress").val(arg[0]);
            $("#secondntripport").val(arg[1]);
            $("#secondMountpoint1").val(arg[2]);
            $("#coreuse2").val(arg[3]);
            $("#corepass2").val(arg[4]);
        }

    }

    /**原始数据回传刷新**/
    function rawdatabackflush(data) {
        if(data.value==0){
            document.getElementById("rawdatabackcontent").innerHTML = "";
            document.getElementById("rawdatabackcontent").innerHTML = "<div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器地址</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackAddress\" type=\"text\" name=\"rawBackAddress\" required\n" +
                "                                           lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                           autocomplete=\"off\" disabled class=\"layui-input layui-disabled\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器端口</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackPort\" type=\"text\" name=\"rawBackPort\" required\n" +
                "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                "                                           autocomplete=\"off\" disabled class=\"layui-input layui-disabled\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n";
            $("#rawBackAddress").val(device.rawBackAddress);
            $("#rawBackPort").val(device.rawBackPort);
        }
        if (data.value == 1 || data.value == 2) {
            document.getElementById("rawdatabackcontent").innerHTML = "";
            document.getElementById("rawdatabackcontent").innerHTML = "<div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器地址</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackAddress\" type=\"text\" name=\"rawBackAddress\" required\n" +
                "                                           lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器端口</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackPort\" type=\"text\" name=\"rawBackPort\" required\n" +
                "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n";
            $("#rawBackAddress").val(device.rawBackAddress);
            $("#rawBackPort").val(device.rawBackPort);
        }
        if (data.value == 3) {
            document.getElementById("rawdatabackcontent").innerHTML = "";
            document.getElementById("rawdatabackcontent").innerHTML = "<div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器地址</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackAddress\" type=\"text\" name=\"rawBackAddress\" required\n" +
                "                                           lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">服务器端口</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawBackPort\" type=\"text\" name=\"rawBackPort\" required\n" +
                "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>" +
                "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">接入点</label>\n" +
                "                                    <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                "                                            <input id=\"rawBackUser\" type=\"text\" name=\"rawBackUser\" required\n" +
                "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">密码</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input id=\"rawreturnpass\" type=\"text\" name=\"rawBackPass\" required\n" +
                "                                           lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n";
            $("#rawBackAddress").val(device.rawBackAddress);
            $("#rawBackPort").val(device.rawBackPort);
            let user=(device.rawBackUser!=null)?device.rawBackUser:"";
            let pass=(device.rawBackPass!=null)?device.rawBackPass:"";
            $("#rawreturnuser").val(user);
            $("#rawreturnpass").val(pass);
        }
        if (data.value == 10 || data.value == 11) {
            document.getElementById("rawdatabackcontent").innerHTML = "";
            document.getElementById("rawdatabackcontent").innerHTML =
                "<div style=\"display: flex;margin-top: 30px\">\n" +
                " <div class=\"layui-form-item\">\n" +
                "            <label class=\"layui-form-label\">串口波特率</label>\n" +
                "            <div class=\"layui-input-block\">\n" +
                "                <div style=\"width: 70%\">\n" +
                "                    <select id=\"rawreturnbaud\" name=\"rawBackBaud\" lay-filter=\"type\" style=\"width: 70%\">\n" +
                "                        <option value=\"4800\">4800 bps</option>\n" +
                "                        <option value=\"9600\" selected>9600 bps</option>\n" +
                "                        <option value=\"19200\">19200 bps</option>\n" +
                "                        <option value=\"38400\">38400 bps</option>\n" +
                "                        <option value=\"57600\">57600 bps</option>\n" +
                "                        <option value=\"115200\">115200 bps</option>\n" +
                "                    </select>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>" +
                "                        </div>";
            let baud=(device.rawBackBaud!=null)?device.rawBackBaud:"";
            $("#rawreturnbaud").val(baud);
        }
    }

    /**判断rtk mode模式*/
    function judgertkmode(data){
        if(document.getElementById("rtkmodeselect")!=null){
            if(data=="NTRIP"){
                document.getElementById("rtkmodeselect").innerHTML="<div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">接入点</label>\n" +
                    "                                    <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                    "                                            <input id=\"networkMountpoint3\" type=\"text\" name=\"networkMountpoint\" required\n" +
                    "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                    "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                    "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint3'>获取接入点</button>\n" +
                    "                                            <div id=\"corePoint3\" class=\"xm-select-demo\" style='width:140px'></div>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">用户名</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
                    "                                               lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">密码</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
                    "                                               lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n";
                $("#networkMountpoint3").val(device.networkMountpoint);
                if(device.networkMountpointPass!=""&&device.networkMountpointPass!=null){
                    let userpass=device.networkMountpointPass.toString().split("|");
                    $("#networkMountpointUse").val(userpass[0]);
                    $("#networkMountpointPass").val(userpass[1]);
                }
                $("#getConnectPoint3").click(function () {
                    getConnectPoint3();
                })
            }else{
                document.getElementById("rtkmodeselect").innerHTML="";
            }
        }
    }

    /*判断是否插入core选择框*/
    function rtkcore(doublebase,download,rtkturn) {
        if(station==0&&compute==0){
            let base = doublebase;
            let source = download;
            let turn = rtkturn;
            let mode=$("#networkMode").val();
            if (base && source == 1 && turn) {
                document.getElementById("coreselect").innerHTML = "  <label class=\"layui-form-label\"></label>\n" +
                    "     <div class=\"layui-input-block\">\n" +
                    "          <input type=\"checkbox\" id='coredata1' name=\"coredata\"  lay-filter=\"coresource\" title=\"与CORS①数据同源\" lay-skin=\"primary\"  value=\"0\"  checked>"+
                    "          <input type=\"checkbox\" id='coredata2' name=\"coredata\"  lay-filter=\"coresource\" title=\"与CORS②数据同源\" lay-skin=\"primary\"  value=\"1\" >"+
                    "    </div>";
                document.getElementById("rtkfront").style.display = "flex";
                document.getElementById("rtkcontent").innerHTML = "";
                document.getElementById("rtkfront").innerHTML = computefunc.rtkpiror;
            } else if ((!base && source == 0 && turn) || (base && source == 0 && turn)) {
                document.getElementById("rtkfront").innerHTML = "";
                document.getElementById("rtkfront").innerHTML =  computefunc.rtkpiror;
                computefunc.decidertkmode(mode);
            } else if (!base && source == 1 && turn) {
                document.getElementById("rtkfront").innerHTML = "";
                document.getElementById("rtkfront").innerHTML =  computefunc.rtkpiror;
                computefunc.decidertkmode(mode);
            } else {
                document.getElementById("coreselect").innerHTML = "";
                // document.getElementById("rtkfront").innerHTML = "";
            }
        }
    }


    var rtkfront = "<div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">RTK解算设置</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"rtkPos\" name=\"rtkPos\" lay-filter='rtkPos' lay-verify=\"required\">\n" +
        "                                        <option value=\"1\">正常模式（5分钟输出）</option>\n" +
        "                                        <option value=\"2\">紧急模式（1秒输出）</option>\n" +
        "                                        <option value=\"3\">紧急模式（5秒输出）</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
        "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
        "                                    <select id=\"imuWarn\" name=\"imuWarn\" lay-filter='imuWarn' lay-verify=\"required\">\n" +
        "                                        <option value=\"0\">关闭</option>\n" +
        "                                        <option value=\"0.3\">0.3度</option>\n" +
        "                                        <option value=\"0.5\">0.5度</option>\n" +
        "                                        <option value=\"1\">1度</option>\n" +
        "                                        <option value=\"2\">2度</option>\n" +
        "                                        <option value=\"3\">3度</option>\n" +
        "                                        <option value=\"5\">5度</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>";

    var rtkcontent = " <div style=\"display: flex;margin-top: 30px;margin-bottom: 20px\">\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">RTK解算设置</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <select id=\"rtkPos\" name=\"rtkPos\" lay-filter='rtkPos' lay-verify=\"required\">\n" +
        "                                            <option value=\"1\">正常模式（5分钟输出）</option>\n" +
        "                                            <option value=\"2\">紧急模式（1秒输出）</option>\n" +
        "                                            <option value=\"3\">紧急模式（5秒输出）</option>\n" +
        "                                        </select>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\"style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
        "                                    <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
        "                                        <select id=\"imuWarn\" name=\"imuWarn\" lay-filter='imuWarn' lay-verify=\"required\">\n" +
        "                                            <option value=\"0\">关闭</option>\n" +
        "                                            <option value=\"0.3\">0.3度</option>\n" +
        "                                            <option value=\"0.5\">0.5度</option>\n" +
        "                                            <option value=\"1\">1度</option>\n" +
        "                                            <option value=\"2\">2度</option>\n" +
        "                                            <option value=\"3\">3度</option>\n" +
        "                                            <option value=\"5\">5度</option>\n" +
        "                                        </select>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">通信协议</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\" lay-filter='networkMode'>\n" +
        "                                        <option value=\"NTRIP\">NTRIP</option>\n" +
        "                                        <option value=\"PPP\">PPP</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div style=\"display: flex;margin-top: 30px\">\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">IP地址</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
        "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">端口</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
        "                                               lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div style=\"display: flex;margin-top: 30px\" id='rtkmodeselect'>\n" +
        "                            </div>";

    var rtkcorecontent= " <div style=\"display: flex;margin-top: 30px;margin-bottom: 20px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">通信协议</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\" lay-filter='networkMode'>\n" +
        "                                        <option value=\"NTRIP\">NTRIP</option>\n" +
        "                                        <option value=\"PPP\">PPP</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div></div>\n" +
        "                            <div style=\"display: flex;margin-top: 30px\">\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">IP地址</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
        "                                               lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">端口</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
        "                                               lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div style=\"display: flex;margin-top: 30px\" id='rtkmodeselect'>\n" +
        "                            </div>";

    var rawdatacontent = "<div class=\"layui-form-item  fastinput\">\n" +
        "                            <label class=\"layui-form-label\">通讯设置</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <select id=\"rawBackEnabled\" name=\"rawBackEnabled\" lay-filter='rawBackEnabled' lay-verify=\"required\">\n" +
        "                                    <option value=\"0\">关闭</option>\n" +
        "                                    <option value=\"1\">TCP客户端</option>\n" +
        "                                    <option value=\"2\">TCP服务端</option>\n" +
        "                                    <option value=\"3\">Ntrip基站</option>\n" +
        "                                    <option value=\"10\">RS485串口</option>\n" +
        "                                    <option value=\"11\">RS232串口</option>\n" +
        "                                </select>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div class=\"layui-form-item  fastinput\" style='margin-top: 30px'>\n" +
        "                            <label class=\"layui-form-label\">数据类型</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <select id=\"rawBackGnssData\" name=\"rawBackGnssData\" lay-filter='rawBackGnssData' lay-verify=\"required\">\n" +
        "                                    <option value=\"0\">GNSS原始数据</option>\n" +
        "                                    <option value=\"1\">RTCM3.2数据</option>\n" +
        "                                </select>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "<div id='rawdatabackcontent'>"+
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">IP地址</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id=\"rawBackAddress\" type=\"text\" name=\"rawBackAddress\" required\n" +
        "                                           lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\">端口</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id=\"rawBackPort\" type=\"text\" name=\"rawBackPort\" required\n" +
        "                                           lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div></div>";


    var computefunc={
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        ConnectPoint:function () {
            getConnectPoint()
        },
        ConnectPoint2:function () {
            getConnectPoint2()
        },
        ConnectPoint3:function () {
            getConnectPoint3()
        },
        exhibitform:function (form1,form2,form3,form4,data1,data2,sn) {
            showform(form1,form2,form3,form4,data1,data2);
            getDeviceSetting(sn);
        },
        altersource:function (doubleturn, type) {
            changesoure(doubleturn,type)
        },
        altermark:function (mark) {
            changemark(mark);
        },
        decidertkmode:function(mode){
            judgertkmode(mode);
        },
        rtkcores:function(base,source,turn){
            rtkcore(base,source,turn);
        },
        delhtml:function(select){
            removehtml(select);
        },
        rtkupdate:function(){
            rtkflush();
        },
        rawdatabackupdate:function(data){
            rawdatabackflush(data);
        },
        inserthtml:function(data){
            innhtml(data);
        },
        downloadsourceupdate:function(){
            downloadsourceflush();
        },
        setdevic:function(data){
            Object.assign(device,data);
        },
        computemark:function(lat,lon,height,mark){
            markcompute(lat,lon,height,mark);
        },
        rawdatatxt:rawdatacontent,
        rtkcoretxt:rtkcorecontent,
        rtktxt:rtkcontent,
        rtkpiror:rtkfront,

    }
    exports('station_compute_func', computefunc)
});