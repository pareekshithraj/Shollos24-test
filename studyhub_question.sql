-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: studyhub
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `question_id` bigint NOT NULL AUTO_INCREMENT,
  `topic_id` bigint NOT NULL,
  `class_grade` int DEFAULT NULL,
  `difficulty` enum('EASY','MEDIUM','HARD') NOT NULL,
  `question_text` text NOT NULL,
  `option_a` text NOT NULL,
  `option_b` text NOT NULL,
  `option_c` text NOT NULL,
  `option_d` text NOT NULL,
  `correct_option` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,1,10,'MEDIUM','Solve: 2x + 3 = 11. What is x?','3','4','5','6','B','2025-08-15 06:26:00'),(2,1,10,'MEDIUM','What is the solution to x┬▓ - 5x + 6 = 0?','x=2 or x=3','x=1 or x=6','x=0 or x=6','x=3 or x=4','A','2025-08-15 06:26:00'),(3,1,10,'MEDIUM','What is the sum of angles in a triangle?','90┬░','180┬░','270┬░','360┬░','B','2025-08-15 06:26:00'),(4,1,10,'MEDIUM','What is the formula for the area of a circle?','╧Çr┬▓','2╧Çr','╧Çd','r┬▓','A','2025-08-15 06:26:00'),(5,1,10,'MEDIUM','What is 1/2 + 1/4?','03-Apr','01-Apr','01-Feb','02-Apr','A','2025-08-15 06:26:00'),(6,1,10,'MEDIUM','What is 25% of 80?','10','15','20','25','C','2025-08-15 06:26:00'),(7,1,10,'MEDIUM','What is the SI unit of speed?','m/s','km/h','m┬▓','kg','A','2025-08-15 06:26:00'),(8,1,10,'MEDIUM','Which law states that force equals mass times acceleration?','NewtonΓÇÖs First Law','NewtonΓÇÖs Second Law','NewtonΓÇÖs Third Law','Law of Inertia','B','2025-08-15 06:26:00'),(9,9,7,'MEDIUM','Which acid is found in lemon?','Hydrochloric acid','Citric acid','Sulfuric acid','Acetic acid','B','2025-08-15 06:26:00');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 23:10:21
