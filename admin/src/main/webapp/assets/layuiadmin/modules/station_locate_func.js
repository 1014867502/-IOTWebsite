layui.define(['form', 'drawer', 'table'], function (exports) {
    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , table = layui.table
        , drawer = layui.drawer
        , table2 = layui.table
        , form = layui.form

    var locatedata={};
    var fourhidepara;
    var basehidepara;
    var layerindex;

    //将表格数据转化成类
    function datatranform(basepara,four,test){
        basehidepara=basepara;
        fourhidepara=four;
        let jsondata={};
        let dstturn = (test.coordcvt_enable != "on") ? 0 : 1;
        let seventurn = (test.coordcvt_seven_use != "on") ? 0 : 1;
        let fourturn = (test.coordcvt_four_use != "on") ? 0 : 1;
        jsondata.coordcvtEnabled = dstturn;
        jsondata.coordcvtDstDatum = test.coordcvt_dst_datum_select + "|" + test.coordvt_dst_datum_da + "|" + test.coordvt_dst_datum_df;
        jsondata.coordcvtProjParam = test.corrdcvt_proj_mode_select + "|" + test.coordvt_proj_centralmeridian + "|" + test.coordvt_proj_scale + "|" + test.coordvt_proj_north +
            "|" + test.coordvt_proj_east + "|" + test.coordvt_proj_height + "|" + test.coordvt_proj_lat + basehidepara;
        jsondata.coordcvtSevenParam = seventurn + "|" + test.coordcvt_seven_tx + "|" + test.coordcvt_seven_ty + "|" + test.coordcvt_seven_tz + "|" +
            test.coordcvt_seven_rx + "|" + test.coordcvt_seven_ry + "|" + test.coordcvt_seven_rz + "|" + test.coordcvt_seven_scale;
        jsondata.coordcvtFourParam = fourturn + "|" + test.coordcvt_four_tx + "|" + test.coordvt_four_ty + "|" + test.coordvt_four_rt + "|" + test.coordvt_four_scale + fourhidepara;
        return jsondata;
    }


    /*局部刷新*/
    function flushdata(type) {
        switch (type) {
            case "base":
                if (locatedata.coordcvtDstDatum != null) {
                    let coordcvt_dst = locatedata.coordcvtDstDatum.split('|');
                    $("#coordcvt_dst_datum_select").val(coordcvt_dst[0]);
                    $("#coordvt_dst_datum_da").val(coordcvt_dst[1]);
                    $("#coordvt_dst_datum_df").val(coordcvt_dst[2]);
                }

                /*投影参数*/
                if (locatedata.coordcvtProjParam != null) {
                    let coordvt_proj = locatedata.coordcvtProjParam.split('|');
                    $("#corrdcvt_proj_mode_select").val(coordvt_proj[0]);
                    $("#coordvt_proj_centralmeridian").val(coordvt_proj[1]);
                    $("#coordvt_proj_scale").val(coordvt_proj[2]);
                    $("#coordvt_proj_north").val(coordvt_proj[3]);
                    $("#coordvt_proj_east").val(coordvt_proj[4]);
                    $("#coordvt_proj_height").val(coordvt_proj[5]);
                    $("#coordvt_proj_lat").val(coordvt_proj[6]);
                }

                break;
            case "seven":
                if (locatedata.coordcvtSevenParam != null) {
                    let coordvt_seven = locatedata.coordcvtSevenParam.split('|');
                    $("#coordcvt_seven_tx").val(coordvt_seven[1]);
                    $("#coordcvt_seven_ty").val(coordvt_seven[2]);
                    $("#coordcvt_seven_tz").val(coordvt_seven[3]);
                    $("#coordcvt_seven_rx").val(coordvt_seven[4]);
                    $("#coordcvt_sevent_ry").val(coordvt_seven[5]);
                    $("#coordcvt_seven_rz").val(coordvt_seven[6]);
                    $("#coordcvt_seven_scale").val(coordvt_seven[7]);
                }
                break;
            case "four":
                if (locatedata.coordcvtFourParam != null) {
                    let coordvt_four = locatedata.coordcvtFourParam.split('|');
                    $("#coordcvt_four_tx").val(coordvt_four[1]);
                    $("#coordcvt_four_ty").val(coordvt_four[2]);
                    $("#coordcvt_four_rotate").val(coordvt_four[3]);
                    $("#coordcvt_four_scale").val(coordvt_four[4]);
                }
                break;
        }

    }

    var projnorth="<label class=\"layui-form-label  \">北加常数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_north' type=\"text\" name=\"coordvt_proj_north\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入北加常数\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n";

    var projeast="<label class=\"layui-form-label  \">东加常数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_east' type=\"text\" name=\"coordvt_proj_east\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入东加常数\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n";

    var projlat="<label class=\"layui-form-label  \">基准纬度</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_lat' type=\"text\" name=\"coordvt_proj_lat\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入基准纬度\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n";

    var projheight="<label class=\"layui-form-label  \">投影高</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_height' type=\"text\" name=\"coordvt_proj_height\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入投影高\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n";

    var projscale="<label class=\"layui-form-label  \">投影比例尺</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_scale' type=\"text\" name=\"coordvt_proj_scale\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入比例尺\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n"

    var locatecontent = "   <div class=\"layui-card-body\" style=\"padding: 0px 15px\">\n" +
        "                    <div class=\"layui-form-item\">\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                            <div>目标概述</div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">椭球名称</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"coordcvt_dst_datum_select\" lay-filter='datumselect' name=\"coordcvt_dst_datum_select\" lay-verify=\"required\">\n" +
        "                                        <option value=\"WGS84\">WGS84</option>\n" +
        "                                        <option value=\"北京54\">北京54</option>\n" +
        "                                        <option value=\"XIAN80\">西安80</option>\n" +
        "                                        <option value=\"CGCS2000\">CGCS2000</option>\n" +
        "                                        <option value=\"CUSTOM\">自定义</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">长半轴</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_dst_datum_da' type=\"text\" name=\"coordvt_dst_datum_da\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入长半轴\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">扁率倒数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_dst_datum_df' type=\"text\" name=\"coordvt_dst_datum_df\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入端口\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div class=\"layui-form-item\">\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                            <div>投影参数</div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">投影方式</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"corrdcvt_proj_mode_select\" name=\"corrdcvt_proj_mode_select\" lay-filter='modeselect' lay-verify=\"required\">\n" +
        "                                        <option value=\"0\">高斯</option>\n" +
        "                                        <option value=\"1\">UTM</option>\n" +
        "                                        <option value=\"2\">横轴墨卡托</option>\n" +
        "                                        <option value=\"3\">倾斜赤平投影</option>\n" +
        "                                        <option value=\"4\">双赤平投影</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">中央子午线</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_centralmeridian' type=\"text\" name=\"coordvt_proj_centralmeridian\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入中央子午线\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div id='projnorth' class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">北加常数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_north' type=\"text\" name=\"coordvt_proj_north\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入北加常数\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div id='projeast' class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">东加常数</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_east' type=\"text\" name=\"coordvt_proj_east\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入东加常数\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div id='projscale' class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">投影比例尺</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_scale' type=\"text\" name=\"coordvt_proj_scale\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入比例尺\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div id='projlat' class=\"layui-form-item  fastinput\">\n" +
        "                               <label class=\"layui-form-label  \">基准纬度</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_lat' type=\"text\" name=\"coordvt_proj_lat\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入基准纬度\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div id='projheight' class=\"layui-form-item  fastinput\">\n" +
        "                               <label class=\"layui-form-label  \">投影高</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordvt_proj_height' type=\"text\" name=\"coordvt_proj_height\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入投影高\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div class=\"layui-form-item\">\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                            <div>七参数</div>\n" +
        "                        </div>\n" +
        "                        <div class=\"layui-form-item\">\n" +
        "                            <label style=\"width: 86px;padding: 9px 10px;\" class=\"layui-form-label\">启用</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <input id=\"coordcvt_seven_use\" lay-filter='coordcvt_seven_use' type=\"checkbox\" name=\"coordcvt_seven_use\" lay-skin=\"switch\">\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div id=\"seven_use\"></div>\n" +
        "                    </div>\n" +
        "                    <div class=\"layui-form-item\">\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                            <div>四参数</div>\n" +
        "                        </div>\n" +
        "                        <div class=\"layui-form-item\">\n" +
        "                            <label style=\"width: 86px;padding: 9px 10px;\" class=\"layui-form-label\">启用</label>\n" +
        "                            <div class=\"layui-input-block\">\n" +
        "                                <input id=\"coordcvt_four_use\" lay-filter='coordcvt_four_use' type=\"checkbox\" name=\"coordcvt_four_use\" lay-skin=\"switch\">\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div id=\"four_use\"></div>\n" +
        "                    </div>\n" +
        "                </div>";

    var seven_use = " <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label\" style=\"width: 86px;padding: 9px;\">模型</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <select id=\"corrdcvt_seven_model\" name=\"corrdcvt_seven_model\" lay-verify=\"required\">\n" +
        "                                        <option value=\"1\" checked>布尔沙</option>\n" +
        "                                    </select>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△X</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_tx' type=\"text\" name=\"coordcvt_seven_tx\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△Y</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_ty' type=\"text\" name=\"coordcvt_seven_ty\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△Z</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_tz' type=\"text\" name=\"coordcvt_seven_tz\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△α(秒)</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_rx' type=\"text\" name=\"coordcvt_seven_rx\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△β(秒)</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_ry' type=\"text\" name=\"coordcvt_seven_ry\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△γ(秒)</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_rz' type=\"text\" name=\"coordcvt_seven_rz\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">△比例尺(ppm)</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_seven_scale' type=\"text\" name=\"coordcvt_seven_scale\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入比例尺\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var four_use = "  <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">x平移</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_four_tx' type=\"text\" name=\"coordcvt_four_tx\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">y平移</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_four_ty' type=\"text\" name=\"coordvt_four_ty\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <div style=\"display: flex;margin-top: 30px\">\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">旋转</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_four_rotate' type=\"text\" name=\"coordvt_four_rt\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <div class=\"layui-form-item  fastinput\">\n" +
        "                                <label class=\"layui-form-label  \">缩放</label>\n" +
        "                                <div class=\"layui-input-block\">\n" +
        "                                    <input id='coordcvt_four_scale' type=\"text\" name=\"coordvt_four_scale\" required lay-verify=\"required\"\n" +
        "                                           placeholder=\"请输入数据\"\n" +
        "                                           autocomplete=\"off\" class=\"layui-input\">\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>";

    var locatefunc={
        // DeviceSetting:function (sn) {
        //     getDeviceSetting(sn)
        // },
        updatedata:function (data) {
            flushdata(data)
        },
        datachange:function (basepara,four,data) {
            let json;
            json=datatranform(basepara,four,data);
            return json;
        },
        setdevice:function(data){
            Object.assign(locatedata,data);
        },
        fouruse:four_use,
        sevenuse:seven_use,
        locatetxt:locatecontent,
        projscale:projscale,
        projheight:projheight,
        projlat:projlat,
        projeast:projeast,
        projnorth:projnorth

    }
    exports('station_locate_func',locatefunc)
});