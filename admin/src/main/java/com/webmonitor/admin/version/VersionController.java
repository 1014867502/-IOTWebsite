package com.webmonitor.admin.version;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.admin.base.BaseController;
import com.webmonitor.admin.index.IndexService;
import com.webmonitor.admin.template.TemplateService;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.VersionData;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.SocketClient;
import com.webmonitor.core.util.exception.ExceptionUtil;
import com.webmonitor.core.vo.Result;

import java.io.File;
import java.util.*;

public class VersionController extends BaseController {

    public static HashMap<String, List<String>> tokenHashMap = new HashMap<String,List<String>>();//用户的token

    public void getAll(){
        int pageno=getParaToInt("page",1);
        int limit=getParaToInt("limit",10);
        Result<Page<VersionData>> result=Result.newOne();
        try{
            Page<VersionData> versionPage= VersionService.me.getAllVersion(pageno,limit);
            result.success(versionPage);
        }catch (Throwable e){
            ExceptionUtil.handleThrowable(result,e);
        }
        renderJson(result);
    }

    /**下载对应的文件**/
    public void downloadFile(){
        String filename = getPara("filename");
        filename = filename.replace(":", "");
        String basepath = "C:\\FirmwareUpdate\\Latest";
        String path = basepath + "\\" + filename;
        File report = new File(path);
        if (report.exists()) {
            renderFile(report);
        }
    }

    /**获取下载的二维码**/
    public void downloadcode(){
        String filename=getPara("filename");
        String userid=getPara("userid");
        String code=getPara("code");
        if(filename.contains("http")){
            renderQrCode(filename,200,200);
        }else{
            String path = "http://8.134.94.147:8080/version/downloadFileByCode?filename="+filename+"&&userid="+userid+"&&code="+code;;
            renderQrCode(path,200,200);
        }
    }

    /**生成验证码**/
    public void developCode(){
        Result<String> result=Result.newOne();
        String userid=getPara("userid");
        Random random=new Random();//随机生成器
        //范围在26个大小写字母，与10个数字之间
        char[] chars = new char[]{'a','b','c','d','e' ,'f','g','h','i','j','k' ,'m','n','p','q','r','s' ,'t','u','v','w','x','y' ,'z',
                'A','B','C','D','E' ,'F','G','H','I','J','K' ,'M','N','P','Q','R','S' ,'T','U','V','W','X','Y' ,'Z','2','3','4','5','6','7','8','9'};
        String code ="";
        //遍历4次得到4个随机整数,再把随机整数作为数组下标得到对象的字符
        for(int i=0;i<4;i++)
        {
            int index=random.nextInt(chars.length);//每次遍历生成数组长度范围内的随机整数
            //生成数组中的随机整数作为下标得到对应的字符值，字符串加字符结果为字符串
            code+=chars[index];
        }
        if(tokenHashMap.get(userid)==null){
            List<String> list=new ArrayList<>();
            tokenHashMap.put(userid,list);
        }
        tokenHashMap.get(userid).add(code);
        result.success(code);
        renderJson(result);
    }

    /**下载对应的文件**/
    public void downloadFileByCode(){
        String filename = getPara("filename");
        String userid=getPara("userid");
        String code=getPara("code");
        if(tokenHashMap.get(userid).contains(code)){
            List<String> list=tokenHashMap.get(userid);
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).equals(code)) {
                    list.remove(i);
                    break;
                }
            }
            filename = filename.replace(":", "");
            String basepath = "C:\\FirmwareUpdate\\Latest";
            String path = basepath + "\\" + filename;
            File report = new File(path);
            if (report.exists()) {
                renderFile(report);
            }
        }else{
            renderJson("链接已过期，无法下载文件");
        }
    }

    /**清除验证码**/
    public void clearCode(){
        String userid=getPara("userid");
        Result<String> result=Result.newOne();
        String code=getPara("code");
            List<String> list = tokenHashMap.get(userid);
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).equals(code)) {
                    list.remove(i);
                    break;
                }
            }
            result.success("succ");
            renderJson(result);
    }
}
