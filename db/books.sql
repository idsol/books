/**
 * @database	books
 * @type		mysql
 * @version		5.1.26
 */

/*
 * create database
 */
DROP DATABASE books;
CREATE DATABASE books DEFAULT CHARACTER SET utf8;
USE books;

--
-- 图书
--
CREATE TABLE book
(
	bookId int unsigned AUTO_INCREMENT NOT NULL,
	
	title longtext NOT NULL COMMENT '标题(书名)',
	intro longtext NOT NULL COMMENT '简介',
	author longtext NOT NULL COMMENT '作者',
	press longtext COMMENT '出版社',
	publishDate date NOT NULL COMMENT '出版时间',
	pages int NOT NULL COMMENT '页数',
	isbn varchar(60) NOT NULL COMMENT '书号',
	
	fileFormat varchar(10) NOT NULL COMMENT '文件格式',
	fileSize int NOT NULL COMMENT '文件大小',
	
	tags longtext COMMENT 'TAGS',
	
	PRIMARY KEY (bookId)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='图书';

--
-- 出版社
-- static, dictionary
--
CREATE TABLE press
(
	pressId int unsigned AUTO_INCREMENT NOT NULL,
	
	name longtext NOT NULL COMMENT '出版社名称',
	
	PRIMARY KEY (pressId)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='出版社';
-- defuault data
insert into press (name) values
	('Apress'),
	('Addison Wesley'),
	('Cisco Press'),
	('Adobe Press'),
	('McGraw-Hill'),
	('O''Reilly'),
	('Prentice Hall'),
	('Sams Publishing'),
	('Syngress'),
	('Wrox Press'),
	('Sybex'),
	('Microsoft Press'),
	('IBM Press'),
	('Friends of Ed'),
	('Manning Publications'),
	('Macromedia Press'),
	('MySQL Press'),
	('Novell Press'),
	('Oxford University Press'),
	('Cambridge University Press'),
	('Non Press'),
	('Wiley Publishing'),
	('清华出版社'),
	('机械工业出版社'),
	('人民邮电出版社'),
	('其他');
