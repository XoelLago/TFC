-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: galiza_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asociacion_bailes`
--

DROP TABLE IF EXISTS `asociacion_bailes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociacion_bailes` (
  `asociacionesId` int NOT NULL,
  `bailesId` int NOT NULL,
  PRIMARY KEY (`asociacionesId`,`bailesId`),
  KEY `IDX_77bf0815f02eadba5188c00428` (`asociacionesId`),
  KEY `IDX_ab65d0ef9f0ad4764d5daef870` (`bailesId`),
  CONSTRAINT `FK_77bf0815f02eadba5188c00428c` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ab65d0ef9f0ad4764d5daef870d` FOREIGN KEY (`bailesId`) REFERENCES `bailes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociacion_bailes`
--

LOCK TABLES `asociacion_bailes` WRITE;
/*!40000 ALTER TABLE `asociacion_bailes` DISABLE KEYS */;
/*!40000 ALTER TABLE `asociacion_bailes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asociacion_cancions`
--

DROP TABLE IF EXISTS `asociacion_cancions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociacion_cancions` (
  `asociacionesId` int NOT NULL,
  `cancionsId` int NOT NULL,
  PRIMARY KEY (`asociacionesId`,`cancionsId`),
  KEY `IDX_47e0299e60c0beaf22a6921697` (`asociacionesId`),
  KEY `IDX_437aba828738deecf77d0e5edf` (`cancionsId`),
  CONSTRAINT `FK_437aba828738deecf77d0e5edfa` FOREIGN KEY (`cancionsId`) REFERENCES `cancions` (`id`),
  CONSTRAINT `FK_47e0299e60c0beaf22a6921697a` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociacion_cancions`
--

LOCK TABLES `asociacion_cancions` WRITE;
/*!40000 ALTER TABLE `asociacion_cancions` DISABLE KEYS */;
INSERT INTO `asociacion_cancions` VALUES (2,1);
/*!40000 ALTER TABLE `asociacion_cancions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asociacion_eventos`
--

DROP TABLE IF EXISTS `asociacion_eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociacion_eventos` (
  `asociacionesId` int NOT NULL,
  `eventosId` int NOT NULL,
  PRIMARY KEY (`asociacionesId`,`eventosId`),
  KEY `IDX_2d98c370db0c0c208649c8a23f` (`asociacionesId`),
  KEY `IDX_b6c301eb3762c5db2dfe2a99b3` (`eventosId`),
  CONSTRAINT `FK_2d98c370db0c0c208649c8a23f2` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`),
  CONSTRAINT `FK_b6c301eb3762c5db2dfe2a99b3b` FOREIGN KEY (`eventosId`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociacion_eventos`
--

LOCK TABLES `asociacion_eventos` WRITE;
/*!40000 ALTER TABLE `asociacion_eventos` DISABLE KEYS */;
INSERT INTO `asociacion_eventos` VALUES (1,9),(2,7);
/*!40000 ALTER TABLE `asociacion_eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asociaciones`
--

DROP TABLE IF EXISTS `asociaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `coords` text,
  `tipo` varchar(255) NOT NULL DEFAULT 'asociacion',
  `icono` varchar(255) NOT NULL DEFAULT 'groups',
  `descripcion` text,
  `lugarId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_94fce403cc20d57c918128e170` (`nome`),
  KEY `FK_3327e56508e489e851e150568ef` (`lugarId`),
  CONSTRAINT `FK_3327e56508e489e851e150568ef` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
INSERT INTO `asociaciones` VALUES (1,'Cantigas da Terra','{\"lat\": 43.3685, \"lng\": -8.4062}','asociacion','groups','Coro histórico fundado en 1916 en A Coruña, declarado Ben de Interese Cultural.',1),(2,'Sondaqui','{\"lat\": 43.3551, \"lng\": -8.4120}','asociacion','groups','Reconocido colectivo y grupo de música tradicional de la zona herculina.',1),(3,'AC Donaire','{\"lat\": 43.3578, \"lng\": -8.4132}','asociacion','groups','Asociación Cultural Donaire, referentes modernos en investigación y ejecución de baile y música tradicional.',1),(4,'Xacarandaina','{\"lat\": 43.3590, \"lng\": -8.4180}','asociacion','groups','Una de las mayores instituciones culturales de Galicia dedicada al folklore desde A Coruña.',1),(5,'Cantigas e Agarimos','{\"lat\": 42.8780, \"lng\": -8.5440}','asociacion','groups','Fundada en Santiago en 1921. Cuartetos, coros y un cuerpo de baile legendario.',2),(6,'Santiaguiños de Boimorto','{\"lat\": 43.0075, \"lng\": -8.1265}','asociacion','groups','Agrupación folclórica mítica del interior que mantiene vivas las piezas de rueda tradicionales.',3),(7,'O Fiadeiro','{\"lat\": 42.2350, \"lng\": -8.7250}','asociacion','groups','Asociación Cultural de Vigo, famosísima por su rigor en el rescate de vestimenta antigua y pandereteras.',15),(8,'Cántigas do Avia','{\"lat\": 42.2870, \"lng\": -8.1430}','asociacion','groups','Agrupación folclórica mítica centrada en la tradición musical de las tierras de Ourense.',12);
/*!40000 ALTER TABLE `asociaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baile_instrumentos`
--

DROP TABLE IF EXISTS `baile_instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baile_instrumentos` (
  `bailesId` int NOT NULL,
  `instrumentosId` int NOT NULL,
  PRIMARY KEY (`bailesId`,`instrumentosId`),
  KEY `IDX_04037c1711061c4497d52e783a` (`bailesId`),
  KEY `IDX_e8e217630eb927d7b624468af0` (`instrumentosId`),
  CONSTRAINT `FK_04037c1711061c4497d52e783a6` FOREIGN KEY (`bailesId`) REFERENCES `bailes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e8e217630eb927d7b624468af0e` FOREIGN KEY (`instrumentosId`) REFERENCES `instrumentos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baile_instrumentos`
--

LOCK TABLES `baile_instrumentos` WRITE;
/*!40000 ALTER TABLE `baile_instrumentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `baile_instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baile_puntos`
--

DROP TABLE IF EXISTS `baile_puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baile_puntos` (
  `bailesId` int NOT NULL,
  `puntosId` int NOT NULL,
  PRIMARY KEY (`bailesId`,`puntosId`),
  KEY `IDX_722a814f0d11179a33c7f50e26` (`bailesId`),
  KEY `IDX_72e4cb62cf2d4b322cf1442991` (`puntosId`),
  CONSTRAINT `FK_722a814f0d11179a33c7f50e26f` FOREIGN KEY (`bailesId`) REFERENCES `bailes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_72e4cb62cf2d4b322cf14429910` FOREIGN KEY (`puntosId`) REFERENCES `puntos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baile_puntos`
--

LOCK TABLES `baile_puntos` WRITE;
/*!40000 ALTER TABLE `baile_puntos` DISABLE KEYS */;
/*!40000 ALTER TABLE `baile_puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bailes`
--

DROP TABLE IF EXISTS `bailes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bailes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descripcion` text,
  `compas` enum('Xota','Muiñeira Nova','Muiñeira Vella','Carballesa','Maneo','Pasodobre','Valse','Polca','Mazurca','Rumba','Pasarruas') NOT NULL DEFAULT 'Muiñeira Nova',
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `lugarId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4c9d52db547b809977873c7bce` (`nome`),
  KEY `FK_701f084c39eca5827749f3a93ce` (`lugarId`),
  CONSTRAINT `FK_701f084c39eca5827749f3a93ce` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bailes`
--

LOCK TABLES `bailes` WRITE;
/*!40000 ALTER TABLE `bailes` DISABLE KEYS */;
INSERT INTO `bailes` VALUES (3,'Wydsrfyasderf','jdfsgjs','Muiñeira Nova','dzfadsfas','fasfasfd',1);
/*!40000 ALTER TABLE `bailes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancion_instrumentos`
--

DROP TABLE IF EXISTS `cancion_instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancion_instrumentos` (
  `cancionsId` int NOT NULL,
  `instrumentosId` int NOT NULL,
  PRIMARY KEY (`cancionsId`,`instrumentosId`),
  KEY `IDX_a764ee33b4a0689b9d3aa57a70` (`instrumentosId`),
  KEY `IDX_b07f7a8ed995773f27a268be5d` (`cancionsId`),
  CONSTRAINT `FK_a764ee33b4a0689b9d3aa57a70b` FOREIGN KEY (`instrumentosId`) REFERENCES `instrumentos` (`id`),
  CONSTRAINT `FK_b07f7a8ed995773f27a268be5de` FOREIGN KEY (`cancionsId`) REFERENCES `cancions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancion_instrumentos`
--

LOCK TABLES `cancion_instrumentos` WRITE;
/*!40000 ALTER TABLE `cancion_instrumentos` DISABLE KEYS */;
INSERT INTO `cancion_instrumentos` VALUES (1,33);
/*!40000 ALTER TABLE `cancion_instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancions`
--

DROP TABLE IF EXISTS `cancions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `letra` text,
  `audioUrl` varchar(255) DEFAULT NULL,
  `lugarId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f7af311bda399bac89c9cd1e1a9` (`lugarId`),
  CONSTRAINT `FK_f7af311bda399bac89c9cd1e1a9` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancions`
--

LOCK TABLES `cancions` WRITE;
/*!40000 ALTER TABLE `cancions` DISABLE KEYS */;
INSERT INTO `cancions` VALUES (1,'Qwfaas','FASFdASDF','asDFasdf',1);
/*!40000 ALTER TABLE `cancions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_asociaciones`
--

DROP TABLE IF EXISTS `evento_asociaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_asociaciones` (
  `eventosId` int NOT NULL,
  `asociacionesId` int NOT NULL,
  PRIMARY KEY (`eventosId`,`asociacionesId`),
  KEY `IDX_b99c76448767016fbc6a020209` (`eventosId`),
  KEY `IDX_c1a9c089d48879bc804def0625` (`asociacionesId`),
  CONSTRAINT `FK_b99c76448767016fbc6a0202092` FOREIGN KEY (`eventosId`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_c1a9c089d48879bc804def06253` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_asociaciones`
--

LOCK TABLES `evento_asociaciones` WRITE;
/*!40000 ALTER TABLE `evento_asociaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_asociaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL,
  `coords` text,
  `tipo` enum('Romería','Festival','Taller','Concierto','Charla','Foliada','Proba','Outro') NOT NULL DEFAULT 'Festival',
  `precio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `icono` varchar(255) NOT NULL DEFAULT 'theater_comedy',
  `descripcion` text,
  `enlaceExterno` varchar(255) DEFAULT NULL,
  `publicado` tinyint NOT NULL DEFAULT '0',
  `lugarId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5ebb57c49e7444a6c6fe912a83` (`nome`),
  KEY `FK_fe781db320254e72c01c939d0e0` (`lugarId`),
  CONSTRAINT `FK_fe781db320254e72c01c939d0e0` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (7,'pruebauser','2026-06-02 10:17:00','{\"lat\":42.755,\"lng\":-7.863}','Charla',10.00,'theater_comedy','asdfasda','asdfas',1,2),(9,'sgy<rgt','2026-06-03 17:35:00','{\"lat\":43.2161858360268,\"lng\":-8.704455102638443}','Taller',120.00,'theater_comedy','sdgfsdgsdgd','sdgsddsgsdg',1,1);
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrumentos`
--

DROP TABLE IF EXISTS `instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instrumentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descripcion` text,
  `imageUrl` varchar(255) DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_036e45805327a7afa8ced49e72` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrumentos`
--

LOCK TABLES `instrumentos` WRITE;
/*!40000 ALTER TABLE `instrumentos` DISABLE KEYS */;
INSERT INTO `instrumentos` VALUES (25,'Gaita Galega','O instrumento de vento rei da música tradicional galega. Consta dun fol, un punteiro para a melodía e un ou varios roncóns que fan a nota pedal.',NULL,NULL),(26,'Pandeireta','Instrumento de percusión circular con ferriñas. É a base do acompañamento do canto e do baile tradicional en Galicia, tocada tradicionalmente polas mulleres (pandeireteiras).',NULL,NULL),(27,'Tamboril','Tambor tradicional de percusión de tamaño mediano que sempre adoita acompañar á gaita. Tócase con dúas baquetas de madeira.',NULL,NULL),(28,'Bombo','Instrumento grande de percusión que marca o pulso grave da música. Xunto co tamboril e a gaita, forma o cuarteto tradicional básico.',NULL,NULL),(29,'Cunchas de vieira','Instrumento de percusión idiófono moi popular. Úsanse dúas cunchas de vieira que se raspan e baten entre si para marcar o ritmo.',NULL,NULL),(30,'Tarrañolas','Instrumento tradicional feito con dúas pezas de madeira (ou óso) que se colocan entre os dedos dunha man e fanse repenicar mediante movementos de pulso.',NULL,NULL),(31,'Lata','Instrumento de percusión de orixe humilde (reutilizando latas de pemento ou aceite) que se toca de forma similar á pandeireta ou fretando a súa superficie.',NULL,NULL),(32,'Pandeiro','Instrumento membranófono de marco cadrado, cuberto por pel en ambas caras e que adoita levar garavanzos ou cantos rodados no seu interior para darlle un son característico ao golpealo.',NULL,NULL),(33,'Gaita de cana','Instrumento primitivo de vento feito con talos de cana, precursor máis sinxelo da gaita actual.',NULL,NULL),(34,'Culleres','Dúas culleres de madeira ou metal que se golpean sobre as pernas ou entre as mans para levar o ritmo.',NULL,NULL),(35,'Rabel','Instrumento de corda frotada con arco, de orixe medieval, que aínda sobrevive nalgunhas tradicións galegas.',NULL,NULL),(36,'Acordeón','Instrumento de teclas e fol fundamental nas verbenas e festas populares galegas do século XX.',NULL,NULL),(37,'Sarten','Instrumento de percusión que consiste nunha tixola de metal (habitualmente de ferro) que se golpea cunha chave ou un obxecto metálico. O seu son agudo e metálico úsase para marcar o compás en xotas e muiñeiras, especialmente en contextos festivos informais.',NULL,NULL);
/*!40000 ALTER TABLE `instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lugares`
--

DROP TABLE IF EXISTS `lugares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lugares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `coords` text NOT NULL,
  `tipo` varchar(255) NOT NULL DEFAULT 'lugar',
  `icono` varchar(255) NOT NULL DEFAULT 'castle',
  `descripcion` text,
  `bailes` text,
  `cancions` text,
  `eventos` text,
  `provinciaId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_abf2afd9cb463bc71a599633d2` (`nome`),
  KEY `FK_8870a592b189c1e9ff216238c9b` (`provinciaId`),
  CONSTRAINT `FK_8870a592b189c1e9ff216238c9b` FOREIGN KEY (`provinciaId`) REFERENCES `provincias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (1,'A Coruña','{\"lat\": 43.3623, \"lng\": -8.4115}','lugar','castle','Ciudad herculina, hogar de la Torre de Hércules y una enorme tradición coral.','[]','[]','[]',1),(2,'Santiago de Compostela','{\"lat\": 42.8782, \"lng\": -8.5448}','lugar','castle','Capital cultural e histórica, meta del Camino de Santiago.','[]','[]','[]',1),(3,'Boimorto','{\"lat\": 43.0076, \"lng\": -8.1269}','lugar','castle','Municipio del interior coruñés con un arraigo brutal a la música tradicional.','[]','[]','[]',1),(4,'Betanzos','{\"lat\": 43.2809, \"lng\": -8.2113}','lugar','castle','Betanzos de los Caballeros, una de las siete capitales del antiguo Reino de Galicia.','[]','[]','[]',1),(5,'Ferrol','{\"lat\": 43.4834, \"lng\": -8.2253}','lugar','castle','Ciudad naval e ilustrada del norte gallego.','[]','[]','[]',1),(6,'Muros','{\"lat\": 42.7745, \"lng\": -9.0576}','lugar','castle','Villa marinera tradicional con un casco antiguo espectacular.','[]','[]','[]',1),(7,'Lugo','{\"lat\": 43.0123, \"lng\": -7.5550}','lugar','castle','La ciudad de la muralla romana bimilenaria intacta.','[]','[]','[]',2),(8,'Ribadeo','{\"lat\": 43.5358, \"lng\": -7.0398}','lugar','castle','Villa costera de la Mariña Lucense orientada al Cantábrico.','[]','[]','[]',2),(9,'Monforte de Lemos','{\"lat\": 42.5218, \"lng\": -7.5142}','lugar','castle','Centro neurálgico e histórico de la Ribeira Sacra lucense.','[]','[]','[]',2),(10,'Viveiro','{\"lat\": 43.6617, \"lng\": -7.5954}','lugar','castle','Villa señorial con un patrimonio medieval espectacular.','[]','[]','[]',2),(11,'Ourense','{\"lat\": 42.3358, \"lng\": -7.8639}','lugar','castle','La ciudad de Las Burgas y los puentes sobre el río Miño.','[]','[]','[]',4),(12,'Ribadavia','{\"lat\": 42.2872, \"lng\": -8.1436}','lugar','castle','Sede histórica del Ribeiro, con su judería y castillo medieval.','[]','[]','[]',4),(13,'Allariz','{\"lat\": 42.1901, \"lng\": -7.8016}','lugar','castle','Villa modélica restaurada a orillas del río Arnoia.','[]','[]','[]',4),(14,'Xinzo de Limia','{\"lat\": 42.0634, \"lng\": -7.7244}','lugar','castle','Famoso por su Entroido tradicional y el sonido de las pantallas.','[]','[]','[]',4),(15,'Vigo','{\"lat\": 42.2406, \"lng\": -8.7207}','lugar','castle','Gran motor industrial de las Rías Baixas y cuna de grandísimos baluartes folclóricos.','[]','[]','[]',6),(16,'Pontevedra','{\"lat\": 42.4310, \"lng\": -8.6444}','lugar','castle','Ciudad del Lérez, famosa por su histórico y hermoso casco viejo peatonal.','[]','[]','[]',6),(17,'Cambados','{\"lat\": 42.5165, \"lng\": -8.8147}','lugar','castle','Villa solariega del Salnés, capital indiscutible del Albariño.','[]','[]','[]',6),(18,'Lalín','{\"lat\": 42.6614, \"lng\": -8.1123}','lugar','castle','Kilómetro cero de Galicia, tierra de gran tradición musical.','[]','[]','[]',6);
/*!40000 ALTER TABLE `lugares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcadores_usuarios`
--

DROP TABLE IF EXISTS `marcadores_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcadores_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `coords` text NOT NULL,
  `tipo` varchar(255) NOT NULL DEFAULT 'personalizado',
  `icono` varchar(255) NOT NULL DEFAULT 'bookmark',
  `descripcion` text,
  `usuarioId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6190046ca8ee935ec876175f794` (`usuarioId`),
  CONSTRAINT `FK_6190046ca8ee935ec876175f794` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcadores_usuarios`
--

LOCK TABLES `marcadores_usuarios` WRITE;
/*!40000 ALTER TABLE `marcadores_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `marcadores_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movemento_puntos`
--

DROP TABLE IF EXISTS `movemento_puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movemento_puntos` (
  `movementosId` int NOT NULL,
  `puntosId` int NOT NULL,
  PRIMARY KEY (`movementosId`,`puntosId`),
  KEY `IDX_ef8bc86cc4b66e1734e7648163` (`movementosId`),
  KEY `IDX_14f9c4598f2a39504dcf944489` (`puntosId`),
  CONSTRAINT `FK_14f9c4598f2a39504dcf9444897` FOREIGN KEY (`puntosId`) REFERENCES `puntos` (`id`),
  CONSTRAINT `FK_ef8bc86cc4b66e1734e76481630` FOREIGN KEY (`movementosId`) REFERENCES `movementos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movemento_puntos`
--

LOCK TABLES `movemento_puntos` WRITE;
/*!40000 ALTER TABLE `movemento_puntos` DISABLE KEYS */;
INSERT INTO `movemento_puntos` VALUES (12,3),(13,3),(14,3);
/*!40000 ALTER TABLE `movemento_puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movementos`
--

DROP TABLE IF EXISTS `movementos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movementos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_21c4b8492d028c414a90da143c` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movementos`
--

LOCK TABLES `movementos` WRITE;
/*!40000 ALTER TABLE `movementos` DISABLE KEYS */;
INSERT INTO `movementos` VALUES (14,'Aire por detrás'),(13,'Aire por diante'),(12,'Atrás-diante'),(6,'Detrás'),(5,'Diante'),(7,'Diante detrás desprazado'),(11,'Diante-atrás'),(4,'Hop'),(15,'Paso'),(2,'Picado cruzado por detrás'),(3,'Picado cruzado por diante'),(1,'Picado valseado'),(9,'Punta'),(16,'Punta adiante'),(17,'Punta atrás'),(8,'Punta-tacón'),(10,'Tacón');
/*!40000 ALTER TABLE `movementos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincias`
--

DROP TABLE IF EXISTS `provincias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descripcion` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_68728fc6ec5f051835d3ce7185` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincias`
--

LOCK TABLES `provincias` WRITE;
/*!40000 ALTER TABLE `provincias` DISABLE KEYS */;
INSERT INTO `provincias` VALUES (1,'A Coruña','A provincia da Coruña é unha das catro provincias galegas, situada no noroeste de Galicia e da Península Ibérica. Caracterízase pola súa extensa costa atlántica, marcada polas Rías Altas e o Golfo Ártabro, sendo a capital a cidade homónima. Cunha forte identidade cultural, combina historia, paisaxes marítimas e un importante papel portuario..',NULL),(2,'Lugo','A provincia de Lugo é unha das catro provincias que conforman a comunidade autónoma de Galicia, situada no noroeste de España. É a meirande provincia galega en extensión territorial e caracterízase pola súa diversidade paisaxística, que vai dende a costa cantábrica ata zonas de montaña interior.',NULL),(4,'Ourense','A provincia de Ourense é a única das catro provincias galegas que non ten mar, situada no sueste de Galicia. Caracterízase polo seu interior montañoso, o val do Miño e Sil, e unha rica herdanza termal e patrimonial, destacando a súa capital, o Concello de Ourense. É unha zona de alto valor paisaxístico e vinícola, conformada por diversas comarcas.',NULL),(6,'Pontevedra','A provincia de Pontevedra é unha das catro provincias que conforman a comunidade autónoma de Galicia, situada no suroeste da rexión. A súa capital é a cidade homónima de Pontevedra, coñecida como a \"Boa Vila\", aínda que a cidade máis poboada é Vigo.',NULL);
/*!40000 ALTER TABLE `provincias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntos`
--

DROP TABLE IF EXISTS `puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` text NOT NULL,
  `tipo` enum('Muiñeira','Xota','Volta','Tablón','Maneo','Pasodobre','Punto Galaico','Outro') NOT NULL DEFAULT 'Outro',
  `videoUrl` varchar(255) DEFAULT NULL,
  `lugarId` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_800da4fb035fb704c1100a4127` (`nome`),
  KEY `FK_9ef7b6083365c9ac1d0210ea481` (`lugarId`),
  CONSTRAINT `FK_9ef7b6083365c9ac1d0210ea481` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntos`
--

LOCK TABLES `puntos` WRITE;
/*!40000 ALTER TABLE `puntos` DISABLE KEYS */;
INSERT INTO `puntos` VALUES (3,'dasgfsdg','Outro','sdgsdg',1,'A Coruña 1');
/*!40000 ALTER TABLE `puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recomendacions`
--

DROP TABLE IF EXISTS `recomendacions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendacions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `tipo` enum('LIBRO','ARTISTA','CANCION','DOCUMENTAL','WEB','OTRO') NOT NULL DEFAULT 'LIBRO',
  `enlaceExterno` varchar(255) DEFAULT NULL,
  `resumo` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_51ecd95607bd3151a34924aa2d` (`titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacions`
--

LOCK TABLES `recomendacions` WRITE;
/*!40000 ALTER TABLE `recomendacions` DISABLE KEYS */;
INSERT INTO `recomendacions` VALUES (1,'Terra','Dakidarría','CANCION','https://www.youtube.com/watch?v=ZngKOuwbDzs','Ska / Punk'),(2,'Linguas Mortas','Dakidarría','CANCION',NULL,'Ska / Punk'),(3,'Imos Durmir Ó Raso','Willowghz','CANCION',NULL,'Rap / Urbano'),(4,'Compliqueime','Willowghz','CANCION',NULL,'Rap / Urbano'),(5,'O Avión','The Rapants','CANCION',NULL,'Indie / Surf Rock'),(6,'La Tía','The Rapants','CANCION',NULL,'Indie / Surf Rock'),(7,'Muiñeira de Costa','Terbutalina','CANCION',NULL,'Punk / Garage'),(8,'Benvida ao desastre','Terbutalina','CANCION',NULL,'Punk / Garage'),(9,'Fisterra','Pelepau','CANCION',NULL,'Percusión / Tradicional'),(10,'O Jato','Pelepau','CANCION',NULL,'Percusión / Tradicional'),(11,'Pigarzos','Untovello','CANCION',NULL,'Tradicional / Recollida'),(12,'Seixedos','Untovello','CANCION',NULL,'Tradicional / Recollida'),(13,'Tempestades de Sal','SÉS','CANCION',NULL,'Rock / Cantautora'),(14,'Milagreira','SÉS','CANCION',NULL,'Rock / Cantautora'),(15,'O Mandil','Xabier Díaz','CANCION',NULL,'Folk / Tradicional'),(16,'Muiñeira de Tareixa','Xabier Díaz','CANCION',NULL,'Folk / Tradicional'),(17,'Morriña','Baiuca','CANCION',NULL,'Folktrónica'),(18,'Veleno','Baiuca','CANCION',NULL,'Folktrónica'),(19,'Ruando','Mondra','CANCION',NULL,'Foliada Pop / Electrónica'),(20,'Punheta!','Mondra','CANCION',NULL,'Foliada Pop / Electrónica'),(21,'Morena','De Ninghures','CANCION',NULL,'Folk Contemporáneo'),(22,'O Fillo do Mar','De Ninghures','CANCION',NULL,'Folk Contemporáneo'),(23,'Liñares','Alana','CANCION',NULL,'Pop Tradicional / Electrónica'),(24,'Consulo de Muiñeira','Alana','CANCION',NULL,'Pop Tradicional / Electrónica'),(25,'Bailegramas','Serxio Cobos','LIBRO',NULL,'Sistema de notación coreográfica e análise do baile tradicional galego.'),(26,'Do palco ao escenario','Xenaro Suárez','LIBRO',NULL,'Análise sobre la evolución do baile tradicional cara o espectáculo coreográfico.'),(27,'Dakidarría','Banda','ARTISTA',NULL,'Banda mítica galega de Ska, Punk e Reggae.'),(28,'Willowghz','Artista','ARTISTA',NULL,'Referente do Rap e a música urbana en galego.'),(29,'The Rapants','Banda','ARTISTA',NULL,'Indie e Surf Rock cheo de enerxía e bo rollo dende Muros.'),(30,'Terbutalina','Banda','ARTISTA',NULL,'Punk e Garage acelerado e irreverente.'),(31,'Pelepau','Colectivo','ARTISTA',NULL,'Grupo de percusionistas que levan a tradición ao límite.'),(32,'Untovello','Dúo','ARTISTA',NULL,'Traballo puro de recollida e música tradicional para o baile.'),(33,'SÉS','Cantautora','ARTISTA',NULL,'Rock, Blues e canción de autora con moitísima forza.'),(34,'Xabier Díaz','Músico','ARTISTA',NULL,'Mestre da percusión e renovador da música tradicional.'),(35,'Baiuca','Produtor','ARTISTA',NULL,'Pioneiro na mestura de folclore galego e electrónica (Folktrónica).'),(36,'Mondra','Artista','ARTISTA',NULL,'Revolución da foliada pop, mesturando electrónica, tradición e baile.'),(37,'De Ninghures','Banda','ARTISTA',NULL,'Savia nova do Folk contemporáneo e de raíz atlántica.'),(38,'Alana','Trío','ARTISTA',NULL,'Fusión de cantos tradicionais, pop e produción electrónica.');
/*!40000 ALTER TABLE `recomendacions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_eventos`
--

DROP TABLE IF EXISTS `solicitudes_eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
  `eventoId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_77dfe9c0eebe3ddd13bff3a122` (`eventoId`),
  CONSTRAINT `FK_77dfe9c0eebe3ddd13bff3a1221` FOREIGN KEY (`eventoId`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_eventos`
--

LOCK TABLES `solicitudes_eventos` WRITE;
/*!40000 ALTER TABLE `solicitudes_eventos` DISABLE KEYS */;
INSERT INTO `solicitudes_eventos` VALUES (3,'APROBADA',7),(5,'APROBADA',9);
/*!40000 ALTER TABLE `solicitudes_eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('USER','ADMIN','SUPERUSER') NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_8699a5bc72f5c2ca7c46b420e8` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (7,'xoel','$2b$10$tPZThchzm8DCml3DH9cuDu/uSp/wucfk7s94U/6/ZM0UBmGMlX2wa','SUPERUSER'),(11,'user','$2b$10$ylH3a9AoCHpY6OS3PoaWXOnfdZ2sZZnrHvtBIdVqgbrE2vrZmwEB6','USER');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03 10:36:12
