layui.define(['element', 'form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , drawer = layui.drawer
        , table = layui.table
        , table2 = layui.table
        , element = layui.element;


    var device;
    var form21 = ["basestation", "devicestatus", "observedata", "rawdatareturn"];
    var form22 = ["statusresult", "observedata", "rtksetting", "rawdatareturn"];
    var form12 = ["basechange", "statusresult", "statusresult2", "timerecord", "basedownload", "rawdatareturn", "rtksetting"];
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

    form.verify({
        ip: [
            /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            , 'IP地址不符合规则'
        ],
        title: function (value) {
            if (value.length < 5) {
                return '标题至少得5个字符啊';
            }
        }
        , Ndouble: [
            /^[1-9]\d*$/
            , '只能输入整数哦'
        ]
        , Lon: [
            /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,2})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,2}|180)$/
            , '经度输入有误'
        ]
        , Lat: [
            /^([0-8]?\d{1}\.\d{2}|90\.0{2}|[0-8]?\d{1}|90)$/
            , '纬度输入有误'
        ]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        , content: function (value) {
            layedit.sync(editIndex);
        }
    });
    getDeviceSetting(machinesn);
    showform(0, 2);

    form.on('radio(compute)', function (data) {
        compute = data.value;
        showform(compute, station);
    });
    form.on('radio(station)', function (data) {
        station = data.value;
        showform(compute, station);
    });
    form.on('radio(mark)', function (data) {
        mark = data.value;
        changemark(mark);
    });
    form.on('radio(downloadsource)', function (data) {
        downloadsource = data.value;
        changesoure(doublebase, downloadsource);
        rtkcore();
    })
    /*监听双基站按钮*/
    form.on('switch(doublebase)', function (data) {
        if (this.checked) {
            doublebase = true;

        } else {
            doublebase = false;
        }
        let source = $('input[name="downloadsource"]:checked').val();
        changesoure(doublebase, source);
        rtkcore()
    })
    /*监听rtk数据按钮*/
    form.on('switch(rtkturn)', function (data) {
        if (this.checked) {
                rtkturn = true;
                document.getElementById("rtkcontent").innerHTML = rtkcontent;
                document.getElementById("rtkcontent").style.display = "block";
                document.getElementById("rtkcontent").style.marginTop = "30px";
        } else {
                rtkturn = false;
                document.getElementById("rtkfront").innerHTML=""
                document.getElementById("rtkfront").style.display = "none";
                document.getElementById("rtkcontent").innerHTML = "";
                document.getElementById("rtkcontent").style.display = "none";
        }
        rtkcore();
        form.render();
    })
    /*监听原始数据回传按钮*/
    form.on('switch(rawdataturn)', function (data) {
        if (this.checked) {
            rawdataturn = true;
            document.getElementById("rawdatacontent").innerHTML = rawdatacontent;
            document.getElementById("rawdatacontent").style.display = "block";
            document.getElementById("rawdatacontent").style.marginTop = "30px";
        } else {
            rawdataturn = false;
            document.getElementById("rawdatacontent").innerHTML = "";
            document.getElementById("rawdatacontent").style.display = "none";
        }
        form.render();
    })
    /*监听原始数据回传的通信设置*/
    form.on('select(rawBackEnabled)',function (data) {

    })
    /*监听表单提交*/
    form.on('submit(formDemo)', function (data) {
        let test = data.field;
        let stringtest = JSON.stringify(test);
        debugger;
        $.ajax({
            url: '/devicelist/editSetting',
            data: {
                setting: stringtest,
                machinesn: machinesn
            },
            success: function (data) {
                getDeviceSetting(machinesn);
                alert(data.data);
            }
        })
    })

    /*获取配置数据*/
    function getDeviceSetting(sn) {
        $.ajax({
            url: '/devicelist/getDeviceSetting',
            data: {
                machineSerial: sn
            },
            success: function (data) {
                device = data.data;
                $("#machineSerial").val(device.machineSerial);
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
                if (device.rtkPos > 0) {
                    rtkturn=true;
                    $("#rtkturn").prop("checked", true);
                    $("#rtkPos").find("option[value=" + device.rtkPos + "]").prop("selected", true);
                    $("#imuWarn").find("option[value=" + device.imuWarn + "]").prop("selected", true);
                    $("#networkMode").find("option[value=" + device.networkMode + "]").prop("selected", true);
                    $("#networkAddress").val(device.networkAddress);
                    $("#networkPort").val(device.networkPort);
                    $("#networkMountpoint").find("option[value=" + device.networkMountpoint + "]").prop("selected", true);
                }
                if (device.rawBackEnabled > 0) {
                    $("#rawdataturn").attr("checked", "checked");
                    $("#rawBackEnabled").find("option[value=" + device.rawBackEnabled + "]").prop("selected", true);
                    $("#rawBackGnssData").find("option[value=" + device.rawBackGnssData + "]").prop("selected", true);
                    $("#rawBackAddress").val(device.rawBackAddress);
                    $("#rawBackPort").val(device.rawBackPort);
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
                form.render();
                // let userpass=device.networkMountpointPass.toString().split("|");
                // $("#networkMountpointUse").val(userpass[0]);
                // $("#networkMountpointPass").val(userpass[1]);

            }
        })
    }


    /*根据单选按钮组的变化显示不同内容*/
    function showform(data1, data2) {
        let no = data1.toString()
        let no1 = data2.toString();
        let no2 = no + no1;
        switch (no2) {
            case "02":
                if (beforeform != null) {
                    for (let i = 0; i < beforeform.length; i++) {
                        if (!form11.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
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
                        if (!form12.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
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
                        if (!form21.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
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
                        if (!form22.includes(beforeform[i])) {
                            removehtml(beforeform[i]);
                        }
                    }
                }
                beforeform = form22;
                for (let i = 0; i < form22.length; i++) {
                    innhtml(form22[i]);
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
                    "                            <div>基准站坐标\n" +
                    "                                <button style=\"margin-left: 50px\" class=\"layui-btn btn_primary\">获取当前坐标</button>\n" +
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
                    "                                    <input id='baseLon' type=\"text\" name=\"baseLon\" required lay-verify=\"stationLat\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='baseLat' type=\"text\" name=\"baseLat\" required lay-verify=\"stationLon\" placeholder=\"请输入经度\"\n" +
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
                    "                                    <input id='rawPort' type=\"text\" name=\"rawPort\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"Nodouble|required\" placeholder=\"请输入端口\"\n" +
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
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                    "                                    <input type=\"text\" name=\"observeport\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                    "                                    <input id='coordinatesX' type=\"text\" name=\"coordinatesX\" required lay-verify=\"required\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesY' type=\"text\" name=\"coordinatesY\" required lay-verify=\"required\" placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input layui-disabled\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">大地高</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='coordinatesZ' type=\"text\" name=\"coordinatesZ\" required lay-verify=\"required\" placeholder=\"请输入大地高\"\n" +
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
                    "                                <input type=\"checkbox\" name=\"doublebase\" lay-filter=\"doublebase\" lay-skin=\"switch\">\n" +
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
                    "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                    "                                    <select id=\"rtkPos\" name=\"rtkPos\" lay-verify=\"required\">\n" +
                    "                                        <option value=\"1\">正常模式（5分钟输出）</option>\n" +
                    "                                        <option value=\"2\">紧急模式（1秒输出）</option>\n" +
                    "                                        <option value=\"3\">紧急模式（5秒输出）</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
                    "                                    <select id=\"imuWarn\" name=\"imuWarn\" lay-verify=\"required\">\n" +
                    "                                        <option value=\"0\">关闭</option>\n" +
                    "                                        <option value=\"0.3\">0.3度</option>\n" +
                    "                                        <option value=\"0.5\">0.5度</option>\n" +
                    "                                        <option value=\"1\">1度</option>\n" +
                    "                                        <option value=\"2\">2度</option>\n" +
                    "                                        <option value=\"3\">3度</option>\n" +
                    "                                        <option value=\"5\">5度</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n"+
                    "                        </div>\n" +
                    "                        <div id=\"rtkcontent\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">通信协议</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\">\n" +
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
                    "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">接入点</label>\n" +
                    "                                    <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                    "                                        <select id=\"networkMountpoint\" name=\"networkMountpoint\" lay-verify=\"required\">\n" +
                    "                                            <option value=\"0\">关闭</option>\n" +
                    "                                            <option value=\"0.3\">0.3度</option>\n" +
                    "                                            <option value=\"0.5\">0.5度</option>\n" +
                    "                                        </select>\n" +
                    "                                        <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">用户名</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
                    "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"layui-form-item  fastinput\">\n" +
                    "                                    <label class=\"layui-form-label\">端口</label>\n" +
                    "                                    <div class=\"layui-input-block\">\n" +
                    "                                        <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
                    "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
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
                    "                    </div>\n" +
                    "                    <div id=\"rawdatacontent\">\n" +
                    "                        <div class=\"layui-form-item  fastinput\">\n" +
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
                    "                        <div class=\"layui-form-item  fastinput\">\n" +
                    "                            <label class=\"layui-form-label\">数据类型</label>\n" +
                    "                            <div class=\"layui-input-block\">\n" +
                    "                                <select id=\"rawBackGnssData\" name=\"rawRate\" lay-verify=\"required\">\n" +
                    "                                    <option value=\"0\">GNSS原始数据</option>\n" +
                    "                                    <option value=\"1\">RTCM3.2数据</option>\n" +
                    "                                </select>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div>\n"+
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
                    "                                           lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                   \n" +
                    "                </div> </div>\n";
                break;
            case "statusresult2":
                document.getElementById(select).innerHTML = "  <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 85px;padding: 9px 11px;\">结果回传协议</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left:110px \">\n" +
                    "                                    <select id=\"resultMsg\" name=\"resultMsg\" lay-verify=\"required\">\n" +
                    "                                        <option value=\"GEOPOS\">GEOPOS</option>\n" +
                    "                                        <option value=\"GEOSMS\">GEOSMS</option>\n" +
                    "                                        <option value=\"BDTL\">BDTL</option>\n" +
                    "                                    </select>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\" style=\"width: 132px\">内置传感器数据输出</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"margin-left: 162px\">\n" +
                    "                                    <select id=\"resultImu\" name=\"resultImu\" lay-verify=\"required\">\n" +
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
                    "                                    <select id=\"resultRs232\" name=\"resultRs232\" lay-verify=\"required\">\n" +
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
        getDeviceSetting(machinesn);
        form.render();
    }

    function changemark(type) {
        switch (type) {
            case "0":
                document.getElementById("XYZ").innerHTML = "";
                document.getElementById("BLH").innerHTML = "  <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">纬度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"Lat\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">经度</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"Lon\" placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">大地高</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"Ndouble|required\" placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>";
                break;
            case "1":
                document.getElementById("BLH").innerHTML = "";
                document.getElementById("XYZ").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">X</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入纬度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Y</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入经度\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">Z</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input type=\"text\" name=\"title\" required lay-verify=\"required\" placeholder=\"请输入大地高\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>";
                break;
        }
        getDeviceSetting(machinesn);
    }

    function changesoure(doubleturn, type) {
        let rtknode=document.getElementById("rtkturn");
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
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    rtkshow(rtknode);
                    break;
                case "01":
                    document.getElementById("cores").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawIp2\" type=\"text\" name=\"rawIp2\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \">CORS①端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawPort2\" type=\"text\" name=\"rawPort2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <select id=\"networkMountpoint\" name=\"networkMountpoint\" lay-verify=\"required\">\n" +
                        "                                                <option value=\"0\">关闭</option>\n" +
                        "                                                <option value=\"0.3\">0.3度</option>\n" +
                        "                                                <option value=\"0.5\">0.5度</option>\n" +
                        "                                            </select>\n" +
                        "                                            <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    document.getElementById("secondbase").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex\">第二基站IP地址</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" name=\"secondIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"layui-form-item  fastinput\">\n" +
                        "                                <label class=\"layui-form-label basecoreindex \">第二基站端口</label>\n" +
                        "                                <div class=\"layui-input-block\">\n" +
                        "                                    <input type=\"text\" name=\"secondPort\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
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
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawIp2\" type=\"text\" name=\"rawIp2\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex \">CORS①端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"rawPort2\" type=\"text\" name=\"rawPort2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <select id=\"networkMountpoint\" name=\"networkMountpoint\" lay-verify=\"required\">\n" +
                        "                                                <option value=\"0\">关闭</option>\n" +
                        "                                                <option value=\"0.3\">0.3度</option>\n" +
                        "                                                <option value=\"0.5\">0.5度</option>\n" +
                        "                                            </select>\n" +
                        "                                            <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS①IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    document.getElementById("cores2").innerHTML = " <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS②IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkAddress\" type=\"text\" name=\"networkAddress\" required\n" +
                        "                                                   lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS②IP端口</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkPort\" type=\"text\" name=\"networkPort\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <div style=\"display: flex;margin-top: 30px\">\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS②接入点</label>\n" +
                        "                                        <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                        "                                            <select id=\"networkMountpoint2\" name=\"networkMountpoint2\" lay-verify=\"required\">\n" +
                        "                                                <option value=\"0\">关闭</option>\n" +
                        "                                                <option value=\"0.3\">0.3度</option>\n" +
                        "                                                <option value=\"0.5\">0.5度</option>\n" +
                        "                                            </select>\n" +
                        "                                            <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\" >CORS②用户名</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointUse2\" type=\"text\" name=\"networkMountpointUse2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"layui-form-item  fastinput\">\n" +
                        "                                        <label class=\"layui-form-label basecoreindex\">CORS②IP地址</label>\n" +
                        "                                        <div class=\"layui-input-block\">\n" +
                        "                                            <input id=\"networkMountpointPass2\" type=\"text\" name=\"networkMountpointPass2\" required\n" +
                        "                                                   lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                        "                                                   autocomplete=\"off\" class=\"layui-input\">\n" +
                        "                                        </div>\n" +
                        "                                    </div>\n" +
                        "                                </div>"
                    if(rtknode!=null){
                        document.getElementById("rtkcontent").innerHTML="";
                    }
                    break;
            }
            getDeviceSetting(machinesn);
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
        if(data!=null){
            document.getElementById("coreselect").innerHTML="";
            document.getElementById("rtkfront").innerHTML="<div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">RTK解算设置</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"rtkPos\" name=\"rtkPos\" lay-verify=\"required\">\n" +
                "                                        <option value=\"1\">正常模式（5分钟输出）</option>\n" +
                "                                        <option value=\"2\">紧急模式（1秒输出）</option>\n" +
                "                                        <option value=\"3\">紧急模式（5秒输出）</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\" style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
                "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
                "                                    <select id=\"imuWarn\" name=\"imuWarn\" lay-verify=\"required\">\n" +
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
            document.getElementById("rtkcontent").innerHTML=" <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">通信协议</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\">\n" +
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
                "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div style=\"display: flex;margin-top: 30px\">\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">接入点</label>\n" +
                "                                    <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                "                                        <select id=\"networkMountpoint\" name=\"networkMountpoint\" lay-verify=\"required\">\n" +
                "                                            <option value=\"0\">关闭</option>\n" +
                "                                            <option value=\"0.3\">0.3度</option>\n" +
                "                                            <option value=\"0.5\">0.5度</option>\n" +
                "                                        </select>\n" +
                "                                        <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">用户名</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
                "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                                <div class=\"layui-form-item  fastinput\">\n" +
                "                                    <label class=\"layui-form-label\">端口</label>\n" +
                "                                    <div class=\"layui-input-block\">\n" +
                "                                        <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
                "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>";
        }
        rtkcore();
    }

    /**原始数据回传刷新**/
    function rawdatabackflush(data) {
        if(data.rawBackEnabled==1||data.rawBackEnabled==2){

        }
        if(data.rawBackEnabled==3){

        }
        if(data.rawBackEnabled==10||data.rawBackEnabled==11){

        }
    }

    /*判断是否插入core选择框*/
    function rtkcore(){
        debugger
        let base=doublebase;
        let source=downloadsource;
        let turn=rtkturn;
        if(base&&source==1&&turn){
            document.getElementById("coreselect").innerHTML="  <label class=\"layui-form-label\"></label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input type=\"radio\" lay-filter=\"coresource\" name=\"coredata\" value=\"0\" title=\"与CORS①数据同源\" checked>\n" +
                "                                    <input type=\"radio\" lay-filter=\"coresource\" name=\"coredata\" value=\"1\" title=\"与CORS②数据同源\">\n" +
                "                                </div>";
            document.getElementById("rtkfront").style.display="flex";
            document.getElementById("rtkcontent").innerHTML="";
            document.getElementById("rtkfront").innerHTML=rtkfront;
        }else if(!base&&turn){
            document.getElementById("rtkfront").style.display="flex";
            document.getElementById("rtkfront").innerHTML=rtkfront;
        }
        else if(base&&source==0&&turn){
            document.getElementById("rtkfront").style.display="flex";
            document.getElementById("rtkfront").innerHTML=rtkfront;
        }
        else{
            document.getElementById("coreselect").innerHTML="";
            document.getElementById("rtkfront").innerHTML="";
        }
    }

    var rtkfront="<div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">RTK解算设置</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"rtkPos\" name=\"rtkPos\" lay-verify=\"required\">\n" +
        "                                        <option value=\"1\">正常模式（5分钟输出）</option>\n" +
        "                                        <option value=\"2\">紧急模式（1秒输出）</option>\n" +
        "                                        <option value=\"3\">紧急模式（5秒输出）</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
        "                                <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
        "                                    <select id=\"imuWarn\" name=\"imuWarn\" lay-verify=\"required\">\n" +
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
        "                                        <select id=\"rtkPos\" name=\"rtkPos\" lay-verify=\"required\">\n" +
        "                                            <option value=\"1\">正常模式（5分钟输出）</option>\n" +
        "                                            <option value=\"2\">紧急模式（1秒输出）</option>\n" +
        "                                            <option value=\"3\">紧急模式（5秒输出）</option>\n" +
        "                                        </select>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\"style=\"width: 150px\">IMU触发RTK紧急模式</label>\n" +
        "                                    <div class=\"layui-input-block\" style=\"margin-left: 180px\">\n" +
        "                                        <select id=\"imuWarn\" name=\"imuWarn\" lay-verify=\"required\">\n" +
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
        "                                    <select id=\"networkMode\" name=\"networkMode\" lay-verify=\"required\">\n" +
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
        "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div style=\"display: flex;margin-top: 30px\">\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">接入点</label>\n" +
        "                                    <div class=\"layui-input-block\" style=\"display: flex\">\n" +
        "                                        <select id=\"networkMountpoint\" name=\"networkMountpoint\" lay-verify=\"required\">\n" +
        "                                            <option value=\"0\">关闭</option>\n" +
        "                                            <option value=\"0.3\">0.3度</option>\n" +
        "                                            <option value=\"0.5\">0.5度</option>\n" +
        "                                        </select>\n" +
        "                                        <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">用户名</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkMountpointUse\" type=\"text\" name=\"networkMountpointUse\" required\n" +
        "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"layui-form-item  fastinput\">\n" +
        "                                    <label class=\"layui-form-label\">端口</label>\n" +
        "                                    <div class=\"layui-input-block\">\n" +
        "                                        <input id=\"networkMountpointPass\" type=\"text\" name=\"networkMountpointPass\" required\n" +
        "                                               lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
        "                                               autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>";

    var rawdatacontent = "<div class=\"layui-form-item  fastinput\">\n" +
        "                            <label class=\"layui-form-label\">通讯设置</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <select id=\"rawBackEnabled\" name=\"rawRate\" lay-verify=\"required\">\n" +
        "                                    <option value=\"0\">关闭</option>\n" +
        "                                    <option value=\"1\">TCP客户端</option>\n" +
        "                                    <option value=\"2\">TCP服务端</option>\n" +
        "                                    <option value=\"3\">Ntrip基站</option>\n" +
        "                                    <option value=\"10\">RS485串口</option>\n" +
        "                                    <option value=\"11\">RS232串口</option>\n" +
        "                                </select>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div class=\"layui-form-item  fastinput\">\n" +
        "                            <label class=\"layui-form-label\">数据类型</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <select id=\"rawBackGnssData\" name=\"rawRate\" lay-verify=\"required\">\n" +
        "                                    <option value=\"0\">GNSS原始数据</option>\n" +
        "                                    <option value=\"1\">RTCM3.2数据</option>\n" +
        "                                </select>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
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
        "                                           lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";
    exports('station_compute', {})
});