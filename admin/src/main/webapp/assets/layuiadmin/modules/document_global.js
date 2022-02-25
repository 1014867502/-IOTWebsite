layui.define(['form','drawer','table'], function (exports) {
    var $ = layui.$
        ,setter = layui.setter
        ,admin = layui.admin
        ,form = layui.form
        ,drawer=layui.drawer
        ,table=layui.table

    changecatalog();

    $(".enlarge").on('click',function () {
        openFile(this);
    })

    $(".catalogclick").on('click',function () {
        $(".catalog-this").removeClass("catalog-this");
        $(this).addClass("catalog-this");
    })

    window.addEventListener("resize", changecatalog);

    
    function changecatalog() {
        let width = document.documentElement.clientWidth;
        let height=document.documentElement.clientHeight;
        let adminheight=441;
        let userheight=331;
        if(width<1000){
            $("#catalog").css("display","none");
        }else{
            $("#catalog").css("display","block");
            let realwidth=width*0.8
            $("#catalog").css("left",realwidth.toString()+"px");
        }
        if(height>700){
            let realheight=height*0.2;
            $("#catalog").css("top",realheight.toString()+"px");
            $("#catalogcontent").css("height","100%");
            $("#catalogapp").css("height","100%");
        }else{
            if(height>200){
                let realheight=height*0.5;
                $("#catalog").css("top",realheight.toString()+"px");
                if(document.getElementById("catalogapp")!=null){
                    let reallogheigh=adminheight*0.4;
                    $("#catalogapp").css("height",reallogheigh.toString()+"px");
                }
                if(document.getElementById("catalogcontent")!=null){
                    let reallogheigh=userheight*0.5;
                    $("#catalogcontent").css("height",reallogheigh.toString()+"px");
                }

            }else{
                let realheight=height*0.5;
                $("#catalog").css("top",realheight.toString()+"px");
                $("#catalogcontent").css("height","100%");
            }
        }
    }


    function openFile(e){
        let src2=" <img class=\"enlarge\" src="+$(e).attr('src')+">";
        let src=$(e).attr('src');
        var img = new Image();
        img.src=src;
        debugger
        //避免图片还未加载完成无法获取到图片的大小。
        //避免图片太大，导致弹出展示超出了网页显示访问，所以图片大于浏览器时下窗口可视区域时，进行等比例缩小。
        var max_height = $(window).height()- 100;
        var max_width = document.body.offsetWidth;
        //rate1，rate2，rate3 三个比例中取最小的。
        var rate1 = max_height / img.height;
        var rate2 = max_width / img.width;
        var rate3 = 1;
        var rate = Math.min(rate1, rate2, rate3);
        //等比例缩放
        var imgHeight = img.height * rate; //获取图片高度
        var imgWidth = img.width * rate; //获取图片宽度

        var imgHtml = "<img src='" + src + "' width='" + imgWidth + "px' height='" + imgHeight + "px'/>";
        //弹出层
        layer.open({
            type: 1,
            id:"pic1",
            title: false,//不显示标题
            closeBtn: 0,
            area: ['auto', 'auto'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: imgHtml
        });
    }

    exports('document_global',{})
});