package com.webmonitor.core.model;

public class MachineInfoEntity {

    /**
     * id : 7
     * serial : MS10640041007
     * model : M3II
     * mcuVer : 2.08
     * firmwareVer : 3.0.20210425
     * puwerLever : 100
     * extVoltage : 15.440
     * space : 27016528|29970656
     * dataLink : 网络
     * timeZone : 12
     * rtkPos : 1
     * imuWarn : 1
     * rawName : MS07
     * rawMode : 0
     * recordInterval : 6
     * rawIp : 192.168.21.200
     * rawPort : 9993
     * resultIp : 192.168.4.10
     * resultPort : 9991
     * resultMsg : GEOPOS
     * resultRs232 : 38400
     * resultImu :
     * secondBase : 0
     * secondIp :
     * secondPort : 0
     * rate : 60000
     * doubleInv : 0
     * resultSmooth : 0
     * extSensorEnabled : 0
     * extSensorCmd :
     * scheduler : 47|12|12|20
     * moveWarnEnabled : 1
     * moveWarnThreshold : 6|7|8
     * moveWarnBaud : -9600
     * moveWarnCmd :
     * dzIotEnabled : 1
     * dzIotId : 440000125628|MS10649101010
     * dzIotIp : ghiot.cigem.cn
     * dzIotPort : 1883
     * dzIotKey : f552f9de134e43808edf|f6e9865a7f7bfbe073f7
     * dzIotGnssData : 1
     * cqIotEnabled : 2
     * cqIotTelecom : 3
     * cqIotId : 123
     * cqIotUser : 5ea5373f826c67041c53732e_864388040512828
     * cqIotKey : 456
     * cqIotStatus : 0433
     * oneNetEnabled : 1
     * oneNetId : 147
     * oneNetUser : 258
     * oneNetKey : 369
     * oneNetGnssData : 123456789
     * wifiMode : CLIENT
     * wifiSsid : miniWIFI
     * wifiPass : geo110310
     * wifiDhcp : 1
     * wifiMask :
     * wifiGateway :
     * wifiDns1 :
     * wifDns2 :
     * wifiExtAntenna : 1
     * wifiBand : 0
     * wifiSignalLevel :  -18 dBm
     * wifiPrefix : M3
     * wifiApPass : 12345678
     * networkStatus : 0432
     * networksignalLevel : 0%
     * networkEnabled : 1
     * networkApn : CMNET
     * networkApnUser : ctnet@mycdma.cn
     * networkApnPass : vnet.mobi
     * networkMode : NTRIP
     * networkAddress : 47.107.86.207
     * networkPort : 6070
     * networkMountpoint : RTCM30
     * networMountpointPass : M5|pass
     * networkUploadGga : 5
     * coordcvtEnabled : 1
     * coordcvtSrcDatum : WGS84|6378137|298.257223563
     * coordcvtDstDatum : WGS84|6378137|298.257223563
     * coordcvtSevenParam : 1|01|02|03|04|05|06|07
     * coordcvtFourParam : 1|5|6|7|8|0|0
     * coordcvtProjParam : 1|3.0|0.9996|10|20|30|6.0|2.0|0.123|0.456
     * smsWakeup : 1
     * coordinatesX : -2332838.3151
     * coordinatesY : 5383250.0930
     * coordinatesZ : 2493557.7768
     * rawBackEnabled : 1
     * rawBackAddress : 39.108.76.11
     * rawBackPort : 8590
     * rawBackGnssData : 0
     */
    private Long _id;//主键id

    private String machineSerial;
    private String machineModel;
    private String mcuVer;
    private String firmwareVer;
    private String puwerLever;
    private String extVoltage;
    private String insideSpace;
    private String dataLink;
    private String timeZone;
    private String rtkPos;
    private String imuWarn;
    private String rawName;
    private String rawMode;
    private String recordInterval;
    private String rawIp;
    private String rawPort;
    private String resultIp;
    private String resultPort;
    private String resultMsg;
    private String resultRs232;
    private String resultImu;
    private String secondBase;
    private String secondIp;
    private String secondPort;
    private String rawRate;
    private String doubleInv;
    private String resultSmooth;
    private String resultStatus;
    private String extSensorEnabled;
    private String extSensorCmd;
    private String extSensorPower;
    private String scheduler;
    private String moveWarnEnabled;
    private String moveWarnThreshold;
    private String moveWarnBaud;
    private String moveWarnCmd;
    private String moveALiYunSms;
    private String dzIotEnabled;
    private String dzIotId;
    private String dzIotIp;
    private String dzIotPort;
    private String dzIotKey;
    private String dzIotHttp;
    private String dzIotGnssData;
    private String cqIotEnabled;
    private String cqIotTelecom;
    private String cqIotId;
    private String cqIotUser;
    private String cqIotKey;
    private String cqIotStatus;
    private String oneNetEnabled;
    private String oneNetId;
    private String oneNetUser;
    private String oneNetKey;
    private String oneNetGnssData;
    private String wifiMode;
    private String wifiSsid;
    private String wifiPass;
    private String wifiDhcp;
    private String wifiMask;
    private String wifiGateway;
    private String wifiDns1;
    private String wifDns2;
    private String wifiExtAntenna;
    private String wifiBand;
    private String wifiSignalLevel;
    private String wifiPrefix;
    private String wifiApPass;
    private String wifiIp;
    private String networkStatus;
    private String networksignalLevel;
    private String networkEnabled;
    private String networkApn;
    private String networkApnUser;
    private String networkApnPass;
    private String networkMode;
    private String networkAddress;
    private String networkPort;
    private String networkMountpoint;
    private String networkMountpointUse;
    private String networkMountpointPass;
    private String networkUploadGga;
    private String ntripArg;
    private String coordcvtEnabled;
    private String coordcvtSrcDatum;
    private String coordcvtDstDatum;
    private String coordcvtSevenParam;
    private String coordcvtFourParam;
    private String coordcvtProjParam;
    private String smsWakeup;
    private String coordinatesX;
    private String coordinatesY;
    private String coordinatesZ;
    private String rawBackEnabled;
    private String rawBackAddress;
    private String rawBackPort;
    private String rawBackGnssData;
    private String rawBackUser;
    private String rawBackPass;
    private String rawBackBaud;
    private String rawSolution;
    private String dzIotRtkResult;
    private String moveWarnMems;
    private String ntrIpBase;
    private int connectState;
    private String baseLon;
    private String baseLat;
    private String baseHeight;
    private String oneNetMode;
    private String accessKey;
    private String secondArg;
    private String secondNtripBase;
    private String gpsSerial;
    private String gpsModel;
    private String gpsFirmwareVer;
    private String gpsEleMask;
    private String gpsBeiDou;
    private String glonass;
    private String gaLileo;
    public MachineInfoEntity(Long _id, String machineSerial, String machineModel,
            String mcuVer, String firmwareVer, String puwerLever, String extVoltage,
            String insideSpace, String dataLink, String timeZone, String rtkPos,
            String imuWarn, String rawName, String rawMode, String recordInterval,
            String rawIp, String rawPort, String resultIp, String resultPort,
            String resultMsg, String resultRs232, String resultImu,
            String secondBase, String secondIp, String secondPort, String rawRate,
            String doubleInv, String resultSmooth, String resultStatus,
            String extSensorEnabled, String extSensorCmd, String extSensorPower,
            String scheduler, String moveWarnEnabled, String moveWarnThreshold,
            String moveWarnBaud, String moveWarnCmd, String dzIotEnabled,
            String dzIotId, String dzIotIp, String dzIotPort, String dzIotKey,String dzIotHttp,
            String dzIotGnssData, String cqIotEnabled, String cqIotTelecom,
            String cqIotId, String cqIotUser, String cqIotKey, String cqIotStatus,
            String oneNetEnabled, String oneNetId, String oneNetUser,
            String oneNetKey, String oneNetGnssData, String wifiMode,
            String wifiSsid, String wifiPass, String wifiDhcp, String wifiMask,
            String wifiGateway, String wifiDns1, String wifDns2,
            String wifiExtAntenna, String wifiBand, String wifiSignalLevel,
            String wifiPrefix, String wifiApPass, String wifiIp,
            String networkStatus, String networksignalLevel, String networkEnabled,
            String networkApn, String networkApnUser, String networkApnPass,
            String networkMode, String networkAddress, String networkPort,
            String networkMountpoint, String networMountpointPass,
            String networkUploadGga, String coordcvtEnabled,
            String coordcvtSrcDatum, String coordcvtDstDatum,
            String coordcvtSevenParam, String coordcvtFourParam,
            String coordcvtProjParam, String smsWakeup, String coordinatesX,
            String coordinatesY, String coordinatesZ, String rawBackEnabled,
            String rawBackAddress, String rawBackPort, String rawBackGnssData,
            String rawBackUser, String rawBackPass, String rawBackBaud,
            String dzIotRtkResult, String moveWarnMems, String ntrIpBase,
            int connectState, String baseLon, String baseLat, String baseHeight,
            String oneNetMode, String accessKey) {
        this._id = _id;
        this.machineSerial = machineSerial;
        this.machineModel = machineModel;
        this.mcuVer = mcuVer;
        this.firmwareVer = firmwareVer;
        this.puwerLever = puwerLever;
        this.extVoltage = extVoltage;
        this.insideSpace = insideSpace;
        this.dataLink = dataLink;
        this.timeZone = timeZone;
        this.rtkPos = rtkPos;
        this.imuWarn = imuWarn;
        this.rawName = rawName;
        this.rawMode = rawMode;
        this.recordInterval = recordInterval;
        this.rawIp = rawIp;
        this.rawPort = rawPort;
        this.resultIp = resultIp;
        this.resultPort = resultPort;
        this.resultMsg = resultMsg;
        this.resultRs232 = resultRs232;
        this.resultImu = resultImu;
        this.secondBase = secondBase;
        this.secondIp = secondIp;
        this.secondPort = secondPort;
        this.rawRate = rawRate;
        this.doubleInv = doubleInv;
        this.resultSmooth = resultSmooth;
        this.resultStatus = resultStatus;
        this.extSensorEnabled = extSensorEnabled;
        this.extSensorCmd = extSensorCmd;
        this.extSensorPower = extSensorPower;
        this.scheduler = scheduler;
        this.moveWarnEnabled = moveWarnEnabled;
        this.moveWarnThreshold = moveWarnThreshold;
        this.moveWarnBaud = moveWarnBaud;
        this.moveWarnCmd = moveWarnCmd;
        this.dzIotEnabled = dzIotEnabled;
        this.dzIotId = dzIotId;
        this.dzIotIp = dzIotIp;
        this.dzIotPort = dzIotPort;
        this.dzIotKey = dzIotKey;
        this.dzIotHttp=dzIotHttp;
        this.dzIotGnssData = dzIotGnssData;
        this.cqIotEnabled = cqIotEnabled;
        this.cqIotTelecom = cqIotTelecom;
        this.cqIotId = cqIotId;
        this.cqIotUser = cqIotUser;
        this.cqIotKey = cqIotKey;
        this.cqIotStatus = cqIotStatus;
        this.oneNetEnabled = oneNetEnabled;
        this.oneNetId = oneNetId;
        this.oneNetUser = oneNetUser;
        this.oneNetKey = oneNetKey;
        this.oneNetGnssData = oneNetGnssData;
        this.wifiMode = wifiMode;
        this.wifiSsid = wifiSsid;
        this.wifiPass = wifiPass;
        this.wifiDhcp = wifiDhcp;
        this.wifiMask = wifiMask;
        this.wifiGateway = wifiGateway;
        this.wifiDns1 = wifiDns1;
        this.wifDns2 = wifDns2;
        this.wifiExtAntenna = wifiExtAntenna;
        this.wifiBand = wifiBand;
        this.wifiSignalLevel = wifiSignalLevel;
        this.wifiPrefix = wifiPrefix;
        this.wifiApPass = wifiApPass;
        this.wifiIp = wifiIp;
        this.networkStatus = networkStatus;
        this.networksignalLevel = networksignalLevel;
        this.networkEnabled = networkEnabled;
        this.networkApn = networkApn;
        this.networkApnUser = networkApnUser;
        this.networkApnPass = networkApnPass;
        this.networkMode = networkMode;
        this.networkAddress = networkAddress;
        this.networkPort = networkPort;
        this.networkMountpoint = networkMountpoint;
        this.networkMountpointPass = networMountpointPass;
        this.networkUploadGga = networkUploadGga;
        this.coordcvtEnabled = coordcvtEnabled;
        this.coordcvtSrcDatum = coordcvtSrcDatum;
        this.coordcvtDstDatum = coordcvtDstDatum;
        this.coordcvtSevenParam = coordcvtSevenParam;
        this.coordcvtFourParam = coordcvtFourParam;
        this.coordcvtProjParam = coordcvtProjParam;
        this.smsWakeup = smsWakeup;
        this.coordinatesX = coordinatesX;
        this.coordinatesY = coordinatesY;
        this.coordinatesZ = coordinatesZ;
        this.rawBackEnabled = rawBackEnabled;
        this.rawBackAddress = rawBackAddress;
        this.rawBackPort = rawBackPort;
        this.rawBackGnssData = rawBackGnssData;
        this.rawBackUser = rawBackUser;
        this.rawBackPass = rawBackPass;
        this.rawBackBaud = rawBackBaud;
        this.dzIotRtkResult = dzIotRtkResult;
        this.moveWarnMems = moveWarnMems;
        this.ntrIpBase = ntrIpBase;
        this.connectState = connectState;
        this.baseLon = baseLon;
        this.baseLat = baseLat;
        this.baseHeight = baseHeight;
        this.oneNetMode = oneNetMode;
        this.accessKey = accessKey;
    }
    public MachineInfoEntity() {
    }
    public Long get_id() {
        return this._id;
    }
    public void set_id(Long _id) {
        this._id = _id;
    }

    public String getMcuVer() {
        return this.mcuVer;
    }
    public void setMcuVer(String mcuVer) {
        this.mcuVer = mcuVer;
    }
    public String getFirmwareVer() {
        return this.firmwareVer;
    }
    public void setFirmwareVer(String firmwareVer) {
        this.firmwareVer = firmwareVer;
    }
    public String getPuwerLever() {
        return this.puwerLever;
    }
    public void setPuwerLever(String puwerLever) {
        this.puwerLever = puwerLever;
    }
    public String getExtVoltage() {
        return this.extVoltage;
    }
    public void setExtVoltage(String extVoltage) {
        this.extVoltage = extVoltage;
    }

    public String getDataLink() {
        return this.dataLink;
    }
    public void setDataLink(String dataLink) {
        this.dataLink = dataLink;
    }
    public String getTimeZone() {
        return this.timeZone;
    }
    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }
    public String getRtkPos() {
        return this.rtkPos;
    }
    public void setRtkPos(String rtkPos) {
        this.rtkPos = rtkPos;
    }
    public String getImuWarn() {
        return this.imuWarn;
    }
    public void setImuWarn(String imuWarn) {
        this.imuWarn = imuWarn;
    }
    public String getRawName() {
        return this.rawName;
    }
    public void setRawName(String rawName) {
        this.rawName = rawName;
    }
    public String getRawMode() {
        return this.rawMode;
    }
    public void setRawMode(String rawMode) {
        this.rawMode = rawMode;
    }
    public String getRecordInterval() {
        return this.recordInterval;
    }
    public void setRecordInterval(String recordInterval) {
        this.recordInterval = recordInterval;
    }
    public String getRawIp() {
        return this.rawIp;
    }
    public void setRawIp(String rawIp) {
        this.rawIp = rawIp;
    }
    public String getRawPort() {
        return this.rawPort;
    }
    public void setRawPort(String rawPort) {
        this.rawPort = rawPort;
    }
    public String getResultIp() {
        return this.resultIp;
    }
    public void setResultIp(String resultIp) {
        this.resultIp = resultIp;
    }
    public String getResultPort() {
        return this.resultPort;
    }
    public void setResultPort(String resultPort) {
        this.resultPort = resultPort;
    }
    public String getResultMsg() {
        return this.resultMsg;
    }
    public void setResultMsg(String resultMsg) {
        this.resultMsg = resultMsg;
    }
    public String getResultRs232() {
        return this.resultRs232;
    }
    public void setResultRs232(String resultRs232) {
        this.resultRs232 = resultRs232;
    }
    public String getResultImu() {
        return this.resultImu;
    }
    public void setResultImu(String resultImu) {
        this.resultImu = resultImu;
    }
    public String getSecondBase() {
        return this.secondBase;
    }
    public void setSecondBase(String secondBase) {
        this.secondBase = secondBase;
    }
    public String getSecondIp() {
        return this.secondIp;
    }
    public void setSecondIp(String secondIp) {
        this.secondIp = secondIp;
    }
    public String getSecondPort() {
        return this.secondPort;
    }
    public void setSecondPort(String secondPort) {
        this.secondPort = secondPort;
    }
    public String getDoubleInv() {
        return this.doubleInv;
    }
    public void setDoubleInv(String doubleInv) {
        this.doubleInv = doubleInv;
    }
    public String getResultSmooth() {
        return this.resultSmooth;
    }
    public void setResultSmooth(String resultSmooth) {
        this.resultSmooth = resultSmooth;
    }
    public String getExtSensorEnabled() {
        return this.extSensorEnabled;
    }
    public void setExtSensorEnabled(String extSensorEnabled) {
        this.extSensorEnabled = extSensorEnabled;
    }
    public String getExtSensorCmd() {
        return this.extSensorCmd;
    }
    public void setExtSensorCmd(String extSensorCmd) {
        this.extSensorCmd = extSensorCmd;
    }
    public String getScheduler() {
        return this.scheduler;
    }
    public void setScheduler(String scheduler) {
        this.scheduler = scheduler;
    }
    public String getMoveWarnEnabled() {
        return this.moveWarnEnabled;
    }
    public void setMoveWarnEnabled(String moveWarnEnabled) {
        this.moveWarnEnabled = moveWarnEnabled;
    }
    public String getMoveWarnThreshold() {
        return this.moveWarnThreshold;
    }
    public void setMoveWarnThreshold(String moveWarnThreshold) {
        this.moveWarnThreshold = moveWarnThreshold;
    }
    public String getMoveWarnBaud() {
        return this.moveWarnBaud;
    }
    public void setMoveWarnBaud(String moveWarnBaud) {
        this.moveWarnBaud = moveWarnBaud;
    }
    public String getMoveWarnCmd() {
        return this.moveWarnCmd;
    }
    public void setMoveWarnCmd(String moveWarnCmd) {
        this.moveWarnCmd = moveWarnCmd;
    }
    public String getDzIotEnabled() {
        return this.dzIotEnabled;
    }
    public void setDzIotEnabled(String dzIotEnabled) {
        this.dzIotEnabled = dzIotEnabled;
    }
    public String getDzIotId() {
        return this.dzIotId;
    }
    public void setDzIotId(String dzIotId) {
        this.dzIotId = dzIotId;
    }
    public String getDzIotIp() {
        return this.dzIotIp;
    }

    public String getNetworkMountpointUse() {
        return networkMountpointUse;
    }

    public void setNetworkMountpointUse(String networkMountpointUse) {
        this.networkMountpointUse = networkMountpointUse;
    }

    public void setDzIotIp(String dzIotIp) {
        this.dzIotIp = dzIotIp;
    }
    public String getDzIotPort() {
        return this.dzIotPort;
    }
    public void setDzIotPort(String dzIotPort) {
        this.dzIotPort = dzIotPort;
    }
    public String getDzIotKey() {
        return this.dzIotKey;
    }
    public void setDzIotKey(String dzIotKey) {
        this.dzIotKey = dzIotKey;
    }
    public String getDzIotGnssData() {
        return this.dzIotGnssData;
    }
    public void setDzIotGnssData(String dzIotGnssData) {
        this.dzIotGnssData = dzIotGnssData;
    }
    public String getCqIotEnabled() {
        return this.cqIotEnabled;
    }
    public void setCqIotEnabled(String cqIotEnabled) {
        this.cqIotEnabled = cqIotEnabled;
    }
    public String getCqIotTelecom() {
        return this.cqIotTelecom;
    }
    public void setCqIotTelecom(String cqIotTelecom) {
        this.cqIotTelecom = cqIotTelecom;
    }
    public String getCqIotId() {
        return this.cqIotId;
    }
    public void setCqIotId(String cqIotId) {
        this.cqIotId = cqIotId;
    }
    public String getCqIotUser() {
        return this.cqIotUser;
    }
    public void setCqIotUser(String cqIotUser) {
        this.cqIotUser = cqIotUser;
    }
    public String getCqIotKey() {
        return this.cqIotKey;
    }
    public void setCqIotKey(String cqIotKey) {
        this.cqIotKey = cqIotKey;
    }
    public String getCqIotStatus() {
        return this.cqIotStatus;
    }
    public void setCqIotStatus(String cqIotStatus) {
        this.cqIotStatus = cqIotStatus;
    }
    public String getOneNetEnabled() {
        return this.oneNetEnabled;
    }
    public void setOneNetEnabled(String oneNetEnabled) {
        this.oneNetEnabled = oneNetEnabled;
    }
    public String getOneNetId() {
        return this.oneNetId;
    }
    public void setOneNetId(String oneNetId) {
        this.oneNetId = oneNetId;
    }
    public String getOneNetUser() {
        return this.oneNetUser;
    }
    public void setOneNetUser(String oneNetUser) {
        this.oneNetUser = oneNetUser;
    }
    public String getOneNetKey() {
        return this.oneNetKey;
    }
    public void setOneNetKey(String oneNetKey) {
        this.oneNetKey = oneNetKey;
    }
    public String getOneNetGnssData() {
        return this.oneNetGnssData;
    }
    public void setOneNetGnssData(String oneNetGnssData) {
        this.oneNetGnssData = oneNetGnssData;
    }
    public String getWifiMode() {
        return this.wifiMode;
    }
    public void setWifiMode(String wifiMode) {
        this.wifiMode = wifiMode;
    }
    public String getWifiSsid() {
        return this.wifiSsid;
    }
    public void setWifiSsid(String wifiSsid) {
        this.wifiSsid = wifiSsid;
    }
    public String getWifiPass() {
        return this.wifiPass;
    }
    public void setWifiPass(String wifiPass) {
        this.wifiPass = wifiPass;
    }
    public String getWifiDhcp() {
        return this.wifiDhcp;
    }
    public void setWifiDhcp(String wifiDhcp) {
        this.wifiDhcp = wifiDhcp;
    }
    public String getWifiMask() {
        return this.wifiMask;
    }
    public void setWifiMask(String wifiMask) {
        this.wifiMask = wifiMask;
    }
    public String getWifiGateway() {
        return this.wifiGateway;
    }
    public void setWifiGateway(String wifiGateway) {
        this.wifiGateway = wifiGateway;
    }
    public String getWifiDns1() {
        return this.wifiDns1;
    }
    public void setWifiDns1(String wifiDns1) {
        this.wifiDns1 = wifiDns1;
    }
    public String getWifDns2() {
        return this.wifDns2;
    }
    public void setWifDns2(String wifDns2) {
        this.wifDns2 = wifDns2;
    }
    public String getWifiExtAntenna() {
        return this.wifiExtAntenna;
    }
    public void setWifiExtAntenna(String wifiExtAntenna) {
        this.wifiExtAntenna = wifiExtAntenna;
    }
    public String getWifiBand() {
        return this.wifiBand;
    }
    public void setWifiBand(String wifiBand) {
        this.wifiBand = wifiBand;
    }
    public String getWifiSignalLevel() {
        return this.wifiSignalLevel;
    }
    public void setWifiSignalLevel(String wifiSignalLevel) {
        this.wifiSignalLevel = wifiSignalLevel;
    }
    public String getWifiPrefix() {
        return this.wifiPrefix;
    }
    public void setWifiPrefix(String wifiPrefix) {
        this.wifiPrefix = wifiPrefix;
    }
    public String getWifiApPass() {
        return this.wifiApPass;
    }
    public void setWifiApPass(String wifiApPass) {
        this.wifiApPass = wifiApPass;
    }
    public String getNetworkStatus() {
        return this.networkStatus;
    }
    public void setNetworkStatus(String networkStatus) {
        this.networkStatus = networkStatus;
    }
    public String getNetworksignalLevel() {
        return this.networksignalLevel;
    }
    public void setNetworksignalLevel(String networksignalLevel) {
        this.networksignalLevel = networksignalLevel;
    }
    public String getNetworkEnabled() {
        return this.networkEnabled;
    }
    public void setNetworkEnabled(String networkEnabled) {
        this.networkEnabled = networkEnabled;
    }
    public String getNetworkApn() {
        return this.networkApn;
    }
    public void setNetworkApn(String networkApn) {
        this.networkApn = networkApn;
    }
    public String getNetworkApnUser() {
        return this.networkApnUser;
    }
    public void setNetworkApnUser(String networkApnUser) {
        this.networkApnUser = networkApnUser;
    }
    public String getNetworkApnPass() {
        return this.networkApnPass;
    }
    public void setNetworkApnPass(String networkApnPass) {
        this.networkApnPass = networkApnPass;
    }
    public String getNetworkMode() {
        return this.networkMode;
    }
    public void setNetworkMode(String networkMode) {
        this.networkMode = networkMode;
    }
    public String getNetworkAddress() {
        return this.networkAddress;
    }
    public void setNetworkAddress(String networkAddress) {
        this.networkAddress = networkAddress;
    }
    public String getNetworkPort() {
        return this.networkPort;
    }
    public void setNetworkPort(String networkPort) {
        this.networkPort = networkPort;
    }
    public String getNetworkMountpoint() {
        return this.networkMountpoint;
    }
    public void setNetworkMountpoint(String networkMountpoint) {
        this.networkMountpoint = networkMountpoint;
    }
    public String getNetworkMountpointPass() {
        return this.networkMountpointPass;
    }
    public void setNetworkMountpointPass(String networkMountpointPass) {
        this.networkMountpointPass = networkMountpointPass;
    }
    public String getNetworkUploadGga() {
        return this.networkUploadGga;
    }
    public void setNetworkUploadGga(String networkUploadGga) {
        this.networkUploadGga = networkUploadGga;
    }
    public String getCoordcvtEnabled() {
        return this.coordcvtEnabled;
    }
    public void setCoordcvtEnabled(String coordcvtEnabled) {
        this.coordcvtEnabled = coordcvtEnabled;
    }
    public String getCoordcvtSrcDatum() {
        return this.coordcvtSrcDatum;
    }
    public void setCoordcvtSrcDatum(String coordcvtSrcDatum) {
        this.coordcvtSrcDatum = coordcvtSrcDatum;
    }
    public String getCoordcvtDstDatum() {
        return this.coordcvtDstDatum;
    }
    public void setCoordcvtDstDatum(String coordcvtDstDatum) {
        this.coordcvtDstDatum = coordcvtDstDatum;
    }
    public String getCoordcvtSevenParam() {
        return this.coordcvtSevenParam;
    }
    public void setCoordcvtSevenParam(String coordcvtSevenParam) {
        this.coordcvtSevenParam = coordcvtSevenParam;
    }
    public String getCoordcvtFourParam() {
        return this.coordcvtFourParam;
    }
    public void setCoordcvtFourParam(String coordcvtFourParam) {
        this.coordcvtFourParam = coordcvtFourParam;
    }
    public String getCoordcvtProjParam() {
        return this.coordcvtProjParam;
    }
    public void setCoordcvtProjParam(String coordcvtProjParam) {
        this.coordcvtProjParam = coordcvtProjParam;
    }
    public String getSmsWakeup() {
        return this.smsWakeup;
    }
    public void setSmsWakeup(String smsWakeup) {
        this.smsWakeup = smsWakeup;
    }
    public String getCoordinatesX() {
        return this.coordinatesX;
    }
    public void setCoordinatesX(String coordinatesX) {
        this.coordinatesX = coordinatesX;
    }
    public String getCoordinatesY() {
        return this.coordinatesY;
    }
    public void setCoordinatesY(String coordinatesY) {
        this.coordinatesY = coordinatesY;
    }
    public String getCoordinatesZ() {
        return this.coordinatesZ;
    }
    public void setCoordinatesZ(String coordinatesZ) {
        this.coordinatesZ = coordinatesZ;
    }
    public String getRawBackEnabled() {
        return this.rawBackEnabled;
    }
    public void setRawBackEnabled(String rawBackEnabled) {
        this.rawBackEnabled = rawBackEnabled;
    }
    public String getRawBackAddress() {
        return this.rawBackAddress;
    }
    public void setRawBackAddress(String rawBackAddress) {
        this.rawBackAddress = rawBackAddress;
    }
    public String getRawBackPort() {
        return this.rawBackPort;
    }
    public void setRawBackPort(String rawBackPort) {
        this.rawBackPort = rawBackPort;
    }
    public String getRawBackGnssData() {
        return this.rawBackGnssData;
    }
    public void setRawBackGnssData(String rawBackGnssData) {
        this.rawBackGnssData = rawBackGnssData;
    }
    public String getDzIotRtkResult() {
        return this.dzIotRtkResult;
    }
    public void setDzIotRtkResult(String dzIotRtkResult) {
        this.dzIotRtkResult = dzIotRtkResult;
    }
    public String getMoveWarnMems() {
        return this.moveWarnMems;
    }
    public void setMoveWarnMems(String moveWarnMems) {
        this.moveWarnMems = moveWarnMems;
    }
    public String getRawBackUser() {
        return this.rawBackUser;
    }
    public void setRawBackUser(String rawBackUser) {
        this.rawBackUser = rawBackUser;
    }
    public String getRawBackPass() {
        return this.rawBackPass;
    }
    public void setRawBackPass(String rawBackPass) {
        this.rawBackPass = rawBackPass;
    }
    public String getRawBackBaud() {
        return this.rawBackBaud;
    }
    public void setRawBackBaud(String rawBackBaud) {
        this.rawBackBaud = rawBackBaud;
    }

    public String getWifiIp() {
        return this.wifiIp;
    }
    public void setWifiIp(String wifiIp) {
        this.wifiIp = wifiIp;
    }

    public String getResultStatus() {
        return this.resultStatus;
    }
    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public int getConnectState() {
        return this.connectState;
    }
    public void setConnectState(int connectState) {
        this.connectState = connectState;
    }
    public String getExtSensorPower() {
        return this.extSensorPower;
    }
    public void setExtSensorPower(String extSensorPower) {
        this.extSensorPower = extSensorPower;
    }

    public String getNtrIpBase() {
        return this.ntrIpBase;
    }
    public void setNtrIpBase(String ntrIpBase) {
        this.ntrIpBase = ntrIpBase;
    }
    public String getBaseLon() {
        return this.baseLon;
    }
    public void setBaseLon(String baseLon) {
        this.baseLon = baseLon;
    }
    public String getBaseLat() {
        return this.baseLat;
    }
    public void setBaseLat(String baseLat) {
        this.baseLat = baseLat;
    }
    public String getBaseHeight() {
        return this.baseHeight;
    }
    public void setBaseHeight(String baseHeight) {
        this.baseHeight = baseHeight;
    }
    public String getOneNetMode() {
        return this.oneNetMode;
    }
    public void setOneNetMode(String oneNetMode) {
        this.oneNetMode = oneNetMode;
    }
    public String getAccessKey() {
        return this.accessKey;
    }
    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }
    public String getMachineSerial() {
        return this.machineSerial;
    }
    public void setMachineSerial(String machineSerial) {
        this.machineSerial = machineSerial;
    }
    public String getMachineModel() {
        return this.machineModel;
    }
    public void setMachineModel(String machineModel) {
        this.machineModel = machineModel;
    }
    public String getInsideSpace() {
        return this.insideSpace;
    }
    public void setInsideSpace(String insideSpace) {
        this.insideSpace = insideSpace;
    }
    public String getRawRate() {
        return this.rawRate;
    }
    public void setRawRate(String rawRate) {
        this.rawRate = rawRate;
    }
    public String getDzIotHttp() {
        return dzIotHttp;
    }
    public void setDzIotHttp(String dzIotHttp) {
        this.dzIotHttp = dzIotHttp;
    }
    public String getMoveALiYunSms() {
        return moveALiYunSms;
    }
    public void setMoveALiYunSms(String moveALiYunSms) {
        this.moveALiYunSms = moveALiYunSms;
    }
    public String getNtripArg() { return ntripArg; }
    public void setNtripArg(String ntripArg) { this.ntripArg = ntripArg; }
    public String getRawSolution() { return rawSolution; }
    public void setRawSolution(String rawSolution) { this.rawSolution = rawSolution; }
    public String getSecondArg() { return secondArg; }
    public void setSecondArg(String secondArg) { this.secondArg = secondArg; }
    public String getSecondNtripBase() { return secondNtripBase; }
    public void setSecondNtripBase(String secondNtripBase) { this.secondNtripBase = secondNtripBase; }

    public String getGpsSerial() { return gpsSerial; }
    public void setGpsSerial(String gpsSerial) { this.gpsSerial = gpsSerial; }
    public String getGpsModel() { return gpsModel; }
    public void setGpsModel(String gpsModel) { this.gpsModel = gpsModel; }
    public String getGpsFirmwareVer() { return gpsFirmwareVer; }
    public void setGpsFirmwareVer(String gpsFirmwareVer) { this.gpsFirmwareVer = gpsFirmwareVer; }
    public String getGpsEleMask() { return gpsEleMask; }
    public void setGpsEleMask(String gpsEleMask) { this.gpsEleMask = gpsEleMask; }
    public String getGpsBeiDou() { return gpsBeiDou; }
    public void setGpsBeiDou(String gpsBeiDou) { this.gpsBeiDou = gpsBeiDou; }
    public String getGlonass() { return glonass; }
    public void setGlonass(String glonass) { this.glonass = glonass; }
    public String getGaLileo() { return gaLileo; }
    public void setGaLileo(String gaLileo) { this.gaLileo = gaLileo; }
}
