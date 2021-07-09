package com.webmonitor.core.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseAgentData<M extends BaseAgentData<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Integer id) {
		set("id", id);
	}
	
	public java.lang.Integer getId() {
		return getInt("id");
	}

	public void setAgentNumber(java.lang.String agentNumber) {
		set("agentNumber", agentNumber);
	}
	
	public java.lang.String getAgentNumber() {
		return getStr("agentNumber");
	}

	public void setMachineSerial(java.lang.String machineSerial) {
		set("machineSerial", machineSerial);
	}
	
	public java.lang.String getMachineSerial() {
		return getStr("machineSerial");
	}

	public void setOnlineState(java.lang.String onlineState) {
		set("onlineState", onlineState);
	}
	
	public java.lang.String getOnlineState() {
		return getStr("onlineState");
	}

	public void setMachineName(java.lang.String machineName) {
		set("machineName", machineName);
	}
	
	public java.lang.String getMachineName() {
		return getStr("machineName");
	}

	public void setCreateTime(java.lang.String createTime) {
		set("createTime", createTime);
	}
	
	public java.lang.String getCreateTime() {
		return getStr("createTime");
	}

	public void setProGroupId(java.lang.Integer ProGroupId) {
		set("ProGroupId", ProGroupId);
	}
	
	public java.lang.Integer getProGroupId() {
		return getInt("ProGroupId");
	}

}
