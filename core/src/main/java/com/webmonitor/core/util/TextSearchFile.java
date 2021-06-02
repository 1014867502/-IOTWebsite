package com.webmonitor.core.util;

import java.io.File;
import java.io.FileFilter;
import java.util.ArrayList;
import java.util.List;

public class TextSearchFile {
    public static List<File> searchFiles(String folder, final String keyword) {
        List<File> result = new ArrayList<File>();

        File file = new File(folder);
        File[] tempList = file.listFiles();

        for (int i = 0; i < tempList.length; i++) {
            if (tempList[i].isFile()) {
                if (tempList[i].getName().contains(keyword))
                {
                    result.add(tempList[i]);
                }
            }
        }
        return result;
    }

}
