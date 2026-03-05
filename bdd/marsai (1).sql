-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : lun. 23 fév. 2026 à 15:31
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
(1, NULL, 'video_submit', 'video', 20, 'cucu', '::1', '2026-02-20 10:19:16');

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

--
-- Déchargement des données de la table `contributor`
--

INSERT INTO `contributor` (`id`, `video_id`, `name`, `last_name`, `gender`, `email`, `production_role`) VALUES
(1, 18, 'William', 'Peynichou', 'women', 'williampeynichou@gmail.com', 'DVZUD'),
(2, 19, 'William', 'Peynichou', 'women', 'williampeynichou@gmail.com', 'jefizelug'),
(3, 19, 'William', 'Peynichou', 'women', 'zizi@zizi.com', 'zkJDGA');

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
(1, 'Bite', 'bite bite v', '2026-01-31 16:16:00', 878, 8686, '', 'Cul', 11, '2026-02-19 15:16:20');

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
(1, 1, 1, 10.0, 'discuss', 0, 'ca j\'aime bien\n', '2026-01-30 15:26:50', '2026-02-09 12:53:57'),
(25, 9, 2, 8.0, NULL, 0, NULL, '2026-02-09 14:52:21', '2026-02-09 14:52:23'),
(27, 9, 4, NULL, 'discuss', 0, '', '2026-02-09 14:52:41', '2026-02-09 14:52:41'),
(28, 9, 1, 7.0, 'discuss', 0, '', '2026-02-09 15:22:08', '2026-02-09 15:43:23'),
(37, 9, 6, 9.0, 'yes', 0, '', '2026-02-10 10:49:41', '2026-02-10 10:49:41'),
(39, 9, 5, NULL, 'no', 0, 'hjfuiktdtuiyfk', '2026-02-10 10:49:48', '2026-02-10 10:49:48'),
(40, 9, 3, NULL, 'no', 0, '', '2026-02-10 10:49:52', '2026-02-10 10:49:52'),
(41, 9, 8, 10.0, 'yes', 0, 'mhhh la jaime bien je vais dire aux autres que c yusuf qui meurt a la fin', '2026-02-10 13:07:01', '2026-02-10 13:07:06'),
(44, 9, 10, 9.0, 'yes', 0, '', '2026-02-10 13:56:18', '2026-02-10 13:56:18'),
(51, 9, 7, NULL, 'discuss', 1, '', '2026-02-10 15:07:05', '2026-02-10 15:09:27'),
(68, 10, 7, 8.0, 'yes', 0, '', '2026-02-13 13:31:32', '2026-02-13 13:31:32'),
(70, 10, 6, NULL, 'discuss', 1, '', '2026-02-13 13:33:32', '2026-02-13 13:33:37'),
(72, 10, 4, 6.0, 'yes', 0, '', '2026-02-13 13:47:45', '2026-02-13 13:47:45'),
(74, 10, 3, NULL, 'no', 0, '', '2026-02-13 13:47:53', '2026-02-13 13:47:53'),
(75, 10, 2, NULL, 'discuss', 1, '', '2026-02-13 13:47:57', '2026-02-13 13:47:57'),
(76, 11, 7, 7.0, 'yes', 0, 'jhgfckjgfjkhggfxjkhg', '2026-02-16 10:15:38', '2026-02-16 10:16:31'),
(88, 11, 5, 9.0, 'yes', 0, '', '2026-02-16 10:17:17', '2026-02-16 10:17:18'),
(90, 11, 3, NULL, 'discuss', 1, '', '2026-02-16 10:39:58', '2026-02-16 10:39:58'),
(91, 11, 6, NULL, 'discuss', 1, '', '2026-02-16 13:20:40', '2026-02-16 13:20:40'),
(92, 11, 4, NULL, 'no', 0, '', '2026-02-16 13:33:46', '2026-02-16 13:33:46');

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
  `is_visible` tinyint(1) NOT NULL DEFAULT '1'
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
(1, 4, 'still_1770386724232_6kh2lc.png', NULL, 0),
(2, 4, 'still_1770386724245_cqmnqj.png', NULL, 1),
(3, 4, 'still_1770386724251_nb7fnm.png', NULL, 2),
(4, 5, 'still_1770388119257_usymoy.png', NULL, 0),
(5, 5, 'still_1770388119258_7g4yv3.png', NULL, 1),
(6, 5, 'still_1770388119259_lpk3bf.png', NULL, 2),
(7, 6, 'still_1770390018966_impyqs.jpg', NULL, 0),
(8, 6, 'still_1770390018994_jhxe7b.jpg', NULL, 1),
(9, 6, 'still_1770390019024_da6btq.jpeg', NULL, 2),
(10, 7, 'still_1770391154740_bdh3zy.jpg', NULL, 0),
(11, 7, 'still_1770391154766_o9e67w.jpg', NULL, 1),
(12, 7, 'still_1770391154788_noi2lb.jpeg', NULL, 2),
(34, 18, '1771506389443.png', '/uploads/stills/1771506389443.png', 1),
(35, 18, '1771506389446.png', '/uploads/stills/1771506389446.png', 2),
(36, 18, '1771506389452.png', '/uploads/stills/1771506389452.png', 3),
(37, 19, '1771516232272.png', '/uploads/stills/1771516232272.png', 1),
(38, 20, '1771582750077.png', '/uploads/stills/1771582750077.png', 1);

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
(8, 'balle'),
(9, 'bulle'),
(1, 'caca'),
(7, 'chatgpt'),
(10, 'codex 5.3'),
(28, 'ekfn'),
(5, 'gemini'),
(35, 'kjzdbv'),
(12, 'kzjdnbiadjzn'),
(21, 'lciha'),
(11, 'le pute'),
(19, 'mzfel,zemfl,`'),
(30, 'openai'),
(2, 'pipi'),
(3, 'popo'),
(6, 'siri'),
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
(1, 2, NULL, 'Enregistrement de l’écran 2026-01-30 à 16.14.54.mov', NULL, NULL, 'Film Test - Player', 'Test Film - Player', 'Video locale pour tester le player, rating et memo.', 'Local video to test player, rating and memo.', 'fr', 'France', 120, 'hybrid', 'Montage simple, fichier local .mov', 'Test technique pour le player', 'Test', 'Realisateur', 'male', 'realisateur.test@marsai.com', '0600000000', NULL, 'Paris', 'Seed manuel', 1, '2026-01-30 15:20:06', '2026-02-19 13:04:59', 1),
(2, NULL, NULL, 'video_1770384076528_us19sn.mp4', NULL, 'cover_1770384076531_zjvxqz.png', 'qlqsifh', 'lbqojqb', 'kqjsbcqjkbcs', 'kkjqsbjkbc', 'q;, ack', 'lqs cqlcs', 989, 'hybrid', 'AZOFHACOZ', 'KCKQSCVASICV', 'William', 'Peynichou', 'prefer-not', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', NULL, 1, '2026-02-06 13:21:16', '2026-02-06 13:21:16', 0),
(3, NULL, 'https://www.youtube.com/watch?v=WXqsq5wo3Rw', 'video_1770386301240_bnawyp.mp4', NULL, 'cover_1770386301243_fas1bn.png', 'ckbscbksB k', 'kjvjkvkjvuiv', 'ikv ikuviu', 'ivhvhkvhvh', 'kjvjkv kj', 'vkjvkjvjkv', 90, 'hybrid', 'lkjjgvougougvuogvui', 'iuvuoivuiovuiv', 'William', 'Peynichou', 'male', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', 'c yusuf il ma dit', 1, '2026-02-06 13:58:21', '2026-02-19 13:04:59', 1),
(4, NULL, 'https://www.youtube.com/watch?v=WXqsq5wo3Rw', 'video_1770386724227_a5rsqw.mp4', NULL, 'cover_1770386724229_t1ervd.png', 'xwlkvnwlks', 'lknqlknlkn', 'kmlnklmbnmklbn', 'mlkbnkmlbn', ';, blkb', 'lkblkblkb', 76, 'hybrid', 'lkjbsljkcbqljsb', 'LKJBCSJLKBSLJSB', 'William', 'Peynichou', 'female', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', NULL, 1, '2026-02-06 14:05:24', '2026-02-19 13:04:59', 1),
(5, NULL, 'https://www.youtube.com/watch?v=WXqsq5wo3Rw', 'video_1770388119071_urjfvu.mov', NULL, 'cover_1770388119247_gu9wzl.jpg', 'slkbqnsclkqncs', 'lkblblkblblblb', 'scoiqhdgsvohOPzhefezohifeozihoehoeh', 'zoefhbzosifhaoibchaocuhbaocuabcouabo', 'oefihzaofebh', 'jhiviubvuivbiuv', 60, 'hybrid', 'azfbaiouzfbazuiofbazuiofbaziufba', 'afiobhaziohzaofhbaoibfaouifabzoiaufbaoiub', 'William', 'Peynichou', 'other', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', NULL, 1, '2026-02-06 14:28:39', '2026-02-19 13:04:59', 1),
(6, NULL, 'https://www.youtube.com/watch?v=GDv8Iei3h4Y', 'video_1770390018945_rcq0m1.mp4', NULL, 'cover_1770390018949_xqkwh2.png', 'lghbzoeibzeo', 'klbolboibo', 'olbouboubouiboi', 'obiiobooibob', 'lboibiobiob', 'obiiobiobob', 98, 'hybrid', 'lhiohohoàihniohniohbn', 'oihoihoihoihoih', 'William', 'Peynichou', 'male', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', NULL, 1, '2026-02-06 15:00:19', '2026-02-06 15:00:19', 0),
(7, NULL, 'https://www.youtube.com/watch?v=GDv8Iei3h4Y', 'video_1770391154724_4vcda3.mp4', NULL, 'cover_1770391154728_89bp68.png', 'scobqiqbcsiu', 'iubuibuob', 'oubgoubooubou', 'ouboubuobolbn', 'obhobuoib', 'ioubuoiboib', 99, 'hybrid', ';, bj jkbjkbkb', 'bouboiuboui', 'William', 'Peynichou', 'prefer-not', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', NULL, 1, '2026-02-06 15:19:14', '2026-02-06 15:19:14', 0),
(8, NULL, 'https://www.youtube.com/watch?v=leYJBhat7zw', 'video_1770728414168_g79fq1.mp4', NULL, NULL, 'Detective', 'Detective', 'With an equivalent 200 mm focal length, the 8x optical-quality zoom makes this our longest iPhone Telephoto ever. So you can get dramatically closer with iPhone 17 Pro.', 'With an equivalent 200 mm focal length, the 8x optical-quality zoom makes this our longest iPhone Telephoto ever. So you can get dramatically closer with iPhone 17 Pro.', 'English', 'England', 60, 'ia', 'With an equivalent 200 mm focal length, the 8x optical-quality zoom makes this our longest iPhone Telephoto ever. So you can get dramatically closer with iPhone 17 Pro.', 'With an equivalent 200 mm focal length, the 8x optical-quality zoom makes this our longest iPhone Telephoto ever. So you can get dramatically closer with iPhone 17 Pro.', 'William', 'Peynichou', 'male', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', 'zizi', 1, '2026-02-10 13:00:14', '2026-02-20 09:44:30', 1),
(10, NULL, 'https://www.youtube.com/watch?v=bLVKTbxPmcg', 'video_1770728729918_2umnm1.mov', NULL, NULL, 'Je tue yusuf a la fin', 'Killing Time', 'Je tue yusuf a la fin', 'I kill mfs yusuf', 'French', 'France', 60, 'hybrid', 'oaziefhpéegoéeçpugzeiugzeugiulg', 'oiqhegfiuzghziugrhzieugzieupghzeiughzeu', 'William', 'Peynichou', 'male', 'williampeynichou@gmail.com', '+33659257240', NULL, '50 rue prunier', 'c yusuf il ma dit c pour ca j\'ai tuer lui', 1, '2026-02-10 13:05:29', '2026-02-20 09:44:30', 1),
(18, NULL, 'https://youtu.be/JfHKdT-QCAU', '1771506388928.mp4', NULL, '1771506389439.png', 'tata en la playa', 'Toto a la plage', 'Marty Mauser, 23 ans, aspire à devenir le meilleur athlète sur la scène mondiale du tennis de table. Le sport est sous-représenté aux États-Unis, ce qui rend difficile le financement de ses compétitions à l\'étranger. Il est toutefois prêt à tout pour arriver à ses fins, y compris nouer des liens avec une ancienne actrice et son riche mari entrepreneur. Son entêtement pose un problème pour les personnes de son entourage, qui font souvent les frais de ses choix cavaliers.', 'Marty Mauser, 23 ans, aspire à devenir le meilleur athlète sur la scène mondiale du tennis de table. Le sport est sous-représenté aux États-Unis, ce qui rend difficile le financement de ses compétitions à l\'étranger. Il est toutefois prêt à tout pour arriver à ses fins, y compris nouer des liens avec une ancienne actrice et son riche mari entrepreneur. Son entêtement pose un problème pour les personnes de son entourage, qui font souvent les frais de ses choix cavaliers.', 'French', 'France', 35, 'hybrid', 'ChatGPT, Codex, Gemini', 'bliblibliabbaba', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 rue prunier, Appt 3, Bordeaux, Gironde, 33100, France', 'search_engine', 1, '2026-02-19 13:06:34', '2026-02-19 13:06:34', 1),
(19, NULL, 'https://youtu.be/enBbvfUxmL8', '1771516232238.mov', NULL, '1771516232271.png', 'bouzcba', 'azflioahf', 'zeufgzoeihzechzoei', 'zeloivhzohnoehcoh', 'zeiufgz', 'France', 4, 'hybrid', 'ekjbeckzebzbczkb', 'kjbzaedkjazbkajzdbakzjb', 'William', 'Peynichou', 'women', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 rue prunier, Appt 3, Bordeaux, Gironde, 33100, France', 'search_engine', 1, '2026-02-19 15:50:37', '2026-02-19 15:50:37', 1),
(20, NULL, 'https://youtu.be/XGXGQAop5Sw', '1771582748974.mov', NULL, '1771582750061.png', 'cucu', 'pipi', 'zeoizheoziehzoihfe', 'oiefhéoeifhéeoifhoiefh', 'French', 'France', 60, 'hybrid', 'efiohefpihzofiezhoeifhzeiofzheofioi', 'kzbeozefbzoefihzoeihzeoifh', 'William', 'Peynichou', 'man', 'williampeynichou@gmail.com', '+33659257240', '+33659257240', '50 rue prunier, Appt 3, Bordeaux, Gironde, 33100, France', 'search_engine', 1, '2026-02-20 10:19:16', '2026-02-20 10:19:16', 1);

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

--
-- Déchargement des données de la table `video_social_media`
--

INSERT INTO `video_social_media` (`video_id`, `social_media_id`) VALUES
(18, 1),
(19, 2);

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
(7, 1),
(8, 1),
(7, 2),
(8, 2),
(7, 3),
(8, 3),
(10, 6),
(10, 7),
(10, 8),
(18, 29),
(18, 30),
(19, 33),
(19, 34),
(19, 35),
(20, 37);

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
  ADD KEY `idx_is_active` (`is_active`);

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `admin_video`
--
ALTER TABLE `admin_video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT pour la table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `sponsor`
--
ALTER TABLE `sponsor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `still`
--
ALTER TABLE `still`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `video`
--
ALTER TABLE `video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
