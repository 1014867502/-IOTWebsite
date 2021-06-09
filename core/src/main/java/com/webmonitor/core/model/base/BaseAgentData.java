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

	public void setSerial(java.lang.String serial) {
		set("serial", serial);
	}
	
	public java.lang.String getSerial() {
		return getStr("serial");
	}

	public void setState(java.lang.String state) {
		set("state", state);
	}
	
	public java.lang.String getState() {
		return getStr("state");
	}

	public void setMachineName(java.lang.String machineName) {
		set("machineName", machineName);
	}
	
	public java.lang.String getMachineName() {
		return getStr("machineName");
	}

	public void setDate(java.lang.String date) {
		set("date", date);
	}
	
	public java.lang.String getDate() {
		return getStr("date");
	}

	public void setProGroupId(java.lang.Integer ProGroupId) {
		set("ProGroupId", ProGroupId);
	}
	
	public java.lang.Integer getProGroupId() {
		return getInt("ProGroupId");
	}

}
