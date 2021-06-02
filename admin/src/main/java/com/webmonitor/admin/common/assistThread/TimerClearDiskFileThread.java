package com.webmonitor.admin.common.assistThread;

//import com.webmonitor.core.model.Websetting;
import com.webmonitor.core.util.Tools;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TimerClearDiskFileThread extends Thread {
    private String rawPath;
    private String rinexPath;
    @Override
    public void run() {
        super.run();

        System.out.println("Clear thread start.");

        while(true) {

            if (isInterrupted()) {
                break;
            }

            try {
                Thread.sleep(1000*60*60*24);
            } catch (InterruptedException e) {
                //e.printStackTrace();
                break;
            }

            if (isStartClear())
            {
                clearRawDir();
                clearRinexDir();
                System.out.println("Start clear dir and file.");
            }

        }

        System.out.println("Clear thread exit.");
    }

    protected void clearRawDir() {
//        WebsettingService webservice = WebsettingService.me;
//        Websetting websetting = webservice.getWebConfig();
//        if (Tools.isEmpty(websetting))
//        {
//            websetting = new Websetting();
//        }
//        String RawDir = websetting.getRinexpath()+ File.separator;
//        clearDir(RawDir);
//        System.out.println("Clear RawDir and file success.");
    }
    protected void clearRinexDir() {
//        WebsettingService webservice = WebsettingService.me;
//        Websetting websetting = webservice.getWebConfig();
//        if (Tools.isEmpty(websetting))
//        {
//            websetting = new Websetting();
//        }
//        String RinexDir = websetting.getRinexpath()+ File.separator ;
//        clearDir(RinexDir);
//        System.out.println("Clear RawDir and file success.");
    }

    protected void  clearDir(String clearDir) {
//        long currentMillis = System.currentTimeMillis();
//
//        File fileDir = new File(clearDir);
//
//        if (!fileDir.exists()) {
//            return;
//        }
//
//        int nDays = 1;
//        try
//        {
//            WebsettingService webservice = WebsettingService.me;
//            Websetting websetting = webservice.getWebConfig();
//            if (Tools.isEmpty(websetting))
//            {
//                websetting = new Websetting();
//            }
//            nDays = Integer.valueOf(websetting.getOntimeclearfile());
//        }
//        catch (NumberFormatException e)
//        {
//            nDays = 1;
//        }
//
//        File[] fileDirList = fileDir.listFiles();
//
//        for(File tempFileDir : fileDirList) {
//            long createTime = tempFileDir.lastModified();
//
//            //delete the dir and files create on 1 day ago
//            if ((currentMillis - createTime) >= 1000*60*60*24*nDays) {
//                if (tempFileDir.isDirectory()) {
//                    DeleteDir(tempFileDir);
//                } else if(tempFileDir.isFile()) {
//                    tempFileDir.delete();
//                }
//            }
//        }
    }

    protected void DeleteDir(File fileDir) {
        File[] fileList = fileDir.listFiles();

        for(File tempFile : fileList) {
            if (tempFile.isDirectory()) {
                DeleteDir(tempFile);
            } else if(tempFile.isFile()) {
                tempFile.delete();
            }
        }

        fileDir.delete();
    }
    private boolean isStartClear(){

        SimpleDateFormat df = new SimpleDateFormat("HH:mm");//设置日期格式
        Date now =null;
        Date beginTime = null;
        Date endTime = null;
        try {
            now = df.parse(df.format(new Date()));
            beginTime = df.parse("00:00");
            endTime = df.parse("04:00");
        } catch (Exception e) {
            e.printStackTrace();
        }

        Boolean flag = belongCalendar(now, beginTime, endTime);
        System.out.println(flag);
        return flag;
    }
    /**
     * 判断时间是否在时间段内
     * @param nowTime
     * @param beginTime
     * @param endTime
     * @return
     */
    protected boolean belongCalendar(Date nowTime, Date beginTime, Date endTime) {
        Calendar date = Calendar.getInstance();
        date.setTime(nowTime);

        Calendar begin = Calendar.getInstance();
        begin.setTime(beginTime);

        Calendar end = Calendar.getInstance();
        end.setTime(endTime);

        if (date.after(begin) && date.before(end)) {
            return true;
        } else {
            return false;
        }
    }
}
