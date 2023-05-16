# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: rm-bp1244pob19n95jfm.mysql.rds.aliyuncs.com (MySQL 5.7.32-log)
# Database: award
# Generation Time: 2022-10-31 08:11:42 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table award
# ------------------------------------------------------------

DROP TABLE IF EXISTS `award`;

CREATE TABLE `award` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `award` float DEFAULT '0' COMMENT '合同金额税后',
  `saleaward` float DEFAULT '0' COMMENT '销售奖金税后',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '发奖金时间',
  `deleted` int(11) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `award` WRITE;
/*!40000 ALTER TABLE `award` DISABLE KEYS */;

INSERT INTO `award` (`id`, `award`, `saleaward`, `update_time`, `deleted`)
VALUES
	(65,0,0,'2022-10-10 15:08:56',0),
	(66,0,0,'2022-10-10 15:08:58',0),
	(68,0,0,'2022-10-10 15:08:59',0),
	(69,0,0,'2022-10-10 15:09:00',0),
	(72,0,0,'2022-10-10 15:09:02',0),
	(73,0,0,'2022-10-10 15:09:03',0),
	(75,0,0,'2022-10-10 15:09:05',0),
	(76,0,0,'2022-10-10 15:09:06',0),
	(77,0,0,'2022-10-10 15:09:08',0),
	(78,0,0,'2022-10-10 15:09:09',0),
	(80,0,0,'2022-10-10 15:09:11',0),
	(81,0,0,'2022-10-10 15:09:12',0),
	(83,2.314,1.157,'2022-10-13 15:07:45',0),
	(84,3.1,0.828,'2022-10-14 16:37:18',0),
	(87,5.93,1.459,'2022-10-20 18:02:47',0),
	(93,5.5,1.107,'2022-10-13 14:24:34',0);

/*!40000 ALTER TABLE `award` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table persons
# ------------------------------------------------------------

DROP TABLE IF EXISTS `persons`;

CREATE TABLE `persons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `position` varchar(100) NOT NULL DEFAULT '' COMMENT '职位',
  `deleted` int(11) DEFAULT '0' COMMENT '是否删除',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pwd` varchar(100) DEFAULT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;

INSERT INTO `persons` (`id`, `name`, `position`, `deleted`, `update_time`, `pwd`)
VALUES
	(1,'叶菁','业务总监',0,'2022-08-11 16:52:12','123123'),
	(2,'施翔','开发经理',0,'2022-08-22 11:52:38','123123sx'),
	(3,'段文康','项目经理',0,'2022-08-12 11:37:06',''),
	(4,'程斌辉','项目经理',0,'2022-08-12 11:37:07',''),
	(5,'李福平','设计师',0,'2022-08-12 11:37:08',''),
	(6,'陆宇','设计师',1,'2022-08-29 17:40:23',''),
	(7,'张敏','设计师',0,'2022-08-12 11:37:10',''),
	(8,'刘俊彦','需求分析师',0,'2022-08-12 11:37:12',''),
	(9,'许洁翔','需求分析师',0,'2022-08-12 11:37:13',''),
	(10,'方吉薇','前端开发',0,'2022-08-12 11:37:14',''),
	(11,'张凯弘','前端开发',0,'2022-08-12 11:37:15',''),
	(12,'李杰','前端开发',0,'2022-08-12 11:37:16',''),
	(13,'李帅','前端开发',0,'2022-08-12 11:37:18',''),
	(14,'厉芯雅','前端开发',0,'2022-08-12 11:37:19',''),
	(15,'蔡衍乐','前端开发',0,'2022-08-12 11:37:20',''),
	(16,'张斌','数据开发',0,'2022-08-12 11:37:21',''),
	(17,'丁亮','前端开发',0,'2022-08-12 11:37:22',''),
	(18,'刘浩','数据开发',0,'2022-08-12 11:37:24',''),
	(19,'李婷婷','前端开发',0,'2022-08-12 11:37:25',''),
	(20,'范育斌','数据开发',0,'2022-10-09 15:27:12',''),
	(22,'测试员','测试工程师',1,'2022-08-12 11:37:27',''),
	(23,'高衍方','',0,'2022-10-09 15:38:03',NULL),
	(24,'胡兴鑫','兼职',0,'2022-10-10 15:00:59',NULL),
	(25,'唐银苹','',0,'2022-10-26 17:40:04',NULL);

/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table processperson
# ------------------------------------------------------------

DROP TABLE IF EXISTS `processperson`;

CREATE TABLE `processperson` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '人名',
  `troublerate` float DEFAULT '0' COMMENT '难度系数',
  `durationrate` float DEFAULT '0' COMMENT '工时系数',
  `responserate` float DEFAULT '0' COMMENT '责任系数',
  `ratio` float DEFAULT '0' COMMENT '总体系数',
  `percent` float DEFAULT '0' COMMENT '总体占比',
  `amount` float DEFAULT '0' COMMENT '金额',
  `poolamount` float DEFAULT '0' COMMENT '池子奖金',
  `saleamount` float DEFAULT '0' COMMENT '销售奖金',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `award_id` int(11) DEFAULT NULL COMMENT '外键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `processperson` WRITE;
/*!40000 ALTER TABLE `processperson` DISABLE KEYS */;

INSERT INTO `processperson` (`id`, `name`, `troublerate`, `durationrate`, `responserate`, `ratio`, `percent`, `amount`, `poolamount`, `saleamount`, `update_time`, `award_id`)
VALUES
	(834,'段文康',4,3,4,3.6,10.24,5633,0,0,'2022-10-13 14:24:35',93),
	(835,'程斌辉',2,2,3,2.1,5.97,3285.92,0,0,'2022-10-13 14:24:35',93),
	(836,'李福平',3,2,3,2.6,7.39,4068.28,0,0,'2022-10-13 14:24:35',93),
	(837,'刘俊彦',3,3,4,3.1,8.81,4850.64,0,0,'2022-10-13 14:24:35',93),
	(838,'许洁翔',3,3,4,3.1,8.81,4850.64,0,0,'2022-10-13 14:24:35',93),
	(839,'张凯弘',1,1.5,2,1.3,3.69,2034.14,0,0,'2022-10-13 14:24:35',93),
	(840,'李杰',2,4,3,2.9,8.25,4537.69,0,0,'2022-10-13 14:24:35',93),
	(841,'方吉薇',3,2,3,2.6,7.39,4068.28,0,0,'2022-10-13 14:24:35',93),
	(842,'李帅',1,1.5,2,1.3,3.69,2034.14,0,0,'2022-10-13 14:24:35',93),
	(843,'厉芯雅',1,1.5,2,1.3,3.69,2034.14,0,0,'2022-10-13 14:24:35',93),
	(844,'蔡衍乐',3,1.5,2,2.3,6.54,3598.86,0,0,'2022-10-13 14:24:35',93),
	(845,'施翔',3.5,2,4,2.95,8.39,4615.93,0,0,'2022-10-13 14:24:35',93),
	(846,'叶菁',3,2,4,2.7,7.68,4224.75,0,0,'2022-10-13 14:24:35',93),
	(847,'范育斌',1,1,1,1,2.84,1564.72,0,0,'2022-10-13 14:24:35',93),
	(848,'张敏',2,2.5,3,2.3,6.54,3598.86,0,0,'2022-10-13 14:24:35',93),
	(879,'程斌辉',4,4,4,4,10.33,2391.73,0,0,'2022-10-13 15:10:05',83),
	(880,'段文康',1,2,3,1.6,4.13,956.692,0,0,'2022-10-13 15:10:05',83),
	(881,'李福平',1,1,1,1,2.58,597.932,0,0,'2022-10-13 15:10:05',83),
	(882,'刘俊彦',4.5,5,4,4.65,12.01,2780.39,0,0,'2022-10-13 15:10:05',83),
	(883,'许洁翔',4.5,4,4,4.25,10.98,2541.21,0,0,'2022-10-13 15:10:05',83),
	(884,'李杰',2,4,3,2.9,7.49,1734.01,0,0,'2022-10-13 15:10:05',83),
	(885,'李帅',2,4,4,3,7.75,1793.8,0,0,'2022-10-13 15:10:05',83),
	(886,'厉芯雅',2,3,3,2.5,6.45,1494.83,0,0,'2022-10-13 15:10:05',83),
	(887,'蔡衍乐',5,4,4,4.5,11.62,2690.7,0,0,'2022-10-13 15:10:05',83),
	(888,'施翔',3,3,4,3.1,8.01,1853.59,0,0,'2022-10-13 15:10:05',83),
	(889,'叶菁',3,3,4,3.1,8.01,1853.59,0,0,'2022-10-13 15:10:05',83),
	(890,'张敏',1,1,1,1,2.58,597.932,0,0,'2022-10-13 15:10:05',83),
	(891,'张斌',1,1,2,1.1,2.84,657.726,0,0,'2022-10-13 15:10:05',83),
	(892,'丁亮',1,1,1,1,2.58,597.932,0,0,'2022-10-13 15:10:05',83),
	(893,'刘浩',1,1,1,1,2.58,597.932,0,0,'2022-10-13 15:10:05',83),
	(982,'段文康',3,4,4,3.5,9.58,5686.3,0,0,'2022-10-20 18:02:48',87),
	(983,'程斌辉',3,2,4,2.7,7.39,4386.58,0,0,'2022-10-20 18:02:48',87),
	(984,'李福平',3,2,3,2.6,7.12,4224.11,0,0,'2022-10-20 18:02:48',87),
	(985,'刘俊彦',4,2,4,3.2,8.76,5198.9,0,0,'2022-10-20 18:02:48',87),
	(986,'许洁翔',4,2,4,3.2,8.76,5198.9,0,0,'2022-10-20 18:02:48',87),
	(987,'李杰',2,4,3,2.9,7.94,4711.51,0,0,'2022-10-20 18:02:48',87),
	(988,'方吉薇',3,2,3,2.6,7.12,4224.11,0,0,'2022-10-20 18:02:48',87),
	(989,'李帅',2,1,3,1.7,4.65,2761.92,0,0,'2022-10-20 18:02:48',87),
	(990,'厉芯雅',2,2,3,2.1,5.75,3411.78,0,0,'2022-10-20 18:02:48',87),
	(991,'蔡衍乐',4,2,3,3.1,8.49,5036.44,0,0,'2022-10-20 18:02:48',87),
	(992,'范育斌',3,2,3,2.6,7.12,4224.11,0,0,'2022-10-20 18:02:48',87),
	(993,'施翔',2,2,5,2.3,6.3,3736.71,0,0,'2022-10-20 18:02:48',87),
	(994,'叶菁',2,2,5,2.3,6.3,3736.71,0,0,'2022-10-20 18:02:48',87),
	(995,'张敏',2,1,3,1.7,4.65,2761.92,0,0,'2022-10-20 18:02:48',87),
	(996,'胡兴鑫',0,0,0,0,0,0,22000,0,'2022-10-20 18:02:48',87),
	(1011,'程斌辉',2,2,3,2.1,10.6,3287.88,0,0,'2022-10-20 18:11:04',84),
	(1012,'段文康',2,2,3,2.1,10.6,3287.88,0,0,'2022-10-20 18:11:04',84),
	(1013,'李福平',0,1,1,0.5,2.52,782.828,0,0,'2022-10-20 18:11:04',84),
	(1014,'刘俊彦',1,2,3,1.6,8.08,2505.05,0,0,'2022-10-20 18:11:04',84),
	(1015,'方吉薇',3,3,4,3.1,15.65,4853.54,0,0,'2022-10-20 18:11:04',84),
	(1016,'蔡衍乐',3,3,4,3.1,15.65,4853.54,0,0,'2022-10-20 18:11:04',84),
	(1017,'施翔',2,2,5,2.3,11.61,3601.01,0,0,'2022-10-20 18:11:04',84),
	(1018,'叶菁',2,3,5,2.7,13.63,4227.27,0,0,'2022-10-20 18:11:04',84),
	(1019,'张斌',0,0.5,4,0.6,3.03,939.393,0,0,'2022-10-20 18:11:04',84),
	(1020,'丁亮',0,0,4,0.4,2.02,626.262,0,0,'2022-10-20 18:11:04',84),
	(1021,'刘浩',0,0,4,0.4,2.02,626.262,0,0,'2022-10-20 18:11:04',84),
	(1022,'许洁翔',0,1,1,0.5,2.52,782.828,0,0,'2022-10-20 18:11:04',84),
	(1023,'张凯弘',0,0,4,0.4,2.02,626.262,0,0,'2022-10-20 18:11:04',84);

/*!40000 ALTER TABLE `processperson` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table processpool
# ------------------------------------------------------------

DROP TABLE IF EXISTS `processpool`;

CREATE TABLE `processpool` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '人名',
  `amount` float DEFAULT '0' COMMENT '金额',
  `totalmoney` float DEFAULT NULL COMMENT '当时总金额',
  `type` int(11) NOT NULL DEFAULT '1' COMMENT '1:付出2:加入',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `award_id` int(11) DEFAULT '0' COMMENT '外键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `processpool` WRITE;
/*!40000 ALTER TABLE `processpool` DISABLE KEYS */;

INSERT INTO `processpool` (`id`, `name`, `amount`, `totalmoney`, `type`, `update_time`, `award_id`)
VALUES
	(190,'',3.2996,11.4944,2,'2022-10-25 14:13:57',93),
	(191,'',0,11.4944,1,'2022-10-25 14:14:00',93),
	(196,'',1.3786,1.3786,2,'2022-10-24 17:18:36',83),
	(197,'',0,1.3786,1,'2022-10-24 17:18:14',83),
	(212,'',4.3476,8.1948,2,'2022-10-24 17:19:33',87),
	(213,'',0,8.1948,1,'2022-10-25 14:13:25',87),
	(216,'',2.4686,3.8472,2,'2022-10-24 17:18:23',84),
	(217,'',0,3.8472,1,'2022-10-24 17:18:26',84),
	(219,'胡兴鑫',2.2,9.2944,1,'2022-10-25 15:25:47',0),
	(220,'高衍方',0.4,8.8944,1,'2022-10-24 17:23:51',0),
	(228,'唐银苹',0.2,8.6944,1,'2022-10-26 17:58:59',0);

/*!40000 ALTER TABLE `processpool` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table processproject
# ------------------------------------------------------------

DROP TABLE IF EXISTS `processproject`;

CREATE TABLE `processproject` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL COMMENT '项目名',
  `po_num` varchar(100) DEFAULT NULL COMMENT 'po 号',
  `contract_num` varchar(100) DEFAULT NULL COMMENT '合同号',
  `totalmoneybeforetax` float DEFAULT NULL COMMENT '合同金额',
  `totalmoney` float DEFAULT '0' COMMENT '合同金额税后',
  `cost` float NOT NULL DEFAULT '0' COMMENT '成本',
  `award` float NOT NULL COMMENT '奖金',
  `saleaward` float DEFAULT '0' COMMENT '销售奖金',
  `poolmoney` float DEFAULT '0' COMMENT '奖金池',
  `recievemoney` float NOT NULL DEFAULT '0' COMMENT '收到钱',
  `paymoney` float NOT NULL DEFAULT '0' COMMENT '支出供应商',
  `tax` float DEFAULT '0' COMMENT '项目税收',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `award_id` int(11) DEFAULT NULL COMMENT '外键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `processproject` WRITE;
/*!40000 ALTER TABLE `processproject` DISABLE KEYS */;

INSERT INTO `processproject` (`id`, `name`, `po_num`, `contract_num`, `totalmoneybeforetax`, `totalmoney`, `cost`, `award`, `saleaward`, `poolmoney`, `recievemoney`, `paymoney`, `tax`, `update_time`, `award_id`)
VALUES
	(130,'【数字驾驶舱】云上嘉善数字驾驶舱','PO20803208','DBHT-20220408-0114',199.98,187.981,0,5.999,1.199,3.299,59.99,0,0,'2022-10-13 14:24:35',93),
	(133,'宜昌城市大脑','无','DBHT-20220614-0190',250.7,235.658,0,2.507,1.2535,1.378,25.07,0,0,'2022-10-13 15:10:05',83),
	(141,'【嘉善交通】运输综合监测大屏模块，含大屏渲染机','PO20558509','DBHT-20211126-0419',180,169.2,0,4.32,1.08,2.97,54,0,0,'2022-10-20 18:02:48',87),
	(142,'【 数字驾驶舱】政务指数驾驶舱','PO20549319','DBHT-20211126-0420',40,37.6,0,0.96,0.24,0.66,12,0,0,'2022-10-20 18:02:48',87),
	(143,'【 数字驾驶舱】数字驾驶舱指标及扩展看板开发服务','PO20514992','DBHT-20211126-0421',27,25.38,0,0.648,0.162,0.445,8.1,0,0,'2022-10-20 18:02:48',87),
	(144,'【数字驾驶舱】云上读善大脑门户','PO20514969','DBHT-20211123-0413',16.5,15.51,0,0.495,0.099,0.272,4.95,0,0,'2022-10-20 18:02:48',87),
	(146,'随申办小程序2020年运营','PO21090388','DBHT-20220622-0207',74.8,70.312,0,3.366,0.897,2.468,44.88,0,0,'2022-10-20 18:11:04',84);

/*!40000 ALTER TABLE `processproject` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table projects
# ------------------------------------------------------------

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `po_num` varchar(100) DEFAULT NULL COMMENT 'po 号',
  `contract_num` varchar(100) DEFAULT NULL COMMENT '合同号',
  `totalmoneybeforetax` float DEFAULT '0' COMMENT '税前合同金额',
  `totalmoney` float NOT NULL DEFAULT '0' COMMENT '合同金额',
  `cost` float NOT NULL DEFAULT '0' COMMENT '成本',
  `award` float NOT NULL DEFAULT '0' COMMENT '奖金',
  `totalaward` float DEFAULT '0' COMMENT '应发奖金',
  `awardpercent` float DEFAULT '45' COMMENT '奖金比例',
  `paymoney` float NOT NULL DEFAULT '0' COMMENT '支出供应商',
  `poolmoney` float NOT NULL DEFAULT '0' COMMENT '奖金池',
  `tax` float DEFAULT '6' COMMENT '合同的税收',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(11) DEFAULT '0' COMMENT '是否删除',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `isdirect` int(11) DEFAULT '2' COMMENT '是否直签，直签销售奖5，非直签销售签2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;

INSERT INTO `projects` (`id`, `name`, `po_num`, `contract_num`, `totalmoneybeforetax`, `totalmoney`, `cost`, `award`, `totalaward`, `awardpercent`, `paymoney`, `poolmoney`, `tax`, `update_time`, `deleted`, `create_time`, `isdirect`)
VALUES
	(29,'【嘉善交通】运输综合监测大屏模块，含大屏渲染机','PO20558509','DBHT-20211126-0419',180,169.2,0,4,8.1,45,0,0,6,'2022-10-08 14:49:43',0,'2022-08-23 10:07:02',2),
	(30,'【 数字驾驶舱】政务指数驾驶舱','PO20549319','DBHT-20211126-0420',40,37.6,0,0.96,1.8,45,0,0,0,'2022-10-08 14:49:25',0,'2022-08-22 18:13:08',2),
	(31,'【 数字驾驶舱】数字驾驶舱指标及扩展看板开发服务','PO20514992','DBHT-20211126-0421',27,25.38,0,0.648,1.215,45,0,0,0,'2022-10-08 14:49:07',0,'2022-08-22 18:13:11',2),
	(32,'【数字驾驶舱】云上读善大脑门户','PO20514969','DBHT-20211123-0413',16.5,15.51,0,0.396,0.7425,45,0,0,0,'2022-10-08 14:48:47',0,'2022-08-22 18:13:16',2),
	(35,'【数字驾驶舱】云上嘉善数字驾驶舱','PO20803208','DBHT-20220408-0114',199.98,187.981,0,7.1988,8.9991,45,0,10.998,0,'2022-10-08 16:43:41',0,'2022-08-22 18:13:20',2),
	(47,'宜昌城市大脑','无','DBHT-20220614-0190',250.7,235.658,0,0,11.281,45,0,13.788,6,'2022-10-08 16:42:14',0,'2022-09-02 00:00:00',5),
	(48,'随申办小程序2020年运营','PO21090388','DBHT-20220622-0207',74.8,70.312,0,0,3.366,45,0,4.114,6,'2022-10-08 16:42:35',0,'2022-09-02 00:00:00',2);

/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
