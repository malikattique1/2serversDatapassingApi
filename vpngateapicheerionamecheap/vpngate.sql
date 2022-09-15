


CREATE TABLE `users` (
  `id` int(60) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(60) NOT NULL,
  `LastName` varchar(60) NOT NULL,
  `Username` varchar(60) NOT NULL,
  `Email` varchar(60) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;


INSERT INTO users VALUES
("1","attique","rehman","attique12","attiqueurrehman12@gmail.com","$2b$10$ELIdsg2nRPRdwqJnjl3Gt.BcYh7g.FxAV/wQLocR5ayYizIp//XHC","2022-08-29 15:50:24"),
("2","attique","rehman","attique123","attiqueurrehman12@gmail.com","$2b$10$rkFNOBGnyuHTljo/i7/j4uojGlEZyypLy2wy2HymM.9BF2BGHMRiq","2022-08-29 16:48:21");




CREATE TABLE `vpngate` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `country` varchar(60) DEFAULT NULL,
  `countryflag` varchar(100) NOT NULL,
  `countrycode` varchar(60) DEFAULT NULL,
  `regionname` varchar(60) DEFAULT NULL,
  `hostname` varchar(60) NOT NULL,
  `ipaddress` varchar(255) NOT NULL,
  `vpnsessions` varchar(100) NOT NULL,
  `users` varchar(100) NOT NULL,
  `linequality` varchar(100) NOT NULL,
  `ping` varchar(60) NOT NULL,
  `score` varchar(100) NOT NULL,
  `ovpnfilelink` varchar(255) NOT NULL,
  `ovpndownloadpath` varchar(255) NOT NULL,
  `portno` varchar(100) DEFAULT NULL,
  `totaldownloads` varchar(100) NOT NULL DEFAULT '0',
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




