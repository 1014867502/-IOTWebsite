package com.webmonitor.admin.version;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.dal.VersionDataMysqlDAL;
import com.webmonitor.core.idal.IVersion;
import com.webmonitor.core.model.VersionData;

public class VersionService {
    public static final VersionService me = new VersionService();
    private static IVersion dal=new VersionDataMysqlDAL();

    public Page<VersionData> getAllVersion(int pageno, int limit) {
        return dal.getAllVersion(pageno, limit);
    }
}
