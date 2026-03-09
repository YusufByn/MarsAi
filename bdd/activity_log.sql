-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mer. 25 fév. 2026 à 10:17
-- Version du serveur : 8.0.40
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `marsai`
--

-- --------------------------------------------------------

--
-- Structure de la table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int UNSIGNED DEFAULT NULL,
  `details` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activity_log`
--

INSERT INTO `activity_log` (`id`, `user_id`, `action`, `entity`, `entity_id`, `details`, `ip`, `created_at`) VALUES
(1, NULL, 'video_submit', 'video', 20, 'cucu', '::1', '2026-02-20 10:19:16'),
(2, 10, 'login', 'user', 10, 'admin@admin.com', '::1', '2026-02-23 15:42:50'),
(3, 10, 'admin_video_status', 'video', 10, 'rejected', '::1', '2026-02-24 12:35:03'),
(4, 10, 'admin_video_status', 'video', 8, 'rejected', '::1', '2026-02-24 12:35:05'),
(5, 10, 'admin_video_delete', 'video', 8, NULL, '::1', '2026-02-24 12:35:16'),
(6, 10, 'admin_video_delete', 'video', 10, NULL, '::1', '2026-02-24 12:35:18'),
(7, 11, 'login', 'user', 11, 'super@admin.com', '::1', '2026-02-24 14:33:14'),
(8, 11, 'admin_video_status', 'video', 20, 'validated', '::1', '2026-02-24 15:34:42'),
(9, 11, 'admin_video_status', 'video', 19, 'validated', '::1', '2026-02-24 15:34:43'),
(10, 11, 'admin_video_status', 'video', 18, 'validated', '::1', '2026-02-24 15:34:44'),
(11, 11, 'admin_video_status', 'video', 7, 'validated', '::1', '2026-02-24 15:34:46'),
(12, 11, 'admin_video_status', 'video', 6, 'validated', '::1', '2026-02-24 15:34:47'),
(13, 11, 'admin_video_status', 'video', 5, 'validated', '::1', '2026-02-24 15:34:48'),
(14, 11, 'admin_video_status', 'video', 4, 'validated', '::1', '2026-02-24 15:34:50'),
(15, 11, 'admin_video_status', 'video', 3, 'validated', '::1', '2026-02-24 15:34:50'),
(16, 11, 'admin_video_status', 'video', 2, 'validated', '::1', '2026-02-24 15:34:52'),
(17, 11, 'admin_video_status', 'video', 1, 'validated', '::1', '2026-02-24 15:34:53');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `fk_activity_log_user` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `fk_activity_log_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
