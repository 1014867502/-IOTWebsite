/*
SQLyog Enterprise v12.09 (64 bit)
MySQL - 5.7.23-log : Database - Monitor
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`Monitor` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `Monitor`;

/*Table structure for table `device` */

DROP TABLE IF EXISTS `device`;

CREATE TABLE `device` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `projectid` varchar(20) NOT NULL COMMENT '所属项目id',
  `stationname` varchar(100) DEFAULT NULL COMMENT '站点名称',
  `name` varchar(100) DEFAULT NULL COMMENT '设备名称',
  `sn` varchar(50) NOT NULL COMMENT 'sn号',
  `typeid` varchar(20) DEFAULT NULL COMMENT '类型id',
  `online` bit(1) DEFAULT NULL COMMENT '是否在线',
  `lat` double DEFAULT NULL COMMENT '安装纬度,单位度',
  `lon` double DEFAULT NULL COMMENT '安装经度,单位度',
  `height` double DEFAULT NULL COMMENT '高度',
  `pic` varchar(500) DEFAULT NULL COMMENT '现场图片路径',
  PRIMARY KEY (`id`,`sn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device` */

/*Table structure for table `device_gnssdata` */

DROP TABLE IF EXISTS `device_gnssdata`;

CREATE TABLE `device_gnssdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn` varchar(50) NOT NULL COMMENT '设备sn号',
  `lat` double DEFAULT NULL COMMENT '经纬度单位度',
  `lon` double DEFAULT NULL,
  `height` double DEFAULT NULL COMMENT '单位米',
  `createtiontime` varchar(25) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device_gnssdata` */

/*Table structure for table `device_gnsslog` */

DROP TABLE IF EXISTS `device_gnsslog`;

CREATE TABLE `device_gnsslog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn` varchar(50) NOT NULL COMMENT '设备sn号',
  `battery` varchar(10) DEFAULT NULL COMMENT '剩余电量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device_gnsslog` */

/*Table structure for table `device_gnssoffset` */

DROP TABLE IF EXISTS `device_gnssoffset`;

CREATE TABLE `device_gnssoffset` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn` varchar(50) NOT NULL COMMENT '设备sn号',
  `dx` double DEFAULT '0' COMMENT '北偏移，单位mm',
  `dy` double DEFAULT '0' COMMENT '东偏移',
  `dz` double DEFAULT '0' COMMENT '高偏移',
  `createtiontime` varchar(25) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device_gnssoffset` */

/*Table structure for table `device_sensordict` */

DROP TABLE IF EXISTS `device_sensordict`;

CREATE TABLE `device_sensordict` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn` varchar(50) DEFAULT NULL COMMENT '设备sn号',
  `value` varchar(50) DEFAULT NULL COMMENT '传感器值',
  `keyname1` varchar(100) DEFAULT NULL COMMENT '字典主健1',
  `keyname2` varchar(100) DEFAULT NULL COMMENT '字典主健2',
  `createtiontime` varchar(25) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device_sensordict` */

/*Table structure for table `device_warnlog` */

DROP TABLE IF EXISTS `device_warnlog`;

CREATE TABLE `device_warnlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sn` varchar(50) DEFAULT NULL COMMENT '设备sn号',
  `createtiontime` varchar(25) DEFAULT NULL COMMENT '创建时间',
  `level` int(4) DEFAULT '0' COMMENT '等级',
  `content` varchar(200) DEFAULT NULL COMMENT '内容',
  `solvetype` int(4) DEFAULT NULL COMMENT '处理方式',
  `solvenote` varchar(200) DEFAULT NULL COMMENT '处理描述',
  `solvetime` varchar(25) DEFAULT NULL COMMENT '处理时间',
  `solveperson` varchar(50) DEFAULT NULL COMMENT '处理人',
  `state` int(4) DEFAULT NULL COMMENT '状态',
  `projectid` varchar(20) DEFAULT NULL COMMENT '所属项目id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `device_warnlog` */

/*Table structure for table `devicetype` */

DROP TABLE IF EXISTS `devicetype`;

CREATE TABLE `devicetype` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `value` varchar(50) DEFAULT NULL COMMENT '索引值',
  `delflag` bit(1) DEFAULT NULL COMMENT '删除标记',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `devicetype` */

/*Table structure for table `project` */

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(50) DEFAULT NULL COMMENT '名称',
  `proID` varchar(20) DEFAULT NULL COMMENT '项目唯一ID',
  `address` varchar(150) DEFAULT NULL COMMENT '地址',
  `lat` double DEFAULT NULL COMMENT '纬度,单位度',
  `lon` double DEFAULT NULL COMMENT '经度,单位度',
  `profile` varchar(200) DEFAULT NULL COMMENT '简介,100字以内',
  `incharge` varchar(50) DEFAULT NULL COMMENT '负责人',
  `equipment` varchar(50) DEFAULT NULL COMMENT '所管理的设备类型id',
  `telephone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `pic` varchar(500) DEFAULT NULL COMMENT '图片路径',
  `creationtime` varchar(25) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `project` */

insert  into `project`(`id`,`name`,`proID`,`address`,`lat`,`lon`,`profile`,`incharge`,`equipment`,`telephone`,`pic`,`creationtime`) values (1,'1','2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `sys_account` */

DROP TABLE IF EXISTS `sys_account`;

CREATE TABLE `sys_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickName` varchar(50) NOT NULL,
  `userName` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `salt` varchar(150) NOT NULL,
  `status` int(11) NOT NULL,
  `createAt` datetime NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `fun_admin` int(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `sys_account` */

insert  into `sys_account`(`id`,`nickName`,`userName`,`password`,`salt`,`status`,`createAt`,`storeId`,`email`,`phone`,`fun_admin`) values (1,'admin','admin','c58a717dc54cc12b8f4074ac6aa9a45462417138b2f91272350a7d8ad2f41dc9','uvro0T1L6pbzVAWKdCn5OgvnrQ0LsfX-',1,'2019-05-30 13:55:53',NULL,'geoelectrontest@163.com',NULL,255);

/*Table structure for table `sys_account_login_log` */

DROP TABLE IF EXISTS `sys_account_login_log`;

CREATE TABLE `sys_account_login_log` (
  `accountId` int(11) NOT NULL,
  `loginAt` datetime NOT NULL,
  `ip` varchar(100) DEFAULT NULL,
  KEY `accountId_index` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_account_login_log` */

/*Table structure for table `sys_account_role` */

DROP TABLE IF EXISTS `sys_account_role`;

CREATE TABLE `sys_account_role` (
  `accountId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`accountId`,`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_account_role` */

insert  into `sys_account_role`(`accountId`,`roleId`) values (1,1);

/*Table structure for table `sys_dict` */

DROP TABLE IF EXISTS `sys_dict`;

CREATE TABLE `sys_dict` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `value` varchar(50) DEFAULT NULL,
  `object` varchar(100) DEFAULT NULL,
  `field` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_dict` */

/*Table structure for table `sys_permission` */

DROP TABLE IF EXISTS `sys_permission`;

CREATE TABLE `sys_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actionKey` varchar(512) NOT NULL DEFAULT '',
  `controller` varchar(512) NOT NULL DEFAULT '',
  `remark` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_permission` */

/*Table structure for table `sys_role` */

DROP TABLE IF EXISTS `sys_role`;

CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '',
  `createAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_role` */

/*Table structure for table `sys_role_permission` */

DROP TABLE IF EXISTS `sys_role_permission`;

CREATE TABLE `sys_role_permission` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_role_permission` */

/*Table structure for table `sys_session` */

DROP TABLE IF EXISTS `sys_session`;

CREATE TABLE `sys_session` (
  `accessToken` varchar(33) NOT NULL,
  `accountId` int(11) NOT NULL,
  `expireAt` bigint(20) NOT NULL,
  PRIMARY KEY (`accessToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_session` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
