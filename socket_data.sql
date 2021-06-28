/*
 Navicat Premium Data Transfer

 Source Server         : test33
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : socket_data

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 25/06/2021 17:49:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for agent_data
-- ----------------------------
DROP TABLE IF EXISTS `agent_data`;
CREATE TABLE `agent_data`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agentNumber` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '代理商编号',
  `serial` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器型号',
  `state` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态',
  `machineName` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品名称',
  `date` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '日期',
  `proGroupId` int(32) NULL DEFAULT NULL COMMENT '项目分组id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of agent_data
-- ----------------------------
INSERT INTO `agent_data` VALUES (1, '1', 'MS20210519', '0', '备用机器01', '2021-05-19', 1);
INSERT INTO `agent_data` VALUES (2, '1', 'MS20210518', '0', '备用机器02', '2021-05-18', 2);
INSERT INTO `agent_data` VALUES (3, '1', 'MS20210517', '1', NULL, NULL, 1);
INSERT INTO `agent_data` VALUES (4, '2', 'MS20210516', '0', NULL, NULL, NULL);
INSERT INTO `agent_data` VALUES (5, '1', 'MS10640041007', '1', '测试机器', '2021-03-15', 1);
INSERT INTO `agent_data` VALUES (6, '1', 'TR12020020286', '0', '备用机器03', '2021-05-25', 2);
INSERT INTO `agent_data` VALUES (7, '3', 'test', '0', '测试机器4', '2021-06-25', 3);

-- ----------------------------
-- Table structure for agent_table
-- ----------------------------
DROP TABLE IF EXISTS `agent_table`;
CREATE TABLE `agent_table`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agentNumber` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '代理商编号',
  `agentName` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '代理商名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of agent_table
-- ----------------------------
INSERT INTO `agent_table` VALUES (1, '1', '哈限公司');
INSERT INTO `agent_table` VALUES (2, '2', '呵呵科技公司');
INSERT INTO `agent_table` VALUES (3, '3', '测试公司3');

-- ----------------------------
-- Table structure for cache_order
-- ----------------------------
DROP TABLE IF EXISTS `cache_order`;
CREATE TABLE `cache_order`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '机器型号',
  `path` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '指令属性',
  `orderValue` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '指令',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cache_order
-- ----------------------------

-- ----------------------------
-- Table structure for machine_data
-- ----------------------------
DROP TABLE IF EXISTS `machine_data`;
CREATE TABLE `machine_data`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器编号',
  `model` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器型号',
  `hardwareVer` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '硬件版本',
  `osVer` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '系统版本',
  `mcuVer` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单片机软件版本',
  `firmwareVer` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '软件版本',
  `manufactureDate` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生产日期',
  `puwerLever` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '剩余电量',
  `extVoltage` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '外接电源电压',
  `space` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器内部存储大小',
  `sdSpace` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器SD卡存储大小',
  `dataLink` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '数据链',
  `timeZone` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置时区',
  `rtkPos` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启RTK解算',
  `imuWarn` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'IMU触发RTK紧急模式，参数为触发角度，0关闭',
  `rawName` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '测站名称',
  `rawMode` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '测站模式',
  `recordInterval` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '记录间隔',
  `rawIp` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '原始数据通信ip',
  `rawPort` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '原始数据通信端口',
  `resultIp` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '结果回传ip',
  `resultPort` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '结果回传端口',
  `resultStatus` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '结果回传连接状态',
  `resultMsg` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回传消息设置',
  `resultRs232` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '串口输出结果信息',
  `resultImu` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回传GEOINS数据，回传频率（秒），0关闭',
  `secondBase` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启第2基站，0-关闭；1-开启',
  `secondIp` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '第二基站ip',
  `secondPort` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '第二基站端口',
  `rate` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置静态采样间隔，单位毫秒',
  `doubleInv` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '双周期解算',
  `resultSmooth` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '结果平滑',
  `extSensorEnabled` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启外接传感器',
  `extSensorPower` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启电源输出',
  `extSensorCmd` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '外接传感器读取参数',
  `scheduler` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '定时开关机',
  `moveWarnEnabled` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启位移报警',
  `moveWarnThreshold` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '位移阈值',
  `moveWarnBaud` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '输出串口波特率',
  `moveWarnCmd` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '报警命令',
  `moveWarnMems` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '位移阈值',
  `dzIotEnabled` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启连接地灾平台；0-关闭，1-开启',
  `dzIotId` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地灾平台分配的id',
  `dzIotIp` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地灾平台服务器地址',
  `dzIotPort` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地灾平台服务器端口',
  `dzIotKey` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地灾平台分配的KEY',
  `dzIotGnssData` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否上传RTCM3.2；0-关闭，1-开启（部分板卡才支持',
  `dzIotHttp` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'http上传结果时填写',
  `cqIotEnabled` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开启重庆地灾平台',
  `cqIotTelecom` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '运营商设置',
  `cqIotId` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '设备id',
  `cqIotUser` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品id',
  `cqIotKey` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '鉴权码',
  `cqIotStatus` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态',
  `oneNetEnabled` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '连接onenet平台',
  `oneNetId` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备id',
  `oneNetUser` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品id',
  `oneNetKey` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '鉴权信息',
  `oneNetGnssData` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '数据流id',
  `wifiMode` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'wifi模式',
  `wifiSsid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '做客户端时连接的路由器SSID',
  `wifiPass` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '做客户端显示WiFi密码',
  `wifiDhcp` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '做客户端时开启DHCP',
  `wifiIp` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'DHCP关闭时静态IP',
  `wifiMask` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'DHCP关闭时子网掩码',
  `wifiGateway` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'DHCP关闭时网关',
  `wifiDns1` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'DHCP关闭时自定义DNS',
  `wifDns2` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'DHCP关闭时自定义DNS',
  `wifiExtAntenna` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开关WIFI天线外置功放，0-关闭，1-开启',
  `wifiBand` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否使用5G频段组网，0-关闭，1-开启',
  `wifiSignalLevel` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '查询WIFI做客户端时的信号强度',
  `wifiPrefix` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'wifi前缀',
  `wifiApPass` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'wifiAP密码',
  `networkInfoModel` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络模块型号',
  `networkStatus` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络状态',
  `networkErrorcode` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络错误码',
  `networkSignal_level` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络模块信号强度',
  `networkEnabled` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否开启网络模块',
  `networkApn` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'apn设置',
  `networkApnUser` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'apn用户名',
  `networkApnPass` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'apn密码',
  `networkMode` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络差分传输协议',
  `networkAddress` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络服务器地址',
  `networkPort` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网络服务器端口',
  `networkMountpoint` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Ntrip接入点',
  `networMountpointPass` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Ntrip用户名|密码',
  `networkUploadGga` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Ntrip上传GGA间隔',
  `coordcvtEnabled` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置是否启用平面坐标转换输出',
  `coordcvtSrcDatum` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置源参考椭球，默认使用WGS84',
  `coordcvtDstDatum` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置目标参考椭球',
  `coordcvtSevenParam` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置七参数',
  `coordcvtFourParam` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置四参数',
  `coordcvtProjParam` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置投影参数',
  `eleMask` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置卫星截止角',
  `smsWakeup` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置短信唤醒',
  `coordinatesX` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `coordinatesY` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置基准坐标，用于计算位移。\r\n初始值从静态解算结果里取第一天的值算平均值。\r\n设置基准坐标，用于计算位移。\r\n初始值从静态解算结果里取第一天的值算平均值。\r\n设置基准坐标，用于计算位移。\r\n初始值从静态解算结果里取第一天的值算平均值。\r\n设置基准坐标，用于计算位移。\r\n初始值从静态解算结果里取第一天的值算平均值。\r\n设置基准坐标，用于计算位移,初始值从静态解算结果里取第一天',
  `coordinates_Z` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `baseLon` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '基准站模式的坐标,经度',
  `baseLat` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '纬度',
  `baseHeight` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '高度',
  `rawBackEnabled` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置原始数据回传',
  `rawBackAddress` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置作客户端时服务器地址',
  `rawBackPort` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设置回传服务器端口',
  `rawBackGnssData` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '0 原始数据\r\n1 RTCM数据\r\n0 原始数据\r\n1 RTCM数据\r\n',
  `rawBackUser` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Ntrip基站使用的接入点',
  `rawBackPass` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Ntrip基站使用的密码',
  `rawBackBaud` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '串口使用的波特率',
  `dzIotRtkResult` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地灾rtk上传解算',
  `connectState` int(8) UNSIGNED NULL DEFAULT NULL COMMENT '连接状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 224 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of machine_data
-- ----------------------------
INSERT INTO `machine_data` VALUES (223, 'MS10640041007', 'M3II', NULL, NULL, '2.08', '3.0.20210518', NULL, '79', '15.275', '27016528|29970656', NULL, '网络', '+8', '1', '2', 'MS07', '0', '4', '192.168.21.200', '9993', '192.168.4.10', '9991', NULL, 'GEOPOS', '38400', '', '0', '', '0', '60000', '1', '1', '0', NULL, '', '47|12|12|20', '1', '6|7|8', '-9600', '', '0.5', '1', '440000125628|MS10649101010', 'ghiot.cigem.cn', '1883', 'f552f9de134e43808edf|f6e9865a7f7bfbe073f7', '1', NULL, '2', '3', '123', '5ea5373f826c67041c53732e_864388040512828', '456', '0433', '1', '147', '258', '369', '123456789', 'CLIENT', 'miniWIFI', 'geo110310', '1', NULL, '', '', '', '', '1', '0', ' 33 dBm', 'M3', '12345678', NULL, '0432', NULL, '0%', '1', 'CMNET', 'ctnet@mycdma.cn', 'vnet.mobi', 'NTRIP', '47.107.86.207', '6070', 'RTCM30', 'M5|pass', '5', '1', 'WGS84|6378137|298.257223563', 'WGS84|6378137|298.257223563', '1|01|02|03|04|05|06|07', '1|5|6|7|8|0|0', '1|3.0|0.9996|10|20|30|6.0|2.0|0.123|0.456', NULL, '1', '-2332838.3151', '5383250.0930', '2493557.7768', '0.000000000', '0.000000000', '0.00000', '1', '39.108.76.11', '8590', '0', NULL, NULL, NULL, '1', 1);

-- ----------------------------
-- Table structure for projects_data
-- ----------------------------
DROP TABLE IF EXISTS `projects_data`;
CREATE TABLE `projects_data`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `proGroupId` int(32) NULL DEFAULT NULL COMMENT '项目分组id',
  `proGroupName` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目名称',
  `agentNumber` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属代理商编号',
  `createTime` date NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of projects_data
-- ----------------------------
INSERT INTO `projects_data` VALUES (1, 1, '广东项目分组', '1', '2021-01-02');
INSERT INTO `projects_data` VALUES (2, 2, '广西项目分组', '2', '2021-02-14');
INSERT INTO `projects_data` VALUES (12, 3, 'test', '1', '2021-06-18');

-- ----------------------------
-- Table structure for staff_data
-- ----------------------------
DROP TABLE IF EXISTS `staff_data`;
CREATE TABLE `staff_data`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agentNumber` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '代理商编号',
  `uAccountNum` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '账号',
  `uPassword` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录密码',
  `uRealName` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `cDept` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门',
  `iRoleType` int(16) NULL DEFAULT NULL COMMENT '角色类型',
  `iAccountType` int(128) NULL DEFAULT NULL COMMENT '账号类型',
  `groupAssemble` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目分组id集合',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of staff_data
-- ----------------------------
INSERT INTO `staff_data` VALUES (1, '00001', 'admin', '21232f297a57a5a743894a0e4a801fc30', '张三丰', '采购部', 2, 0, '1@2@3');
INSERT INTO `staff_data` VALUES (2, '00002', '1234', '21232f297a57a5a743894a0e4a801fc30', NULL, NULL, 1, NULL, NULL);
INSERT INTO `staff_data` VALUES (3, '00001', '456', '21232f297a57a5a743894a0e4a801fc30', NULL, NULL, 0, NULL, '3');

-- ----------------------------
-- Table structure for sys_account
-- ----------------------------
DROP TABLE IF EXISTS `sys_account`;
CREATE TABLE `sys_account`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nickName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userName` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `salt` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(11) NOT NULL,
  `createAt` datetime(0) NOT NULL,
  `storeId` int(11) NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fun_admin` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_account
-- ----------------------------

-- ----------------------------
-- Table structure for sys_session
-- ----------------------------
DROP TABLE IF EXISTS `sys_session`;
CREATE TABLE `sys_session`  (
  `accessToken` varchar(33) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `accountId` int(11) NOT NULL,
  `expireAt` bigint(20) NOT NULL,
  `userId` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`accessToken`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_session
-- ----------------------------
INSERT INTO `sys_session` VALUES ('0018a9ba4b194950b2abc98c6b05648f', 0, 1612339611688, 'admin');
INSERT INTO `sys_session` VALUES ('01e89e83696a47b1bd45006fa965ab95', 0, 1614588261121, 'admin');
INSERT INTO `sys_session` VALUES ('037d77400f4d4dfb8909c61f2cc1f540', 0, 1614240670200, 'admin');
INSERT INTO `sys_session` VALUES ('03f1fee357054311b7914e37a5a65d3c', 0, 1615350968750, 'admin');
INSERT INTO `sys_session` VALUES ('040020c445c345a3b53a61ceea55e037', 0, 1607912659756, 'admin');
INSERT INTO `sys_session` VALUES ('0491fc4da7134bfeb5fd6227a257dfe9', 0, 1608894538271, 'admin');
INSERT INTO `sys_session` VALUES ('054cf387fa7a43d8a51862ddfe8d0301', 0, 1616381774388, 'admin');
INSERT INTO `sys_session` VALUES ('05533694bc5d464f87a7a893f386b22c', 0, 1607696562862, 'admin');
INSERT INTO `sys_session` VALUES ('068d2e0fceec41b4b21d3bd3b3d0e4db', 0, 1614227473020, 'admin');
INSERT INTO `sys_session` VALUES ('077052121a494c129d6e6ce43e0b401d', 0, 1607756783468, 'admin');
INSERT INTO `sys_session` VALUES ('0770c47c451e434f830b4129de403a5c', 0, 1614052486459, 'admin');
INSERT INTO `sys_session` VALUES ('089a044341e5406fbdcfe1bd8ff67cb1', 0, 1613797578746, 'admin');
INSERT INTO `sys_session` VALUES ('0b23960935aa4f30847f7be70277b5ce', 0, 1614762015830, 'admin');
INSERT INTO `sys_session` VALUES ('0c9e2f134bc1447fbade808d7db2deed', 0, 1607687707417, 'admin');
INSERT INTO `sys_session` VALUES ('0df290e823c948599e3f3d2e1d2e4ed9', 0, 1607834185088, 'admin');
INSERT INTO `sys_session` VALUES ('0e7536c2b8374cc1af19ce7ac03ce3c8', 0, 1607832976663, 'admin');
INSERT INTO `sys_session` VALUES ('0f13f9b7bc2a4ea3976a3e83ee48a96f', 0, 1624348358334, 'admin');
INSERT INTO `sys_session` VALUES ('0fb05a42086841ee96fb0e6c393359d2', 0, 1607761630559, 'admin');
INSERT INTO `sys_session` VALUES ('103fc5c7ce9740c497a3d4277dd767c7', 0, 1607916572498, 'admin');
INSERT INTO `sys_session` VALUES ('113886bad18646d3b69e512635470f42', 0, 1607832976581, 'admin');
INSERT INTO `sys_session` VALUES ('12cd12246cf342fda0634948b717f961', 0, 1607837857333, 'admin');
INSERT INTO `sys_session` VALUES ('13915dfa149e4b9fbbff65a519d0fcaa', 0, 1615807479208, 'admin');
INSERT INTO `sys_session` VALUES ('142a065817b14cf08d6f9e76787812c7', 0, 1607915598850, 'admin');
INSERT INTO `sys_session` VALUES ('159b478e3ec346d392928ff2cddd7eb4', 0, 1607685590438, 'admin');
INSERT INTO `sys_session` VALUES ('15defb0ea9514341a67b2e4fa79924ac', 0, 1608715515843, 'admin');
INSERT INTO `sys_session` VALUES ('16c508cba5c946709fad0b8b2ad00983', 0, 1614586958293, 'admin');
INSERT INTO `sys_session` VALUES ('16fb8704a741405ca6262b5197e4f4bc', 0, 1608002924850, 'admin');
INSERT INTO `sys_session` VALUES ('175deaa20fbe4894845d26a64725303b', 0, 1623743081883, 'admin');
INSERT INTO `sys_session` VALUES ('1893a28998db41109d5c9b02668ea975', 0, 1614163579853, 'admin');
INSERT INTO `sys_session` VALUES ('1a5efe374e034b55a509cb36e7d43811', 0, 1610939474723, 'admin');
INSERT INTO `sys_session` VALUES ('1ac0e1cec5a145fbb13957b618231f87', 0, 1611048857762, 'admin');
INSERT INTO `sys_session` VALUES ('1af32b8f5c2d43c9b7f74ccda8dc69f7', 0, 1623988570732, 'admin');
INSERT INTO `sys_session` VALUES ('1b92771282e6438ea79269e0e941cb71', 0, 1614327707387, 'geo');
INSERT INTO `sys_session` VALUES ('1b9f54eb631848a684dd611b8a33ecae', 0, 1612436317460, 'admin');
INSERT INTO `sys_session` VALUES ('1ba1dd6a80824194a3bf2b5a82a1acc3', 0, 1609828622624, 'admin');
INSERT INTO `sys_session` VALUES ('1bb73b3d7064402d8c2ccc2d915dfddd', 0, 1612581824350, 'admin');
INSERT INTO `sys_session` VALUES ('1bf6cf229ca442eab40522b41bb4230e', 0, 1607843674642, 'admin');
INSERT INTO `sys_session` VALUES ('1c0dd1dbe1ec410198f1288a44c8d659', 0, 1610094094515, 'admin');
INSERT INTO `sys_session` VALUES ('1c3538e107d1471ca09702fe8b4c439c', 0, 1609998562671, 'admin');
INSERT INTO `sys_session` VALUES ('1c41b6c0f90b404f99733365094ad8f2', 0, 1608117153579, 'admin');
INSERT INTO `sys_session` VALUES ('1c72a43adf7b4f59ab6502506fb11490', 0, 1615435089788, 'geo');
INSERT INTO `sys_session` VALUES ('1d103751dc6b4fe3926250791ff85551', 0, 1615450451888, 'geo');
INSERT INTO `sys_session` VALUES ('1da7355b9ad94858b6d25daf3a48b94f', 0, 1608173876009, 'admin');
INSERT INTO `sys_session` VALUES ('24055719f7c0403cab2524044fbe8158', 0, 1613634469098, 'admin');
INSERT INTO `sys_session` VALUES ('24540a4ddd144af58b1a9b355a09efe1', 0, 1607685607355, 'admin');
INSERT INTO `sys_session` VALUES ('254cf7269fe84205a298f1f278efe47e', 0, 1624250540485, 'admin');
INSERT INTO `sys_session` VALUES ('257b920abe224c659b8e941f54d6e862', 0, 1624355749467, 'admin');
INSERT INTO `sys_session` VALUES ('25a598472a794395b60eba0e45e6d374', 0, 1612436158789, 'admin');
INSERT INTO `sys_session` VALUES ('262cb5865d46424582a17a1e428a7410', 0, 1608806120709, 'admin');
INSERT INTO `sys_session` VALUES ('267ae333c43a4ee2a47be301588398f9', 0, 1607755940562, 'admin');
INSERT INTO `sys_session` VALUES ('2853854438734e29825ce0865a14f436', 0, 1609308933268, 'admin');
INSERT INTO `sys_session` VALUES ('28580e10e3424667a10e881735115830', 0, 1607854865419, 'admin');
INSERT INTO `sys_session` VALUES ('288811ef6dfb42fc9809ee10e60b6dcc', 0, 1624614627799, 'admin');
INSERT INTO `sys_session` VALUES ('28abcb8ad54a45be91eb09932e0584aa', 0, 1607745595059, 'admin');
INSERT INTO `sys_session` VALUES ('28f692d2431247188f54c04ae410bbaa', 0, 1609151074143, 'admin');
INSERT INTO `sys_session` VALUES ('2a06987dd7584142bf5a04c45d9a59f1', 0, 1614659458064, 'admin');
INSERT INTO `sys_session` VALUES ('2a26092f5caa4454a0032690f165934a', 0, 1614327560904, 'geo');
INSERT INTO `sys_session` VALUES ('2b5cd3715b084719b4d4e409673e09ec', 0, 1607920451000, 'admin');
INSERT INTO `sys_session` VALUES ('2be80fdc88534efd947bdabf862589db', 0, 1609308933864, 'admin');
INSERT INTO `sys_session` VALUES ('2c3a152ef4614310bd14b88c3e5b25ba', 0, 1608691554223, 'admin');
INSERT INTO `sys_session` VALUES ('2c46f070fc604f6d8de43e71df64e7bd', 0, 1607831789574, 'admin');
INSERT INTO `sys_session` VALUES ('2d75aa422bbc42d3a0f761fc478cedc6', 0, 1614312457852, 'geo');
INSERT INTO `sys_session` VALUES ('2d9aa672df2c4dffb46beb785263add0', 0, 1623831156971, 'admin');
INSERT INTO `sys_session` VALUES ('2d9df14508fd40b8b31a012bf1338f89', 0, 1612804493042, 'test');
INSERT INTO `sys_session` VALUES ('2dc2a1290e0e49e6a45670d159a88a50', 0, 1609993839093, 'admin');
INSERT INTO `sys_session` VALUES ('2ddf6c887db240018dbb46e647a19cbe', 0, 1623148297984, 'admin');
INSERT INTO `sys_session` VALUES ('2e08b1a9afae44a7a2f7e4f57be96899', 0, 1608885397158, 'admin');
INSERT INTO `sys_session` VALUES ('2e6c43bb100a435bbfcbe2db576060b6', 0, 1612321967498, 'admin');
INSERT INTO `sys_session` VALUES ('2e6dbc050e8d4e148e29e6dd1f3c1c19', 0, 1613821933864, 'admin');
INSERT INTO `sys_session` VALUES ('2fc719821fb849bfa1f1358ed3db76fb', 0, 1610344095714, 'admin');
INSERT INTO `sys_session` VALUES ('3100abfb098d40cab846a5eefa917fae', 0, 1615460672391, 'admin');
INSERT INTO `sys_session` VALUES ('341d1d7fe8564277ad46291ccf92e934', 0, 1615799235560, 'admin');
INSERT INTO `sys_session` VALUES ('34c190693768416397a2c5a7f4b0dc55', 0, 1614229660699, 'admin');
INSERT INTO `sys_session` VALUES ('36cfe27434f5432b8f527b0d818a44ca', 0, 1615784565182, 'admin');
INSERT INTO `sys_session` VALUES ('3757bbc8d9a5418288b0297b1fe8283d', 0, 1609236423704, 'admin');
INSERT INTO `sys_session` VALUES ('3850ff81aa834b90acc69bb1056a0d9f', 0, 1609832533374, 'admin');
INSERT INTO `sys_session` VALUES ('38f02c91201f4c15add0680560e4f000', 0, 1623380052313, 'admin');
INSERT INTO `sys_session` VALUES ('398764936a4a46e3a4f66fe6874f9049', 0, 1608709546590, 'admin');
INSERT INTO `sys_session` VALUES ('39bd9700d9944756b1a835a09559d4b0', 0, 1612612085848, 'test');
INSERT INTO `sys_session` VALUES ('39dcbfce548f4b82b8995acced706095', 0, 1623234014931, 'admin');
INSERT INTO `sys_session` VALUES ('3c192c8003ce46b8be8feeff899755b2', 0, 1615797593059, 'admin');
INSERT INTO `sys_session` VALUES ('3d991d94e6f74138935fa08d29163af3', 0, 1614136402511, 'admin');
INSERT INTO `sys_session` VALUES ('3dbcbccfe96e426c93f91f561c21a3d1', 0, 1608714607671, 'admin');
INSERT INTO `sys_session` VALUES ('3e681777c71241dcbfd7e0d284ea1497', 0, 1623036452911, 'admin');
INSERT INTO `sys_session` VALUES ('3eb93c65060941dc9546d8cfb2b0481a', 0, 1609149884015, 'admin');
INSERT INTO `sys_session` VALUES ('41be56c6c3a944b7813b3a64481fa313', 0, 1612154590045, 'admin');
INSERT INTO `sys_session` VALUES ('4324405bb36b47c1951fa004a9a53f34', 0, 1623724566160, 'admin');
INSERT INTO `sys_session` VALUES ('439aa839d3be47c2a202defd6b5f5ac2', 0, 1607854865365, 'admin');
INSERT INTO `sys_session` VALUES ('43b5d0e397974624ae9c852631279553', 0, 1610362276448, 'admin');
INSERT INTO `sys_session` VALUES ('43fde1c2d0cc4035a4fb77b10f4298ef', 0, 1607840005864, 'admin');
INSERT INTO `sys_session` VALUES ('460208617dfb497ca56264a779e40b57', 0, 1611046766488, 'admin');
INSERT INTO `sys_session` VALUES ('46aabcd7143e4d3c9b275697c3f93020', 0, 1607923533119, 'admin');
INSERT INTO `sys_session` VALUES ('46bc0d27ac944cc285ab904c9234e6e0', 0, 1624615563598, '456');
INSERT INTO `sys_session` VALUES ('46c7e3007e0142c89643416b672d3533', 0, 1612492250100, 'test');
INSERT INTO `sys_session` VALUES ('47ed87840de745c19728ccc4c94256a3', 0, 1609732594986, 'admin');
INSERT INTO `sys_session` VALUES ('49864749a62543c3ad12d293aae0ff31', 0, 1611660637068, 'admin');
INSERT INTO `sys_session` VALUES ('4aa4a07690a0450ea103241265f06e22', 0, 1623325788997, 'admin');
INSERT INTO `sys_session` VALUES ('4b1aab7ff8664f1cbd2fb64ea70e3e3a', 0, 1623316885584, 'admin');
INSERT INTO `sys_session` VALUES ('4b7e1cb600e549ed934ef685164d30e7', 0, 1624592242009, '456');
INSERT INTO `sys_session` VALUES ('4f34c937a41548a4a68f572a17f853f9', 0, 1614141110406, 'geo');
INSERT INTO `sys_session` VALUES ('4f8d30357fe54d4bae69a971f8e927a8', 0, 1608811879199, 'admin');
INSERT INTO `sys_session` VALUES ('50f6c565f82e4760bc6027d3a3a14075', 0, 1610961339657, 'admin');
INSERT INTO `sys_session` VALUES ('51393eb86b8e4be288e032efac4eb1fe', 0, 1614228145654, 'admin');
INSERT INTO `sys_session` VALUES ('513a0051d84a4aa8a2acf4698e0c12fc', 0, 1612804402042, 'test');
INSERT INTO `sys_session` VALUES ('5166fe73ece641aa9e66327aa7866d50', 0, 1608714132124, 'admin');
INSERT INTO `sys_session` VALUES ('5179f7bbd5bf4d78b824ee4fb2eb8261', 0, 1623921595631, 'admin');
INSERT INTO `sys_session` VALUES ('520e3711c5b44cc1b0c7335c7de4881f', 0, 1607915602216, 'admin');
INSERT INTO `sys_session` VALUES ('525ad6b0bc854fa2937cbc461af55753', 0, 1609409043237, 'admin');
INSERT INTO `sys_session` VALUES ('535b2fbb0bca41e581dd070f727053b8', 0, 1623139172354, 'admin');
INSERT INTO `sys_session` VALUES ('559785ef59314935bdb578a0ad116984', 0, 1614311115652, 'admin');
INSERT INTO `sys_session` VALUES ('55d812e8d809490ea90967bcefa33415', 0, 1624596522902, '1234');
INSERT INTO `sys_session` VALUES ('5696c5da1c6a41f4acc46d2d899d93bf', 0, 1608176513351, 'admin');
INSERT INTO `sys_session` VALUES ('5804653a00f2470192fb5cbbc87d6943', 0, 1611660262696, 'admin');
INSERT INTO `sys_session` VALUES ('5840e4823d754f2fa3956708c49a9ea8', 0, 1612581535821, 'admin');
INSERT INTO `sys_session` VALUES ('58c4484629bb4d7e8c2555557ccea314', 0, 1608868051187, 'admin');
INSERT INTO `sys_session` VALUES ('5967da9ea57b41c9a5d36fca19620801', 0, 1610351196981, 'admin');
INSERT INTO `sys_session` VALUES ('5a064518e471485b803b3acf6501106e', 0, 1624588989764, 'admin');
INSERT INTO `sys_session` VALUES ('5a5ddb86b4a64b94b90afb641104af02', 0, 1615546259160, 'admin');
INSERT INTO `sys_session` VALUES ('5a8562a05ffa4c29b2b742b5a3caba41', 0, 1614166565755, 'admin');
INSERT INTO `sys_session` VALUES ('5b83445ed2e34f3192b73b92cd990423', 0, 1609834354481, 'admin');
INSERT INTO `sys_session` VALUES ('5cbb0372854b421c9645060e8c56418d', 0, 1608787295856, 'admin');
INSERT INTO `sys_session` VALUES ('5cd234d55f7c469d901ca7325c500b39', 0, 1609145384141, 'admin');
INSERT INTO `sys_session` VALUES ('5cfb3948a3f442018dd0f12368c1a208', 0, 1607678326804, 'admin');
INSERT INTO `sys_session` VALUES ('5d3db4ee4e28460385cffc4d61285905', 0, 1609739994289, 'admin');
INSERT INTO `sys_session` VALUES ('5e82ddb14eb7444d8913d3c3d42c1a38', 0, 1614661062084, 'admin');
INSERT INTO `sys_session` VALUES ('5ecd4f5c51ce4e648b9a933b62b9debf', 0, 1609227853267, 'admin');
INSERT INTO `sys_session` VALUES ('5efa830714f645d797ecdcc381f917d0', 0, 1613705252755, 'admin');
INSERT INTO `sys_session` VALUES ('5f175a9aa8ec4811b68c9308ba9d212b', 0, 1608779578883, 'admin');
INSERT INTO `sys_session` VALUES ('5f78ddce195043de9a22feba726bdaee', 0, 1607749458622, 'admin');
INSERT INTO `sys_session` VALUES ('60551c1e5c454f488fa77ced5a14e812', 0, 1611293821508, 'admin');
INSERT INTO `sys_session` VALUES ('6068b87a80c84a5fa66b99f7b5d1d3bb', 0, 1607831789655, 'admin');
INSERT INTO `sys_session` VALUES ('610eb2f07ebe48a6bdb76200086e3764', 0, 1614136193023, 'admin');
INSERT INTO `sys_session` VALUES ('6233266de08441f183bdb59422293574', 0, 1611216389121, 'admin');
INSERT INTO `sys_session` VALUES ('62dc4dec76704c2b9295f83fd7550f76', 0, 1623751618279, 'admin');
INSERT INTO `sys_session` VALUES ('63671b39c27f4ed59ac5625e5ed1671d', 0, 1608788180149, 'admin');
INSERT INTO `sys_session` VALUES ('6392bbc8c68a45f4abb0b6038e6f3525', 0, 1609921134833, 'admin');
INSERT INTO `sys_session` VALUES ('63c2f2a6a57c4103acd346fef6abe6e2', 0, 1613789890111, 'admin');
INSERT INTO `sys_session` VALUES ('665b9b2dbfb142719db6c8bf3606799c', 0, 1607833449431, 'admin');
INSERT INTO `sys_session` VALUES ('66d49a9d5208479bbc79cce6df6d4137', 0, 1607505020945, 'admin');
INSERT INTO `sys_session` VALUES ('66fd17592e324840b4a284bbbc1f5acc', 0, 1612607831464, 'admin');
INSERT INTO `sys_session` VALUES ('68437c55dd0e4871bc47af1c00d432ed', 0, 1607681784242, 'admin');
INSERT INTO `sys_session` VALUES ('695789a795d24fd2b19b815612d96785', 0, 1608795793228, 'admin');
INSERT INTO `sys_session` VALUES ('69dfd0f080d1458fa04b0a4182249efd', 0, 1609401664396, 'admin');
INSERT INTO `sys_session` VALUES ('6b29cfce7bf64a4b8704ac2aab99b964', 0, 1615520258638, 'admin');
INSERT INTO `sys_session` VALUES ('6b5731eb53dd4c138cc29e96fdea4d26', 0, 1607769126536, 'admin');
INSERT INTO `sys_session` VALUES ('6c6f9a4a619440ee8904bf1da857b0fd', 0, 1623225690723, 'admin');
INSERT INTO `sys_session` VALUES ('6c78d8f512524558be4c755edf235890', 0, 1608714359842, 'admin');
INSERT INTO `sys_session` VALUES ('6c7f8f738c864745aa4a8964998b430c', 0, 1623411211810, 'admin');
INSERT INTO `sys_session` VALUES ('6e9dcb500cd04f629b1f2fc41764f7d8', 0, 1608865157657, 'admin');
INSERT INTO `sys_session` VALUES ('6f01cb305c6645258a60149151ec64bd', 0, 1609301121751, 'admin');
INSERT INTO `sys_session` VALUES ('7044cb5e45624c4aa7bf842be19c089e', 0, 1615371479495, 'admin');
INSERT INTO `sys_session` VALUES ('719c9d96545b463a82468ddc667b37ae', 0, 1613723405120, 'admin');
INSERT INTO `sys_session` VALUES ('72b93c50761c4e50a9f7ad2ab5ea0fc3', 0, 1609323686921, 'admin');
INSERT INTO `sys_session` VALUES ('7377321ed29f477e857f4149dba06513', 0, 1615436339105, 'geo');
INSERT INTO `sys_session` VALUES ('74307bf28fcc458f9c533e6f386aaa6b', 0, 1623302633865, 'admin');
INSERT INTO `sys_session` VALUES ('751a119fc61c426b809549aebd36e03a', 0, 1614659405538, 'admin');
INSERT INTO `sys_session` VALUES ('7537b9a36db64bda8df166a2e6a7b4b5', 0, 1609124991315, 'admin');
INSERT INTO `sys_session` VALUES ('7586a89090b34a3393b8e6234392ca6a', 0, 1607758898655, 'admin');
INSERT INTO `sys_session` VALUES ('75d98864dba749619e64fd0040a79370', 0, 1614659627922, 'admin');
INSERT INTO `sys_session` VALUES ('7668c73ed2c6477cb1d73c25738e3716', 0, 1610078080708, 'admin');
INSERT INTO `sys_session` VALUES ('76c56e2b4821479a9e764fe5d9e21284', 0, 1608699290665, 'admin');
INSERT INTO `sys_session` VALUES ('772875f0a7d8479b89618575582635bb', 0, 1610700816418, 'admin');
INSERT INTO `sys_session` VALUES ('77f2edf7dbea4a298c4cdc5e2634cf39', 0, 1609987909661, 'admin');
INSERT INTO `sys_session` VALUES ('79f506a63fca4255af885fd423b8a6d6', 0, 1608709181581, 'admin');
INSERT INTO `sys_session` VALUES ('7a0a249599334a9783a419988dfa68b6', 0, 1624337134854, 'admin');
INSERT INTO `sys_session` VALUES ('7a90524eb31640b28b234eb3a9a8121d', 0, 1608709768908, 'admin');
INSERT INTO `sys_session` VALUES ('7c9a5dbdf846494293d66e7c84c14d82', 0, 1624271199524, 'admin');
INSERT INTO `sys_session` VALUES ('7c9ab707b1fc459f8c8acaabc719cb48', 0, 1608714277842, 'admin');
INSERT INTO `sys_session` VALUES ('7e419829ed8b4900a844170c2ec12075', 0, 1615863515496, 'admin');
INSERT INTO `sys_session` VALUES ('7e441065fbbf430a9ae961e710d7743a', 0, 1613988704959, 'admin');
INSERT INTO `sys_session` VALUES ('7fc23a36fd6b40e1842d2830eef3c100', 0, 1615545506306, 'admin');
INSERT INTO `sys_session` VALUES ('80815ae3e52c40a8ab7ba4f32ac9c192', 0, 1612493429622, 'test');
INSERT INTO `sys_session` VALUES ('809fd1ed1d83474aa9659bc75197002e', 0, 1624436315575, 'admin');
INSERT INTO `sys_session` VALUES ('80a37208392045b7a9a499d12e6bf6c9', 0, 1611112377984, 'admin');
INSERT INTO `sys_session` VALUES ('80c9779298724447acfede18f6e88fd3', 0, 1607837857376, 'admin');
INSERT INTO `sys_session` VALUES ('81070fcd3bc945a297b1af54fa4252b0', 0, 1616402492099, 'admin');
INSERT INTO `sys_session` VALUES ('81352afbdef24bf3a00ba80cc58fa49b', 0, 1607746219934, 'admin');
INSERT INTO `sys_session` VALUES ('81817a048eee4997a3583823eb2724d4', 0, 1607923219715, 'admin');
INSERT INTO `sys_session` VALUES ('81ab2f6c5337458e9df0aa789b19dfb7', 0, 1615523506904, 'admin');
INSERT INTO `sys_session` VALUES ('82639e6fc8e347d0ada6ace9ea848d0f', 0, 1615807398289, 'admin');
INSERT INTO `sys_session` VALUES ('82e8aaf7899548beaaffc8bd4ae51c83', 0, 1610950552854, 'admin');
INSERT INTO `sys_session` VALUES ('82fdecbcc46448f8ad823b7b4c72c852', 0, 1614069997717, 'admin');
INSERT INTO `sys_session` VALUES ('84f698dd393740e5b243b125180719cb', 0, 1614250633728, 'test');
INSERT INTO `sys_session` VALUES ('85133b215612459e9b61f7a9980df60d', 0, 1607855204444, 'admin');
INSERT INTO `sys_session` VALUES ('86364eb284f34585a099d135e9bf3e84', 0, 1607687741071, 'admin');
INSERT INTO `sys_session` VALUES ('8707060c8c904500a1cf6b7f8ec68f3b', 0, 1615784835715, 'admin');
INSERT INTO `sys_session` VALUES ('88899900baa84878aca7cfbe7660224f', 0, 1609316471959, 'admin');
INSERT INTO `sys_session` VALUES ('899e7d7545c44ce08dbad05ee473d1fc', 0, 1608701927928, 'admin');
INSERT INTO `sys_session` VALUES ('8aa799633c8e49f9a8e53289dd4a1670', 0, 1608714341514, 'admin');
INSERT INTO `sys_session` VALUES ('8ab1d461fe4542ed881bcfb2a0ece614', 0, 1609929168741, 'admin');
INSERT INTO `sys_session` VALUES ('8b0d6a6e80c24c588c69c6c42d279c01', 0, 1612411741401, 'admin');
INSERT INTO `sys_session` VALUES ('8bb38be1f2f545e5bb60dc0f33f430b4', 0, 1612581885975, 'admin');
INSERT INTO `sys_session` VALUES ('8bee2e883fe44a0d8711333b71b7fc26', 0, 1607854865321, 'admin');
INSERT INTO `sys_session` VALUES ('8e5fb4f819434039a30ff9e49b69af11', 0, 1610092557062, 'admin');
INSERT INTO `sys_session` VALUES ('8f339e4ea6874615aa4e92f14aa1edf1', 0, 1624425373135, 'admin');
INSERT INTO `sys_session` VALUES ('90363f3c1f9548528f64518e516c0f4e', 0, 1609841080241, 'admin');
INSERT INTO `sys_session` VALUES ('9119cdae5c9d4d75a48053490bf2c232', 0, 1608700179558, 'admin');
INSERT INTO `sys_session` VALUES ('91d0bb42f60e4093baec2c86db1454c7', 0, 1607833912955, 'admin');
INSERT INTO `sys_session` VALUES ('91ebbec5249e43489d45e081fdc8bc20', 0, 1608605321148, 'admin');
INSERT INTO `sys_session` VALUES ('92ef4a43ec6e4fbbbc47db6eaffb1452', 0, 1611066228097, 'admin');
INSERT INTO `sys_session` VALUES ('9342842158f6400b84d69df20de9d5f3', 0, 1624434498261, 'admin');
INSERT INTO `sys_session` VALUES ('934e7bbe0b4c44d8b4fb45b260052ecc', 0, 1607843308833, 'admin');
INSERT INTO `sys_session` VALUES ('93b00e96495f451cb9ecd93bc0cad2d9', 0, 1616148249880, 'admin');
INSERT INTO `sys_session` VALUES ('93c2b7b2ac2f4214bf8f1a8f62d5c9cc', 0, 1608865562650, 'admin');
INSERT INTO `sys_session` VALUES ('95b455569fe8420c825774f0203de64f', 0, 1615862831645, 'admin');
INSERT INTO `sys_session` VALUES ('9605154df15b45dbb086a541bda4f925', 0, 1615547331410, 'admin');
INSERT INTO `sys_session` VALUES ('9692ce3b32204648af808e56b4e361a9', 0, 1609254541641, 'admin');
INSERT INTO `sys_session` VALUES ('96e88acedd28428abf89f7a54d2a5920', 0, 1607934343941, 'admin');
INSERT INTO `sys_session` VALUES ('984a8a93811f4a3fbe5b22059e86f461', 0, 1609219761179, 'admin');
INSERT INTO `sys_session` VALUES ('98df53cbae1d4c5b8fc5e1c185608427', 0, 1613722097972, 'admin');
INSERT INTO `sys_session` VALUES ('9a54c0db05624b7f8009f193e2763ae9', 0, 1608791420155, 'admin');
INSERT INTO `sys_session` VALUES ('9a6abcb8178f434ca8762922533f9b4f', 0, 1607840270908, 'admin');
INSERT INTO `sys_session` VALUES ('9b0cf629daae481c99f5e99c93d25538', 0, 1609841629085, 'admin');
INSERT INTO `sys_session` VALUES ('9c65a547e45e4b11927dc5f781560ea6', 0, 1614762167551, 'admin');
INSERT INTO `sys_session` VALUES ('9dcbdedace3c4e2bbe2d4da6c8f8fae5', 0, 1623325504323, 'admin');
INSERT INTO `sys_session` VALUES ('9e28dba045bb4b298f54126a4d269972', 0, 1615370455923, 'admin');
INSERT INTO `sys_session` VALUES ('9f75e973f99e4481bb9a4b641dbe5d30', 0, 1607871556871, 'admin');
INSERT INTO `sys_session` VALUES ('9fade7ee7ab24e8ca80751b7584b5cc0', 0, 1607749480106, 'admin');
INSERT INTO `sys_session` VALUES ('9fe0766a66de4cd7a1b09398b70d8560', 0, 1615781885345, 'admin');
INSERT INTO `sys_session` VALUES ('a1262b76f30646918c92c61ddc6c67fc', 0, 1614660780458, 'admin');
INSERT INTO `sys_session` VALUES ('a145d7c9db0a4605bc8fca4fb8526318', 0, 1607399778415, 'admin');
INSERT INTO `sys_session` VALUES ('a16535eb7081466bbf382d57ecb5af24', 0, 1615523506818, 'admin');
INSERT INTO `sys_session` VALUES ('a1b9781e24ed46e5a7051e13dfdfd2f1', 0, 1613705879815, 'admin');
INSERT INTO `sys_session` VALUES ('a212c4488c1a4ddea0c741036c0e3604', 0, 1607052732117, 'admin');
INSERT INTO `sys_session` VALUES ('a4586c8ee0f84ee3b76b93dc22ad7576', 0, 1615535969636, 'admin');
INSERT INTO `sys_session` VALUES ('a49b1411198a4682addfaa342877d323', 0, 1609902834088, 'admin');
INSERT INTO `sys_session` VALUES ('a510a09041504e62b3a2ad286f461e6e', 0, 1612803994839, 'admin');
INSERT INTO `sys_session` VALUES ('a6bba8b7f06c4bff8e86477df873b7ae', 0, 1610353097044, 'admin');
INSERT INTO `sys_session` VALUES ('a755f8009cac445793cc67d50619cfd4', 0, 1624592981933, '1234');
INSERT INTO `sys_session` VALUES ('a860491d163d491580f04001fbf0c646', 0, 1609386491599, 'admin');
INSERT INTO `sys_session` VALUES ('a8b312e59517488db12a0e1f6db2a04f', 0, 1624615381561, '1234');
INSERT INTO `sys_session` VALUES ('a9feb75f007e4cd4958c6243b5d7839b', 0, 1607831136681, 'admin');
INSERT INTO `sys_session` VALUES ('aa9e3f73c1554de1b27c043c3eff4a00', 0, 1623314745802, 'admin');
INSERT INTO `sys_session` VALUES ('ab6d079db51e48be919b4a04f3d2d858', 0, 1607834469838, 'admin');
INSERT INTO `sys_session` VALUES ('ac35bd5e8bcb48bb996643d92e4ed070', 0, 1608281743893, 'admin');
INSERT INTO `sys_session` VALUES ('ad4537d76bab43e3a5bb69033d1a401f', 0, 1607878603376, 'admin');
INSERT INTO `sys_session` VALUES ('adaf5730e82e4fe882ab018dd63778f7', 0, 1612152881435, 'admin');
INSERT INTO `sys_session` VALUES ('ae1f64c96ea9458b8fc55051daf591cd', 0, 1612792552723, 'admin');
INSERT INTO `sys_session` VALUES ('ae496c03d0a44e0eaceda43306c15a7f', 0, 1614587007310, 'geo');
INSERT INTO `sys_session` VALUES ('af2eaa5e44324e61bdf2c2ad67a436e5', 0, 1607681785898, 'admin');
INSERT INTO `sys_session` VALUES ('affdc566730642a593cf46f89c5ab246', 0, 1608701119516, 'admin');
INSERT INTO `sys_session` VALUES ('afff9f61418d4dc9a694c844d0bac3d9', 0, 1607844213428, 'admin');
INSERT INTO `sys_session` VALUES ('b016eb6f96074e9292762ec0d4fea1e5', 0, 1623065140345, 'admin');
INSERT INTO `sys_session` VALUES ('b0ced7d898204f188faebba866dfa7ee', 0, 1624011237149, 'admin');
INSERT INTO `sys_session` VALUES ('b114ae99c3644e8eb079576e44876fed', 0, 1623129788081, 'admin');
INSERT INTO `sys_session` VALUES ('b131e65588cd4ba294edfb6849d0678e', 0, 1615448993396, 'geo');
INSERT INTO `sys_session` VALUES ('b258e25c23d4409196697e93d34a3bf4', 0, 1607745604872, 'admin');
INSERT INTO `sys_session` VALUES ('b2801277836c4e429e510cea806ea81e', 0, 1615453246550, 'geo');
INSERT INTO `sys_session` VALUES ('b3a6a9f714c64531b653891f38305eac', 0, 1607828279350, 'admin');
INSERT INTO `sys_session` VALUES ('b3b544c85d9442d5a9f7f53d37b04477', 0, 1615778112581, 'admin');
INSERT INTO `sys_session` VALUES ('b42d268563ec428d82e6f6b77eb790c3', 0, 1611776140068, 'admin');
INSERT INTO `sys_session` VALUES ('b4a5bab584f6475fbd204dc3966b4ef3', 0, 1612936006174, 'admin');
INSERT INTO `sys_session` VALUES ('b4de9e27d1a54ba6aae72375587ece34', 0, 1624003599577, 'admin');
INSERT INTO `sys_session` VALUES ('b5480597771b4f2da3cf5a1b2265206a', 0, 1607843156774, 'admin');
INSERT INTO `sys_session` VALUES ('b5b503ec00c14520b59400eec3c91470', 0, 1607844549946, 'admin');
INSERT INTO `sys_session` VALUES ('b67e968e7ef5486c86ba6999c6605db0', 0, 1623842433621, 'admin');
INSERT INTO `sys_session` VALUES ('b9ec348f08884415b60d68b0053470ab', 0, 1608699505115, 'admin');
INSERT INTO `sys_session` VALUES ('ba566d195d3e478489edf490adf356a1', 0, 1613817727259, 'admin');
INSERT INTO `sys_session` VALUES ('bb385aaa608547ab879b266fe3019891', 0, 1609819851548, 'admin');
INSERT INTO `sys_session` VALUES ('bbd08d81ff5e497c991e2173ceb89758', 0, 1607922622340, 'admin');
INSERT INTO `sys_session` VALUES ('bc0146679f9e45fd8517e94c087ee842', 0, 1624533478009, 'admin');
INSERT INTO `sys_session` VALUES ('bc37af839bc142ab90e802d677a072b9', 0, 1622775560480, 'admin');
INSERT INTO `sys_session` VALUES ('bc60825dc8c44914acb4b431131f243a', 0, 1607869673120, 'admin');
INSERT INTO `sys_session` VALUES ('bc7e6af6b6d444688cc715ce43a1807b', 0, 1608778607825, 'admin');
INSERT INTO `sys_session` VALUES ('bdb53a5ebd3843ef9b3a387454075fce', 0, 1607687870537, 'admin');
INSERT INTO `sys_session` VALUES ('be0868d1287b4913905bd896b293874a', 0, 1623400272820, 'admin');
INSERT INTO `sys_session` VALUES ('be633fb04f854375b99c74bd91f520f6', 0, 1609747346608, 'admin');
INSERT INTO `sys_session` VALUES ('bee2130795a5496e9d8a2823e2c8e88e', 0, 1614078087056, 'admin');
INSERT INTO `sys_session` VALUES ('bf7083ebfd784aab9783e1d7cf121858', 0, 1623150440592, 'admin');
INSERT INTO `sys_session` VALUES ('bfa31547fd9a47cba6d304dd72210219', 0, 1623382588152, 'admin');
INSERT INTO `sys_session` VALUES ('c0cb6afe595c467698c630cf89df3e5c', 0, 1623727326329, 'admin');
INSERT INTO `sys_session` VALUES ('c1124d88d122426d876b5edc637f2590', 0, 1613809067449, 'admin');
INSERT INTO `sys_session` VALUES ('c2dccea8a9a844e9a593d86d66a5d750', 0, 1623292781035, 'admin');
INSERT INTO `sys_session` VALUES ('c62d2116eb784585a67a68ad862312a7', 0, 1607842976942, 'admin');
INSERT INTO `sys_session` VALUES ('c65610e2c4ca4f2dbabd10469189b2f4', 0, 1607834293660, 'admin');
INSERT INTO `sys_session` VALUES ('c72550d22c8247e9b16a03dda439429d', 0, 1624599190496, 'admin');
INSERT INTO `sys_session` VALUES ('c7fbd90de46541c099fcfa6cda0cedd1', 0, 1624443647656, 'admin');
INSERT INTO `sys_session` VALUES ('c899203c6f354deebaf87a51410af3a1', 0, 1607867697828, 'admin');
INSERT INTO `sys_session` VALUES ('c94f6755d38940abb49bd8c43af00f51', 0, 1612520602053, 'admin');
INSERT INTO `sys_session` VALUES ('c951908b3a8643f4b43d0a9048ef102e', 0, 1608712056991, 'admin');
INSERT INTO `sys_session` VALUES ('c96e1f36e369464e8a006b021a49db56', 0, 1612582311066, 'admin');
INSERT INTO `sys_session` VALUES ('c9ca2213c14944fab29643523c379d64', 0, 1614586947974, 'admin');
INSERT INTO `sys_session` VALUES ('ca884d27809844578d32541456a336b1', 0, 1624329922714, 'admin');
INSERT INTO `sys_session` VALUES ('cbb139d713c34d3b917d8750d3c9b088', 0, 1607839759053, 'admin');
INSERT INTO `sys_session` VALUES ('cbd98bd235de4d719ac3c9f8a7892976', 0, 1614675370232, 'admin');
INSERT INTO `sys_session` VALUES ('ccb2719b55ef49c1b72f8570910d03c9', 0, 1612349036885, 'admin');
INSERT INTO `sys_session` VALUES ('cd4c4a557e5741e591ec6a9c99e9a74d', 0, 1615550244323, 'admin');
INSERT INTO `sys_session` VALUES ('ce6b6640e96540e09a20e57936878258', 0, 1616123617740, 'admin');
INSERT INTO `sys_session` VALUES ('cef6b4bd914a4d71b7b6728027f2d8fc', 0, 1613961882892, 'admin');
INSERT INTO `sys_session` VALUES ('cf56a11263b64ab092f379aef39294b6', 0, 1607878553251, 'admin');
INSERT INTO `sys_session` VALUES ('cfe5c484bf9e4ad2913eb7a9be2b341a', 0, 1613800105830, 'admin');
INSERT INTO `sys_session` VALUES ('d00ba302ed5349319cbd25a4ebb8ed00', 0, 1608265279113, 'admin');
INSERT INTO `sys_session` VALUES ('d09f00afeb0a400390201edc4fcde293', 0, 1609999100309, 'admin');
INSERT INTO `sys_session` VALUES ('d16097ae84dc4d649aeecdabfe4dae4c', 0, 1612607905214, 'admin');
INSERT INTO `sys_session` VALUES ('d2480ba74cf64b5dbdefc345e3e11c1a', 0, 1616140982281, 'admin');
INSERT INTO `sys_session` VALUES ('d270346d86aa4a7c8f200f29812f87e4', 0, 1609212330389, 'admin');
INSERT INTO `sys_session` VALUES ('d37bc3fea77c4283ac25f7e6202e0d27', 0, 1612413591622, 'admin');
INSERT INTO `sys_session` VALUES ('d37c83d912ea457caf82f7f51435f49c', 0, 1614152938477, 'admin');
INSERT INTO `sys_session` VALUES ('d454c7d6a36d432eb918328316b6a315', 0, 1608803428105, 'admin');
INSERT INTO `sys_session` VALUES ('d495a15adae647e4858a3d5c82c9805e', 0, 1608886791170, 'admin');
INSERT INTO `sys_session` VALUES ('d5d39ca0dbe14432b7175b6e1ec16f91', 0, 1607869058197, 'admin');
INSERT INTO `sys_session` VALUES ('d60112c95ecc465a956523a08c0fbf65', 0, 1624263388698, 'admin');
INSERT INTO `sys_session` VALUES ('d61fbf21c1464918885860013fc70370', 0, 1608290069920, 'admin');
INSERT INTO `sys_session` VALUES ('d6449f60a23a4f9bba36b72c8c3720b3', 0, 1610342345020, 'admin');
INSERT INTO `sys_session` VALUES ('d6616c89ad6c4d01841c50e13180d4a5', 0, 1614051819463, 'admin');
INSERT INTO `sys_session` VALUES ('d68dcf6159d94f5ebb2e9f4e9ba289b3', 0, 1622783420053, 'admin');
INSERT INTO `sys_session` VALUES ('d868044e5f9f4ca5bb64f276112603c2', 0, 1610506655702, 'admin');
INSERT INTO `sys_session` VALUES ('d88c04bba4e34b32a12042c3b1b68c78', 0, 1614139403060, 'geo');
INSERT INTO `sys_session` VALUES ('d8ccaf9133d7401088ae47634906fd05', 0, 1608540256870, 'admin');
INSERT INTO `sys_session` VALUES ('d92102a5185f4bcd86bdc660bab79e08', 0, 1614240048313, 'admin');
INSERT INTO `sys_session` VALUES ('d93779d6da68411d8343750c42c61a77', 0, 1609998657468, 'admin');
INSERT INTO `sys_session` VALUES ('da83eab05730454091995a01e7defee3', 0, 1623300082548, 'admin');
INSERT INTO `sys_session` VALUES ('db197e8da18c482789422af5dbf0c53b', 0, 1607703788497, 'admin');
INSERT INTO `sys_session` VALUES ('dc6e7bc6e4a144ad9106395c2eb321b5', 0, 1614570706223, 'admin');
INSERT INTO `sys_session` VALUES ('dce60fea839849828541bb3337ac7757', 0, 1609952958123, 'admin');
INSERT INTO `sys_session` VALUES ('dd34f62c289048d99f487cefba7ec292', 0, 1607923751668, 'admin');
INSERT INTO `sys_session` VALUES ('dda52b9e87d74675ac9abe6a44993642', 0, 1607684536037, 'admin');
INSERT INTO `sys_session` VALUES ('ddc29b050e9247eab6295492cb4c6641', 0, 1608805675681, 'admin');
INSERT INTO `sys_session` VALUES ('df6c05ea95704ebe972f6883fbba3e8c', 0, 1607881679044, 'admin');
INSERT INTO `sys_session` VALUES ('df6fba5730b04eb09beca19f269ab547', 0, 1623065130940, 'admin');
INSERT INTO `sys_session` VALUES ('df78ea697ca441f1a21c99cb4fa9ba9f', 0, 1611315788196, 'admin');
INSERT INTO `sys_session` VALUES ('dfe184b4134f4ff784b306c33b66b4a7', 0, 1612607013011, 'admin');
INSERT INTO `sys_session` VALUES ('e03397d85b9e41558aed0777e8a70770', 0, 1607585643009, 'admin');
INSERT INTO `sys_session` VALUES ('e0490c7a65f346afb224ce13f3aba56b', 0, 1613790186947, 'admin');
INSERT INTO `sys_session` VALUES ('e056560bc0cd4da687eb8a7b257dc5fd', 0, 1607745595090, 'admin');
INSERT INTO `sys_session` VALUES ('e0ef2c2bde5e4601977b6b3a42e3938f', 0, 1607922592871, 'admin');
INSERT INTO `sys_session` VALUES ('e0fa3aaed0b64d5ca3c73e97a196caa9', 0, 1610016955748, 'admin');
INSERT INTO `sys_session` VALUES ('e198bf22cb8e4a4eb4ff216285df86e6', 0, 1607839919989, 'admin');
INSERT INTO `sys_session` VALUES ('e303c9ce92df45a4a8d479531603a6ff', 0, 1609127542067, 'admin');
INSERT INTO `sys_session` VALUES ('e3312f804f0640d3a5b6ffff676fe498', 0, 1614569120465, 'geo');
INSERT INTO `sys_session` VALUES ('e35a9d7c973f4e37860badb73bba6582', 0, 1614139402998, 'geo');
INSERT INTO `sys_session` VALUES ('e425abddeda24fa999152860aa0d076f', 0, 1611049671501, 'admin');
INSERT INTO `sys_session` VALUES ('e63968cba7834387bbf899f19fb08804', 0, 1615347541721, 'admin');
INSERT INTO `sys_session` VALUES ('e6e4a1a4ad8844f6aec4a858b233b742', 0, 1612813183550, 'test');
INSERT INTO `sys_session` VALUES ('e8c43fbbd11c48b2a94e988775725f35', 0, 1614311891049, 'geo');
INSERT INTO `sys_session` VALUES ('e95deb8f6392474eb1c6efbc0f48b494', 0, 1613647466698, 'admin');
INSERT INTO `sys_session` VALUES ('ea2656525186484d89b9c71215325c95', 0, 1609991704660, 'admin');
INSERT INTO `sys_session` VALUES ('ea554aade4c549b895949865e0e41ca7', 0, 1610961396157, 'admin');
INSERT INTO `sys_session` VALUES ('ea8847dde10840d28df5a0b110813a52', 0, 1607505715349, 'admin');
INSERT INTO `sys_session` VALUES ('eae2fe4303584cd08e0d14eadde9e5c2', 0, 1616124500371, 'admin');
INSERT INTO `sys_session` VALUES ('eb3c9b941e6a4ea7a242a948de483658', 0, 1612413041898, 'admin');
INSERT INTO `sys_session` VALUES ('eb5ffed81be44beca850c3f48e93a5f6', 0, 1624593102453, '456');
INSERT INTO `sys_session` VALUES ('ec0a5d32e4bd4cd686ceb56442ac06c2', 0, 1614710285963, 'admin');
INSERT INTO `sys_session` VALUES ('ec0c50235ad948bd8c25c73a389a0967', 0, 1615547130335, 'admin');
INSERT INTO `sys_session` VALUES ('ec897500767847a7afe22e662ce7a258', 0, 1616131739566, 'admin');
INSERT INTO `sys_session` VALUES ('ecd8e250c80440c8bf27bfb1103e1bf7', 0, 1615871049220, 'admin');
INSERT INTO `sys_session` VALUES ('ecfdb88a875f402d8f0630bbbf53e79c', 0, 1614135906098, 'admin');
INSERT INTO `sys_session` VALUES ('ed9207179b094413ac3963073b5a1870', 0, 1623904730214, 'admin');
INSERT INTO `sys_session` VALUES ('edfb47f84f9a4417a9ce7791fa8c3c3e', 0, 1623210690588, 'admin');
INSERT INTO `sys_session` VALUES ('ee02798c4ded499684aa1b816a6e7547', 0, 1607852674447, 'admin');
INSERT INTO `sys_session` VALUES ('ee42d9b7ec944d359608e5c9a5688a40', 0, 1613807365605, 'admin');
INSERT INTO `sys_session` VALUES ('ef48e0e08e8c47d2baf2337cd8359199', 0, 1623064318169, 'admin');
INSERT INTO `sys_session` VALUES ('f00d3b827dd849af82318a9df3c928d1', 0, 1613623796397, 'admin');
INSERT INTO `sys_session` VALUES ('f06e30120e55499282f0ad38719f4da8', 0, 1607768216696, 'admin');
INSERT INTO `sys_session` VALUES ('f0f816f46769451eb0d48bf153002bdc', 0, 1615362219148, 'admin');
INSERT INTO `sys_session` VALUES ('f16352bdc0de46f1912874d37040e055', 0, 1613636673491, 'test');
INSERT INTO `sys_session` VALUES ('f19599a54524485b9e7ed5049d9c06ea', 0, 1623995793666, 'admin');
INSERT INTO `sys_session` VALUES ('f20205251ef241d1821e2f4d1e280c01', 0, 1612942361633, 'admin');
INSERT INTO `sys_session` VALUES ('f239f20a6bf0450dba15a2d7cadc6cdb', 0, 1609988026754, 'admin');
INSERT INTO `sys_session` VALUES ('f303c69a7d194cc184ad74bd9c8d978e', 0, 1607845340325, 'admin');
INSERT INTO `sys_session` VALUES ('f340a269cd794493836b0362a6954d29', 0, 1614618080431, 'admin');
INSERT INTO `sys_session` VALUES ('f4acef5501a04c6cafac6c542b4f53a9', 0, 1615519894396, 'admin');
INSERT INTO `sys_session` VALUES ('f5bae34e65044002a11b6de7efb8ee19', 0, 1615544209461, 'admin');
INSERT INTO `sys_session` VALUES ('f5fc505becb445b7bf793db36088520c', 0, 1610006414935, 'admin');
INSERT INTO `sys_session` VALUES ('f6e3db941f5b495c83fb8da62652a243', 0, 1609756431763, 'admin');
INSERT INTO `sys_session` VALUES ('f87cf1d240114715b7235913427f0eb3', 0, 1613729414199, 'admin');
INSERT INTO `sys_session` VALUES ('f9d5dbb1184144b19daadc0be4c0f00d', 0, 1612612594204, 'test');
INSERT INTO `sys_session` VALUES ('f9f31a5aa34e469f9da1bfc9dbf37b27', 0, 1613713135974, 'admin');
INSERT INTO `sys_session` VALUES ('fbfe1ffc4578456992c1bf030729216c', 0, 1607672622767, 'admin');
INSERT INTO `sys_session` VALUES ('fc7ba7d98b0c423d99355dfaab58522e', 0, 1623121463637, 'admin');
INSERT INTO `sys_session` VALUES ('fd07ca6364304ede86f20f92c6a36237', 0, 1608108903342, 'admin');
INSERT INTO `sys_session` VALUES ('fd6b4c9edbe5490bbbf9f6d9c2286e5d', 0, 1607330924320, 'admin');
INSERT INTO `sys_session` VALUES ('fd75690087ff41a8927e53c8f4158756', 0, 1614741300230, 'admin');
INSERT INTO `sys_session` VALUES ('ff1efaef0eee4820a655880396d24458', 0, 1607833935424, 'admin');
INSERT INTO `sys_session` VALUES ('ff92c7ff2c244945beb8931b211357f2', 0, 1607685590243, 'admin');
INSERT INTO `sys_session` VALUES ('ff983a6df7fb498ea2bacc53209bec47', 0, 1607755334047, 'admin');

-- ----------------------------
-- Table structure for tableuserinfo
-- ----------------------------
DROP TABLE IF EXISTS `tableuserinfo`;
CREATE TABLE `tableuserinfo`  (
  `UserID` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `UserGrade` int(11) NULL DEFAULT NULL,
  `Password` char(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `UserName` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `PID` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Company` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Education` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Degree` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Telephone` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Email` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `QQ` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Image` char(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Certificate` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Job` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `Qualifications` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `LoginDateTime` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `ProjectAuthority` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`UserID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tableuserinfo
-- ----------------------------
INSERT INTO `tableuserinfo` VALUES ('1', 1, 'e10adc3949ba59abbe56e057f20f883e0', 'ZXF', '', '', '', '', '13760777323', '', '', '', '', '', '', '', 'ALL');
INSERT INTO `tableuserinfo` VALUES ('2', 1, 'e10adc3949ba59abbe56e057f20f883e0', 'HHX', '', '', '', '', '15920431947', '', '', '', '', '', '', '', 'ALL');
INSERT INTO `tableuserinfo` VALUES ('3', 1, 'e10adc3949ba59abbe56e057f20f883e0', 'LRX', '', '', '', '', '18620380168', '', '', '', '', '', '', '', 'ALL');
INSERT INTO `tableuserinfo` VALUES ('4', 1, 'e10adc3949ba59abbe56e057f20f883e0', 'HK', '', '', '', '', '15989068889', '', '', '', '', '', '', '', 'ALL');
INSERT INTO `tableuserinfo` VALUES ('admin', 0, '21232f297a57a5a743894a0e4a801fc30', '超级管理员', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ALL');
INSERT INTO `tableuserinfo` VALUES ('biluo', 1, 'e8e1f69687c7e7c8217584c0edba00de0', 'biluo', '', '', '', '', '', '', '', '', '', '', '', '', '1@2@4');
INSERT INTO `tableuserinfo` VALUES ('geo', 1, 'ecc174e3e02c82f34c14fe860bf47ef20', 'geo', '', '', '', '', '', '', '', '', '', '', '', '', '1@2');
INSERT INTO `tableuserinfo` VALUES ('geotest', 1, 'c9634623fe9cd7f383605b5c6aec6ce30', 'geotest', '', '', '', '', '', '', '', '', '', '', '', '', '2');
INSERT INTO `tableuserinfo` VALUES ('test', 1, '098f6bcd4621d373cade4e832627b4f60', 'test', '', '', '', '', '', '', '', '', '', '', '', '2021-02-24 14:01:19', 'ALL');

-- ----------------------------
-- Table structure for take_note
-- ----------------------------
DROP TABLE IF EXISTS `take_note`;
CREATE TABLE `take_note`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '仪器编码',
  `function` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '功能属性',
  `noteOrder` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '指令',
  `ResSate` int(5) NULL DEFAULT NULL COMMENT '指令返回结果',
  `workTime` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '记录时间',
  `orderDetail` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of take_note
-- ----------------------------
INSERT INTO `take_note` VALUES (1, 'MS101', 'WiFi设置', 'wifi', 0, '2021-05-28', NULL);
INSERT INTO `take_note` VALUES (2, 'MS101', '服务器地址', 'net', 1, '2021-05-28', NULL);
INSERT INTO `take_note` VALUES (3, 'MS102', 'WiFi设置', 'wifi', 2, '2021-05-28', NULL);
INSERT INTO `take_note` VALUES (6, 'MS10640041007', '结果进行平滑设置', 'DEVICE.RAW.RESULT_SMOOTH', 1, '2021-05-31 18:09:20', '@GNSS,SET,DEVICE.RAW.RESULT_SMOOTH,1,OK*2E');
INSERT INTO `take_note` VALUES (7, 'MS10640041007', '双周期解算设置', 'DEVICE.RAW.DOUBLE_INV', 1, '2021-06-04 09:14:16', '@GNSS,SET,DEVICE.RAW.DOUBLE_INV,1,OK*4A');
INSERT INTO `take_note` VALUES (16, 'MS10640041007', '设置时区设置', 'DEVICE.TIMEZONE', 1, '2021-06-03 09:40:38', '@GNSS,SET,DEVICE.TIMEZONE,+8,OK*AF');
INSERT INTO `take_note` VALUES (17, 'MS10640041007', 'IMU触发RTK紧急模式设置', 'DEVICE.IMU_WARN', 1, '2021-05-31 18:09:20', '@GNSS,SET,DEVICE.IMU_WARN,2,OK*18');
INSERT INTO `take_note` VALUES (18, 'MS10640041007', '短信唤醒设置', 'DEVICE.SMS_WAKEUP', 1, '2021-06-02 15:29:54', '@GNSS,SET,DEVICE.SMS_WAKEUP,1,OK*DC');

-- ----------------------------
-- Table structure for template_data
-- ----------------------------
DROP TABLE IF EXISTS `template_data`;
CREATE TABLE `template_data`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `templateid` varchar(168) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `projectid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of template_data
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
