package com.webmonitor.core.model;

import com.jfinal.plugin.activerecord.ActiveRecordPlugin;

/**
 * Generated by JFinal, do not modify this file.
 * <pre>
 * Example:
 * public void configPlugin(Plugins me) {
 *     ActiveRecordPlugin arp = new ActiveRecordPlugin(...);
 *     _MappingKit.mapping(arp);
 *     me.add(arp);
 * }
 * </pre>
 */
public class _MappingKit {
	
	public static void mapping(ActiveRecordPlugin arp) {
		arp.addMapping("version_data", "id", VersionData.class);
		arp.addMapping("version_data_copy1", "id", VersionDataCopy1.class);
		arp.addMapping("staff_data", "id", StaffData.class);
		arp.addMapping("machine_data", "id", MachineData.class);
		arp.addMapping("template_data", "id", TemplateData.class);
		arp.addMapping("projects_data", "Id", ProjectsData.class);
		arp.addMapping("agent_table", "id", AgentTable.class);
		arp.addMapping("agent_data", "id", AgentDataDao.class);
		arp.addMapping("sys_account", "ID", Account.class);
		arp.addMapping("sys_session", "accessToken", Session.class);
		arp.addMapping("cache_order", "id", CacheOrder.class);
		arp.addMapping("update_data", "id", UpdateData.class);
		arp.addMapping("take_note", "id", TakeNote.class);
	}
}

