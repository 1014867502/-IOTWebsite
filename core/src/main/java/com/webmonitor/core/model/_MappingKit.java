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
		arp.addMapping("agent_table", "id", AgentTable.class);
		arp.addMapping("groups_data", "id", GroupsData.class);
		arp.addMapping("staff_data", "id", StaffData.class);
		arp.addMapping("machine_data", "id", MachineData.class);
		arp.addMapping("sys_account", "ID", Account.class);
		arp.addMapping("sys_session", "accessToken", Session.class);
	}
}

