package com.webmonitor.core.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseGroupsData<M extends BaseGroupsData<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Integer id) {
		set("id", id);
	}
	
	public java.lang.Integer getId() {
		return getInt("id");
	}

	public void setProGroupId(java.lang.Integer ProGroupId) {
		set("ProGroupId", ProGroupId);
	}
	
	public java.lang.Integer getProGroupId() {
		return getInt("ProGroupId");
	}

	public void setProGroupName(java.lang.String ProGroupName) {
		set("ProGroupName", ProGroupName);
	}
	
	public java.lang.String getProGroupName() {
		return getStr("ProGroupName");
	}

	public void setAgentNumber(java.lang.String agentNumber) {
		set("agentNumber", agentNumber);
	}
	
	public java.lang.String getAgentNumber() {
		return getStr("agentNumber");
	}

	public void setCreatetime(java.util.Date createtime) {
		set("createtime", createtime);
	}
	
	public java.util.Date getCreatetime() {
		return get("createtime");
	}

}
