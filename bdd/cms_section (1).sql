-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mer. 25 fév. 2026 à 12:26
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
-- Structure de la table `cms_section`
--

CREATE TABLE `cms_section` (
  `id` int UNSIGNED NOT NULL,
  `phase` datetime DEFAULT NULL COMMENT 'Date de début de la phase',
  `section_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'countdown | hero | prizes | video | agenda | winners | kpi | cta | text',
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'countdown-2025, video-last-year...',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Sous-titre H2/H3',
  `config` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON: {target_date, video_url, button_text, button_link, stats: {...}}',
  `image_file` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL image/photo',
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien externe ou interne',
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cms_section`
--

INSERT INTO `cms_section` (`id`, `phase`, `section_type`, `slug`, `title`, `sub_title`, `config`, `image_file`, `link`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '2026-05-10 00:00:00', 'countdown', 'countdown-2026', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-02-02 11:16:35', '2026-02-02 12:46:41');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cms_section`
--
ALTER TABLE `cms_section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_phase` (`phase`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `fk_cms_created_by` (`created_by`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cms_section`
--
ALTER TABLE `cms_section`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cms_section`
--
ALTER TABLE `cms_section`
  ADD CONSTRAINT `fk_cms_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
