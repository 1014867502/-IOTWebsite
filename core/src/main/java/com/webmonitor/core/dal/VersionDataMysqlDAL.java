package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.idal.IVersion;
import com.webmonitor.core.model.VersionData;

import java.util.ArrayList;
import java.util.List;

public class VersionDataMysqlDAL implements IVersion {
    @Override
    public Page<VersionData> getAllVersion(int pageno, int limit) {
        String sql="from version_data where id in(1,4,5,6,7)";
        Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
        List<Record> recordList = page.getList();
        List<VersionData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            VersionData map = new VersionData();
            map.setId(record.getInt("id"));
            map.setVersionCode(record.getInt("versionCode"));
            map.setDownloadUrl(record.getStr("downloadUrl"));
            map.setVersionType(record.getInt("versionType"));
            map.setVersionContent(record.getStr("versionContent"));
            rslist.add(map);
        }
        return new Page<VersionData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }
}
