-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 06 mars 2026 à 08:31
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
(17, 11, 'admin_video_status', 'video', 1, 'validated', '::1', '2026-02-24 15:34:53'),
(18, 10, 'login', 'user', 10, 'admin@admin.com', '::1', '2026-02-25 10:20:05'),
(19, 11, 'login', 'user', 11, 'super@admin.com', '::1', '2026-02-25 10:20:17'),
(20, 11, 'admin_video_delete', 'video', 19, NULL, '::1', '2026-02-25 10:47:31'),
(21, 11, 'admin_video_delete', 'video', 7, NULL, '::1', '2026-02-25 10:47:34'),
(22, 11, 'admin_video_delete', 'video', 6, NULL, '::1', '2026-02-25 10:47:37'),
(23, 11, 'admin_video_delete', 'video', 3, NULL, '::1', '2026-02-25 10:47:40'),
(24, 11, 'admin_video_delete', 'video', 2, NULL, '::1', '2026-02-25 10:47:42'),
(25, 11, 'admin_video_delete', 'video', 1, NULL, '::1', '2026-02-25 10:47:44'),
(26, 11, 'admin_video_delete', 'video', 4, NULL, '::1', '2026-02-25 10:47:50'),
(27, NULL, 'video_submit', 'video', 21, 'Hello World', '::1', '2026-02-25 10:53:19'),
(28, 11, 'admin_video_delete', 'video', 20, NULL, '::1', '2026-02-25 11:04:51'),
(29, 11, 'admin_video_delete', 'video', 21, NULL, '::1', '2026-02-25 11:04:53'),
(30, 11, 'admin_video_delete', 'video', 5, NULL, '::1', '2026-02-25 11:04:54'),
(31, 11, 'admin_video_delete', 'video', 18, NULL, '::1', '2026-02-25 11:04:56'),
(32, NULL, 'video_submit', 'video', 22, 'Alysa Liu Gala JO 2026', '::1', '2026-02-25 11:52:30'),
(33, NULL, 'video_submit', 'video', 23, 'Jasper', '::1', '2026-02-25 11:58:14'),
(34, NULL, 'video_submit', 'video', 24, 'Toto', '::1', '2026-02-25 12:01:00'),
(35, NULL, 'video_submit', 'video', 25, NULL, '::1', '2026-02-25 12:05:04'),
(36, 11, 'admin_video_status', 'video', 25, 'validated', '::1', '2026-02-25 12:34:15'),
(37, 11, 'admin_video_status', 'video', 24, 'validated', '::1', '2026-02-25 12:34:16'),
(38, 11, 'admin_video_status', 'video', 23, 'validated', '::1', '2026-02-25 12:34:17'),
(39, 11, 'admin_video_status', 'video', 22, 'validated', '::1', '2026-02-25 12:34:17'),
(40, 11, 'admin_invite_sent', NULL, NULL, 'williampeynichou@gmail.com', '::1', '2026-02-25 12:35:01'),
(41, NULL, 'video_submit', 'video', 26, 'Hello World', '::1', '2026-02-25 12:40:12'),
(42, NULL, 'video_submit', 'video', 27, 'Hello World 3', '::1', '2026-02-25 12:43:56'),
(43, 11, 'admin_video_status', 'video', 24, 'rejected', '::1', '2026-02-25 12:44:31'),
(44, 11, 'admin_video_status', 'video', 23, 'rejected', '::1', '2026-02-25 12:44:34'),
(45, 11, 'admin_video_status', 'video', 22, 'rejected', '::1', '2026-02-25 12:44:35'),
(46, 11, 'admin_video_status', 'video', 24, 'validated', '::1', '2026-02-25 12:46:04'),
(47, 11, 'admin_video_status', 'video', 23, 'validated', '::1', '2026-02-25 12:46:05'),
(48, 11, 'admin_video_status', 'video', 22, 'validated', '::1', '2026-02-25 12:46:06'),
(49, 11, 'admin_video_status', 'video', 26, 'validated', '::1', '2026-02-25 12:46:07'),
(50, 11, 'admin_video_status', 'video', 27, 'validated', '::1', '2026-02-25 12:46:08'),
(51, NULL, 'video_submit', 'video', 28, 'Hello World 7', '::1', '2026-02-25 12:49:13'),
(52, NULL, 'video_submit', 'video', 29, 'Hello World 8', '::1', '2026-02-25 12:51:06'),
(53, NULL, 'video_submit', 'video', 30, 'Breaking', '::1', '2026-02-25 12:53:55'),
(54, NULL, 'video_submit', 'video', 31, 'Dominik', '::1', '2026-02-25 13:00:40'),
(55, NULL, 'video_submit', 'video', 32, 'Jasper', '::1', '2026-02-25 13:02:29'),
(56, NULL, 'video_submit', 'video', 33, 'Candide Thovex', '::1', '2026-02-25 13:04:40'),
(57, NULL, 'video_submit', 'video', 34, 'Hello World 10', '::1', '2026-02-25 13:06:10'),
(58, NULL, 'video_submit', 'video', 35, 'Hello World 11', '::1', '2026-02-25 13:08:17'),
(59, NULL, 'video_submit', 'video', 36, 'Hello World', '::1', '2026-02-25 13:12:25'),
(60, 11, 'login', 'user', 11, 'super@admin.com', '::1', '2026-02-26 09:16:03'),
(61, NULL, 'video_submit', 'video', 37, 'jdznjdjn', '::1', '2026-02-26 13:57:10'),
(62, 11, 'login', 'user', 11, 'super@admin.com', '::1', '2026-02-27 13:38:03');

-- --------------------------------------------------------

--
-- Structure de la table `admin_video`
--

CREATE TABLE `admin_video` (
  `id` int UNSIGNED NOT NULL,
  `video_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Admin qui a modéré',
  `statut` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'draft | pending | validated | rejected | banned',
  `comment` text COLLATE utf8mb4_unicode_ci COMMENT 'Commentaire admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admin_video`
--

INSERT INTO `admin_video` (`id`, `video_id`, `user_id`, `statut`, `comment`, `created_at`, `updated_at`) VALUES
(13, 25, 11, 'validated', NULL, '2026-02-25 12:34:15', '2026-02-25 12:34:15'),
(14, 24, 11, 'validated', NULL, '2026-02-25 12:34:16', '2026-02-25 12:46:04'),
(15, 23, 11, 'validated', NULL, '2026-02-25 12:34:17', '2026-02-25 12:46:05'),
(16, 22, 11, 'validated', NULL, '2026-02-25 12:34:17', '2026-02-25 12:46:06'),
(23, 26, 11, 'validated', NULL, '2026-02-25 12:46:07', '2026-02-25 12:46:07'),
(24, 27, 11, 'validated', NULL, '2026-02-25 12:46:08', '2026-02-25 12:46:08');

-- --------------------------------------------------------

--
-- Structure de la table `assignation`
--

CREATE TABLE `assignation` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Admin ou sélectionneur assigné',
  `video_id` int UNSIGNED NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `award`
--

CREATE TABLE `award` (
  `id` int UNSIGNED NOT NULL,
  `titre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Image du prix',
  `rank` tinyint UNSIGNED DEFAULT NULL COMMENT 'Ordre d''affichage',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int UNSIGNED NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fingerprint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banned_until` datetime DEFAULT NULL COMMENT 'NULL = ban permanent',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Structure de la table `contributor`
--

CREATE TABLE `contributor` (
  `id` int UNSIGNED NOT NULL,
  `video_id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `production_role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Réalisateur, Scénariste, Monteur...'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` datetime NOT NULL,
  `duration` smallint UNSIGNED DEFAULT NULL COMMENT 'Durée en minutes',
  `stock` smallint UNSIGNED DEFAULT NULL COMMENT 'Capacité max',
  `illustration` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL image',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`id`, `title`, `description`, `date`, `duration`, `stock`, `illustration`, `location`, `created_by`, `created_at`) VALUES
(2, 'Conference Sam Altman', NULL, '2026-04-22 09:48:00', 90, 300, NULL, 'Salle Blanche', 11, '2026-02-25 08:49:32'),
(3, 'Workshop Gemini 3.1', 'Approfondir sa créativité grace au dernier model de Google', '2026-04-23 09:49:00', 120, 50, NULL, 'Salle Rouge', 11, '2026-02-25 08:51:48');

-- --------------------------------------------------------

--
-- Structure de la table `jury`
--

CREATE TABLE `jury` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `illustration` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Photo',
  `biographie` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `jury`
--

INSERT INTO `jury` (`id`, `name`, `lastname`, `illustration`, `biographie`, `created_at`) VALUES
(1, 'Spielberg', 'Steven', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Réalisateur américain légendaire, pionnier du cinéma moderne et de la science-fiction. Connu pour E.T., Jurassic Park et La Liste de Schindler.', '2026-01-28 09:59:05'),
(2, 'Nolan', 'Christopher', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Maître du cinéma contemporain, réputé pour ses structures narratives complexes et ses explorations du temps. Inception, Interstellar, Oppenheimer.', '2026-01-28 09:59:05'),
(3, 'Villeneuve', 'Denis', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Cinéaste canadien visionnaire, spécialiste de la science-fiction atmosphérique. Blade Runner 2049, Arrival, Dune.', '2026-01-28 09:59:05'),
(4, 'Anderson', 'Wes', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'Réalisateur américain reconnu pour son style visuel unique et symétrique. The Grand Budapest Hotel, Moonrise Kingdom, The French Dispatch.', '2026-01-28 09:59:05'),
(5, 'Gerwig', 'Greta', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Cinéaste américaine, figure emblématique du cinéma indépendant moderne. Lady Bird, Little Women, Barbie.', '2026-01-28 09:59:05');

-- --------------------------------------------------------

--
-- Structure de la table `newsletter`
--

CREATE TABLE `newsletter` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `newsletter`
--

INSERT INTO `newsletter` (`id`, `email`, `subscribed_at`, `unsubscribed_at`) VALUES
(2, 'test2-1769679340866@example.com', '2026-01-29 09:35:41', NULL),
(4, 'unsub-1769679340867@example.com', '2026-01-29 09:35:44', '2026-01-29 09:35:45'),
(7, 'test2-1769679372036@example.com', '2026-01-29 09:36:13', NULL),
(9, 'unsub-1769679372037@example.com', '2026-01-29 09:36:16', '2026-01-29 09:36:16'),
(12, 'test2-1769679396216@example.com', '2026-01-29 09:36:37', NULL),
(15, 'unsub-1769679396217@example.com', '2026-01-29 09:36:41', '2026-01-29 09:36:42'),
(19, 'williampeynichou@gmail.com', '2026-01-29 10:36:32', NULL),
(21, 'peterse.muel@laplateforme.io', '2026-01-29 12:30:55', NULL),
(22, 'yusuf33170@gmail.com', '2026-01-29 12:31:13', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `new_post`
--

CREATE TABLE `new_post` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id` int UNSIGNED NOT NULL,
  `event_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL COMMENT 'Null si réservation sans compte',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `qrcode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'pending | confirmed | cancelled | attended',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `selector_memo`
--

CREATE TABLE `selector_memo` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Le sélectionneur/jury',
  `video_id` int UNSIGNED NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL COMMENT 'Note 1-10',
  `statut` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'liked | rejected | discuss',
  `playlist` tinyint(1) DEFAULT '0' COMMENT '0=non, 1=oui',
  `comment` text COLLATE utf8mb4_unicode_ci COMMENT 'Commentaire privé',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `selector_memo`
--

INSERT INTO `selector_memo` (`id`, `user_id`, `video_id`, `rating`, `statut`, `playlist`, `comment`, `created_at`, `updated_at`) VALUES
(93, 11, 23, 10.0, 'yes', 0, 'a voir avec les collégues', '2026-02-25 12:31:27', '2026-02-25 12:33:55'),
(96, 11, 22, 7.0, 'discuss', 1, 'a voir avec les collégues', '2026-02-25 12:31:53', '2026-02-25 12:31:55'),
(99, 11, 24, 10.0, 'yes', 0, '', '2026-02-25 12:33:27', '2026-02-25 12:33:27'),
(101, 11, 25, NULL, 'discuss', 1, '', '2026-02-25 12:33:33', '2026-02-25 12:33:33'),
(103, 11, 26, NULL, 'discuss', 1, '', '2026-02-25 12:40:34', '2026-02-25 12:40:34'),
(104, 11, 27, 10.0, 'yes', 0, '', '2026-02-25 12:44:12', '2026-02-25 12:44:12'),
(106, 11, 33, NULL, 'discuss', 1, '', '2026-02-25 13:13:30', '2026-02-25 13:13:30'),
(107, 11, 32, 10.0, 'yes', 0, 'Super !', '2026-02-25 13:13:43', '2026-02-25 13:13:43'),
(109, 11, 31, NULL, 'no', 0, '', '2026-02-25 13:13:52', '2026-02-25 13:13:52'),
(110, 11, 30, 10.0, 'yes', 0, '', '2026-02-26 09:17:10', '2026-02-26 09:17:10'),
(112, 11, 29, NULL, 'discuss', 1, 'a discuter, je voudrais que ca soit plus court', '2026-02-26 09:17:13', '2026-02-26 09:17:31'),
(114, 11, 28, NULL, 'no', 0, '', '2026-02-26 09:17:35', '2026-02-26 09:17:35'),
(115, 11, 34, NULL, 'discuss', 1, '', '2026-02-26 13:58:33', '2026-02-26 13:58:33');

-- --------------------------------------------------------

--
-- Structure de la table `social_media`
--

CREATE TABLE `social_media` (
  `id` int UNSIGNED NOT NULL,
  `platform` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'instagram | facebook | linkedin | tiktok | youtube | website | x',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `social_media`
--

INSERT INTO `social_media` (`id`, `platform`, `url`) VALUES
(1, 'instagram', 'https://www.instagram.com/'),
(2, 'instagram', 'https://www.instagram.com/');

-- --------------------------------------------------------

--
-- Structure de la table `sponsor`
--

CREATE TABLE `sponsor` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Logo URL',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien site',
  `sort_order` smallint UNSIGNED DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `award_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `still`
--

CREATE TABLE `still` (
  `id` int UNSIGNED NOT NULL,
  `video_id` int UNSIGNED NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` tinyint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `still`
--

INSERT INTO `still` (`id`, `video_id`, `file_name`, `file_url`, `sort_order`) VALUES
(42, 22, '1772020350033.png', '/uploads/stills/1772020350033.png', 1),
(43, 22, '1772020350043.png', '/uploads/stills/1772020350043.png', 2),
(44, 25, '1772021104257.jpg', '/uploads/stills/1772021104257.jpg', 1),
(45, 27, '1772023436331.png', '/uploads/stills/1772023436331.png', 1),
(46, 27, '1772023436336.png', '/uploads/stills/1772023436336.png', 2),
(47, 27, '1772023436337.png', '/uploads/stills/1772023436337.png', 3),
(48, 31, '1772024439606.png', '/uploads/stills/1772024439606.png', 1),
(49, 35, '1772024897337.jpeg', '/uploads/stills/1772024897337.jpeg', 1),
(50, 35, '1772024897339.jpg', '/uploads/stills/1772024897339.jpg', 2),
(51, 35, '1772024897339.jpg', '/uploads/stills/1772024897339.jpg', 3),
(52, 36, '1772025145161.jpg', '/uploads/stills/1772025145161.jpg', 1),
(53, 36, '1772025145165.jpg', '/uploads/stills/1772025145165.jpg', 2),
(54, 36, '1772025145167.jpg', '/uploads/stills/1772025145167.jpg', 3),
(55, 37, '1772114229790.png', '/uploads/stills/1772114229790.png', 1);

-- --------------------------------------------------------

--
-- Structure de la table `tag`
--

CREATE TABLE `tag` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tag`
--

INSERT INTO `tag` (`id`, `name`) VALUES
(27, 'afa'),
(13, 'aiozbfaziub'),
(24, 'akjb'),
(14, 'akzdjbna'),
(23, 'amcjn'),
(20, 'amefl,nzefml'),
(22, 'ameichjap$'),
(18, 'amklznf'),
(25, 'amlken'),
(26, 'an'),
(4, 'apple'),
(38, 'atelier'),
(8, 'balle'),
(9, 'bulle'),
(42, 'ca'),
(1, 'caca'),
(44, 'candide'),
(7, 'chatgpt'),
(55, 'claude'),
(10, 'codex 5.3'),
(40, 'darwin'),
(59, 'deepseek'),
(43, 'dide'),
(28, 'ekfn'),
(48, 'freekick'),
(41, 'full-ia'),
(5, 'gemini'),
(35, 'kjzdbv'),
(12, 'kzjdnbiadjzn'),
(39, 'la-plateforme'),
(21, 'lciha'),
(11, 'le pute'),
(47, 'liverpool'),
(19, 'mzfel,zemfl,`'),
(30, 'openai'),
(58, 'perplexity'),
(2, 'pipi'),
(3, 'popo'),
(6, 'siri'),
(60, 'sonnet'),
(45, 'tata'),
(29, 'toto'),
(37, 'wow'),
(15, 'z:ekfbnzef'),
(33, 'zdk'),
(34, 'zkjd'),
(16, 'zùemf,z'),
(17, 'zùlef,z');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT 'superadmin | admin | jury | realisateur | user',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `login_attempts` int DEFAULT '0',
  `lock_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password_hash`, `role`, `name`, `lastname`, `last_login_at`, `created_at`, `updated_at`, `login_attempts`, `lock_until`) VALUES
(1, 'admin@marsia.fr', '$2b$10$EXAMPLE_HASH', 'superadmin', 'Admin', 'MarsIA', NULL, '2026-01-27 15:34:44', '2026-01-27 15:34:44', 0, NULL),
(2, 'realisateur.test@marsai.com', NULL, 'realisateur', 'Test', 'Realisateur', NULL, '2026-01-30 13:13:57', '2026-01-30 13:13:57', 0, NULL),
(8, 'williampeynichou@gmail.com', '$2b$10$qIDKRp0vEoWz.xJF9fHtZeLVfi2ZhOcCvLFthAdxEYED0m0ZUeePa', 'user', 'William', 'Peynichou', NULL, '2026-02-02 10:31:40', '2026-02-02 10:31:40', 0, NULL),
(9, 'william@peynichou.com', '$2b$10$W/PlJp1ue2Wil6NEwwJKYuMC30mGTi5DFcuTrW.ORTK56/2Uv8tiG', 'jury', 'William', 'Peynichou', NULL, '2026-02-09 12:51:42', '2026-02-12 15:11:50', 0, NULL),
(10, 'admin@admin.com', '$2b$10$skGCS5cAnvfrE3zebk.IruL5b/rmi4w.D9lrGj3T.KTKIU0GJDOuG', 'admin', 'William', 'Peynichou', NULL, '2026-02-12 15:08:10', '2026-02-12 15:42:02', 0, NULL),
(11, 'super@admin.com', '$2b$10$Z0YgFsKim9v7lRxhGS93XOJGOyrNnCyIO.GF5Jux9shwHXFF6fFoi', 'superadmin', 'Super', 'Admin', NULL, '2026-02-16 09:28:29', '2026-02-16 09:29:01', 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `video`
--

CREATE TABLE `video` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL COMMENT 'Sélecteur assigné (NULL si non assigné)',
  `youtube_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srt_file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Fichier sous-titres',
  `cover` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL affiche',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_en` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `synopsis` text COLLATE utf8mb4_unicode_ci,
  `synopsis_en` text COLLATE utf8mb4_unicode_ci,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` smallint UNSIGNED DEFAULT NULL COMMENT 'Durée en secondes',
  `classification` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'hybrid' COMMENT 'ia | hybrid',
  `tech_resume` text COLLATE utf8mb4_unicode_ci COMMENT 'Résumé technique / outils IA',
  `creative_resume` text COLLATE utf8mb4_unicode_ci COMMENT 'Résumé créatif / méthodologie',
  `realisator_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realisator_lastname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realisator_gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fixe_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acquisition_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Comment a connu le festival',
  `rights_accepted` tinyint(1) DEFAULT '0' COMMENT 'Checkbox cession droits',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `birthday` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Utilisateur déclare être majeur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `video`
--

INSERT INTO `video` (`id`, `user_id`, `youtube_url`, `video_file_name`, `srt_file_name`, `cover`, `title`, `title_en`, `synopsis`, `synopsis_en`, `language`, `country`, `duration`, `classification`, `tech_resume`, `creative_resume`, `realisator_name`, `realisator_lastname`, `realisator_gender`, `email`, `mobile_number`, `fixe_number`, `address`, `acquisition_source`, `rights_accepted`, `created_at`, `updated_at`, `birthday`) VALUES
(22, NULL, NULL, '1772020349443.mov', NULL, '1772020349994.JPG', 'Alysa Liu Gala JO 2026', 'Alysa Liu Gala JO 2026', 'Gold Olympic Skating medalist performing on milan ice', 'Gold Olympic Skating medalist performing on milan ice', 'French', 'France', 28, 'ia', 'AI Tools make DA', 'Toto tata tata', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 Rue Prunier, Bordeaux, 33100, France', 'search_engine', 1, '2026-02-25 11:52:30', '2026-02-25 11:52:30', 1),
(23, NULL, NULL, '1772020693649.mov', NULL, '1772020693950.JPG', 'Jasper', 'Jasper', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'French', 'France', 19, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Jules', 'Daudin', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '157 Cours de la Somme, Appartement 3, bORDEAUX, 33800, France', 'search_engine', 1, '2026-02-25 11:58:14', '2026-02-25 11:58:14', 1),
(24, NULL, NULL, '1772020858725.mov', NULL, '1772020859456.png', 'Toto', 'Toto', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'French', 'France', 51, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Yusuf', 'Buyu', 'women', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '157 Cours de la Somme, Appartement 3, bORDEAUX, 33800, France', 'word_of_mouth', 1, '2026-02-25 12:01:00', '2026-02-25 12:01:00', 1),
(25, NULL, NULL, '1772021103457.mov', NULL, '1772021104254.png', '', 'Dominik Free Kick', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Hungary', 'France', 49, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:05:04', '2026-02-25 12:05:04', 1),
(26, NULL, NULL, '1772023209523.mov', NULL, '1772023210280.png', 'Hello World', 'Hello World', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 28, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:40:12', '2026-02-25 12:40:12', 1),
(27, NULL, NULL, '1772023435784.mov', NULL, '1772023436329.png', 'Hello World 3', 'Hello World 3', 'qofiphazofiehaeziofh apifhafiha', 'qoufhaeofhaofhea qoizhfaoizfhaizo', 'French', 'France', 28, 'ia', 'ChatGPT with Gemini', 'ChatGPT with Gemini', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:43:56', '2026-02-25 12:43:56', 1),
(28, NULL, NULL, '1772023752300.mov', NULL, '1772023753365.png', 'Hello World 7', 'Hello World 6', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'Andorra', 51, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+376977979', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:49:13', '2026-02-25 12:49:13', 1),
(29, NULL, NULL, '1772023865461.mov', NULL, '1772023866058.png', 'Hello World 8', 'Hello World 8', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 34, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:51:06', '2026-02-25 12:51:06', 1),
(30, NULL, NULL, '1772024034590.mov', NULL, '1772024035149.png', 'Breaking', 'Breaking', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 32, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 12:53:55', '2026-02-25 12:53:55', 1),
(31, NULL, NULL, '1772024438679.mov', NULL, '1772024439604.jpeg', 'Dominik', 'Dominik', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 49, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampro1711@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:00:39', '2026-02-25 13:00:39', 1),
(32, NULL, NULL, '1772024547680.mov', NULL, '1772024548352.jpg', 'Jasper', 'Jasper', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Swedish', 'France', 19, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:02:29', '2026-02-25 13:02:29', 1),
(33, NULL, NULL, '1772024679620.mov', NULL, '1772024680240.jpg', 'Candide Thovex', 'Candide', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 32, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'women', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:04:40', '2026-02-25 13:04:40', 1),
(34, NULL, NULL, '1772024769873.mov', NULL, '1772024770478.jpg', 'Hello World 10', 'Hello World 10', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 34, 'hybrid', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:06:10', '2026-02-25 13:06:10', 1),
(35, NULL, NULL, '1772024896750.mov', NULL, '1772024897334.jpg', 'Hello World 11', 'Hello World 11', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 28, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:08:17', '2026-02-25 13:08:17', 1),
(36, NULL, NULL, '1772025143912.mov', NULL, '1772025145155.jpeg', 'Hello World', 'Hello World', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'French', 'France', 49, 'ia', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 Rue Prunier, Bordeaux, 33100, France', 'word_of_mouth', 1, '2026-02-25 13:12:25', '2026-02-25 13:12:25', 1),
(37, NULL, NULL, '1772114229645.mov', NULL, '1772114229784.png', 'jdznjdjn', 'annglais jdjdj', 'fjqnsfnqzjnjfnqjzf', 'lorem lorem oreml', 'French', 'France', 46, 'ia', 'chatgpt zijjiz', 'je l\'ai utilise cm ca la', 'William', 'hbbhbhb', 'man', 'yusuf@yusuf.com', '+33659257240', '+33659257240', '50 rue prunier, Appt 3, Bordeaux, Gironde, 33100, France', 'social_networks:tiktok', 1, '2026-02-26 13:57:10', '2026-02-26 13:57:10', 1);

-- --------------------------------------------------------

--
-- Structure de la table `video_award`
--

CREATE TABLE `video_award` (
  `video_id` int UNSIGNED NOT NULL,
  `award_id` int UNSIGNED NOT NULL,
  `year` smallint UNSIGNED DEFAULT NULL COMMENT 'Année d''attribution'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `video_social_media`
--

CREATE TABLE `video_social_media` (
  `video_id` int UNSIGNED NOT NULL,
  `social_media_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `video_tag`
--

CREATE TABLE `video_tag` (
  `video_id` int UNSIGNED NOT NULL,
  `tag_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `video_tag`
--

INSERT INTO `video_tag` (`video_id`, `tag_id`) VALUES
(26, 5),
(27, 5),
(28, 5),
(30, 5),
(35, 5),
(36, 5),
(26, 7),
(30, 7),
(36, 7),
(37, 7),
(24, 29),
(27, 30),
(28, 30),
(22, 41),
(23, 42),
(23, 43),
(23, 44),
(24, 45),
(25, 47),
(25, 48),
(29, 55),
(36, 55),
(31, 58),
(32, 59),
(35, 59),
(36, 59),
(33, 60);

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
-- Index pour la table `admin_video`
--
ALTER TABLE `admin_video`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `video_id` (`video_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `fk_admin_video_user` (`user_id`);

--
-- Index pour la table `assignation`
--
ALTER TABLE `assignation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_video` (`user_id`,`video_id`),
  ADD KEY `idx_video_id` (`video_id`);

--
-- Index pour la table `award`
--
ALTER TABLE `award`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip` (`ip`);

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
-- Index pour la table `contributor`
--
ALTER TABLE `contributor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_email` (`email`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_created_by` (`created_by`);

--
-- Index pour la table `jury`
--
ALTER TABLE `jury`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Index pour la table `new_post`
--
ALTER TABLE `new_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_published_at` (`published_at`),
  ADD KEY `fk_new_post_created_by` (`created_by`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qrcode` (`qrcode`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_qrcode` (`qrcode`);

--
-- Index pour la table `selector_memo`
--
ALTER TABLE `selector_memo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_video` (`user_id`,`video_id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_playlist` (`playlist`),
  ADD KEY `idx_rating` (`rating`);

--
-- Index pour la table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_platform` (`platform`);

--
-- Index pour la table `sponsor`
--
ALTER TABLE `sponsor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_sponsor_award_id` (`award_id`);

--
-- Index pour la table `still`
--
ALTER TABLE `still`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_id` (`video_id`);

--
-- Index pour la table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Index pour la table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_classification` (`classification`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Index pour la table `video_award`
--
ALTER TABLE `video_award`
  ADD PRIMARY KEY (`video_id`,`award_id`),
  ADD KEY `fk_video_award_award` (`award_id`);

--
-- Index pour la table `video_social_media`
--
ALTER TABLE `video_social_media`
  ADD PRIMARY KEY (`video_id`,`social_media_id`),
  ADD KEY `fk_video_social_media` (`social_media_id`);

--
-- Index pour la table `video_tag`
--
ALTER TABLE `video_tag`
  ADD PRIMARY KEY (`video_id`,`tag_id`),
  ADD KEY `fk_video_tag_tag` (`tag_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT pour la table `admin_video`
--
ALTER TABLE `admin_video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `assignation`
--
ALTER TABLE `assignation`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `award`
--
ALTER TABLE `award`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cms_section`
--
ALTER TABLE `cms_section`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `contributor`
--
ALTER TABLE `contributor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `jury`
--
ALTER TABLE `jury`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `new_post`
--
ALTER TABLE `new_post`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `selector_memo`
--
ALTER TABLE `selector_memo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT pour la table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `sponsor`
--
ALTER TABLE `sponsor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `still`
--
ALTER TABLE `still`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT pour la table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `video`
--
ALTER TABLE `video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `fk_activity_log_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `admin_video`
--
ALTER TABLE `admin_video`
  ADD CONSTRAINT `fk_admin_video_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_admin_video_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `assignation`
--
ALTER TABLE `assignation`
  ADD CONSTRAINT `fk_assignation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignation_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `cms_section`
--
ALTER TABLE `cms_section`
  ADD CONSTRAINT `fk_cms_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `contributor`
--
ALTER TABLE `contributor`
  ADD CONSTRAINT `fk_contributor_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `new_post`
--
ALTER TABLE `new_post`
  ADD CONSTRAINT `fk_new_post_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_reservation_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `selector_memo`
--
ALTER TABLE `selector_memo`
  ADD CONSTRAINT `fk_selector_memo_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_selector_memo_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sponsor`
--
ALTER TABLE `sponsor`
  ADD CONSTRAINT `fk_sponsor_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `still`
--
ALTER TABLE `still`
  ADD CONSTRAINT `fk_still_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `fk_video_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `video_award`
--
ALTER TABLE `video_award`
  ADD CONSTRAINT `fk_video_award_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_award_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `video_social_media`
--
ALTER TABLE `video_social_media`
  ADD CONSTRAINT `fk_video_social_media` FOREIGN KEY (`social_media_id`) REFERENCES `social_media` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_social_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `video_tag`
--
ALTER TABLE `video_tag`
  ADD CONSTRAINT `fk_video_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_tag_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
