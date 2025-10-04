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
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `class_grade` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `school` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,1,'priyanka',10,'priyanka@gmail.com','priyanka@123','2025-08-11 14:42:15'),(2,1,'Aarav Mehta',10,'aarav.mehta@example.com','hash_aarav123','2025-08-11 14:49:16'),(3,1,'Diya Sharma',10,'diya.sharma@example.com','hash_diya456','2025-08-11 14:49:16'),(4,1,'Rohan Verma',10,'rohan.verma@example.com','hash_rohan789','2025-08-11 14:49:16'),(5,1,'Sneha Patel',10,'sneha.patel@example.com','hash_sneha321','2025-08-11 14:49:16'),(6,1,'Kabir Rao',10,'kabir.rao@example.com','hash_kabir654','2025-08-11 14:49:16'),(7,1,'Isha Nair',10,'isha.nair@example.com','hash_isha987','2025-08-11 14:49:16'),(8,1,'Yuvraj Singh',10,'yuvraj.singh@example.com','hash_yuvraj111','2025-08-11 14:49:16'),(9,1,'Meera Joshi',10,'meera.joshi@example.com','hash_meera222','2025-08-11 14:49:16'),(10,1,'Aditya Kulkarni',10,'aditya.kulkarni@example.com','hash_aditya333','2025-08-11 14:49:16'),(11,1,'Tanya Desai',10,'tanya.desai@example.com','hash_tanya444','2025-08-11 14:49:16'),(12,1,'Nikhil Reddy',10,'nikhil.reddy@example.com','hash_nikhil555','2025-08-11 14:49:16'),(13,1,'Pooja Iyer',10,'pooja.iyer@example.com','hash_pooja666','2025-08-11 14:49:16'),(14,1,'Arjun Bhat',10,'arjun.bhat@example.com','hash_arjun777','2025-08-11 14:49:16'),(15,1,'Neha Jain',10,'neha.jain@example.com','hash_neha888','2025-08-11 14:49:16'),(16,1,'Rahul Das',10,'rahul.das@example.com','hash_rahul999','2025-08-11 14:49:16'),(17,1,'Simran Kaur',10,'simran.kaur@example.com','hash_simran000','2025-08-11 14:49:16'),(18,1,'Vikram Sinha',10,'vikram.sinha@example.com','hash_vikram101','2025-08-11 14:49:16'),(19,1,'Ananya Roy',10,'ananya.roy@example.com','hash_ananya202','2025-08-11 14:49:16'),(20,1,'Harshita Menon',10,'harshita.menon@example.com','hash_harshita303','2025-08-11 14:49:16'),(21,1,'Kunal Thakur',10,'kunal.thakur@example.com','hash_kunal404','2025-08-11 14:49:16');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 23:10:22
