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
    var ntriparg;
    var secondarg;
    var form21 = ["devicestatus", "observedata"];
    var form22 = ["statusresult", "observedata"];
    var form12 = ["statusresult","basechange","basedownload","timerecord"];
    var form11 = ["basestation", "devicestatus", "basefilereturn","timerecord"];
    var formlist = ["basestation", "devicestatus", "basefilereturn", "basechange", "statusresult", "basedownload", "observedata","timerecord"];
    var beforeform;
    var compute = 0;
    var station = 0;
    var mark = 0;
    var doublebase = false;//双基站开关
    var downloadsource = 0;//基站数据来源的数据来源单选
    var layerindex;

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

    function DeviceSetFlush() {
        $("#machineSerial").val(device.machineSerial);
        $("#baseLon").val(device.baseLon);
        $("#baseLat").val(device.baseLat);
        if ($("#recordinterval") != null&&device.recordInterval!="") {
            $("#recordInterval").find("option[value=" + device.recordInterval + "]").prop("selected", true);
        }
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
        if(device.rawRate!=null&device.rawRate!=""){
            $("#selectList").find("option[value=" + device.rawRate + "]").prop("selected", true);
        }
        form.render();
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
        form.render();
    }

    function showform(data1, data2) {
        let no = data1.toString()
        let no1 = data2.toString();
        let no2 = no + no1;
        switch (no2) {
            case "02":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form11.length; k++) {
                            if (beforeform[i] != form11[k]) {
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form11;
                for (let i = 0; i < form11.length; i++) {
                    innhtml(form11[i]);
                }
                break;
            case "00":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form12.length; k++) {
                            if (beforeform[i] != form12[k]) {
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form12;
                for (let i = 0; i < form12.length; i++) {
                    innhtml(form12[i]);
                }

                break;
            case "12":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form21.length; k++) {
                            if (beforeform[i] != form21[k]) {
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form21;
                for (let i = 0; i < form21.length; i++) {
                    innhtml(form21[i]);
                }

                break;
            case "10":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        for (let k = 0; k < form22.length; k++) {
                            if (beforeform[i] != form22[k]) {
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform = form22;
                for (let i = 0; i < form22.length; i++) {
                    innhtml(form22[i]);
                }
                break;
        }
        getDeviceSetting(machinesn);
        form.render();
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
                document.getElementById(select).innerHTML = "     <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>状态结果回传</div>\n" +
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
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"Ndouble|required|port\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
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
                    "                                    <input id='rawIp' type=\"text\" name=\"rawIp\" required lay-verify=\"ip|required\" placeholder=\"请输入IP地址\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label  \">端口</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id=\"rawPort\" type=\"text\" name=\"rawPort\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
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
                    "                        <div class=\"layui-form-item  fastinput\" style=\"margin-top: 30px\">\n" +
                    "                            <label class=\"layui-form-label\">坐标类型</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <input type=\"radio\" lay-filter=\"mark2\" name=\"marktype\" value=\"0\" title=\"BLH\" >\n" +
                    "                                <input type=\"radio\" lay-filter=\"mark2\" name=\"marktype\" value=\"1\" title=\"XYZ\" checked>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex\" id=\"BLH\" >\n" +
                    "                           <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">X</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesX' type=\"text\" name=\"coordinatesX\" disabled   placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Y</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesY' type=\"text\" name=\"coordinatesY\" disabled  placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Z</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesZ' type=\"text\" name=\"coordinatesZ\" disabled  placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex\" id=\"XYZ\" ></div>";
                break;
            case "basedownload":
                document.getElementById(select).innerHTML = "   <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"circle\"></div>\n" +
                    "                            <div>基站数据下载</div>\n" +
                    "                        </div>\n" +
                    // "                        <div class=\"layui-form-item\">\n" +
                    // "                            <label class=\"layui-form-label\">启用双基站</label>\n" +
                    // "                            <div class=\"layui-input-block\">\n" +
                    // "                                <input type=\"checkbox\" name=\"doublebase\" lay-filter=\"doublebase\" id='doublebase' lay-skin=\"switch\">\n" +
                    // "                            </div>\n" +
                    // "                        </div>\n" +
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
            case "timerecord":
                document.getElementById(select).innerHTML = "<div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">记录时长</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <select id=\"recordInterval\" name=\"recordInterval\" lay-filter='recordInterval' lay-verify=\"required\">\n" +
                    "                                        <option value=\"\"></option>\n" +
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
    }

    function changemarkalter(type) {
        switch (type) {
            case "0":
                document.getElementById("XYZ").innerHTML = "";
                document.getElementById("BLH").innerHTML = "<div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">纬度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='ecefLat' type=\"text\" name=\"baseLat\" disabled required lay-verify=\"stationLat\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='ecefLon' type=\"text\" name=\"baseLon\" disabled required lay-verify=\"stationLon\" placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">大地高</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='ecefHeight' type=\"text\" name=\"baseHeight\" disabled required lay-verify=\"number|required\" placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n";
                break;
            case "1":
                document.getElementById("BLH").innerHTML = "";
                document.getElementById("XYZ").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">X</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesX' type=\"text\" name=\"title\" disabled required lay-verify=\"required\" placeholder=\"请输入X坐标\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Y</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesY' type=\"text\" name=\"title\" disabled required lay-verify=\"required\" placeholder=\"请输入Y坐标\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Z</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesZ' type=\"text\" name=\"title\" disabled required lay-verify=\"required\" placeholder=\"请输入Z坐标\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>";
                break;
        }
        mark2compute();
    }

    function changesoure(doubleturn, type){
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
                        "                                            <input id=\"networkMountpoint1\" type=\"text\" name=\"networkMountpoint1\" lay-filter='networkMountpoint1' required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                        "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint1'>获取接入点</button>\n" +
                        "                                            <div id=\"corePoint1\" class=\"xm-select-demo\" style='width:150px'></div>\n" +
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
                    // document.getElementById("secondbase").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                <label class=\"layui-form-label basecoreindex\" style='width: 98px;padding: 6px 6px;'>第二基站IP地址</label>\n" +
                    //     "                                <div class=\"layui-input-block\">\n" +
                    //     "                                    <input type=\"text\" id='secondIp' name=\"secondIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    //     "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                </div>\n" +
                    //     "                            </div>\n" +
                    //     "                            <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                <label class=\"layui-form-label basecoreindex \" style='width: 98px;padding: 6px 6px;'>第二基站端口</label>\n" +
                    //     "                                <div class=\"layui-input-block\">\n" +
                    //     "                                    <input type=\"text\" id='secondPort' name=\"secondPort\" required lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    //     "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                </div>\n" +
                    //     "                            </div>";
                    // document.getElementById("secondbase").style.display = "flex";
                    // document.getElementById("secondbase").style.marginTop = "30px";
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
                        "                                            <div id=\"corePoint1\" class=\"xm-select-demo\" style='width: 150px'></div>\n" +
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
                    // document.getElementById("cores2").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                    //     "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP地址</label>\n" +
                    //     "                                        <div class=\"layui-input-block\">\n" +
                    //     "                                            <input id=\"secondntripaddress\" type=\"text\" name=\"secondntripaddress\" required\n" +
                    //     "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                    //     "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                        </div>\n" +
                    //     "                                    </div>\n" +
                    //     "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②IP端口</label>\n" +
                    //     "                                        <div class=\"layui-input-block\">\n" +
                    //     "                                            <input id=\"secondntripport\" type=\"text\" name=\"secondntripport\" required\n" +
                    //     "                                                   lay-verify=\"required|port\" placeholder=\"请输入端口\"\n" +
                    //     "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                        </div>\n" +
                    //     "                                    </div>\n" +
                    //     "                                </div>\n" +
                    //     "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                    //     "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 98px;'>CORS②接入点</label>\n" +
                    //     "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                    //     "                                            <input id=\"secondMountpoint1\" type=\"text\" name=\"secondMountpoint1\" lay-filter='secondMountpoint1' required\n" +
                    //     "                                                   lay-verify=\"required\" placeholder=\"请输入接入点\"\n" +
                    //     "                                                   autocomplete=\"off\" class=\"layui-input\" style='width: 150px'>\n" +
                    //     "                                            <button type='button' class=\"layui-btn btn_primary\" id='getConnectPoint2'>获取接入点</button>\n" +
                    //     "                                            <div id=\"corePoint2\" class=\"xm-select-demo\" style='width: 150px'></div>\n" +
                    //     "                                        </div>\n" +
                    //     "                                    </div>\n" +
                    //     "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                        <label class=\"layui-form-label basecoreindex\"style='padding: 9px 4px;width: 98px;' >CORS②用户名</label>\n" +
                    //     "                                        <div class=\"layui-input-block\">\n" +
                    //     "                                            <input id=\"coreuse2\" type=\"text\" name=\"coreuse2\" required\n" +
                    //     "                                                   lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                    //     "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                        </div>\n" +
                    //     "                                    </div>\n" +
                    //     "                                    <div class=\"layui-form-item  fastinput\">\n" +
                    //     "                                        <label class=\"layui-form-label basecoreindex\" style='padding: 9px 4px;width: 93px;'>CORS②密码</label>\n" +
                    //     "                                        <div class=\"layui-input-block\">\n" +
                    //     "                                            <input id=\"corepass2\" type=\"text\" name=\"corepass2\" required\n" +
                    //     "                                                   lay-verify=\"required\" placeholder=\"请输入密码\"\n" +
                    //     "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                    //     "                                        </div>\n" +
                    //     "                                    </div>\n" +
                    //     "                                </div>"
                    break;
            }
            $("#getConnectPoint1").click(function () {
                getConnectPoint();
            })
            $("#getConnectPoint2").click(function () {
                getConnectPoint2();
            })
            downloadsourceflush();
        }
    }

    /**动态删除表单项**/
    function removehtml(select) {
        if (formlist.includes(select)) {
            document.getElementById(select).innerHTML = "";
        }
    }

    var fastsettingfunc={
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        ConnectPoint:function () {
            getConnectPoint()
        },
        ConnectPoint2:function () {
            getConnectPoint2()
        },
        exhibitform:function (form1,form2,form3,form4,data1,data2,sn) {
            showform(form1,form2,form3,form4,data1,data2);
            form.render();
        },
        altersource:function (doubleturn, type) {
            changesoure(doubleturn,type)
        },
        altermark:function (mark) {
            changemark(mark);
        },
        delhtml:function(select){
            removehtml(select);
        },
        inserthtml:function(data){
            innhtml(data);
        },
        setdevice:function(data){
            Object.assign(device,data);
        },
        computemark:function(lat,lon,height,mark){
            markcompute(lat,lon,height,mark);
        }
    }
    exports('station_fastsetting_func',fastsettingfunc)
});