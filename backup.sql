-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: boutique_stock_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('048f8634-0963-4f25-935f-77e937a9eeeb','cbec6f2023cb1ea3cd470949826639d1560841f13db01c3cfbda6673ad2ab309','2026-01-22 16:16:23.315','20260115070816_update_user_model_add_phone_isactive_timestamps',NULL,NULL,'2026-01-22 16:16:23.169',1),('0990c4e2-22b0-40f3-83aa-83cd390fb657','68745806e5baf1a890948939698f89afc2f17019b103dea9d3110dad9ea1f01b','2026-01-22 16:16:26.202','20260122135755_add_bonus_payment_table',NULL,NULL,'2026-01-22 16:16:25.922',1),('0dc8015e-e8e7-44fd-b282-dc9f128aa8e9','1ec4294945ed6346b3d34cd92d55932685c6abb47b999400ab79720559100c83','2026-01-23 12:31:24.212','20260123123124_add_expense_date',NULL,NULL,'2026-01-23 12:31:24.123',1),('2bee2428-1942-4d58-81d0-9b97127376e1','307d65eecba7afa24f6c526f29d1fd42302a4ae8a9b3f67a5c6529f6225ddff3','2026-01-22 16:16:23.778','20260115073631',NULL,NULL,'2026-01-22 16:16:23.754',1),('2c46c5c9-672c-4204-9fe0-8ca13cb4d2a6','0cb80bed2c82a6fb48e5ee477906c1399dcaa67d1c39008451dc498ea6bd85c4','2026-01-22 16:16:23.165','20260114115114',NULL,NULL,'2026-01-22 16:16:23.145',1),('2e4c857a-5f88-4a46-b63d-97815fb91f87','d0728a4d568f7b7f897d9a324f40c9f19dfe9a584d216d068bf093d4356bc85f',NULL,'20260122203749_fix_bonus_rule_unique_constraint','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260122203749_fix_bonus_rule_unique_constraint\n\nDatabase error code: 1062\n\nDatabase error:\nDuplicate entry \'50000\' for key \'bonusrule.bonusRule_type_minAmount_key\'\n\nPlease check the query number 2 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260122203749_fix_bonus_rule_unique_constraint\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20260122203749_fix_bonus_rule_unique_constraint\"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:246','2026-01-22 20:46:59.498','2026-01-22 20:37:49.124',0),('382da216-afb1-4325-8ac0-8ba112fd0e80','408e155bebe879b3a15536223ca02a32fcfbc10bb1e736965915b6d7ba9da11e','2026-01-26 13:04:42.419','20260126130442_make_password_required',NULL,NULL,'2026-01-26 13:04:42.261',1),('3e5c3aab-a369-45ea-88a4-1c3934652486','0675a1ae56f141fa2229ec20781b6c0a1b5ecadd4680b6811ae5bdb7c29a6a53','2026-01-22 16:16:23.382','20260115071100',NULL,NULL,'2026-01-22 16:16:23.319',1),('408a2091-ea21-40e1-8bfd-b2401d7cf844','116796ee97651059d668da6dc1436b93729ed7257e4bb32fd99af7cfdb7baf7c','2026-01-22 16:16:25.141','20260120143459_add_salary_period_and_make_days_required',NULL,NULL,'2026-01-22 16:16:24.599',1),('414345fb-00c1-4e7a-bd11-3c11a2f0925a','97a9b3e5754206006ef54e8d4b8bd75270e95ad794a3ace128006bce24f0bdd4','2026-01-22 16:16:23.141','20260114114901_add_timestamps_to_stock',NULL,NULL,'2026-01-22 16:16:22.992',1),('59a2f559-2b3f-4b91-853d-ca233e3ef5e9','b1d95f917831fb4acbcc72c046b6efee1f17e501f5f8e0576f90bed9cb98ae25','2026-01-22 16:16:24.116','20260115154552_add_unique_constraint_salarypayment_week',NULL,NULL,'2026-01-22 16:16:24.083',1),('638f0d9c-28d1-4a6f-951f-84d91b3d3de7','50813709502f0cc2a235efd21767e6dd290a1ecb43d39794a892b33b0377f974','2026-01-22 16:16:23.881','20260115074027_add_is_active_to_category',NULL,NULL,'2026-01-22 16:16:23.782',1),('68f5719d-af77-419b-aaa9-3fb044310b6b','758459fe6bc155ef619e8babb760db26b97c2ae031f88a3422bbbf3499138872','2026-01-22 16:16:26.417','20260122144111_remove_weekly_bonus',NULL,NULL,'2026-01-22 16:16:26.206',1),('69d7a549-947f-43e1-9b3d-b23b7692c08c','197873bd2679f8ffcb0a610072d61e55668bd1d8c8ef560b5b9af82568ff6fb4','2026-01-22 16:16:24.308','20260118183939_add_category_image',NULL,NULL,'2026-01-22 16:16:24.225',1),('6f8014e6-e814-45df-a466-a05d8c515131','e06ede52c06c22259f33fa8745c664cf9076776ae5dd5dc14b4cf2e04f20c440','2026-01-22 16:16:23.924','20260115122914_add_bonus_rules',NULL,NULL,'2026-01-22 16:16:23.884',1),('7e95a56e-31a4-4e15-b0b7-67e252d9a726','7199b46b4b37299f0fa46763ee7df8eefb3a777c6091ba6696d9885cf8338d86','2026-01-22 16:16:24.080','20260115133457_add_weekly_bonus_relation',NULL,NULL,'2026-01-22 16:16:23.929',1),('92d26e2f-3d9b-4cb0-bec8-0b59684ac0aa','a876ce225e48a44538627029e5d62300e38a0392a51b70df62d6da5d91cf87d1','2026-01-22 16:16:25.918','20260122135256_add_bonus_type_values',NULL,NULL,'2026-01-22 16:16:25.899',1),('9562bc82-79e2-4d52-83af-49e937007670','ce2a4c6cf6141e8b44a8af26a62f1052f6875a7a18d911b6793eea1d94cb2b69','2026-01-22 16:16:22.988','20260111122025_init_schema',NULL,NULL,'2026-01-22 16:16:22.215',1),('97bfbe8e-ca30-4a15-86d0-b86b277f14a2','2e17c7d973b50ee92481d403311677d169cae98dd66640d1c47bb76fba311b6f','2026-01-22 16:16:24.222','20260118144139_add_payment_method_to_sale',NULL,NULL,'2026-01-22 16:16:24.120',1),('9db9081f-deb3-494f-841e-4cbd5616e0a3','d409fc39fa57448384be2d2b99c8eef3a579f4f98fd07906bfea941fde5feccf','2026-01-22 16:16:25.895','20260122060807_remove_legacy_sale_columns',NULL,NULL,'2026-01-22 16:16:25.803',1),('9e20e34b-2c16-4322-9193-3ad02d00ff05','b3ee0079398b441a9faf1a303668906b91548560198956ba2123791d648728e9','2026-01-26 12:57:25.565','20260126125725_add_auth_fields_and_login_logs',NULL,NULL,'2026-01-26 12:57:25.303',1),('a3a7fc33-d7ce-4563-b29d-050e1c8eba4c','a1dc8482f48039b491a982e11181bc22d9e6f8dff02a5078d5bb47c9f0110f0a','2026-01-22 16:16:25.798','20260122043857_add_sale_items_and_payments',NULL,NULL,'2026-01-22 16:16:25.145',1),('ad8bf8cc-7a0d-41e5-bfc9-4b0882ed8ee7','9606e47175203bd700d409e1e0c1780baa24799e53240073b07a9d0e05634257','2026-01-22 16:16:24.395','20260118203743_add_pricecategory_image_and_activation',NULL,NULL,'2026-01-22 16:16:24.311',1),('d7cbf629-0c8c-4fb8-9d36-cc3b4eec46c1','d0728a4d568f7b7f897d9a324f40c9f19dfe9a584d216d068bf093d4356bc85f','2026-01-22 20:46:59.511','20260122203749_fix_bonus_rule_unique_constraint','',NULL,'2026-01-22 20:46:59.511',0),('dd148166-99ab-4604-8c80-96a2115610ac','3f5a532122f61f1e0ebe57ba91e6204b652622162a6b6b450fc9a1b924bacdcf','2026-01-22 16:16:23.750','20260115071734_update_sale_add_updatedat_status',NULL,NULL,'2026-01-22 16:16:23.386',1),('e858fa95-60f7-48f0-8b1b-2876c0210752','7bbdf0b19e54f7441f57e82cbd3a663f390e5a8daa960dc392dc8009ff42240d','2026-01-22 16:16:26.454','20260122160536_integrate_bonus_rule_constraints_and_relations',NULL,NULL,'2026-01-22 16:16:26.421',1),('ed0c32ac-6cad-4e83-9891-73b2f40514bc','e4c4615fdda075ca6d121c1600c7f1b8a8700af198cefd64befc3fa9951886ed','2026-01-24 19:56:14.816','20260124195614_add_stock_alerts',NULL,NULL,'2026-01-24 19:56:14.739',1),('f1cb3c70-cb94-4672-93ad-7ab520100514','9fc34f7c06144b8166eddfcd4192952bd4012da525ed2c7f1ae8c234add00734','2026-01-22 16:16:24.595','20260119151325_add_salary_calculation_fields',NULL,NULL,'2026-01-22 16:16:24.398',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `status` enum('PRESENT','ABSENT','HALF_DAY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRESENT',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_userId_date_key` (`userId`,`date`),
  CONSTRAINT `attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2026-01-28 00:00:00.000','PRESENT','2026-01-28 12:19:04.700'),(2,2,'2026-01-28 00:00:00.000','HALF_DAY','2026-01-28 12:19:18.720'),(3,3,'2026-01-28 00:00:00.000','PRESENT','2026-01-28 12:19:43.393'),(4,5,'2026-01-28 00:00:00.000','PRESENT','2026-01-28 12:20:01.100'),(5,3,'2026-01-11 00:00:00.000','ABSENT','2026-01-28 20:31:37.015'),(6,1,'2026-01-29 00:00:00.000','PRESENT','2026-01-29 09:10:56.363'),(7,2,'2026-01-29 00:00:00.000','PRESENT','2026-01-29 09:11:07.718'),(8,3,'2026-01-29 00:00:00.000','PRESENT','2026-01-29 09:11:12.729'),(9,3,'2026-01-20 00:00:00.000','PRESENT','2026-01-29 14:23:07.327'),(10,1,'2026-01-20 00:00:00.000','PRESENT','2026-01-29 14:23:13.760'),(11,1,'2026-01-21 00:00:00.000','PRESENT','2026-01-29 14:23:20.336'),(12,1,'2026-01-22 00:00:00.000','PRESENT','2026-01-29 14:23:26.219'),(13,1,'2026-01-23 00:00:00.000','ABSENT','2026-01-29 14:24:26.056'),(14,1,'2026-01-24 00:00:00.000','HALF_DAY','2026-01-29 14:24:46.472'),(15,1,'2026-01-26 00:00:00.000','HALF_DAY','2026-01-29 14:25:16.535'),(16,1,'2026-01-27 00:00:00.000','PRESENT','2026-01-29 14:25:39.115'),(17,18,'2026-03-03 00:00:00.000','PRESENT','2026-03-03 13:54:13.533'),(18,19,'2026-03-04 00:00:00.000','PRESENT','2026-03-04 09:30:06.110'),(19,18,'2026-03-04 00:00:00.000','ABSENT','2026-03-04 09:30:17.801'),(20,2,'2026-03-04 00:00:00.000','HALF_DAY','2026-03-04 09:30:35.093'),(21,19,'2026-03-03 00:00:00.000','PRESENT','2026-03-04 09:46:53.695'),(22,3,'2026-03-03 00:00:00.000','PRESENT','2026-03-04 09:47:10.386'),(23,2,'2026-03-03 00:00:00.000','ABSENT','2026-03-04 09:47:12.480'),(24,1,'2026-03-03 00:00:00.000','PRESENT','2026-03-04 09:47:17.925'),(25,19,'2026-03-02 00:00:00.000','HALF_DAY','2026-03-04 10:34:33.361'),(26,18,'2026-03-02 00:00:00.000','PRESENT','2026-03-04 10:34:37.951'),(27,3,'2026-03-02 00:00:00.000','PRESENT','2026-03-04 10:34:41.215'),(28,2,'2026-03-02 00:00:00.000','PRESENT','2026-03-04 10:34:44.704'),(29,1,'2026-03-02 00:00:00.000','PRESENT','2026-03-04 10:34:46.034'),(30,19,'2026-03-01 00:00:00.000','PRESENT','2026-03-04 10:34:49.275'),(31,18,'2026-03-01 00:00:00.000','PRESENT','2026-03-04 10:34:51.635'),(32,3,'2026-03-01 00:00:00.000','ABSENT','2026-03-04 10:34:55.286'),(33,2,'2026-03-01 00:00:00.000','HALF_DAY','2026-03-04 10:34:57.230'),(34,1,'2026-03-01 00:00:00.000','PRESENT','2026-03-04 10:34:59.020'),(35,19,'2026-03-05 00:00:00.000','PRESENT','2026-03-08 14:38:49.867'),(36,18,'2026-03-05 00:00:00.000','PRESENT','2026-03-08 14:38:52.062'),(37,3,'2026-03-05 00:00:00.000','PRESENT','2026-03-08 14:38:53.380'),(38,2,'2026-03-05 00:00:00.000','PRESENT','2026-03-08 14:38:54.958'),(39,1,'2026-03-05 00:00:00.000','PRESENT','2026-03-08 14:38:56.495'),(40,19,'2026-03-06 00:00:00.000','PRESENT','2026-03-08 14:39:07.762'),(41,18,'2026-03-06 00:00:00.000','HALF_DAY','2026-03-08 14:39:09.926'),(42,3,'2026-03-06 00:00:00.000','ABSENT','2026-03-08 14:39:11.650'),(43,2,'2026-03-06 00:00:00.000','PRESENT','2026-03-08 14:39:13.292'),(44,1,'2026-03-06 00:00:00.000','PRESENT','2026-03-08 14:39:15.493'),(45,19,'2026-03-07 00:00:00.000','HALF_DAY','2026-03-08 14:39:22.270'),(46,18,'2026-03-07 00:00:00.000','PRESENT','2026-03-08 14:39:24.688'),(47,3,'2026-03-07 00:00:00.000','PRESENT','2026-03-08 14:39:27.350'),(48,1,'2026-03-07 00:00:00.000','ABSENT','2026-03-08 14:39:30.298'),(49,2,'2026-03-07 00:00:00.000','HALF_DAY','2026-03-08 14:39:31.757'),(50,19,'2026-03-08 00:00:00.000','PRESENT','2026-03-08 14:39:39.160'),(51,18,'2026-03-08 00:00:00.000','PRESENT','2026-03-08 14:39:40.552'),(52,3,'2026-03-08 00:00:00.000','PRESENT','2026-03-08 14:39:41.777'),(53,2,'2026-03-08 00:00:00.000','PRESENT','2026-03-08 14:39:43.216'),(54,1,'2026-03-08 00:00:00.000','PRESENT','2026-03-08 14:39:44.942'),(55,20,'2026-03-09 00:00:00.000','PRESENT','2026-03-09 11:23:09.012'),(56,20,'2026-03-08 00:00:00.000','PRESENT','2026-03-09 11:23:13.905'),(57,20,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:45.749'),(58,19,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:47.473'),(59,18,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:48.551'),(60,5,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:53.051'),(61,2,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:54.086'),(62,1,'2026-03-10 00:00:00.000','PRESENT','2026-03-11 08:23:55.342'),(63,20,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:23:59.382'),(64,19,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:24:00.472'),(65,18,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:24:01.688'),(66,5,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:24:02.764'),(67,2,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:24:03.776'),(68,1,'2026-03-11 00:00:00.000','PRESENT','2026-03-11 08:24:04.720'),(69,20,'2026-03-12 00:00:00.000','PRESENT','2026-03-13 12:49:47.718'),(70,19,'2026-03-12 00:00:00.000','PRESENT','2026-03-13 12:50:03.570'),(71,20,'2026-03-13 00:00:00.000','PRESENT','2026-03-13 12:50:19.445'),(72,19,'2026-03-13 00:00:00.000','PRESENT','2026-03-13 12:50:21.075'),(73,18,'2026-03-13 00:00:00.000','PRESENT','2026-03-13 12:50:22.450'),(74,22,'2026-03-16 00:00:00.000','PRESENT','2026-03-16 13:37:20.068');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bonuspayment`
--

DROP TABLE IF EXISTS `bonuspayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bonuspayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `periodStart` datetime(3) NOT NULL,
  `periodEnd` datetime(3) NOT NULL,
  `type` enum('PERIOD_TOTAL','SINGLE_SALE','GLOBAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `ruleId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bonusPayment_userId_periodStart_periodEnd_type_key` (`userId`,`periodStart`,`periodEnd`,`type`),
  KEY `bonusPayment_periodStart_periodEnd_idx` (`periodStart`,`periodEnd`),
  KEY `bonusPayment_userId_idx` (`userId`),
  KEY `bonusPayment_ruleId_fkey` (`ruleId`),
  CONSTRAINT `bonusPayment_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `bonusrule` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bonusPayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bonuspayment`
--

LOCK TABLES `bonuspayment` WRITE;
/*!40000 ALTER TABLE `bonuspayment` DISABLE KEYS */;
INSERT INTO `bonuspayment` VALUES (1,2,'2026-01-22 00:00:00.000','2026-01-23 20:59:59.999','GLOBAL',2000,NULL,'2026-01-22 20:24:16.916'),(2,3,'2026-01-22 00:00:00.000','2026-01-23 20:59:59.999','GLOBAL',2000,NULL,'2026-01-22 20:24:16.916'),(3,2,'2026-01-20 00:00:00.000','2026-01-27 20:59:59.999','GLOBAL',2000,NULL,'2026-01-22 20:27:10.045'),(4,3,'2026-01-20 00:00:00.000','2026-01-27 20:59:59.999','GLOBAL',2000,NULL,'2026-01-22 20:27:10.045'),(5,1,'2026-01-29 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',1000,NULL,'2026-01-29 15:39:11.050'),(6,2,'2026-01-29 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',1000,NULL,'2026-01-29 15:39:11.050'),(7,3,'2026-01-29 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',1000,NULL,'2026-01-29 15:39:11.050'),(8,1,'2026-01-22 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',550,NULL,'2026-01-29 15:43:11.843'),(9,2,'2026-01-22 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',550,NULL,'2026-01-29 15:43:11.843'),(10,3,'2026-01-22 00:00:00.000','2026-01-29 20:59:59.999','GLOBAL',550,NULL,'2026-01-29 15:43:11.843'),(11,2,'2026-01-10 00:00:00.000','2026-01-22 20:59:59.999','SINGLE_SALE',500,10,'2026-01-29 15:47:41.603'),(12,3,'2026-01-10 00:00:00.000','2026-01-22 20:59:59.999','PERIOD_TOTAL',1000,5,'2026-01-29 15:47:41.603'),(13,3,'2026-01-10 00:00:00.000','2026-01-22 20:59:59.999','SINGLE_SALE',500,10,'2026-01-29 15:47:41.603'),(14,2,'2026-01-22 00:00:00.000','2026-01-27 20:59:59.999','SINGLE_SALE',500,10,'2026-01-29 15:48:04.890'),(15,3,'2026-01-22 00:00:00.000','2026-01-27 20:59:59.999','PERIOD_TOTAL',1000,5,'2026-01-29 15:48:04.890'),(16,3,'2026-01-22 00:00:00.000','2026-01-27 20:59:59.999','SINGLE_SALE',500,10,'2026-01-29 15:48:04.890'),(17,1,'2026-03-01 00:00:00.000','2026-03-31 20:59:59.999','GLOBAL',1000,6,'2026-03-04 13:20:10.711'),(18,2,'2026-03-01 00:00:00.000','2026-03-31 20:59:59.999','GLOBAL',1000,6,'2026-03-04 13:20:10.711'),(19,3,'2026-03-01 00:00:00.000','2026-03-31 20:59:59.999','GLOBAL',1000,6,'2026-03-04 13:20:10.711'),(20,18,'2026-03-01 00:00:00.000','2026-03-31 20:59:59.999','GLOBAL',1000,6,'2026-03-04 13:20:10.711'),(21,19,'2026-03-01 00:00:00.000','2026-03-31 20:59:59.999','GLOBAL',1000,6,'2026-03-04 13:20:10.711');
/*!40000 ALTER TABLE `bonuspayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bonusrule`
--

DROP TABLE IF EXISTS `bonusrule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bonusrule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('PERIOD_TOTAL','SINGLE_SALE','GLOBAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `minAmount` double NOT NULL,
  `bonusAmount` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bonusRule_type_minAmount_key` (`type`,`minAmount`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bonusrule`
--

LOCK TABLES `bonusrule` WRITE;
/*!40000 ALTER TABLE `bonusrule` DISABLE KEYS */;
INSERT INTO `bonusrule` VALUES (1,'PERIOD_TOTAL',20000,1000,0,'2026-01-22 19:42:07.689','2026-03-04 12:38:45.025'),(2,'SINGLE_SALE',15000,500,0,'2026-01-22 19:44:05.458','2026-01-29 14:56:56.452'),(5,'PERIOD_TOTAL',50000,1000,0,'2026-01-22 20:02:14.393','2026-03-04 12:30:55.160'),(6,'GLOBAL',0,200,1,'2026-01-22 20:25:55.793','2026-03-04 13:22:32.676'),(10,'SINGLE_SALE',20000,300,0,'2026-01-29 15:22:27.532','2026-03-04 13:22:12.998');
/*!40000 ALTER TABLE `bonusrule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Shoes',1,'/uploads/categories/1769108874611-336926148.jpg'),(2,'Trousers(Suriwoch)',1,'/uploads/categories/1770895094091-209066749.jpg'),(4,'Shemith',1,'/uploads/categories/1769606588750-531299838.jpg'),(6,'Jackets',1,'/uploads/categories/1770895886112-985922166.jpg'),(7,'T-shirts',1,'/uploads/categories/1770879762026-549697089.jpg'),(8,'Sweater(Shurab)',1,'/uploads/categories/1770887234955-202649399.jpg');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expenseDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_expenseDate_idx` (`expenseDate`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense`
--

LOCK TABLES `expense` WRITE;
/*!40000 ALTER TABLE `expense` DISABLE KEYS */;
INSERT INTO `expense` VALUES (1,'Updated electricity bill n',3000,'2026-01-23 12:31:45.627','ELECTRICITY','2026-01-19 21:00:00.000'),(4,'Ride Transport',1000,'2026-01-25 11:43:45.901','Transport','2026-01-24 21:00:00.000'),(5,'Shop Rent',10000,'2026-01-25 11:44:25.277','Rent','2026-01-24 21:00:00.000'),(6,'Juice for employees',200,'2026-01-25 11:45:06.444','Tips','2026-01-24 21:00:00.000'),(7,'Updated  January Tax',4500,'2026-01-28 21:23:54.272','Tax','2026-01-27 21:00:00.000'),(9,'Breakfast for employees',900,'2026-01-29 08:29:11.882','Tips','2026-01-28 21:00:00.000'),(11,'coffee',100,'2026-03-03 11:44:27.987','General','2026-03-02 21:00:00.000'),(13,'electricity',1000,'2026-03-03 11:54:33.587','Utilities','2026-03-02 21:00:00.000'),(15,'maintenance',800,'2026-03-03 12:18:24.150','General','2026-03-01 21:00:00.000'),(16,'some',300,'2026-03-03 12:19:35.496','General','2026-03-02 21:00:00.000'),(17,'coffee',100,'2026-03-09 11:35:09.916','General','2026-03-08 21:00:00.000'),(18,'Electricity',2000,'2026-03-11 13:36:05.988','Utilities','2026-03-10 21:00:00.000'),(20,'top performers',1000,'2026-03-11 14:05:13.362','Bonus','2026-03-10 21:00:00.000'),(21,'bygyh',500,'2026-03-13 12:57:22.191','General','2026-03-12 21:00:00.000');
/*!40000 ALTER TABLE `expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginlog`
--

DROP TABLE IF EXISTS `loginlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `LoginLog_userId_fkey` (`userId`),
  CONSTRAINT `LoginLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginlog`
--

LOCK TABLES `loginlog` WRITE;
/*!40000 ALTER TABLE `loginlog` DISABLE KEYS */;
INSERT INTO `loginlog` VALUES (1,4,'::1','PostmanRuntime/7.51.0','2026-01-27 11:17:11.485'),(2,5,'::1','PostmanRuntime/7.51.0','2026-01-27 12:00:34.577'),(3,5,'::1','PostmanRuntime/7.51.0','2026-01-27 12:08:25.040'),(4,5,'::1','PostmanRuntime/7.51.0','2026-01-27 12:12:05.744'),(5,4,'::1','PostmanRuntime/7.51.0','2026-01-27 19:00:20.619'),(6,4,'::1','PostmanRuntime/7.51.0','2026-01-28 12:16:20.330'),(7,4,'::1','PostmanRuntime/7.51.0','2026-01-28 20:30:52.112'),(8,3,'::1','PostmanRuntime/7.51.0','2026-01-28 20:39:46.025'),(9,4,'::1','PostmanRuntime/7.51.0','2026-01-28 20:44:58.667'),(10,4,'::1','PostmanRuntime/7.51.0','2026-01-28 21:15:55.984'),(11,4,'::1','PostmanRuntime/7.51.0','2026-01-29 07:48:48.828'),(12,4,'::1','PostmanRuntime/7.51.0','2026-01-29 13:04:31.664'),(13,4,'::1','PostmanRuntime/7.51.0','2026-01-30 11:38:47.702'),(14,3,'::1','PostmanRuntime/7.51.0','2026-01-30 12:15:34.630'),(15,4,'::1','PostmanRuntime/7.51.1','2026-01-31 07:03:22.364'),(16,4,'::1','PostmanRuntime/7.51.1','2026-01-31 07:46:35.737'),(17,4,'::1','PostmanRuntime/7.51.1','2026-02-01 07:20:42.098'),(18,4,'::1','PostmanRuntime/7.51.1','2026-02-01 08:24:37.563'),(19,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-01 08:54:28.528'),(20,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-01 08:56:26.896'),(21,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 04:50:58.084'),(22,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 04:53:49.750'),(23,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 05:44:04.931'),(24,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 05:47:40.179'),(25,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 05:48:45.154'),(26,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 05:49:18.079'),(27,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 05:51:31.071'),(28,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:21:52.872'),(29,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:24:03.497'),(30,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:41:22.319'),(31,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:57:47.319'),(32,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:58:13.389'),(33,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 19:58:34.527'),(34,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:18:04.773'),(35,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:19:11.003'),(36,4,'::1','PostmanRuntime/7.51.1','2026-02-03 20:20:03.877'),(37,5,'::1','PostmanRuntime/7.51.1','2026-02-03 20:20:53.446'),(38,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:38:44.486'),(39,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:40:27.634'),(40,5,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:41:12.334'),(41,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:50:45.227'),(42,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 20:59:39.025'),(43,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 21:15:20.003'),(44,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 21:15:40.474'),(45,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 11:46:25.164'),(46,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:15:56.664'),(47,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:18:54.131'),(48,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:20:02.172'),(49,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:24:13.599'),(50,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:26:30.336'),(51,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 15:32:03.821'),(52,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-09 16:14:44.180'),(53,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 06:24:50.865'),(54,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 07:14:02.247'),(55,4,'::1','PostmanRuntime/7.51.1','2026-02-10 07:22:19.109'),(56,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 07:53:05.033'),(57,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 07:53:39.997'),(58,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 07:53:59.398'),(59,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-10 08:27:51.094'),(60,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-11 09:48:09.991'),(61,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 05:48:55.157'),(62,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 05:59:09.562'),(63,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 06:43:11.069'),(64,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 14:55:12.641'),(65,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 14:55:35.311'),(66,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 14:56:13.814'),(67,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 15:43:29.077'),(68,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-12 15:56:56.275'),(69,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-13 06:24:51.747'),(70,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-23 14:26:27.768'),(71,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-25 14:59:59.100'),(72,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-02-27 14:46:57.946'),(73,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-02 07:29:47.040'),(74,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-02 09:00:52.652'),(75,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-03 07:54:36.078'),(76,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 09:29:23.607'),(77,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 11:32:06.214'),(78,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 11:42:27.616'),(79,19,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 12:36:08.172'),(80,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 12:37:11.468'),(81,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-04 12:38:00.792'),(82,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 14:37:14.224'),(83,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 16:58:11.050'),(84,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 17:05:57.485'),(85,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 20:22:13.114'),(86,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 21:56:10.639'),(87,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 21:56:58.465'),(88,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 22:14:52.517'),(89,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:00:55.671'),(90,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:11:43.253'),(91,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:12:42.321'),(92,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:12:49.110'),(93,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:12:50.430'),(94,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:13:04.311'),(95,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:13:19.202'),(96,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:13:20.561'),(97,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:13:20.780'),(98,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:14:44.711'),(99,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:17:09.962'),(100,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:38:07.301'),(101,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 23:39:18.839'),(102,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 06:03:14.115'),(103,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 06:19:12.936'),(104,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 06:19:40.583'),(105,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 09:30:06.419'),(106,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 10:02:24.455'),(107,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 10:42:39.414'),(108,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 12:19:03.895'),(109,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 12:26:11.913'),(110,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 12:26:55.254'),(111,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-09 13:53:24.107'),(112,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 06:51:21.644'),(113,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 06:54:53.607'),(114,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 07:11:35.647'),(115,19,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 07:12:56.314'),(116,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 07:13:52.794'),(117,19,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 07:14:55.613'),(118,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 07:19:00.180'),(119,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 08:22:38.951'),(120,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 08:27:45.616'),(121,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:12:14.603'),(122,19,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:12:54.937'),(123,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 13:15:02.397'),(124,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 21:21:39.386'),(125,18,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 21:42:42.671'),(126,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-11 21:45:37.083'),(127,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-12 10:44:08.610'),(128,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-13 11:55:48.513'),(129,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-15 07:35:33.074'),(130,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-15 09:40:13.892'),(131,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-15 11:11:08.570'),(132,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-15 11:32:16.016'),(133,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-15 11:34:27.811'),(134,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 08:25:55.096'),(135,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 10:36:14.516'),(136,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 10:38:04.279'),(137,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 11:05:37.386'),(138,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 11:06:33.165'),(139,22,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 11:07:30.375'),(140,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 11:29:07.858'),(141,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:04:02.345'),(142,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:10:10.776'),(143,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:28:05.888'),(144,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:32:37.875'),(145,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:36:51.434'),(146,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:45:09.583'),(147,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 12:50:43.051'),(148,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:01:17.290'),(149,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:10:08.680'),(150,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:17:00.208'),(151,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:18:05.073'),(152,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:26:29.370'),(153,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:27:26.173'),(154,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:28:14.474'),(155,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:29:49.848'),(156,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:35:47.667'),(157,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:35:48.879'),(158,4,'::ffff:192.168.0.101','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-16 13:35:54.092'),(159,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:40:16.922'),(160,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:43:16.877'),(161,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:43:20.157'),(162,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:45:09.546'),(163,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 13:57:42.872'),(164,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:03:15.896'),(165,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:07:06.233'),(166,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:13:42.010'),(167,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:15:10.651'),(168,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:18:48.368'),(169,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:21:12.384'),(170,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:26:18.823'),(171,4,'::ffff:192.168.0.101','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-16 14:33:17.716'),(172,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 08:29:45.696'),(173,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 08:39:07.249'),(174,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 08:39:16.567'),(175,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 08:44:51.409'),(176,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 10:12:20.227'),(177,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 10:26:13.393'),(178,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 10:31:33.042'),(179,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 10:35:26.394'),(180,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 11:18:24.463'),(181,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 11:19:00.607'),(182,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 11:29:06.587'),(183,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 11:29:40.287'),(184,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 11:40:08.295'),(185,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 11:58:40.955'),(186,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 12:30:45.470'),(187,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 12:54:21.009'),(188,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 13:03:42.557'),(189,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 13:04:46.688'),(190,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 13:07:30.507'),(191,20,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 13:09:32.470'),(192,4,'102.208.96.206','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 13:11:07.070'),(193,20,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 13:19:36.470'),(194,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 13:34:13.805'),(195,4,'102.208.96.17','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 13:37:42.848'),(196,4,'102.208.96.17','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1','2026-03-21 13:45:17.581'),(197,4,'102.208.96.17','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1','2026-03-21 13:47:22.267'),(198,4,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 09:29:08.809');
/*!40000 ALTER TABLE `loginlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricecategory`
--

DROP TABLE IF EXISTS `pricecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricecategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fixedPrice` double NOT NULL,
  `categoryId` int NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `PriceCategory_categoryId_fkey` (`categoryId`),
  CONSTRAINT `PriceCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricecategory`
--

LOCK TABLES `pricecategory` WRITE;
/*!40000 ALTER TABLE `pricecategory` DISABLE KEYS */;
INSERT INTO `pricecategory` VALUES (1,2000,1,'/uploads/pricecategories/1769108959299-969240197.jpg',1),(2,3000,1,'/uploads/pricecategories/1769108982024-11652367.jpg',1),(3,4000,1,'/uploads/pricecategories/1769108998689-925770770.jpg',1),(4,1500,2,'/uploads/pricecategories/1769109045388-368908368.jpg',1),(5,3000,2,'/uploads/pricecategories/1769109089653-850894740.jpg',1),(6,4000,2,'/uploads/pricecategories/1769109110402-316598873.jpg',1),(7,1500,4,'/uploads/pricecategories/1769609198048-27569119.jpg',1),(8,2000,4,'/uploads/pricecategories/1769609294572-184708037.jpg',1),(9,2800,4,'/uploads/pricecategories/1769609349020-312801548.jpg',1),(10,3500,6,'/uploads/pricecategories/1770809945623-649271590.jpg',1),(11,4500,6,'/uploads/pricecategories/1770879192280-17028892.jpg',1),(12,1000,7,'/uploads/pricecategories/1770879762074-857669154.jpg',1),(13,1500,7,'/uploads/pricecategories/1770879860979-430804279.webp',1),(15,2500,7,'/uploads/pricecategories/1770883756795-173951340.jpg',1),(16,6000,6,'/uploads/pricecategories/1770883969477-192870468.jpg',1),(17,2000,8,'/uploads/pricecategories/1770887235045-875862694.jpg',1),(18,3000,8,'/uploads/pricecategories/1770887437178-820653559.jpg',1),(19,2000,6,'/uploads/pricecategories/1770911417087-163908261.jpg',1),(20,4000,8,'/uploads/pricecategories/1773564100248-67045063.jpg',1);
/*!40000 ALTER TABLE `pricecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salarypayment`
--

DROP TABLE IF EXISTS `salarypayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salarypayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` int NOT NULL,
  `daysWorked` int NOT NULL,
  `paymentType` enum('DAILY','PERIOD') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` double NOT NULL,
  `periodStart` datetime(3) NOT NULL,
  `periodEnd` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SalaryPayment_userId_fkey` (`userId`),
  KEY `salarypayment_userId_periodStart_periodEnd_idx` (`userId`,`periodStart`,`periodEnd`),
  CONSTRAINT `salarypayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salarypayment`
--

LOCK TABLES `salarypayment` WRITE;
/*!40000 ALTER TABLE `salarypayment` DISABLE KEYS */;
INSERT INTO `salarypayment` VALUES (4,1100,'2026-01-29 09:11:33.182',3,1,'DAILY',1100,'2026-01-29 00:00:00.000','2026-01-29 00:00:00.000'),(5,1000,'2026-01-29 09:11:43.626',2,1,'DAILY',1000,'2026-01-29 00:00:00.000','2026-01-29 00:00:00.000'),(7,1200,'2026-01-29 13:57:27.944',1,1,'DAILY',1200,'2026-01-29 00:00:00.000','2026-01-29 00:00:00.000'),(8,5000,'2026-01-29 14:27:20.255',1,5,'PERIOD',1000,'2026-01-20 00:00:00.000','2026-01-27 00:00:00.000'),(9,2800,'2026-03-04 10:37:12.626',19,3,'PERIOD',800,'2026-03-01 00:00:00.000','2026-03-04 00:00:00.000'),(10,3000,'2026-03-04 10:49:35.247',18,3,'PERIOD',1000,'2026-03-01 00:00:00.000','2026-03-04 00:00:00.000'),(12,2400,'2026-03-04 11:58:33.016',2,2,'PERIOD',1200,'2026-03-01 00:00:00.000','2026-03-04 00:00:00.000'),(13,2700,'2026-03-04 13:25:47.055',1,3,'PERIOD',900,'2026-03-01 00:00:00.000','2026-03-04 00:00:00.000'),(16,2800,'2026-03-08 14:56:33.659',19,3,'PERIOD',800,'2026-03-05 00:00:00.000','2026-03-08 00:00:00.000'),(17,1800,'2026-03-09 11:23:50.806',20,2,'PERIOD',900,'2026-03-08 00:00:00.000','2026-03-09 00:00:00.000'),(18,2000,'2026-03-11 08:24:48.459',20,2,'PERIOD',1000,'2026-03-10 00:00:00.000','2026-03-11 00:00:00.000'),(19,1800,'2026-03-11 08:25:09.948',19,2,'PERIOD',900,'2026-03-10 00:00:00.000','2026-03-11 00:00:00.000'),(20,3600,'2026-03-11 08:25:49.657',18,2,'PERIOD',1800,'2026-03-10 00:00:00.000','2026-03-11 00:00:00.000'),(21,1000,'2026-03-13 12:52:23.792',20,1,'DAILY',1000,'2026-03-13 00:00:00.000','2026-03-13 00:00:00.000'),(22,1800,'2026-03-13 12:53:19.497',19,2,'PERIOD',900,'2026-03-12 00:00:00.000','2026-03-13 00:00:00.000');
/*!40000 ALTER TABLE `salarypayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `employeeId` int NOT NULL,
  `status` enum('DRAFT','CONFIRMED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `updatedAt` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Sale_employeeId_fkey` (`employeeId`),
  CONSTRAINT `Sale_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
INSERT INTO `sale` VALUES (1,'2026-01-22 19:14:55.448',2,'CONFIRMED','2026-01-30 12:08:18.754'),(2,'2026-01-22 19:17:21.266',3,'CONFIRMED','2026-01-22 19:22:17.628'),(3,'2026-01-24 20:10:56.271',1,'CONFIRMED','2026-01-24 20:12:32.231'),(4,'2026-01-24 20:28:24.904',3,'CONFIRMED','2026-01-24 20:29:51.178'),(5,'2026-01-28 20:34:06.010',4,'CONFIRMED','2026-01-30 12:07:35.512'),(7,'2026-01-28 20:55:59.313',3,'CONFIRMED','2026-01-28 20:58:28.314'),(8,'2026-01-30 11:55:14.804',4,'CONFIRMED','2026-01-30 12:07:56.798'),(9,'2026-01-30 12:16:32.746',3,'CONFIRMED','2026-01-30 12:22:44.633'),(10,'2026-01-30 12:19:04.534',4,'CONFIRMED','2026-01-30 12:23:21.342'),(11,'2026-01-30 12:19:14.170',3,'CONFIRMED','2026-01-30 12:23:36.190'),(38,'2026-02-12 15:38:04.293',4,'DRAFT','2026-02-12 15:38:04.293'),(44,'2026-02-12 15:40:51.923',4,'DRAFT','2026-02-12 15:40:51.923'),(52,'2026-02-12 15:51:31.945',4,'DRAFT','2026-02-12 15:51:31.945'),(79,'2026-02-12 16:13:44.688',4,'DRAFT','2026-02-12 16:13:44.688'),(82,'2026-02-12 16:36:15.160',4,'DRAFT','2026-02-12 16:36:15.160'),(84,'2026-02-12 16:46:25.809',4,'DRAFT','2026-02-12 16:46:25.809'),(86,'2026-02-13 07:37:56.614',4,'DRAFT','2026-02-13 07:37:56.614'),(87,'2026-02-13 07:38:05.110',4,'DRAFT','2026-02-13 07:38:05.110'),(88,'2026-02-13 08:36:36.603',4,'DRAFT','2026-02-13 08:36:36.603'),(90,'2026-02-13 08:48:57.940',4,'DRAFT','2026-02-13 08:48:57.940'),(91,'2026-02-13 08:49:12.092',4,'DRAFT','2026-02-13 08:49:12.092'),(92,'2026-02-13 09:06:04.378',4,'DRAFT','2026-02-13 09:06:04.378'),(94,'2026-02-23 14:50:17.861',4,'CONFIRMED','2026-02-27 15:43:17.286'),(97,'2026-02-23 15:10:15.665',4,'CONFIRMED','2026-02-23 15:10:49.777'),(98,'2026-02-23 15:11:08.055',4,'CONFIRMED','2026-02-23 15:11:24.303'),(99,'2026-02-23 15:23:10.166',4,'CONFIRMED','2026-02-23 15:25:33.743'),(100,'2026-02-23 15:24:32.903',4,'CONFIRMED','2026-02-23 15:25:33.752'),(103,'2026-03-02 08:27:21.681',4,'CONFIRMED','2026-03-02 08:32:35.125'),(104,'2026-03-02 08:34:37.868',4,'CONFIRMED','2026-03-02 08:43:10.123'),(105,'2026-03-02 08:35:58.641',4,'CONFIRMED','2026-03-02 08:43:10.117'),(106,'2026-03-02 08:37:25.666',4,'CONFIRMED','2026-03-02 08:43:10.112'),(107,'2026-03-02 08:51:39.059',4,'CONFIRMED','2026-03-02 08:53:07.890'),(111,'2026-03-08 21:17:06.951',4,'CONFIRMED','2026-03-08 23:38:39.092'),(113,'2026-03-08 22:54:57.652',20,'CONFIRMED','2026-03-08 23:38:39.077'),(114,'2026-03-08 23:36:49.663',20,'CONFIRMED','2026-03-08 23:38:39.063'),(115,'2026-03-08 23:56:21.527',20,'DRAFT','2026-03-08 23:56:21.527'),(116,'2026-03-09 09:24:13.465',20,'DRAFT','2026-03-09 09:24:13.465'),(117,'2026-03-11 07:08:30.573',20,'DRAFT','2026-03-11 07:08:30.573'),(118,'2026-03-11 07:10:35.440',20,'DRAFT','2026-03-11 07:10:35.440'),(119,'2026-03-11 07:16:42.282',19,'CONFIRMED','2026-03-11 21:27:01.125'),(120,'2026-03-11 07:21:16.191',20,'CONFIRMED','2026-03-11 21:27:01.133'),(121,'2026-03-11 08:49:28.140',20,'DRAFT','2026-03-11 08:49:28.140'),(122,'2026-03-11 08:49:52.416',20,'DRAFT','2026-03-11 08:49:52.416'),(123,'2026-03-11 08:50:09.292',20,'DRAFT','2026-03-11 08:50:09.292'),(124,'2026-03-11 08:50:23.185',20,'DRAFT','2026-03-11 08:50:23.185'),(125,'2026-03-11 13:13:34.153',19,'CONFIRMED','2026-03-11 21:27:01.118'),(126,'2026-03-11 14:08:28.725',4,'CONFIRMED','2026-03-11 21:27:01.112'),(131,'2026-03-11 21:11:12.138',4,'CONFIRMED','2026-03-11 21:27:01.102'),(133,'2026-03-11 21:42:59.733',18,'DRAFT','2026-03-11 21:42:59.733'),(134,'2026-03-12 12:15:12.728',4,'DRAFT','2026-03-12 12:15:12.728'),(142,'2026-03-12 12:56:13.237',4,'DRAFT','2026-03-12 12:56:13.237'),(143,'2026-03-12 12:56:58.545',4,'DRAFT','2026-03-12 12:56:58.545'),(146,'2026-03-13 12:16:18.293',4,'DRAFT','2026-03-13 12:16:18.293'),(147,'2026-03-15 07:52:42.774',4,'DRAFT','2026-03-15 07:52:42.774'),(148,'2026-03-15 08:44:32.044',4,'DRAFT','2026-03-15 08:44:32.044'),(149,'2026-03-15 08:46:49.393',4,'DRAFT','2026-03-15 08:46:49.393'),(150,'2026-03-15 09:37:57.925',20,'DRAFT','2026-03-15 09:39:05.332'),(151,'2026-03-15 09:40:32.733',19,'DRAFT','2026-03-15 09:41:18.582'),(153,'2026-03-15 11:31:23.338',20,'DRAFT','2026-03-15 11:31:41.509'),(154,'2026-03-15 11:33:01.995',19,'DRAFT','2026-03-15 11:33:46.378'),(155,'2026-03-15 11:35:37.581',4,'DRAFT','2026-03-15 11:35:46.103'),(156,'2026-03-15 11:39:52.723',20,'DRAFT','2026-03-15 12:02:55.147'),(157,'2026-03-16 13:32:33.977',4,'DRAFT','2026-03-16 13:32:33.977'),(159,'2026-03-21 08:41:37.882',19,'DRAFT','2026-03-21 08:42:13.207'),(160,'2026-03-21 08:46:32.911',20,'DRAFT','2026-03-21 08:48:38.719'),(162,'2026-03-21 08:55:39.866',20,'DRAFT','2026-03-21 08:56:40.078'),(164,'2026-03-21 09:08:01.167',20,'DRAFT','2026-03-21 09:38:49.007');
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saleitem`
--

DROP TABLE IF EXISTS `saleitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saleitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `saleId` int NOT NULL,
  `priceCategoryId` int NOT NULL,
  `quantity` int NOT NULL,
  `soldPrice` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SaleItem_saleId_priceCategoryId_key` (`saleId`,`priceCategoryId`),
  KEY `SaleItem_priceCategoryId_fkey` (`priceCategoryId`),
  CONSTRAINT `SaleItem_priceCategoryId_fkey` FOREIGN KEY (`priceCategoryId`) REFERENCES `pricecategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sale` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saleitem`
--

LOCK TABLES `saleitem` WRITE;
/*!40000 ALTER TABLE `saleitem` DISABLE KEYS */;
INSERT INTO `saleitem` VALUES (1,1,1,10,2000),(2,2,4,30,1500),(3,2,3,5,4000),(4,3,3,4,4000),(5,4,5,18,3000),(6,5,2,2,3000),(8,7,4,1,2300),(9,8,1,2,2000),(10,9,2,2,3000),(11,10,4,1,2000),(12,11,3,1,4000),(13,38,1,3,1800),(14,44,15,2,2400),(15,52,19,1,1900),(16,79,19,2,2000),(17,82,17,1,1800),(18,82,5,1,2900),(20,84,13,1,1500),(21,84,16,1,4000),(28,86,1,1,2000),(29,87,2,7,3000),(30,87,1,9,2000),(31,87,7,1,1500),(32,87,4,1,1500),(33,88,10,9,3500),(34,88,11,1,4500),(35,88,18,1,3000),(36,88,2,1,3000),(37,88,3,1,4000),(38,90,4,1,1500),(39,91,6,1,4000),(40,91,4,1,1500),(41,91,5,1,3000),(42,91,8,1,2000),(43,92,4,2,1500),(44,94,5,1,3000),(46,97,1,2,2000),(47,98,16,1,6000),(48,99,1,1,2000),(49,100,8,1,2000),(54,103,10,1,3500),(55,104,12,1,1000),(56,104,13,1,1500),(57,104,11,1,4500),(58,105,3,2,3800),(59,106,8,1,2000),(60,107,4,2,1500),(62,111,15,1,2500),(64,113,1,1,2000),(65,113,3,1,4000),(66,114,9,1,2800),(67,114,6,1,4000),(68,115,16,1,6000),(69,116,16,1,6000),(70,117,1,1,2000),(71,117,8,1,2000),(72,118,10,2,3500),(73,119,16,1,6000),(74,119,2,1,3000),(75,119,6,1,4000),(76,120,12,1,1000),(77,121,9,1,2800),(78,122,8,1,2000),(79,123,3,1,4000),(80,124,11,1,4500),(81,125,5,1,3000),(82,126,8,1,2000),(83,131,1,1,2000),(84,131,6,1,4000),(85,133,3,1,4000),(86,133,6,1,4000),(87,133,5,1,3000),(88,133,9,1,2800),(89,133,16,1,6000),(90,133,13,1,1500),(91,134,19,2,2000),(92,142,2,1,3000),(93,143,10,1,3500),(94,146,1,1,1900),(95,146,6,1,4000),(96,147,4,1,1500),(97,147,11,1,4500),(98,148,20,1,4000),(99,149,16,1,6000),(100,150,1,1,2000),(101,151,20,1,4000),(102,153,6,1,4000),(103,154,7,1,1500),(104,155,10,1,3500),(105,156,8,1,2000),(106,156,4,1,1500),(107,159,15,1,2500),(108,160,2,1,3000),(109,160,6,1,4000),(110,162,12,1,1000),(111,162,17,1,2000),(112,164,5,1,3000),(113,164,12,1,1000),(114,164,15,1,2500),(115,164,13,1,1500),(116,164,10,1,3500),(117,164,19,1,2000);
/*!40000 ALTER TABLE `saleitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salepayment`
--

DROP TABLE IF EXISTS `salepayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salepayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `saleId` int NOT NULL,
  `method` enum('CASH','BANK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `bankName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SalePayment_saleId_fkey` (`saleId`),
  CONSTRAINT `SalePayment_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sale` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salepayment`
--

LOCK TABLES `salepayment` WRITE;
/*!40000 ALTER TABLE `salepayment` DISABLE KEYS */;
INSERT INTO `salepayment` VALUES (2,1,'BANK',10000,'CBE'),(3,1,'CASH',10000,NULL),(4,2,'CASH',5000,NULL),(5,2,'BANK',50000,'CBE'),(6,2,'BANK',10000,'Awash'),(7,3,'BANK',16000,'CBE'),(8,4,'BANK',54000,'CBE'),(9,5,'CASH',3000,NULL),(10,5,'BANK',3000,'CBE'),(15,7,'BANK',2000,'CBE'),(16,7,'BANK',300,'CBE'),(20,8,'BANK',2000,'CBE'),(21,8,'CASH',2000,NULL),(22,9,'CASH',2000,NULL),(23,9,'BANK',3000,'CBE'),(24,9,'BANK',1000,'CBE'),(25,10,'BANK',2000,'CBE'),(26,11,'BANK',4000,'CBE'),(27,38,'CASH',2000,NULL),(28,38,'BANK',4000,'CBE'),(29,44,'CASH',2000,NULL),(30,44,'BANK',2800,'Awash'),(31,52,'CASH',1000,NULL),(32,52,'BANK',900,'CBE'),(33,79,'CASH',1000,NULL),(34,79,'BANK',1000,'CBE'),(35,79,'BANK',2000,'Awash'),(36,82,'CASH',1000,NULL),(37,82,'BANK',2000,'Awash'),(38,82,'BANK',1000,'CBE'),(39,82,'BANK',700,'Telebir'),(40,84,'CASH',2000,NULL),(41,84,'BANK',5000,'CBE'),(42,84,'BANK',1500,'BOA'),(64,87,'CASH',2000,NULL),(65,87,'BANK',1500,'Bank Transfer'),(66,88,'CASH',1000,NULL),(67,88,'BANK',6000,'Awash'),(68,91,'CASH',2000,NULL),(69,91,'BANK',4500,'CBE'),(70,92,'CASH',1000,NULL),(71,92,'BANK',2000,'CBE'),(72,94,'BANK',3000,'BOA'),(76,97,'CASH',1000,NULL),(77,97,'BANK',2000,'CBE'),(78,97,'BANK',1000,'BOA'),(79,98,'BANK',6000,'Awash'),(80,99,'CASH',1000,NULL),(81,99,'BANK',1000,'CBE'),(82,100,'BANK',2000,'Awash'),(87,103,'CASH',1000,NULL),(88,103,'BANK',2500,'Nib'),(89,104,'CASH',7000,NULL),(90,105,'CASH',3000,NULL),(91,105,'BANK',3000,'CBE'),(92,105,'BANK',1600,'Awash'),(93,106,'CASH',2000,NULL),(94,107,'CASH',1000,NULL),(95,107,'BANK',2000,'Nib'),(97,111,'CASH',500,NULL),(98,111,'BANK',2000,'Awash'),(101,113,'CASH',4000,NULL),(102,113,'BANK',2000,'CBE'),(103,114,'CASH',6800,NULL),(104,115,'BANK',6000,'BOA'),(105,116,'CASH',1000,NULL),(106,116,'BANK',2000,'Awash'),(107,116,'BANK',3000,'CBE'),(108,117,'CASH',2000,NULL),(109,117,'BANK',2000,'CBE'),(110,118,'CASH',7000,NULL),(111,119,'BANK',13000,'Awash'),(112,120,'CASH',1000,NULL),(113,121,'CASH',2800,NULL),(114,122,'CASH',2000,NULL),(115,123,'CASH',4000,NULL),(116,124,'BANK',4500,'Awash'),(117,125,'CASH',500,NULL),(118,125,'BANK',2500,'CBE'),(119,126,'CASH',2000,NULL),(120,131,'CASH',2000,NULL),(121,131,'BANK',2000,'CBE'),(122,131,'BANK',2000,'Awash'),(123,133,'CASH',5000,NULL),(124,133,'BANK',10000,'CBE'),(125,133,'BANK',6300,'Dashen'),(126,134,'CASH',4000,NULL),(127,142,'CASH',3000,NULL),(128,143,'CASH',1000,NULL),(129,143,'BANK',2500,'Awash'),(130,146,'CASH',2000,NULL),(131,146,'BANK',2000,'Awash'),(132,146,'BANK',1900,'CBE'),(133,147,'CASH',1000,NULL),(134,147,'BANK',4000,'CBE'),(135,147,'BANK',1000,'NIB'),(136,148,'BANK',4000,'CBE'),(137,149,'BANK',6000,'TELEBIR'),(138,150,'BANK',2000,'CBE'),(139,151,'BANK',4000,'TELEBIR'),(140,153,'CASH',2000,NULL),(141,153,'BANK',2000,'AWASH'),(142,154,'CASH',1500,NULL),(143,155,'BANK',3500,'CBE'),(144,156,'BANK',3500,'NIB'),(145,159,'CASH',1000,NULL),(146,159,'BANK',1500,'TELEBIR'),(147,160,'CASH',2000,NULL),(148,160,'BANK',3000,'AWASH'),(149,160,'BANK',2000,'CBE'),(150,162,'CASH',1000,NULL),(151,162,'BANK',2000,'AWASH'),(152,164,'BANK',10000,'CBE'),(153,164,'BANK',3500,'NIB');
/*!40000 ALTER TABLE `salepayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchasePrice` double NOT NULL,
  `quantity` int NOT NULL,
  `priceCategoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Stock_priceCategoryId_key` (`priceCategoryId`),
  CONSTRAINT `Stock_priceCategoryId_fkey` FOREIGN KEY (`priceCategoryId`) REFERENCES `pricecategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1447.34693877551,49,1,'2026-01-22 19:13:00.466','2026-03-15 09:39:05.299'),(2,2500,15,2,'2026-01-22 19:13:33.591','2026-03-21 08:48:38.683'),(3,3000,4,3,'2026-01-22 19:13:46.609','2026-03-11 21:44:58.304'),(4,1000,59,4,'2026-01-22 19:13:58.903','2026-03-15 12:02:55.129'),(5,2000,6,5,'2026-01-22 19:14:13.538','2026-03-21 09:38:48.937'),(6,3000,37,6,'2026-01-22 19:14:32.012','2026-03-21 08:48:38.697'),(7,1000,13,7,'2026-02-10 10:54:25.651','2026-03-15 11:33:46.350'),(8,2000,7,9,'2026-02-10 12:34:26.332','2026-03-11 21:44:58.335'),(9,1500,8,8,'2026-02-10 13:22:45.789','2026-03-15 12:02:55.114'),(10,3527.272727272727,7,11,'2026-02-12 06:53:12.345','2026-03-15 07:55:56.529'),(11,600,16,12,'2026-02-12 07:02:42.107','2026-03-21 09:38:48.950'),(12,1000,11,13,'2026-02-12 07:04:21.019','2026-03-21 09:38:48.967'),(13,2661.111111111111,15,10,'2026-02-12 07:14:39.064','2026-03-21 09:38:48.976'),(15,1800,1,15,'2026-02-12 08:09:16.849','2026-03-21 09:38:48.960'),(16,4390.909090909091,4,16,'2026-02-12 08:12:49.523','2026-03-15 08:47:00.819'),(17,1318.181818181818,10,17,'2026-02-12 09:07:15.115','2026-03-21 08:56:40.053'),(18,2300,2,18,'2026-02-12 09:10:37.227','2026-02-13 08:37:04.565'),(19,1300,9,19,'2026-02-12 15:50:17.140','2026-03-21 09:38:48.985'),(20,3000,8,20,'2026-03-15 08:41:40.286','2026-03-15 09:41:18.567');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockalert`
--

DROP TABLE IF EXISTS `stockalert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockalert` (
  `id` int NOT NULL AUTO_INCREMENT,
  `priceCategoryId` int NOT NULL,
  `lastSentAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `StockAlert_priceCategoryId_key` (`priceCategoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockalert`
--

LOCK TABLES `stockalert` WRITE;
/*!40000 ALTER TABLE `stockalert` DISABLE KEYS */;
INSERT INTO `stockalert` VALUES (1,3,'2026-01-31 08:20:21.316','2026-01-24 20:26:27.687'),(2,5,'2026-01-31 08:20:21.316','2026-01-24 20:29:57.881');
/*!40000 ALTER TABLE `stockalert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('OWNER','EMPLOYEE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `baseSalary` double DEFAULT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `mustChangePassword` tinyint(1) NOT NULL DEFAULT '1',
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_phoneNumber_key` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Fuad Yae\'kub','EMPLOYEE',0,'0000000000',0,'2026-01-22 19:06:23.931','2026-03-15 11:11:26.390','2026-02-03 20:50:45.217',0,'$2b$10$iM.rVlhLcdgJHS6F0/PrqufaI4eQBpXRY7Bo57u5u.SV12c8OLeky'),(2,'Feysel Yae\'kub','EMPLOYEE',0,'0000000001',1,'2026-01-22 19:06:46.960','2026-02-03 21:15:20.000','2026-02-03 21:15:19.995',0,'$2b$10$vVBTpGbfdHNxrBVvWfmeZewpJVkBW4Qw8m8z1wCTBOqm6DkIuoQMi'),(3,'Test User','EMPLOYEE',0,'0000000002',0,'2026-01-22 19:07:03.591','2026-03-15 12:24:23.437','2026-01-30 12:15:34.619',1,'$2b$10$hIhV.FK8Y.66NYQVi/vKN.qrTiXOB5sf4Xcll6FZ39tMdAISrL0GO'),(4,'Fuad Yae\'kub','OWNER',NULL,'0934993955',1,'2026-01-27 10:58:11.619','2026-03-22 09:29:08.789','2026-03-22 09:29:08.761',0,'$2b$10$BYb6NYNFq9rmwWy8pdP5JuxZn4Z7x7mPC1O9fhWfpm1.V0N48cvGm'),(5,'Test User2','EMPLOYEE',1000,'0900000000',1,'2026-01-27 11:54:55.327','2026-03-08 21:49:21.877','2026-02-03 20:41:12.325',0,'$2b$10$nMEMi0.YjlY.EwwjkpGOEuK1S3uTiVeFMwubtfcmppktXnSctk7pq'),(18,'Test Us1','EMPLOYEE',1000,'0700000000',1,'2026-02-09 13:10:49.309','2026-03-11 21:42:42.668','2026-03-11 21:42:42.665',0,'$2b$10$CdBLkMK1uHk1LeJdTWcYlOVgnONLmWuscGXjspGYktIuZUEoaldsm'),(19,'Amar','EMPLOYEE',900,'0900000003',1,'2026-02-09 15:37:11.676','2026-03-11 13:33:40.491','2026-03-11 13:12:54.930',0,'$2b$10$4PeHhNJALNPY2hdJAoiBG.EO0MLkVnN7Rjft/vZklZ07bHyHFnLcC'),(20,'Zeyd','EMPLOYEE',900,'0717150059',1,'2026-03-08 21:51:21.475','2026-03-21 13:19:36.467','2026-03-21 13:19:36.464',0,'$2b$10$mkUV06EqSl09u3RmT5svSOOQY7Gj6hOPXP4CuOY5Ffw9P4jLPb1wq'),(22,'Kemal','EMPLOYEE',800,'0945454545',1,'2026-03-15 12:36:20.991','2026-03-21 11:03:50.783','2026-03-16 11:07:30.360',1,'$2b$10$RWGrcBxkPPILQOcPNaXW1uz0.dhZnoAI8gBtlIQ.W/EOMOoCI2daq');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23  7:20:56
