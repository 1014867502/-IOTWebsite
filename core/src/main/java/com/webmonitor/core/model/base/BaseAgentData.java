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

	public void setProGroupId(java.lang.Integer proGroupId) {
		set("proGroupId", proGroupId);
	}
	
	public java.lang.Integer getProGroupId() {
		return getInt("proGroupId");
	}

	public void setMainModel(java.lang.String mainModel) {
		set("mainModel", mainModel);
	}
	
	public java.lang.String getMainModel() {
		return getStr("mainModel");
	}

	public void setOrderNumber(java.lang.String orderNumber) {
		set("orderNumber", orderNumber);
	}
	
	public java.lang.String getOrderNumber() {
		return getStr("orderNumber");
	}

	public void setProductCode(java.lang.String productCode) {
		set("productCode", productCode);
	}
	
	public java.lang.String getProductCode() {
		return getStr("productCode");
	}

	public void setFirmwareType(java.lang.String firmwareType) {
		set("firmwareType", firmwareType);
	}
	
	public java.lang.String getFirmwareType() {
		return getStr("firmwareType");
	}

}
