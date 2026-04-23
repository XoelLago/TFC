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
  `cancionesId` int NOT NULL,
  PRIMARY KEY (`asociacionesId`,`cancionesId`),
  KEY `IDX_47e0299e60c0beaf22a6921697` (`asociacionesId`),
  KEY `IDX_1adf8f7193af1589805c573651` (`cancionesId`),
  CONSTRAINT `FK_1adf8f7193af1589805c573651d` FOREIGN KEY (`cancionesId`) REFERENCES `canciones` (`id`),
  CONSTRAINT `FK_47e0299e60c0beaf22a6921697a` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociacion_cancions`
--

LOCK TABLES `asociacion_cancions` WRITE;
/*!40000 ALTER TABLE `asociacion_cancions` DISABLE KEYS */;
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
  CONSTRAINT `FK_2d98c370db0c0c208649c8a23f2` FOREIGN KEY (`asociacionesId`) REFERENCES `asociaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b6c301eb3762c5db2dfe2a99b3b` FOREIGN KEY (`eventosId`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociacion_eventos`
--

LOCK TABLES `asociacion_eventos` WRITE;
/*!40000 ALTER TABLE `asociacion_eventos` DISABLE KEYS */;
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
  KEY `FK_3327e56508e489e851e150568ef` (`lugarId`),
  CONSTRAINT `FK_3327e56508e489e851e150568ef` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bailes`
--

LOCK TABLES `bailes` WRITE;
/*!40000 ALTER TABLE `bailes` DISABLE KEYS */;
INSERT INTO `bailes` VALUES (1,'Golpellas',NULL,'Muiñeira Nova',NULL,NULL,2);
/*!40000 ALTER TABLE `bailes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancion_instrumentos`
--

DROP TABLE IF EXISTS `cancion_instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancion_instrumentos` (
  `cancionesId` int NOT NULL,
  `instrumentosId` int NOT NULL,
  PRIMARY KEY (`cancionesId`,`instrumentosId`),
  KEY `IDX_3119869d9a24788de9ebcb4c2a` (`cancionesId`),
  KEY `IDX_a764ee33b4a0689b9d3aa57a70` (`instrumentosId`),
  CONSTRAINT `FK_3119869d9a24788de9ebcb4c2a1` FOREIGN KEY (`cancionesId`) REFERENCES `canciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_a764ee33b4a0689b9d3aa57a70b` FOREIGN KEY (`instrumentosId`) REFERENCES `instrumentos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancion_instrumentos`
--

LOCK TABLES `cancion_instrumentos` WRITE;
/*!40000 ALTER TABLE `cancion_instrumentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cancion_instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canciones`
--

DROP TABLE IF EXISTS `canciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `letra` text,
  `audioUrl` varchar(255) DEFAULT NULL,
  `lugarId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c79bb5b78f68d15f3607c462c67` (`lugarId`),
  CONSTRAINT `FK_c79bb5b78f68d15f3607c462c67` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canciones`
--

LOCK TABLES `canciones` WRITE;
/*!40000 ALTER TABLE `canciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `canciones` ENABLE KEYS */;
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
  KEY `FK_fe781db320254e72c01c939d0e0` (`lugarId`),
  CONSTRAINT `FK_fe781db320254e72c01c939d0e0` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrumentos`
--

LOCK TABLES `instrumentos` WRITE;
/*!40000 ALTER TABLE `instrumentos` DISABLE KEYS */;
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
  KEY `FK_8870a592b189c1e9ff216238c9b` (`provinciaId`),
  CONSTRAINT `FK_8870a592b189c1e9ff216238c9b` FOREIGN KEY (`provinciaId`) REFERENCES `provincias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (2,'A Coruña','{\"lat\":43.35779531515394,\"lng\":-8.413218067813007}','lugar','castle','','[]','[]','[]',1),(3,'Lugo','{\"lat\":43.007151905994085,\"lng\":-7.556564659335151}','lugar','castle','','[]','[]','[]',1),(5,'Arzua','{\"lat\":42.755,\"lng\":-7.863}','lugar','castle','','[{\"id\":1,\"nome\":\"Golpellas\",\"descripcion\":null,\"compas\":\"Muiñeira Nova\",\"image\":null,\"video\":null}]','[]','[]',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcadores_usuarios`
--

LOCK TABLES `marcadores_usuarios` WRITE;
/*!40000 ALTER TABLE `marcadores_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `marcadores_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento_puntos`
--

DROP TABLE IF EXISTS `movimiento_puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento_puntos` (
  `movimientosId` int NOT NULL,
  `puntosId` int NOT NULL,
  PRIMARY KEY (`movimientosId`,`puntosId`),
  KEY `IDX_d9b6e11dfbf53107820352554c` (`movimientosId`),
  KEY `IDX_2db63f75a81cc05cb5a53a390f` (`puntosId`),
  CONSTRAINT `FK_2db63f75a81cc05cb5a53a390f2` FOREIGN KEY (`puntosId`) REFERENCES `puntos` (`id`),
  CONSTRAINT `FK_d9b6e11dfbf53107820352554c9` FOREIGN KEY (`movimientosId`) REFERENCES `movimientos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento_puntos`
--

LOCK TABLES `movimiento_puntos` WRITE;
/*!40000 ALTER TABLE `movimiento_puntos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimiento_puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `FK_9ef7b6083365c9ac1d0210ea481` (`lugarId`),
  CONSTRAINT `FK_9ef7b6083365c9ac1d0210ea481` FOREIGN KEY (`lugarId`) REFERENCES `lugares` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntos`
--

LOCK TABLES `puntos` WRITE;
/*!40000 ALTER TABLE `puntos` DISABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacions`
--

LOCK TABLES `recomendacions` WRITE;
/*!40000 ALTER TABLE `recomendacions` DISABLE KEYS */;
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
  `eventoId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_77dfe9c0eebe3ddd13bff3a122` (`eventoId`),
  CONSTRAINT `FK_77dfe9c0eebe3ddd13bff3a1221` FOREIGN KEY (`eventoId`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_eventos`
--

LOCK TABLES `solicitudes_eventos` WRITE;
/*!40000 ALTER TABLE `solicitudes_eventos` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

-- Dump completed on 2026-04-23  7:24:38
