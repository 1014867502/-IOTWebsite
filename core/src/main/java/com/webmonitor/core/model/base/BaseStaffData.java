package com.webmonitor.core.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseStaffData<M extends BaseStaffData<M>> extends Model<M> implements IBean {

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

	public void setUAccountNum(java.lang.String uAccountNum) {
		set("uAccountNum", uAccountNum);
	}
	
	public java.lang.String getUAccountNum() {
		return getStr("uAccountNum");
	}

	public void setUPassword(java.lang.String uPassword) {
		set("uPassword", uPassword);
	}
	
	public java.lang.String getUPassword() {
		return getStr("uPassword");
	}

	public void setURealName(java.lang.String uRealName) {
		set("uRealName", uRealName);
	}
	
	public java.lang.String getURealName() {
		return getStr("uRealName");
	}

	public void setCDept(java.lang.String cDept) {
		set("cDept", cDept);
	}
	
	public java.lang.String getCDept() {
		return getStr("cDept");
	}

	public void setIRoleType(java.lang.Integer iRoleType) {
		set("iRoleType", iRoleType);
	}
	
	public java.lang.Integer getIRoleType() {
		return getInt("iRoleType");
	}

	public void setIAccountType(java.lang.Integer iAccountType) {
		set("iAccountType", iAccountType);
	}
	
	public java.lang.Integer getIAccountType() {
		return getInt("iAccountType");
	}

	public void setGroupAssemble(java.lang.String groupAssemble) {
		set("groupAssemble", groupAssemble);
	}
	
	public java.lang.String getGroupAssemble() {
		return getStr("groupAssemble");
	}

}
