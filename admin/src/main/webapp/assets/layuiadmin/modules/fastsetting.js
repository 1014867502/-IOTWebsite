layui.define(['element','form','drawer','table'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table
        ,table2=layui.table
        ,element = layui.element;


    var device;
    var form21=["devicestatus","observedata"];
    var form22=["statusresult","observedata"];
    var form12=["basechange","statusresult","basedownload"];
    var form11=["basestation","devicestatus","basefilereturn"];
    var formlist=["basestation","devicestatus","basefilereturn","basechange","statusresult","basedownload","observedata"];
    var beforeform;
    var compute=0;
    var station=0;
    var mark=0;

    form.verify({
         ip: [
           /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            ,'IP地址不符合规则'
        ],
        title: function(value){
            if(value.length < 5){
                return '标题至少得5个字符啊';
            }
        }
        ,Ndouble:[
            /^[1-9]\d*$/
            ,'只能输入整数哦'
        ]
        ,Lon:[
            /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,2})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,2}|180)$/
            ,'经度输入有误'
        ]
        ,Lat:[
            /^([0-8]?\d{1}\.\d{2}|90\.0{2}|[0-8]?\d{1}|90)$/
            ,'纬度输入有误'
        ]
        ,pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ]
        ,content: function(value){
            layedit.sync(editIndex);
        }
    });
    getDeviceSetting(machinesn);
    showform(0,2);

    form.on('radio(compute)', function(data) {
        debugger
        compute=data.value;
        showform(compute,station);
    });
    form.on('radio(station)', function(data) {
        station=data.value;
        showform(compute,station);
    });
    form.on('radio(mark)', function(data) {
        mark=data.value;
        changemark(mark);
    });
    form.on('switch(doublebase)',function (data) {
        debugger
        let test=data.value
        if(this.checked) {
            document.getElementById("secondbase").innerHTML = " <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label\">第二基站IP地址</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input type=\"text\" name=\"secondIp\" required lay-verify=\"ip\" placeholder=\"请输入IP地址\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"layui-form-item  fastinput\">\n" +
                "                                <label class=\"layui-form-label  \">第二基站端口</label>\n" +
                "                                <div class=\"layui-input-block\">\n" +
                "                                    <input type=\"text\" name=\"secondPort\" required lay-verify=\"required\" placeholder=\"请输入端口\"\n" +
                "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                "                                </div>\n" +
                "                            </div>";
            document.getElementById("secondbase").style.display="flex";
            document.getElementById("secondbase").style.marginTop="30px";
        }else{
                document.getElementById("secondbase").innerHTML="";
            document.getElementById("secondbase").style.display="none";
        }
    })
    form.on('submit(formDemo)',function (data) {
        debugger;
        let test=data.field;
        let stringtest=JSON.stringify(test);
        $.ajax({
            url:'/devicelist/editSetting',
            data:{
                setting:stringtest,
                machinesn:machinesn
            },
            success:function (data) {
                getDeviceSetting(machinesn);
                alert(data.data);
            }
        })
    })

    function getDeviceSetting(sn) {
        $.ajax({
            url:'/devicelist/getDeviceSetting',
            data:{
                machineSerial:sn
            },
            success:function (data) {
                device=data.data;
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
                $("#selectList").find("option[value="+device.rawRate+"]").prop("selected",true);
                form.render();
                // let userpass=device.networkMountpointPass.toString().split("|");
                // $("#networkMountpointUse").val(userpass[0]);
                // $("#networkMountpointPass").val(userpass[1]);

            }
        })
    }

    function showform(data1,data2){
        let no=data1.toString()
        let no1=data2.toString();
        let no2=no+no1;
        debugger;
        switch(no2){
            case "02":
                if(beforeform!=null){
                    for(let i=0;i<beforeform.length;i++){
                        for(let k=0;k<form11.length;k++){
                            if(beforeform[i]!=form11[k]){
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform=form11;
                for(let i=0;i<form11.length;i++){
                    innhtml(form11[i]);
                }
                break;
            case "00":
                if(beforeform!=null){
                    for(let i=0;i<beforeform.length;i++){
                        for(let k=0;k<form12.length;k++){
                            if(beforeform[i]!=form12[k]){
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform=form12;
                for(let i=0;i<form12.length;i++){
                    innhtml(form12[i]);
                }

                break;
            case "12":
                if(beforeform!=null){
                    for(let i=0;i<beforeform.length;i++){
                        for(let k=0;k<form21.length;k++){
                            if(beforeform[i]!=form21[k]){
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform=form21;
                for(let i=0;i<form21.length;i++){
                    innhtml(form21[i]);
                }

                break;
            case "10":
                if(beforeform!=null){
                    for(let i=0;i<beforeform.length;i++){
                        for(let k=0;k<form22.length;k++){
                            if(beforeform[i]!=form22[k]){
                                removehtml(beforeform[i]);
                            }
                        }
                    }
                }
                beforeform=form22;
                for(let i=0;i<form22.length;i++){
                    innhtml(form22[i]);
                }
                break;
        }
    }

    /**动态插入表单项**/
    function innhtml(select){
        switch (select) {
            case "basestation":
                document.getElementById("basestation").innerHTML="   <div style=\"display: flex;margin-top: 30px\">\n" +
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
                document.getElementById(select).innerHTML=" <div style=\"display: flex;margin-top: 30px\">\n" +
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
                document.getElementById(select).innerHTML="         <div style=\"display: flex;margin-top: 30px\">\n" +
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
                document.getElementById(select).innerHTML="     <div style=\"display: flex;margin-top: 30px\">\n" +
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
                    "                                    <input id='resultPort' type=\"text\" name=\"resultPort\" required lay-verify=\"Ndouble|required\" placeholder=\"请输入端口\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
            case "observedata":
                document.getElementById(select).innerHTML=" <div style=\"display: flex;margin-top: 30px\">\n" +
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
                document.getElementById(select).innerHTML="     <div style=\"display: flex;margin-top: 30px\">\n" +
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
                document.getElementById(select).innerHTML="   <div style=\"display: flex;margin-top: 30px\">\n" +
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
                    "                                <input type=\"radio\" name=\"downloadsource\" value=\"0\" title=\"基站文件\">\n" +
                    "                                <input type=\"radio\" name=\"downloadsource\" value=\"1\" title=\"CORS数据\" checked>\n" +
                    "                            </div>\n" +
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
                    "                        </div>\n" +
                    "                        <div id='secondbase'>\n" +
                    "                        </div>\n" +
                    "                        <div style=\"display: flex;margin-top: 30px\">\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label\">接入点</label>\n" +
                    "                                <div class=\"layui-input-block\" style=\"display: flex\">\n" +
                    "                                    <select name=\"networkMountpoint\" lay-verify=\"required\">\n" +
                    "                                        <option value=\"\"></option>\n" +
                    "                                        <option value=\"0\">1s</option>\n" +
                    "                                        <option value=\"1\">5s</option>\n" +
                    "                                    </select>\n" +
                    "                                    <button class=\"layui-btn btn_primary\">获取接入点</button>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label  \">用户名</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='networkMountpointUse' type=\"text\" name=\"networkMountpointUse\" required lay-verify=\"required\" placeholder=\"请输入用户名\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"layui-form-item  fastinput\">\n" +
                    "                                <label class=\"layui-form-label  \">密码</label>\n" +
                    "                                <div class=\"layui-input-block\">\n" +
                    "                                    <input id='networkMountpointPass' type=\"text\" name=\"networkMountpointPass\" required lay-verify=\"pass\" placeholder=\"请输入密码\"\n" +
                    "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>"
                break;
        }
        getDeviceSetting(machinesn);
        element.init();
        form.render();
    }

    function changemark(type) {
        switch(type){
            case "0":
                document.getElementById("XYZ").innerHTML="";
                document.getElementById("BLH").innerHTML="  <div class=\"layui-form-item  fastinput\">\n" +
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
                document.getElementById("BLH").innerHTML="";
                document.getElementById("XYZ").innerHTML=" <div class=\"layui-form-item  fastinput\">\n" +
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

    /**动态删除表单项**/
    function removehtml(select){
        if(formlist.includes(select)){
            document.getElementById(select).innerHTML="";
        }
    }
    exports('fastsetting',{})
});