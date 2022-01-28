package com.webmonitor.core.idal;

import com.jfinal.plugin.activerecord.Page;
import com.webmonitor.core.model.VersionData;
import com.webmonitor.core.model.userbase.DeviceSensorList;

/**版本表**/
public interface IVersion {
    /**获取设备外接传感器列表**/
    Page<VersionData> getAllVersion(int pageno, int limit);
}
