package com.webmonitor.core.util.io;

import com.webmonitor.core.util.StringUtils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipCompress {
    private String zipFileName;	//目的地Zip文件
    private String sourceFileName;	//源文件
    private List<String> fileFilter;	//文件后缀过滤

    public ZipCompress(String zipFileName, String sourceFileName,List<String> fileFilter) {
        this.zipFileName = zipFileName;
        this.sourceFileName = sourceFileName;
        this.fileFilter = fileFilter;
    }

    public void zip() throws Exception {
        System.out.println("开始压缩...");

        //创建zip输出流
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFileName));

        File sourceFile = new File(sourceFileName);

        //调用函数
        compress(out, sourceFile, sourceFile.getName());

        out.close();
        System.out.println("压缩完成！");
    }

    public void compress(ZipOutputStream out, File sourceFile, String base) throws Exception {
        String fileName="";
        String suffix="";
        //如果路径为目录（文件夹）
        if(sourceFile.isDirectory()) {
            //取出文件夹中的文件（或子文件夹）
            File[] flist = sourceFile.listFiles();

            if(flist.length==0) {//如果文件夹为空，则只需在目的地zip文件中写入一个目录进入点
                System.out.println(base + File.separator);
                out.putNextEntry(new ZipEntry(base + File.separator));
            } else {//如果文件夹不为空，则递归调用compress,文件夹中的每一个文件（或文件夹）进行压缩
                for(int i=0; i<flist.length; i++) {

                    fileName = flist[i].getName();
                    suffix = fileName.substring(fileName.lastIndexOf(".") + 1);

                    if (suffix.length()<3)
                    {
                        continue;
                    }
                    else
                    {
                        for(String ext : fileFilter) {

                            if(StringUtils.isMatching(suffix,ext))
                            {
                                compress(out, flist[i], base+File.separator+fileName);
                            }
                        }
                    }
//                    else if (suffix.charAt(2)=='d'||suffix.charAt(2)=='D')
//                    {
//                        for(String ext : fileFilter) {
//
//                            if(StringUtils.isMatching(suffix,ext))
//                            {
//                                compress(out, flist[i], base+File.separator+fileName);
//                            }
//                        }
//                        //Hatanaka算法压缩后的d文件
//                        compress(out, flist[i], base+File.separator+fileName);
//
//                    }
//                    if (fileFiter.contains(suffix))
//                    {
//                        continue;
//                    }

                }
            }
        } else {
            out.putNextEntry(new ZipEntry(base));
            FileInputStream fos = new FileInputStream(sourceFile);
            BufferedInputStream bis = new BufferedInputStream(fos);
            int len;

            byte[] buf = new byte[1024];
            System.out.println(base);
            while((len=bis.read(buf, 0, 1024)) != -1) {
                out.write(buf, 0, len);
            }
            bis.close();
            fos.close();
        }
    }
    public void Test()
    {
        List<String> list = new ArrayList<>();
        list.add("??C");
        list.add("??G");
        list.add("??L");
        list.add("??N");
        ZipCompress zipCom = new ZipCompress("D:\\Obs\\压缩文件包.zip", "D:\\Obs\\temp",list);
        try {
            zipCom.zip();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
