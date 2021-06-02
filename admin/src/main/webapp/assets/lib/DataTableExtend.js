let LayUIDataTable = (function () {
    let rowData = {};
    let $;

    //配置项
    let LayUIDataTableConfig={
        isdblClick:true,// 是否支持行、单元格的双击事件（默认true）,如果为"false"，则默认只支持单击事件
        fixedColumnDBClick:true,// 固定列的标题是否可以触发双击（受限于"isdblClick"配置项是否开启，若"isdblClick"配置为false，则无意义）

    };

    function checkJquery() {
        if (!$) {
            console.log("未获取jquery对象，请检查是否在调用ConvertDataTable方法之前调用SetJqueryObj进行设置！")
            return false;
        } else return true;
    }

    /**
     * 转换表格，处理事件等
     * @param callback 双击行的回调函数，该回调函数返回三个参数，分别为：当前点击行的索引值、当前点击单元格的值、当前行数据
     * @returns {*} 返回当前表格的所有行数据对象集合。数据结构：<br/>
     * [
     *      {字段名称1:{value:"当前字段值",cell:"当前字段所在单元格td对象",row:"当前字段所在行tr对象"}}
     *     ,{字段名称2:{value:"",cell:"",row:""}}
     * ]
     * @constructor
     */
    function ConvertDataTable(callback) {
        let isExistFixColFlag = IsExistFiexColumn();
        if (!checkJquery()) return;
        let dataList = [];
        let trArr = GetTr();
        let trArrFiex = GetFiexColumnArr();

        if (!trArr || trArr.length == 0) {
            console.log("未获取到相关行数据，请检查数据表格是否渲染完毕！");
            return;
        }

        EachRowDealData(trArr, dataList, LayUIDataTableConfig.isdblClick, callback);

        if (isExistFixColFlag) {
            EachRowDealData(trArrFiex, dataList, LayUIDataTableConfig.isdblClick, callback);
        }
        return dataList;
    }

    /**
     * 判断是否存在固定列（左侧固定或者右侧固定任意一个出现即可）
     * @returns {boolean}
     * @constructor
     */
    function IsExistFiexColumn() {
        if (IsExistFiexColumnL() || IsExistFiexColumnR())
            return true;
        else
            return false;
    }

    /**
     * 是否存在左侧固定列
     * @returns {boolean}
     * @constructor
     */
    function IsExistFiexColumnL() {
        if ($(".layui-table-fixed.layui-table-fixed-l").length > 0)
            return true;
        else
            return false;
    }

    /**
     * 是否存在右侧固定列
     * @returns {boolean}
     * @constructor
     */
    function IsExistFiexColumnR() {
        if ($(".layui-table-fixed.layui-table-fixed-r").length > 0)
            return true;
        else
            return false;
    }


    /**
     * 获取行数据
     * @returns {*|jQuery|HTMLElement}
     * @constructor
     */
    function GetTr() {
        let trArr = $(".layui-table-body.layui-table-main tr");// 行数据
        return trArr;
    }

    /**
     * 获取固定列所属行的集合
     * @returns {*}
     * @constructor
     */
    function GetFiexColumnArr() {
        let trArr = [];
        let trArrTmp = [];
        if (IsExistFiexColumn) {
            if ($(".layui-table-fixed.layui-table-fixed-l").length > 0)
                trArr = $(".layui-table-fixed.layui-table-fixed-l tr");
            if ($(".layui-table-fixed.layui-table-fixed-r").length > 0) {
                trArrTmp = $(".layui-table-fixed.layui-table-fixed-r tr");
                //TODO 有优化空间
                $.each(trArrTmp, function (index, value) {
                    trArr.push(value);
                })
            }
            return trArr

        }
        else return null;
    }


    /**
     * 遍历每行并处理每一行处理，将其封装于对象中
     * @param trArr
     * @param dataList 返回数据集合对象（引用类型）
     * @param callback 回调
     * @returns {*}
     * @constructor
     */
    function EachRowDealData(trArr, dataList, isdblClick, callback) {
        if (!trArr) return;

        let fixedCol;
        let indexFixedColumn = 0;
        //TODO 有优化空间
        $.each(trArr, function (index, trObj) {
            let currentClickRowIndex;
            let currentClickCellValue;

            if (isdblClick) {
                $(trObj).dblclick(function (e) {
                    if(LayUIDataTableConfig.fixedColumnDBClick){
                        _click(e);
                    }
                    // 排除固定列标题行的点击事件
                    // let dataIndex = e.currentTarget.dataset.index;//如果是固定列的行标题，那么没有"data-index"属性，通过这一点进行判断
                    // if (dataIndex)
                    //     _click(e);

                });
            } else {
                $(trObj).click(function (e) {
                    _click(e);
                });
            }

            function _click(e) {
                let returnData = {};
                let currentClickRow = $(e.currentTarget);
                currentClickRowIndex = currentClickRow.data("index");
                currentClickCellValue = e.target.innerHTML
                $.each(dataList[currentClickRowIndex], function (key, obj) {
                    returnData[key] = obj.value;
                });
                e.cancelBubble = true;
                // layui.stope(e)
                callback(currentClickRowIndex, currentClickCellValue, returnData);
            }

            let tdArrObj = $(trObj).find('td');
            rowData = {};

            //  每行的单元格数据
            $.each(tdArrObj, function (index_1, tdObj) {
                let td_field = $(tdObj).data("field");
                if ($($(tdObj).find("div.layui-form-checkbox")).length > 0) {
                    rowData["checkbox"] = rowData["checkbox"] || {};
                    // rowData["fixedColumn"] = rowData["fixedColumn"] || {};

                    rowData["checkbox"]["checkbox"] = ($($(tdObj).find("div.layui-form-checkbox")).length > 0 ? $($(tdObj).find("div.layui-form-checkbox")) : undefined);
                    if (IsExistFiexColumn()) {
                        if (!fixedCol)
                            fixedCol = GetFiexColumnArr();
                        if (IsExistFiexColumnL())
                            rowData["fixedColumn_L"] = $(fixedCol[indexFixedColumn + 1]);
                        if (IsExistFiexColumnR()) {
                            rowData["fixedColumn_R"] = $(fixedCol[fixedCol.length / 2 + indexFixedColumn + 1]);
                        }
                        indexFixedColumn++;
                    }
                } else {
                    rowData[td_field] = rowData[td_field] || {};
                    rowData[td_field]["value"] = $($(tdObj).html()).html();
                    rowData[td_field]["cell"] = $(tdObj);
                    rowData[td_field]["row"] = $(trObj);
                }
                //$($(tdObj).find("div.layui-form-checkbox")).addClass("layui-form-checked")//选中
                //$($(tdObj).find("div.layui-form-checkbox")).hide()//隐藏
                //$($(tdObj).find("div.layui-form-checkbox")).show()//显示
            })
            dataList.push(rowData);
        })
        return dataList;
    }


    // 暴露对外访问的接口
    return {
        /**
         * 设置配置对象
         *
         * @constructor
         */
        Config:function(config){
            LayUIDataTableConfig=config;
        },
        /**
         * 设置JQuery对象，第一步操作。如果你没有在head标签里面引入jquery且未执行该方法的话，ParseDataTable方法、HideField方法会无法执行，出现找不到 $ 的错误。如果你是使用LayUI内置的Jquery，可以
         * let $ = layui.jquery   然后把 $ 传入该方法
         * @param jqueryObj
         * @constructor
         */
        SetJqueryObj: function (jqueryObj) {
            $ = jqueryObj;
        }

        /**
         * 转换数据表格
         */
        , ParseDataTable: ConvertDataTable

        /**
         * 隐藏字段
         * @param fieldName 要隐藏的字段名（field名称）参数可为字符串（隐藏单列）或者数组（隐藏多列）
         * @constructor
         */
        , HideField: function (fieldName) {
            if (!checkJquery()) return;
            if (fieldName instanceof Array) {
                $.each(fieldName, function (index, field) {
                    $("[data-field='" + field + "']").css('display', 'none');
                })
            } else if (typeof fieldName === 'string') {
                $("[data-field='" + fieldName + "']").css('display', 'none');
            } else {

            }
        }

        /**
         * 存在固定列的行高亮显示。对于普通行还是使用：obj['score']["row"].css("background-color", "#FAB000");形式即可
         * @param rowObj 调用LayUIDataTable.ParseDataTable返回的行集合的某一项（即：行对象）。
         * @param bgColor 背景颜色值。格式："red"或者"#ff0000"
         * @constructor
         */
        , DealFixedRowHighLight: function (rowObj, bgColor) {
            if (IsExistFiexColumnL())
            //左侧固定列高亮
                $(rowObj["fixedColumn_L"]).css("background-color", bgColor);
            if (IsExistFiexColumnR())
            // 右侧固定列高亮
                $(rowObj["fixedColumn_R"]).css("background-color", bgColor);
        }
    }
})();