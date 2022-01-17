package com.webmonitor.core.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseMachineData<M extends BaseMachineData<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Integer id) {
		set("id", id);
	}
	
	public java.lang.Integer getId() {
		return getInt("id");
	}

	public void setMachineSerial(java.lang.String machineSerial) {
		set("machineSerial", machineSerial);
	}
	
	public java.lang.String getMachineSerial() {
		return getStr("machineSerial");
	}

	public void setMachineModel(java.lang.String machineModel) {
		set("machineModel", machineModel);
	}
	
	public java.lang.String getMachineModel() {
		return getStr("machineModel");
	}

	public void setHardwareVer(java.lang.String hardwareVer) {
		set("hardwareVer", hardwareVer);
	}
	
	public java.lang.String getHardwareVer() {
		return getStr("hardwareVer");
	}

	public void setOsVer(java.lang.String osVer) {
		set("osVer", osVer);
	}
	
	public java.lang.String getOsVer() {
		return getStr("osVer");
	}

	public void setMcuVer(java.lang.String mcuVer) {
		set("mcuVer", mcuVer);
	}
	
	public java.lang.String getMcuVer() {
		return getStr("mcuVer");
	}

	public void setFirmwareVer(java.lang.String firmwareVer) {
		set("firmwareVer", firmwareVer);
	}
	
	public java.lang.String getFirmwareVer() {
		return getStr("firmwareVer");
	}

	public void setManufactureDate(java.lang.String manufactureDate) {
		set("manufactureDate", manufactureDate);
	}
	
	public java.lang.String getManufactureDate() {
		return getStr("manufactureDate");
	}

	public void setPuwerLever(java.lang.String puwerLever) {
		set("puwerLever", puwerLever);
	}
	
	public java.lang.String getPuwerLever() {
		return getStr("puwerLever");
	}

	public void setExtVoltage(java.lang.String extVoltage) {
		set("extVoltage", extVoltage);
	}
	
	public java.lang.String getExtVoltage() {
		return getStr("extVoltage");
	}

	public void setInsideSpace(java.lang.String insideSpace) {
		set("insideSpace", insideSpace);
	}
	
	public java.lang.String getInsideSpace() {
		return getStr("insideSpace");
	}

	public void setSdSpace(java.lang.String sdSpace) {
		set("sdSpace", sdSpace);
	}
	
	public java.lang.String getSdSpace() {
		return getStr("sdSpace");
	}

	public void setDataLink(java.lang.String dataLink) {
		set("dataLink", dataLink);
	}
	
	public java.lang.String getDataLink() {
		return getStr("dataLink");
	}

	public void setTimeZone(java.lang.String timeZone) {
		set("timeZone", timeZone);
	}
	
	public java.lang.String getTimeZone() {
		return getStr("timeZone");
	}

	public void setRtkPos(java.lang.String rtkPos) {
		set("rtkPos", rtkPos);
	}
	
	public java.lang.String getRtkPos() {
		return getStr("rtkPos");
	}

	public void setImuWarn(java.lang.String imuWarn) {
		set("imuWarn", imuWarn);
	}
	
	public java.lang.String getImuWarn() {
		return getStr("imuWarn");
	}

	public void setRawName(java.lang.String rawName) {
		set("rawName", rawName);
	}
	
	public java.lang.String getRawName() {
		return getStr("rawName");
	}

	public void setRawMode(java.lang.String rawMode) {
		set("rawMode", rawMode);
	}
	
	public java.lang.String getRawMode() {
		return getStr("rawMode");
	}

	public void setRecordInterval(java.lang.String recordInterval) {
		set("recordInterval", recordInterval);
	}
	
	public java.lang.String getRecordInterval() {
		return getStr("recordInterval");
	}

	public void setRawIp(java.lang.String rawIp) {
		set("rawIp", rawIp);
	}
	
	public java.lang.String getRawIp() {
		return getStr("rawIp");
	}

	public void setRawPort(java.lang.String rawPort) {
		set("rawPort", rawPort);
	}
	
	public java.lang.String getRawPort() {
		return getStr("rawPort");
	}

	public void setResultIp(java.lang.String resultIp) {
		set("resultIp", resultIp);
	}
	
	public java.lang.String getResultIp() {
		return getStr("resultIp");
	}

	public void setResultPort(java.lang.String resultPort) {
		set("resultPort", resultPort);
	}
	
	public java.lang.String getResultPort() {
		return getStr("resultPort");
	}

	public void setResultStatus(java.lang.String resultStatus) {
		set("resultStatus", resultStatus);
	}
	
	public java.lang.String getResultStatus() {
		return getStr("resultStatus");
	}

	public void setResultMsg(java.lang.String resultMsg) {
		set("resultMsg", resultMsg);
	}
	
	public java.lang.String getResultMsg() {
		return getStr("resultMsg");
	}

	public void setResultRs232(java.lang.String resultRs232) {
		set("resultRs232", resultRs232);
	}
	
	public java.lang.String getResultRs232() {
		return getStr("resultRs232");
	}

	public void setResultImu(java.lang.String resultImu) {
		set("resultImu", resultImu);
	}
	
	public java.lang.String getResultImu() {
		return getStr("resultImu");
	}

	public void setSecondBase(java.lang.String secondBase) {
		set("secondBase", secondBase);
	}
	
	public java.lang.String getSecondBase() {
		return getStr("secondBase");
	}

	public void setSecondIp(java.lang.String secondIp) {
		set("secondIp", secondIp);
	}
	
	public java.lang.String getSecondIp() {
		return getStr("secondIp");
	}

	public void setSecondPort(java.lang.String secondPort) {
		set("secondPort", secondPort);
	}
	
	public java.lang.String getSecondPort() {
		return getStr("secondPort");
	}

	public void setRawRate(java.lang.String rawRate) {
		set("rawRate", rawRate);
	}
	
	public java.lang.String getRawRate() {
		return getStr("rawRate");
	}

	public void setDoubleInv(java.lang.String doubleInv) {
		set("doubleInv", doubleInv);
	}
	
	public java.lang.String getDoubleInv() {
		return getStr("doubleInv");
	}

	public void setResultSmooth(java.lang.String resultSmooth) {
		set("resultSmooth", resultSmooth);
	}
	
	public java.lang.String getResultSmooth() {
		return getStr("resultSmooth");
	}

	public void setExtSensorEnabled(java.lang.String extSensorEnabled) {
		set("extSensorEnabled", extSensorEnabled);
	}
	
	public java.lang.String getExtSensorEnabled() {
		return getStr("extSensorEnabled");
	}

	public void setExtSensorPower(java.lang.String extSensorPower) {
		set("extSensorPower", extSensorPower);
	}
	
	public java.lang.String getExtSensorPower() {
		return getStr("extSensorPower");
	}

	public void setExtSensorCmd(java.lang.String extSensorCmd) {
		set("extSensorCmd", extSensorCmd);
	}
	
	public java.lang.String getExtSensorCmd() {
		return getStr("extSensorCmd");
	}

	public void setScheduler(java.lang.String scheduler) {
		set("scheduler", scheduler);
	}
	
	public java.lang.String getScheduler() {
		return getStr("scheduler");
	}

	public void setMoveWarnEnabled(java.lang.String moveWarnEnabled) {
		set("moveWarnEnabled", moveWarnEnabled);
	}
	
	public java.lang.String getMoveWarnEnabled() {
		return getStr("moveWarnEnabled");
	}

	public void setMoveWarnThreshold(java.lang.String moveWarnThreshold) {
		set("moveWarnThreshold", moveWarnThreshold);
	}
	
	public java.lang.String getMoveWarnThreshold() {
		return getStr("moveWarnThreshold");
	}

	public void setMoveWarnBaud(java.lang.String moveWarnBaud) {
		set("moveWarnBaud", moveWarnBaud);
	}
	
	public java.lang.String getMoveWarnBaud() {
		return getStr("moveWarnBaud");
	}

	public void setMoveWarnCmd(java.lang.String moveWarnCmd) {
		set("moveWarnCmd", moveWarnCmd);
	}
	
	public java.lang.String getMoveWarnCmd() {
		return getStr("moveWarnCmd");
	}

	public void setMoveWarnMems(java.lang.String moveWarnMems) {
		set("moveWarnMems", moveWarnMems);
	}
	
	public java.lang.String getMoveWarnMems() {
		return getStr("moveWarnMems");
	}

	public void setDzIotEnabled(java.lang.String dzIotEnabled) {
		set("dzIotEnabled", dzIotEnabled);
	}
	
	public java.lang.String getDzIotEnabled() {
		return getStr("dzIotEnabled");
	}

	public void setDzIotId(java.lang.String dzIotId) {
		set("dzIotId", dzIotId);
	}
	
	public java.lang.String getDzIotId() {
		return getStr("dzIotId");
	}

	public void setDzIotIp(java.lang.String dzIotIp) {
		set("dzIotIp", dzIotIp);
	}
	
	public java.lang.String getDzIotIp() {
		return getStr("dzIotIp");
	}

	public void setDzIotPort(java.lang.String dzIotPort) {
		set("dzIotPort", dzIotPort);
	}
	
	public java.lang.String getDzIotPort() {
		return getStr("dzIotPort");
	}

	public void setDzIotKey(java.lang.String dzIotKey) {
		set("dzIotKey", dzIotKey);
	}
	
	public java.lang.String getDzIotKey() {
		return getStr("dzIotKey");
	}

	public void setDzIotGnssData(java.lang.String dzIotGnssData) {
		set("dzIotGnssData", dzIotGnssData);
	}
	
	public java.lang.String getDzIotGnssData() {
		return getStr("dzIotGnssData");
	}

	public void setDzIotHttp(java.lang.String dzIotHttp) {
		set("dzIotHttp", dzIotHttp);
	}
	
	public java.lang.String getDzIotHttp() {
		return getStr("dzIotHttp");
	}

	public void setCqIotEnabled(java.lang.String cqIotEnabled) {
		set("cqIotEnabled", cqIotEnabled);
	}
	
	public java.lang.String getCqIotEnabled() {
		return getStr("cqIotEnabled");
	}

	public void setCqIotTelecom(java.lang.String cqIotTelecom) {
		set("cqIotTelecom", cqIotTelecom);
	}
	
	public java.lang.String getCqIotTelecom() {
		return getStr("cqIotTelecom");
	}

	public void setCqIotId(java.lang.String cqIotId) {
		set("cqIotId", cqIotId);
	}
	
	public java.lang.String getCqIotId() {
		return getStr("cqIotId");
	}

	public void setCqIotUser(java.lang.String cqIotUser) {
		set("cqIotUser", cqIotUser);
	}
	
	public java.lang.String getCqIotUser() {
		return getStr("cqIotUser");
	}

	public void setCqIotKey(java.lang.String cqIotKey) {
		set("cqIotKey", cqIotKey);
	}
	
	public java.lang.String getCqIotKey() {
		return getStr("cqIotKey");
	}

	public void setCqIotStatus(java.lang.String cqIotStatus) {
		set("cqIotStatus", cqIotStatus);
	}
	
	public java.lang.String getCqIotStatus() {
		return getStr("cqIotStatus");
	}

	public void setOneNetEnabled(java.lang.String oneNetEnabled) {
		set("oneNetEnabled", oneNetEnabled);
	}
	
	public java.lang.String getOneNetEnabled() {
		return getStr("oneNetEnabled");
	}

	public void setOneNetId(java.lang.String oneNetId) {
		set("oneNetId", oneNetId);
	}
	
	public java.lang.String getOneNetId() {
		return getStr("oneNetId");
	}

	public void setOneNetUser(java.lang.String oneNetUser) {
		set("oneNetUser", oneNetUser);
	}
	
	public java.lang.String getOneNetUser() {
		return getStr("oneNetUser");
	}

	public void setOneNetKey(java.lang.String oneNetKey) {
		set("oneNetKey", oneNetKey);
	}
	
	public java.lang.String getOneNetKey() {
		return getStr("oneNetKey");
	}

	public void setOneNetGnssData(java.lang.String oneNetGnssData) {
		set("oneNetGnssData", oneNetGnssData);
	}
	
	public java.lang.String getOneNetGnssData() {
		return getStr("oneNetGnssData");
	}

	public void setWifiMode(java.lang.String wifiMode) {
		set("wifiMode", wifiMode);
	}
	
	public java.lang.String getWifiMode() {
		return getStr("wifiMode");
	}

	public void setWifiSsid(java.lang.String wifiSsid) {
		set("wifiSsid", wifiSsid);
	}
	
	public java.lang.String getWifiSsid() {
		return getStr("wifiSsid");
	}

	public void setWifiPass(java.lang.String wifiPass) {
		set("wifiPass", wifiPass);
	}
	
	public java.lang.String getWifiPass() {
		return getStr("wifiPass");
	}

	public void setWifiDhcp(java.lang.String wifiDhcp) {
		set("wifiDhcp", wifiDhcp);
	}
	
	public java.lang.String getWifiDhcp() {
		return getStr("wifiDhcp");
	}

	public void setWifiIp(java.lang.String wifiIp) {
		set("wifiIp", wifiIp);
	}
	
	public java.lang.String getWifiIp() {
		return getStr("wifiIp");
	}

	public void setWifiMask(java.lang.String wifiMask) {
		set("wifiMask", wifiMask);
	}
	
	public java.lang.String getWifiMask() {
		return getStr("wifiMask");
	}

	public void setWifiGateway(java.lang.String wifiGateway) {
		set("wifiGateway", wifiGateway);
	}
	
	public java.lang.String getWifiGateway() {
		return getStr("wifiGateway");
	}

	public void setWifiDns1(java.lang.String wifiDns1) {
		set("wifiDns1", wifiDns1);
	}
	
	public java.lang.String getWifiDns1() {
		return getStr("wifiDns1");
	}

	public void setWifDns2(java.lang.String wifDns2) {
		set("wifDns2", wifDns2);
	}
	
	public java.lang.String getWifDns2() {
		return getStr("wifDns2");
	}

	public void setWifiExtAntenna(java.lang.String wifiExtAntenna) {
		set("wifiExtAntenna", wifiExtAntenna);
	}
	
	public java.lang.String getWifiExtAntenna() {
		return getStr("wifiExtAntenna");
	}

	public void setWifiBand(java.lang.String wifiBand) {
		set("wifiBand", wifiBand);
	}
	
	public java.lang.String getWifiBand() {
		return getStr("wifiBand");
	}

	public void setWifiSignalLevel(java.lang.String wifiSignalLevel) {
		set("wifiSignalLevel", wifiSignalLevel);
	}
	
	public java.lang.String getWifiSignalLevel() {
		return getStr("wifiSignalLevel");
	}

	public void setWifiPrefix(java.lang.String wifiPrefix) {
		set("wifiPrefix", wifiPrefix);
	}
	
	public java.lang.String getWifiPrefix() {
		return getStr("wifiPrefix");
	}

	public void setWifiApPass(java.lang.String wifiApPass) {
		set("wifiApPass", wifiApPass);
	}
	
	public java.lang.String getWifiApPass() {
		return getStr("wifiApPass");
	}

	public void setNetworkInfoModel(java.lang.String networkInfoModel) {
		set("networkInfoModel", networkInfoModel);
	}
	
	public java.lang.String getNetworkInfoModel() {
		return getStr("networkInfoModel");
	}

	public void setNetworkStatus(java.lang.String networkStatus) {
		set("networkStatus", networkStatus);
	}
	
	public java.lang.String getNetworkStatus() {
		return getStr("networkStatus");
	}

	public void setNetworkErrorcode(java.lang.String networkErrorcode) {
		set("networkErrorcode", networkErrorcode);
	}
	
	public java.lang.String getNetworkErrorcode() {
		return getStr("networkErrorcode");
	}

	public void setNetworksignalLevel(java.lang.String networksignalLevel) {
		set("networkSignal_level", networksignalLevel);
	}
	
	public java.lang.String getNetworksignalLevel() {
		return getStr("networkSignal_level");
	}

	public void setNetworkEnabled(java.lang.String networkEnabled) {
		set("networkEnabled", networkEnabled);
	}
	
	public java.lang.String getNetworkEnabled() {
		return getStr("networkEnabled");
	}

	public void setNetworkApn(java.lang.String networkApn) {
		set("networkApn", networkApn);
	}
	
	public java.lang.String getNetworkApn() {
		return getStr("networkApn");
	}

	public void setNetworkApnUser(java.lang.String networkApnUser) {
		set("networkApnUser", networkApnUser);
	}
	
	public java.lang.String getNetworkApnUser() {
		return getStr("networkApnUser");
	}

	public void setNetworkApnPass(java.lang.String networkApnPass) {
		set("networkApnPass", networkApnPass);
	}
	
	public java.lang.String getNetworkApnPass() {
		return getStr("networkApnPass");
	}

	public void setNetworkMode(java.lang.String networkMode) {
		set("networkMode", networkMode);
	}
	
	public java.lang.String getNetworkMode() {
		return getStr("networkMode");
	}

	public void setNetworkAddress(java.lang.String networkAddress) {
		set("networkAddress", networkAddress);
	}
	
	public java.lang.String getNetworkAddress() {
		return getStr("networkAddress");
	}

	public void setNetworkPort(java.lang.String networkPort) {
		set("networkPort", networkPort);
	}
	
	public java.lang.String getNetworkPort() {
		return getStr("networkPort");
	}

	public void setNetworkMountpoint(java.lang.String networkMountpoint) {
		set("networkMountpoint", networkMountpoint);
	}
	
	public java.lang.String getNetworkMountpoint() {
		return getStr("networkMountpoint");
	}

	public void setNetworkMountpointPass(java.lang.String networkMountpointPass) {
		set("networkMountpointPass", networkMountpointPass);
	}
	
	public java.lang.String getNetworkMountpointPass() {
		return getStr("networkMountpointPass");
	}

	public void setNetworkUploadGga(java.lang.String networkUploadGga) {
		set("networkUploadGga", networkUploadGga);
	}
	
	public java.lang.String getNetworkUploadGga() {
		return getStr("networkUploadGga");
	}

	public void setCoordcvtEnabled(java.lang.String coordcvtEnabled) {
		set("coordcvtEnabled", coordcvtEnabled);
	}
	
	public java.lang.String getCoordcvtEnabled() {
		return getStr("coordcvtEnabled");
	}

	public void setCoordcvtSrcDatum(java.lang.String coordcvtSrcDatum) {
		set("coordcvtSrcDatum", coordcvtSrcDatum);
	}
	
	public java.lang.String getCoordcvtSrcDatum() {
		return getStr("coordcvtSrcDatum");
	}

	public void setCoordcvtDstDatum(java.lang.String coordcvtDstDatum) {
		set("coordcvtDstDatum", coordcvtDstDatum);
	}
	
	public java.lang.String getCoordcvtDstDatum() {
		return getStr("coordcvtDstDatum");
	}

	public void setCoordcvtSevenParam(java.lang.String coordcvtSevenParam) {
		set("coordcvtSevenParam", coordcvtSevenParam);
	}
	
	public java.lang.String getCoordcvtSevenParam() {
		return getStr("coordcvtSevenParam");
	}

	public void setCoordcvtFourParam(java.lang.String coordcvtFourParam) {
		set("coordcvtFourParam", coordcvtFourParam);
	}
	
	public java.lang.String getCoordcvtFourParam() {
		return getStr("coordcvtFourParam");
	}

	public void setCoordcvtProjParam(java.lang.String coordcvtProjParam) {
		set("coordcvtProjParam", coordcvtProjParam);
	}
	
	public java.lang.String getCoordcvtProjParam() {
		return getStr("coordcvtProjParam");
	}

	public void setEleMask(java.lang.String eleMask) {
		set("eleMask", eleMask);
	}
	
	public java.lang.String getEleMask() {
		return getStr("eleMask");
	}

	public void setSmsWakeup(java.lang.String smsWakeup) {
		set("smsWakeup", smsWakeup);
	}
	
	public java.lang.String getSmsWakeup() {
		return getStr("smsWakeup");
	}

	public void setCoordinatesX(java.lang.String coordinatesX) {
		set("coordinatesX", coordinatesX);
	}
	
	public java.lang.String getCoordinatesX() {
		return getStr("coordinatesX");
	}

	public void setCoordinatesY(java.lang.String coordinatesY) {
		set("coordinatesY", coordinatesY);
	}
	
	public java.lang.String getCoordinatesY() {
		return getStr("coordinatesY");
	}

	public void setCoordinatesZ(java.lang.String coordinatesZ) {
		set("coordinatesZ", coordinatesZ);
	}
	
	public java.lang.String getCoordinatesZ() {
		return getStr("coordinatesZ");
	}

	public void setBaseLon(java.lang.String baseLon) {
		set("baseLon", baseLon);
	}
	
	public java.lang.String getBaseLon() {
		return getStr("baseLon");
	}

	public void setBaseLat(java.lang.String baseLat) {
		set("baseLat", baseLat);
	}
	
	public java.lang.String getBaseLat() {
		return getStr("baseLat");
	}

	public void setBaseHeight(java.lang.String baseHeight) {
		set("baseHeight", baseHeight);
	}
	
	public java.lang.String getBaseHeight() {
		return getStr("baseHeight");
	}

	public void setPositionLon(java.lang.String positionLon) {
		set("positionLon", positionLon);
	}
	
	public java.lang.String getPositionLon() {
		return getStr("positionLon");
	}

	public void setPositionLat(java.lang.String positionLat) {
		set("positionLat", positionLat);
	}
	
	public java.lang.String getPositionLat() {
		return getStr("positionLat");
	}

	public void setPositionHeight(java.lang.String positionHeight) {
		set("positionHeight", positionHeight);
	}
	
	public java.lang.String getPositionHeight() {
		return getStr("positionHeight");
	}

	public void setRawBackEnabled(java.lang.String rawBackEnabled) {
		set("rawBackEnabled", rawBackEnabled);
	}
	
	public java.lang.String getRawBackEnabled() {
		return getStr("rawBackEnabled");
	}

	public void setRawBackAddress(java.lang.String rawBackAddress) {
		set("rawBackAddress", rawBackAddress);
	}
	
	public java.lang.String getRawBackAddress() {
		return getStr("rawBackAddress");
	}

	public void setRawBackPort(java.lang.String rawBackPort) {
		set("rawBackPort", rawBackPort);
	}
	
	public java.lang.String getRawBackPort() {
		return getStr("rawBackPort");
	}

	public void setRawBackGnssData(java.lang.String rawBackGnssData) {
		set("rawBackGnssData", rawBackGnssData);
	}
	
	public java.lang.String getRawBackGnssData() {
		return getStr("rawBackGnssData");
	}

	public void setRawBackUser(java.lang.String rawBackUser) {
		set("rawBackUser", rawBackUser);
	}
	
	public java.lang.String getRawBackUser() {
		return getStr("rawBackUser");
	}

	public void setRawBackPass(java.lang.String rawBackPass) {
		set("rawBackPass", rawBackPass);
	}
	
	public java.lang.String getRawBackPass() {
		return getStr("rawBackPass");
	}

	public void setRawBackBaud(java.lang.String rawBackBaud) {
		set("rawBackBaud", rawBackBaud);
	}
	
	public java.lang.String getRawBackBaud() {
		return getStr("rawBackBaud");
	}

	public void setDzIotRtkResult(java.lang.String dzIotRtkResult) {
		set("dzIotRtkResult", dzIotRtkResult);
	}
	
	public java.lang.String getDzIotRtkResult() {
		return getStr("dzIotRtkResult");
	}

	public void setNtrIpBase(java.lang.String ntrIpBase) {
		set("ntrIpBase", ntrIpBase);
	}
	
	public java.lang.String getNtrIpBase() {
		return getStr("ntrIpBase");
	}

	public void setOneNetMode(java.lang.String oneNetMode) {
		set("oneNetMode", oneNetMode);
	}
	
	public java.lang.String getOneNetMode() {
		return getStr("oneNetMode");
	}

	public void setAccessKey(java.lang.String accessKey) {
		set("accessKey", accessKey);
	}
	
	public java.lang.String getAccessKey() {
		return getStr("accessKey");
	}

	public void setConnectState(java.lang.Long connectState) {
		set("connectState", connectState);
	}
	
	public java.lang.Long getConnectState() {
		return getLong("connectState");
	}

	public void setUpdateTime(java.lang.String updateTime) {
		set("updateTime", updateTime);
	}
	
	public java.lang.String getUpdateTime() {
		return getStr("updateTime");
	}

	public void setRawSolution(java.lang.String rawSolution) {
		set("rawSolution", rawSolution);
	}
	
	public java.lang.String getRawSolution() {
		return getStr("rawSolution");
	}

	public void setNtripArg(java.lang.String ntripArg) {
		set("ntripArg", ntripArg);
	}
	
	public java.lang.String getNtripArg() {
		return getStr("ntripArg");
	}

	public void setSecondArg(java.lang.String secondArg) {
		set("secondArg", secondArg);
	}
	
	public java.lang.String getSecondArg() {
		return getStr("secondArg");
	}

	public void setSecondNtripBase(java.lang.String secondNtripBase) {
		set("secondNtripBase", secondNtripBase);
	}
	
	public java.lang.String getSecondNtripBase() {
		return getStr("secondNtripBase");
	}

	public void setGpsSerial(java.lang.String gpsSerial) {
		set("gpsSerial", gpsSerial);
	}
	
	public java.lang.String getGpsSerial() {
		return getStr("gpsSerial");
	}

	public void setGpsModel(java.lang.String gpsModel) {
		set("gpsModel", gpsModel);
	}
	
	public java.lang.String getGpsModel() {
		return getStr("gpsModel");
	}

	public void setGpsFirmwareVer(java.lang.String gpsFirmwareVer) {
		set("gpsFirmwareVer", gpsFirmwareVer);
	}
	
	public java.lang.String getGpsFirmwareVer() {
		return getStr("gpsFirmwareVer");
	}

	public void setGpsEleMask(java.lang.String gpsEleMask) {
		set("gpsEleMask", gpsEleMask);
	}
	
	public java.lang.String getGpsEleMask() {
		return getStr("gpsEleMask");
	}

	public void setGpsBeiDou(java.lang.String gpsBeiDou) {
		set("gpsBeiDou", gpsBeiDou);
	}
	
	public java.lang.String getGpsBeiDou() {
		return getStr("gpsBeiDou");
	}

	public void setGlonass(java.lang.String glonass) {
		set("glonass", glonass);
	}
	
	public java.lang.String getGlonass() {
		return getStr("glonass");
	}

	public void setGaLileo(java.lang.String gaLileo) {
		set("gaLileo", gaLileo);
	}
	
	public java.lang.String getGaLileo() {
		return getStr("gaLileo");
	}

	public void setProName(java.lang.String proName) {
		set("proName", proName);
	}
	
	public java.lang.String getProName() {
		return getStr("proName");
	}

	public void setRawStatus(java.lang.String rawStatus) {
		set("rawStatus", rawStatus);
	}
	
	public java.lang.String getRawStatus() {
		return getStr("rawStatus");
	}

	public void setRawBackStatus(java.lang.String rawBackStatus) {
		set("rawBackStatus", rawBackStatus);
	}
	
	public java.lang.String getRawBackStatus() {
		return getStr("rawBackStatus");
	}

	public void setNetworkState(java.lang.String networkState) {
		set("networkState", networkState);
	}
	
	public java.lang.String getNetworkState() {
		return getStr("networkState");
	}

	public void setWifiEnable(java.lang.String wifiEnable) {
		set("wifiEnable", wifiEnable);
	}
	
	public java.lang.String getWifiEnable() {
		return getStr("wifiEnable");
	}

	public void setExpireDate(java.lang.String expireDate) {
		set("expireDate", expireDate);
	}
	
	public java.lang.String getExpireDate() {
		return getStr("expireDate");
	}

}
