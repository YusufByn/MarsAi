-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 23 fév. 2026 à 13:32
-- Version du serveur : 8.4.3
-- Version de PHP : 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `marsia`
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
(1, NULL, 'video_submit', 'video', 48, 'La Course', '::ffff:127.0.0.1', '2026-02-20 13:39:54'),
(2, 5, 'login', 'user', 5, 'admin2@admin2.com', '::1', '2026-02-23 08:04:38'),
(3, NULL, 'video_submit', 'video', 49, NULL, '::1', '2026-02-23 10:46:27'),
(4, 5, 'login', 'user', 5, 'admin2@admin2.com', '::1', '2026-02-23 12:48:13');

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
(1, 1, 1, 'draft', NULL, '2026-01-30 10:21:50', '2026-01-30 10:21:50'),
(2, 2, 1, 'draft', NULL, '2026-01-30 10:42:20', '2026-01-30 10:42:20');

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
  `id` int NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fingerprint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `banned_until` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cms_section`
--

CREATE TABLE `cms_section` (
  `id` int UNSIGNED NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phase` date NOT NULL COMMENT 'Date de la phase'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 1, 'Albert', 'Einstein', 'M', 'albert.einstein@example.com', 'Consultant Scientifique'),
(2, 1, 'Neil', 'Armstrong', 'M', 'neil.armstrong@example.com', 'Conseiller Technique'),
(3, 1, 'Marie', 'Curie', 'F', 'marie.curie@example.com', 'Productrice'),
(4, 2, 'Marie', 'Curie', 'F', 'marie.curie@example.com', 'Productrice'),
(5, 3, 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 'Director'),
(6, 4, 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 'director'),
(7, 6, 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 'Hackeur'),
(9, 29, 'Sigourney', 'Weaver', 'women', 'sigourney@weaver.com', 'Survivor'),
(10, 31, 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 'Director'),
(11, 34, 'pkmpkl', 'mpoikpmo', 'man', 'olivier.brun@laplateforme.io', '^pokpok'),
(12, 35, 'Atif', 'Zourganio', 'other', 'atifzourgani@gmail.com', 'Publisher'),
(13, 37, 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 'Directeur'),
(14, 37, 'Olivier', 'Brun', 'women', 'olivier.brun@laplateforme.com', 'Directeur'),
(15, 37, 'Olivier', 'Brun', 'other', 'olivier.brun@laplateforme.fr', 'Directeur'),
(16, 38, 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.org', 'Directeur'),
(17, 43, 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.toto', 'Directeur'),
(18, 48, 'lolo', 'cochet', 'man', 'lolocochet@jdm.com', 'Motard');

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
(1, 'David', 'Hasselhoff', 'https://c8.alamy.com/compde/py0d8b/david-hasselhoff-hier-dargestellt-auf-dem-set-von-knight-rider-in-den-fruhen-1980er-jahren-star-der-tv-hits-wie-baywatch-und-knight-rider-geliefert-von-landmarkmediapunch-py0d8b.jpg', NULL, '2026-02-13 15:53:27');

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
(1, 'contact@olivierbrun.eu', '2026-02-13 09:53:41', NULL),
(3, 'olivier.brun@laplateforme.io', '2026-02-13 10:56:03', NULL),
(4, 'other@others.com', '2026-02-16 10:39:24', NULL),
(5, 'toto@g.com', '2026-02-16 13:08:15', NULL),
(6, 'atifzourgani@gmail.com', '2026-02-16 15:05:51', NULL);

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
-- Structure de la table `security_log`
--

CREATE TABLE `security_log` (
  `id` int NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `fingerprint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ID unique du device calculé',
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_url` text COLLATE utf8mb4_unicode_ci,
  `payload` text COLLATE utf8mb4_unicode_ci COMMENT 'Le contenu malveillant détecté',
  `attack_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SQLi, XSS, DDOS...',
  `risk_score` int DEFAULT '0',
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
(3, 5, 24, 10.0, 'yes', 0, 'super film', '2026-02-13 12:03:38', '2026-02-13 12:03:52'),
(6, 5, 13, NULL, 'discuss', 1, '', '2026-02-16 09:45:28', '2026-02-16 09:45:30'),
(8, 5, 9, NULL, 'discuss', 1, '', '2026-02-16 12:50:03', '2026-02-16 12:50:03'),
(9, 5, 8, 9.0, 'yes', 0, '', '2026-02-16 12:50:20', '2026-02-16 12:50:20'),
(11, 5, 7, NULL, 'no', 0, '', '2026-02-16 12:51:04', '2026-02-16 12:51:04'),
(12, 5, 6, 10.0, 'discuss', 1, '', '2026-02-16 12:51:12', '2026-02-16 15:28:44');

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
(1, 'twitter', 'https://twitter.com/test'),
(2, 'twitter', 'https://twitter.com/pionniers_mars'),
(3, 'website', 'www.worldwideweb.com'),
(4, 'website', 'www.thewebsiteofthedead.com'),
(5, 'x', 'https://x.com/nazi'),
(6, 'tiktok', 'tiktok.com/@mateub'),
(7, 'website', 'www.google.com'),
(8, 'website', 'www.google.fr'),
(9, 'instagram', 'https://instagram.com/patate'),
(10, 'x', 'https://x.com/musk'),
(11, 'website', 'www.williampeynichou.com'),
(12, 'website', 'www.teub.com'),
(13, 'website', 'https://www.website.eu'),
(14, 'instagram', 'https://hh.com'),
(15, 'x', 'https://x.com/grosfilsdeputedepedonazimusk'),
(16, 'instagram', 'https://instagram.com/moninsta'),
(17, 'x', 'https://x.com/@musked'),
(18, 'instagram', 'https://instagram.com/teub'),
(19, 'youtube', 'https://youtube.com/@lolocochet');

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

--
-- Déchargement des données de la table `sponsor`
--

INSERT INTO `sponsor` (`id`, `name`, `img`, `url`, `sort_order`, `is_active`, `is_visible`) VALUES
(63, 'Platine', '/uploads/covers/1771841081681.jpg', NULL, 1, 1, 1),
(64, 'Platine', '/uploads/covers/1771841218413.jpg', NULL, 2, 1, 1),
(65, 'Platine', '/uploads/covers/1771841233330.jpg', NULL, 3, 1, 1),
(66, 'Platine', '/uploads/covers/1771841248335.jpg', NULL, 4, 1, 1),
(67, 'Gold', '/uploads/covers/1771841264466.jpg', NULL, 2, 2, 1),
(68, 'Platine', '/uploads/covers/1771841592109.jpg', NULL, 5, 1, 1),
(69, 'Silver', '/uploads/covers/1771842901885.jpg', NULL, 1, 3, 1),
(70, 'Gold', '/uploads/covers/1771851061961.png', NULL, 1, 2, 1),
(71, 'Silver', '/uploads/covers/1771851779018.png', NULL, 2, 3, 1);

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
(1, 4, 'still_4_0_1770735832657_nk3et3.png', NULL, 1),
(2, 4, 'still_4_0_1770735832707_4qujvn.jpg', NULL, 2),
(3, 4, 'still_4_0_1770735832804_rrwo5x.jpg', NULL, 3),
(4, 6, 'still_6_0_1770805437772_8q3eaf.png', NULL, 1),
(5, 7, 'still_7_0_1770824616392_wvokrh.png', NULL, 1),
(6, 7, 'still_7_0_1770824616415_4dx37o.png', NULL, 2),
(7, 7, 'still_7_0_1770824616461_4cp515.png', NULL, 3),
(8, 14, '1770903764293.png', '/uploads/1770903764293.png', 1),
(9, 16, '1770906699579.png', '/uploads/1770906699579.png', 1),
(10, 16, '1770906699583.jpg', '/uploads/1770906699583.jpg', 2),
(11, 18, '1770969992559.jpeg', '/uploads/1770969992559.jpeg', 1),
(12, 18, '1770969992562.png', '/uploads/1770969992562.png', 2),
(13, 18, '1770969992613.png', '/uploads/1770969992613.png', 3),
(15, 24, '1770980163595.png', '/uploads/1770980163595.png', 1),
(22, 29, '1771235110530.jpg', '/uploads/1771235110530.jpg', 1),
(23, 29, '1771235110542.png', '/uploads/1771235110542.png', 2),
(24, 29, '1771235110552.png', '/uploads/1771235110552.png', 3),
(25, 30, '1771236925482.png', '/uploads/1771236925482.png', 1),
(26, 30, '1771236925499.jpg', '/uploads/1771236925499.jpg', 2),
(27, 30, '1771236925540.png', '/uploads/1771236925540.png', 3),
(28, 31, '1771238363830.jpg', '/uploads/1771238363830.jpg', 1),
(29, 34, '1771247294949.jpeg', '/uploads/1771247294949.jpeg', 1),
(30, 34, '1771247294952.png', '/uploads/1771247294952.png', 2),
(31, 34, '1771247294995.png', '/uploads/1771247294995.png', 3),
(32, 35, '1771254351004.jpg', '/uploads/1771254351004.jpg', 1),
(33, 35, '1771254351018.jpg', '/uploads/1771254351018.jpg', 2),
(34, 35, '1771254351019.png', '/uploads/1771254351019.png', 3),
(35, 36, '1771256672897.png', '/uploads/1771256672897.png', 1),
(36, 37, '1771316512833.png', '/uploads/1771316512833.png', 1),
(37, 37, '1771316512870.jpg', '/uploads/1771316512870.jpg', 2),
(38, 37, '1771316512876.png', '/uploads/1771316512876.png', 3),
(39, 38, '1771318085839.jpg', '/uploads/1771318085839.jpg', 1),
(40, 38, '1771318085894.jpg', '/uploads/1771318085894.jpg', 2),
(41, 38, '1771318085932.png', '/uploads/1771318085932.png', 3),
(42, 48, '1771594783141.png', '/uploads/stills/1771594783141.png', 1),
(43, 48, '1771594783181.png', '/uploads/stills/1771594783181.png', 2),
(44, 48, '1771594783212.png', '/uploads/stills/1771594783212.png', 3);

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
(55, '11'),
(56, '12'),
(57, '13'),
(58, '14'),
(59, '15'),
(63, '16'),
(73, 'atif'),
(80, 'baba'),
(45, 'bbbbbbb'),
(44, 'bbbbbbbb'),
(46, 'bbbbbbbbb'),
(79, 'bebe'),
(33, 'bi'),
(34, 'bibi'),
(35, 'bibibibi'),
(23, 'biloute'),
(76, 'bite'),
(81, 'bobo'),
(82, 'bubu'),
(8, 'cool'),
(5, 'court-metrage'),
(42, 'dadadadada'),
(9, 'dev'),
(71, 'dezfre'),
(14, 'dfdfd'),
(70, 'dzezeferf'),
(38, 'erzez'),
(4, 'espace'),
(93, 'feets'),
(39, 'fgdgdf'),
(15, 'fgdgdg'),
(96, 'fgfg'),
(97, 'gfgf'),
(3, 'ia'),
(31, 'mama'),
(1, 'mars'),
(74, 'mickael'),
(32, 'momo'),
(95, 'motorcycle'),
(43, 'other'),
(29, 'papa'),
(19, 'pat'),
(6, 'piste'),
(21, 'pit'),
(20, 'pot'),
(30, 'pupu'),
(37, 'reggdfg'),
(94, 'run'),
(7, 'rush'),
(2, 'science fiction'),
(78, 'sdfsf'),
(88, 'sfdgsdfgsdfgsdfg'),
(86, 'tag'),
(83, 'tag1'),
(84, 'tag2'),
(85, 'tag3'),
(51, 'tags'),
(52, 'tagss'),
(27, 'tata'),
(53, 'tatata'),
(47, 'tatataa'),
(60, 'tatatata'),
(41, 'tatatatata'),
(77, 'teub'),
(25, 'titi'),
(54, 'tititi'),
(28, 'toto'),
(26, 'tutu'),
(16, 'zat'),
(49, 'zaza'),
(36, 'zertzert'),
(18, 'zit'),
(22, 'zop'),
(75, 'zourgani'),
(17, 'zut');

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
(1, 'admin@marsia.fr', '$2b$10$EXAMPLE_HASH', 'superadmin', 'Admin', 'MarsIA', NULL, '2026-01-30 08:22:10', '2026-02-13 10:26:28', 1, NULL),
(2, 'contact@olivierbrun.eu', NULL, 'user', 'Olivier', 'BRUN', NULL, '2026-02-10 13:53:25', '2026-02-10 13:53:25', 0, NULL),
(3, 'olivier.brun@laplateforme.io', NULL, 'user', 'Olivier', 'Brun', NULL, '2026-02-11 10:23:57', '2026-02-11 10:23:57', 0, NULL),
(5, 'admin2@admin2.com', '$2b$10$X32FgfkUbfwqatXAIjag4OFpzIQzt13eqLLkrdiYEOuCaqhn4Y.uu', 'superadmin', 'admin2', 'admin2', NULL, '2026-02-13 10:48:52', '2026-02-18 09:41:10', 0, NULL);

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
  `birthday` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Utilisateur déclare être majeur',
  `mobile_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fixe_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acquisition_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Comment a connu le festival',
  `rights_accepted` tinyint(1) DEFAULT '0' COMMENT 'Checkbox cession droits',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `video`
--

INSERT INTO `video` (`id`, `user_id`, `youtube_url`, `video_file_name`, `srt_file_name`, `cover`, `title`, `title_en`, `synopsis`, `synopsis_en`, `language`, `country`, `duration`, `classification`, `tech_resume`, `creative_resume`, `realisator_name`, `realisator_lastname`, `realisator_gender`, `email`, `birthday`, `mobile_number`, `fixe_number`, `address`, `acquisition_source`, `rights_accepted`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, NULL, NULL, 'Le Futur de l\'IA', NULL, 'Un voyage captivant à travers les possibilités infinies de l\'intelligence artificielle.', NULL, 'Français', 'France', NULL, 'ia', NULL, NULL, 'Dupont', 'Jean', NULL, 'jean.dupont@festival-ia.com', 0, '0612345678', NULL, NULL, NULL, 1, '2026-01-30 10:21:50', '2026-02-13 09:38:44'),
(2, 1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, NULL, NULL, 'Les Pionniers de Mars', 'The Pioneers of Mars', 'Dans un futur proche une equipe francaise debarque sur Mars pour etablir la premiere colonie permanente. Entre espoirs et defis technologiques ce court-metrage explore humanite face a inconnu.', 'In the near future a French team lands on Mars to establish the first permanent colony. Between hopes and technological challenges this short film explores humanity facing the unknown.', 'Francais', 'France', 180, 'hybrid', 'Midjourney v6 pour les paysages martiens, RunwayML Gen-2 pour les animations, Eleven Labs pour le doublage, DaVinci Resolve pour le montage final', 'Approche narrative documentaire avec une direction artistique inspiree des films de science-fiction des annees 70. Les scenes ont ete creees par IA puis retouchees manuellement pour garantir la coherence visuelle.', 'Jean', 'Dupont', 'M', 'jean.dupont@marsia.com', 1, '0678901234', '0145678901', '42 Avenue des Champs-Elysees, 75008 Paris, France', 'Reseaux sociaux', 1, '2026-01-30 10:42:20', '2026-02-13 09:38:44'),
(3, 2, NULL, NULL, NULL, NULL, 'TITLE', 'THE TITLE', 'THE SYNOPSIS', 'THE THE SYNOPSIS', 'THE LANG', 'FR', NULL, 'ia', 'TECH RESUME', 'CREATIVE RESUME', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', '+33695479713', 'Poujeau Bât Deuville Ent 1', 'L\'INTERNET', 1, '2026-02-10 13:53:25', '2026-02-13 09:38:44'),
(4, 2, NULL, 'video_4_1770735832638_fuu5px.mp4', 'sub_4_fr_1770735832664.srt', 'cover_4_1770735832648_a6j5e9.png', 'aaaaaaa', 'aaaaaaa', 'aaaaaaaaaaaaaa', 'aaaaaaaaaaaaaa', 'aaaaaaa', 'FR', NULL, 'ia', 'aaaaaaaaaaaaaa', 'aaaaaaaaaaaaaa', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', '+33123456789', 'Poujeau Bât Deuville Ent 1', 'L\'INTERNET', 1, '2026-02-10 15:03:52', '2026-02-13 09:38:44'),
(5, 2, NULL, 'video_5_1770805049510_oefyaw.mp4', NULL, 'cover_5_1770805049518_25i8ko.png', 'aaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'FR', NULL, 'ia', 'aaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', '+33695479713', 'Poujeau Bât Deuville Ent 1', 'L\'INTERNET', 1, '2026-02-11 10:17:29', '2026-02-13 09:38:44'),
(6, 3, NULL, 'video_6_1770805437767_xkj2xa.mp4', 'sub_6_fr_1770805437785.srt', 'cover_6_1770805437735_17mnwo.png', 'Le Titre', 'The Title', 'Le Synopsis', 'The Synopsis', 'La Langue Française', 'France', NULL, 'ia', 'The Technical Resume', 'The Creative Resume', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 0, '+33123456789', '+33123456789', '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-11 10:23:57', '2026-02-13 09:38:44'),
(7, 2, NULL, 'video_7_1770824616380_mf04py.mp4', 'sub_7_fr_1770824616388.srt', 'cover_7_1770824616384_b828ya.png', '', 'aaaaaaaaaaa', NULL, 'aaaaaaaaaaa', 'aaaaaaaaaaa', 'FR', NULL, 'ia', 'aaaaaaaaaaa', 'aaaaaaaaaaa', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', NULL, 'Poujeau Bât Deuville Ent 1', 'L\'INTERNET', 1, '2026-02-11 15:43:36', '2026-02-13 09:38:44'),
(8, 2, NULL, 'video_8_1770884959790_fro4g7.mp4', NULL, 'cover_8_1770884959879_7dusvd.png', '', 'aaaaaaaaaaaaaaaaa', NULL, 'sfghdfhdfghd', 'Frenchouille', 'FR', NULL, 'ia', 'dfghdfghdfghdfghfdghfdgh', 'dgfhdfghdfghdfgh', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', '+33695479713', 'Poujeau Bât Deuville Ent 1', 'L\'INTERNET', 1, '2026-02-12 08:29:19', '2026-02-13 09:38:44'),
(9, 2, NULL, 'video_9_1770885699881_wl7ce0.mp4', NULL, 'cover_9_1770885699885_ni764v.png', '', 'dfgsdfgsdgfsdfg', NULL, 'sdfgsfdgsdfgsdfg', 'sdfgsdfgsdfg', 'FR', NULL, 'ia', 'sdfgsdfgsdfgsdfg', 'sdfgsdfgdsfgsdfg', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 0, '+33695479713', '+33695479713', 'Poujeau Bât Deuville Ent 1', 'PAR TA MERE', 1, '2026-02-12 08:41:39', '2026-02-13 09:38:44'),
(10, 3, NULL, 'video_10_1770886461963_a4ztqa.mp4', NULL, 'cover_10_1770886461970_4cjw85.png', '', 'sdfgsdfgsdfgsdfg', NULL, 'fgsfdgsdfgsfdg', 'sdfgsdfgsdfgsd', 'tatata', NULL, 'ia', 'sdfgsdfgsdfgsdfg', 'sdfgsdfgsdfg', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 0, '+33123456789', NULL, '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-12 08:54:21', '2026-02-13 09:38:44'),
(11, 3, NULL, 'video_11_1770889465274_3kf4s0.mp4', NULL, 'cover_11_1770889465279_2cwm4l.png', '', 'sdfsdfsdfsdfsdf', NULL, 'berntbsdfgbsfdbgvs', 'sdfsdfsdfsdfs', 'France', NULL, 'ia', 'dfghdfgnhdfgndgfnh', 'sbdfhdfngnsfgnhg', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 0, '+33111111111', '+33123456789', '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-12 09:44:25', '2026-02-13 09:38:44'),
(12, 3, NULL, 'video_12_1770890069802_27n7tn.mp4', NULL, 'cover_12_1770890069806_sk689x.png', '', '1 23 45 67 89', NULL, '1 23 45 67 89', 'sdfsdf', 'France', NULL, 'ia', '1 23 45 67 89', '1 23 45 67 89', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 0, '+33123456789', '+33123456789', '14 rue du Lieutenant Pinard', 'tatatata', 1, '2026-02-12 09:54:29', '2026-02-13 09:38:44'),
(13, 3, NULL, 'video_13_1770892186993_6a2s8t.mp4', NULL, 'cover_13_1770892186996_aer3it.png', '', 'tatatata', NULL, 'sdfsddfsdfsdfsd', 'tatatatata', 'France', NULL, 'ia', 'sdfgsdfgsdfgsdfg', 'sdfgsdfgsdfg', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 0, '+33123456789', '+33123456789', '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-12 10:29:46', '2026-02-13 09:38:44'),
(14, NULL, NULL, '1770903764172.mp4', '1770903764295.srt', '1770903764291.jpeg', 'sdfgsdfg', 'qdsfgsdfgsdgsdfg', 'sdfgsdfgsdfg', 'dfghdfghdfgh', 'sfhfgsddfgh', 'USA', 52, 'hybrid', 'dfghdfghdfgh', 'dfghdfghdfgh', 'Olivier', 'Claude', 'man', 'oc@gmail.com', 0, '+33123456789', NULL, '33200 24 rue du lieutenant pinard', 'from the COW', 0, '2026-02-12 13:42:44', '2026-02-13 09:38:44'),
(15, NULL, NULL, '1770904414191.mp4', NULL, '1770904414345.png', 'dfgnhdfghndg', 'drghnfghfgnh', 'hdfghdfghsgf,n', 'gfdhghddgfhdgfhdgf', 'dgfhdfghdgfhd', 'USA', 52, 'ia', 'gsfnshngshnghsn', 'sgfnhsghn,s,tns', 'Olivier', 'Claude', 'man', 'oc@gmail.com', 0, '+33123456789', '+33123456789', 'qsdfsdfsd', 'sdfsdfjkjlhyujfg', 1, '2026-02-12 13:53:34', '2026-02-13 09:38:44'),
(16, NULL, NULL, '1770906699361.mp4', '1770906699584.srt', '1770906699504.png', 'dfgsdfgsdfg', 'qdsfgsdfgsdgsdfg', 'egergerdfgrzeg', 'sdfgsdfgsdfg', 'sdfgsdfgsdfg', 'USA', 52, 'hybrid', 'sdhgsghfgsjcxnvncbn', 'cvbncvbncvbncvbn', 'Jean', 'Claude', 'man', 'marie@gmail.com', 0, '+33123456789', '+33123456789', '33200 24 rue du lieutenant pinard', 'from the PIG', 1, '2026-02-12 14:31:39', '2026-02-13 09:38:44'),
(17, NULL, NULL, '1770910892501.mp4', '1770910892748.srt', '1770910892675.png', 'TIIIIIITTTTLLLLE', 'ENENENENENENENEN', 'dgfhdfghdghdgfh', 'sdfsdfsdfsdfsdf', 'FRFRFRFRFR', 'USA', 52, 'ia', 'dfghgfdhfgdhfgdh', 'xcvbxcvbxcvbxcvb', 'Olivier', 'Claude', 'man', 'marie@gmail.com', 0, '+33111111111', NULL, '33200 24 rue du lieutenant pinard', 'from the DUCK', 1, '2026-02-12 15:41:32', '2026-02-13 09:38:44'),
(18, NULL, NULL, '1770969992232.mp4', '1770969992616.srt', '1770969992497.png', 'sdfgsdfgsfdg', 'qdsfgsdfgsdgsdfg', 'sdfgsdfgsdfgdsfg', 'sdfgsdfgdsfgdsfg', 'sdfsdfsdf', 'USA', 52, 'ia', 'sdfgsdfgsdfgdsfg', 'sdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgdsfg', 'Olivier', 'Claude', 'man', 'marie@gmail.com', 0, '+33111111111', '+33111111111', '33200 24 rue du lieutenant pinard', 'from the DOG', 1, '2026-02-13 08:06:32', '2026-02-13 09:38:44'),
(24, NULL, NULL, '1770980163277.mp4', '1770980163598.srt', '1770980163547.png', 'Super Film', 'Super Movie', 'tatatatatatata', 'dadadadadada', 'English', 'France', 52, 'ia', 'technical resume', 'creative resume', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33123456789', '+33123456789', '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-13 10:56:03', '2026-02-13 10:56:03'),
(29, NULL, NULL, '1771235109945.mp4', '1771235110583.srt', '1771235110529.jpg', 'sdfgsdfgsdfg', 'tatatata', 'fdsgsdfgsdfg', 'sdfgsdfgsdfgds', 'sdfgsdfgsdfg', 'France', 52, 'ia', 'dsfgdsfgsdfg', 'sdfgsdfgsdfg', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '14 rue du Lieutenant Pinard', 'L\'internet', 1, '2026-02-16 09:45:10', '2026-02-16 09:45:10'),
(30, NULL, NULL, '1771236925201.mp4', '1771236925570.srt', '1771236925476.jpg', 'Le Title', 'The Title', 'Le Synopsis', 'The Synopsis', 'English', 'France', 52, 'hybrid', 'The technical resume', 'The creative resume', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', 'rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'L\'internet', 1, '2026-02-16 10:15:25', '2026-02-16 10:15:25'),
(31, NULL, NULL, '1771238363531.mp4', '1771238363834.srt', '1771238363825.jpg', 'ffff', 'dff', 'sdfsdfsdfsdf', 'fffdsfsdfsdfsdf', 'ffff', 'USA', 52, 'ia', 'sdfsdfsdfsdf', 'sdfsdfsdfsdf', 'Other', 'Others', 'other', 'other@others.com', 1, '+33111111111', '+33111111111', 'rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'L\'internet', 1, '2026-02-16 10:39:24', '2026-02-16 10:39:24'),
(32, NULL, NULL, '1771244290253.mp4', NULL, '1771244290547.jpg', 'sdfgsdfgsdfgsdfg', 'tatatata', 'sdfgdsfgdsfgdsfg', 'sdfgsdfgdsfgdsfg', 'sdfgsdfgsdfgsd', 'France', 52, 'ia', 'sdfgdsfgdsfg', 'sdfgsdfgdsfg', 'Olivier', 'Brun', 'other', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'L\'internet', 1, '2026-02-16 12:18:10', '2026-02-16 12:18:10'),
(33, NULL, NULL, '1771244399169.mp4', NULL, '1771244399488.png', 'sdfgsdfgsdfg', 'sdfgsdfgsdfgsdfg', 'sdfgsdfgsdfg', 'sdfgsdfgfdsg', 'sdfgsdfgsdfg', 'France', 52, 'ia', 'sdfgsdfgsdfg', 'sdfgsdfgsdfg', 'tatatatdfgsdfg', 'sdfgsdfgsdfg', 'other', 'atif@gmail.com', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'L\'internet', 1, '2026-02-16 12:19:59', '2026-02-16 12:19:59'),
(34, NULL, NULL, '1771247284505.mp4', '1771247295036.srt', '1771247294877.png', 'kljlkjlkj', 'moklmjk', 'lkjlkjlkjlkj', 'iojljilkjlkj', 'lkjkljlkj', 'dezdez', 120, 'hybrid', 'lkjnlkjlkjlkj', 'lkjlkjlkjlkjlkj', 'sqd', 'fergefgereg', 'women', 'toto@g.com', 1, '+33777777777', NULL, 'toto, toto, Bordeaux, dnadhnez, 33200, France', 'ferfre', 1, '2026-02-16 13:08:15', '2026-02-16 13:08:15'),
(35, NULL, NULL, '1771254350677.mp4', '1771254351036.srt', '1771254350967.png', 'le TITRE', 'The TIIIIIIIIIIIITLE', 'LE SYNOPSIS LE SYNOPSIS LE SYNOPSIS', 'THE SYNOPSIS THE SYNOPSIS THE SYNOPSIS', 'ENGLISH', 'France', 52, 'hybrid', 'Techtechtech', 'creacreacrea', 'Olivier', 'Brun', 'man', 'atifzourgani@gmail.com', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'social_networks:youtube', 1, '2026-02-16 15:05:51', '2026-02-16 15:05:51'),
(36, NULL, NULL, '1771256672629.mp4', NULL, '1771256672892.jpg', '', 'dghjfgjhfgjhfgjh', NULL, 'fgjhfgjhfgjh', 'fgjhfhjfgjh', 'France', 52, 'ia', 'fgjhfgjhfgjhfgjh', 'fgjhfgjhgfjh', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'social_networks:x', 1, '2026-02-16 15:44:33', '2026-02-16 15:44:33'),
(37, NULL, NULL, '1771316512373.mp4', '1771316512904.srt', '1771316512759.jpg', '', 'sdfsdfsdf', NULL, 'sdfsdfsdfsdf', 'dfsdfsdf', 'France', 52, 'hybrid', 'sdfsdfsdfsdf', 'sdfsdfsdfsdf', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'word_of_mouth', 1, '2026-02-17 08:21:53', '2026-02-17 08:21:53'),
(38, NULL, NULL, '1771318085540.mp4', '1771318085972.srt', '1771318085835.jpg', '', 'The Title', NULL, 'The Synopsis', 'English', 'France', 52, 'ia', 'Technical Resume', 'Creative Resume', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'search_engine', 1, '2026-02-17 08:48:06', '2026-02-17 08:48:06'),
(39, NULL, NULL, '1771321559045.mp4', NULL, '1771321559409.jpg', '', 'The Title', NULL, 'react-dom_client.js?v=24d84041:20103 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools\r\ni18n.js:6 🌐 i18next is maintained with support from locize.com — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com 💙\r\n', 'English', 'France', 52, 'ia', 'react-dom_client.js?v=24d84041:20103 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools\r\ni18n.js:6 🌐 i18next is maintained with support from locize.com — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com 💙\r\n', 'react-dom_client.js?v=24d84041:20103 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools\r\ni18n.js:6 🌐 i18next is maintained with support from locize.com — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com 💙\r\n', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'word_of_mouth', 1, '2026-02-17 09:45:59', '2026-02-17 09:45:59'),
(40, NULL, NULL, '1771322423749.mp4', NULL, '1771322424330.jpg', '', 'The Title', NULL, 'sdfsdfsdfsdfsdf', 'English', 'France', 52, 'ia', 'sdfsdfsdfsdfsdf', 'sdfsdfsdfsdfsdfsdf', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'word_of_mouth', 1, '2026-02-17 10:00:24', '2026-02-17 10:00:24'),
(41, NULL, NULL, '1771324826821.mp4', NULL, '1771324829212.jpg', 'qsdfqsdfqsdf', 'qsdfqsdfqsdf', 'qsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdf', 'qsdfqsdfqsdffqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdfqsdf', 'qsdfqsdfqsdf', 'France', 120, 'ia', 'qsdfqsdfqsdf', 'qsdfqsdfqsdf', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 1, '+33695479713', '+33695479713', 'Poujeau Bât Deuville Ent 1, Bordeaux, 33200, FR', 'word_of_mouth', 1, '2026-02-17 10:40:29', '2026-02-17 10:40:29'),
(42, NULL, NULL, '1771330322359.mp4', NULL, '1771330322477.jpg', 'qsdfqsdfqsdfqsd', 'The Title', 'qsdfqsdfqsdfqsdf', 'fqsdfqsdfqsdf', 'La Langue Française', 'France', 52, 'ia', 'qsdfqsdfqsdfqsdf', 'qsdfqsdfqdsfqdsf', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'social_networks:youtube', 1, '2026-02-17 12:12:02', '2026-02-17 12:12:02'),
(43, NULL, NULL, '1771330714653.mp4', NULL, '1771330714906.jpg', '', 'qsdfqsdfsqdf', NULL, 'qsdfqsdfqsdf', 'qsdfqsdqsdf', 'France', 52, 'hybrid', 'qsdfqsdfqsdf', 'qsdfqsdfqsdf', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, none, 33200, France', 'social_networks:instagram', 1, '2026-02-17 12:18:35', '2026-02-17 12:18:35'),
(44, NULL, NULL, '1771330912640.mp4', NULL, '1771330912892.jpg', '', 'qsdfqsdfqsdf', NULL, 'qsdfqsdfqsdf', 'qsdfqsdfqsdf', 'France', 52, 'ia', 'qsdfqsdfqsdf', 'qsdfqsdfqsdf', 'Olivier', 'Brun', 'man', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'other', 1, '2026-02-17 12:21:53', '2026-02-17 12:21:53'),
(48, NULL, NULL, '1771594774335.mp4', '1771594783572.srt', '1771594783096.jpeg', 'La Course', 'The Run', 'We are all going to die', 'Ont va tous mourrir', 'French', 'France', 40, 'ia', 'made with feets', 'with love from cursor', 'Olivier', 'BRUN', 'man', 'contact@olivierbrun.eu', 1, '+33695479713', '+33695479713', '36 rue Poujeau, Bât Deuville Ent 1, Bordeaux, Nouvelle-Aquitaine, 33200, France', 'search_engine', 1, '2026-02-20 13:39:54', '2026-02-20 13:39:54'),
(49, NULL, NULL, '1771843580773.mp4', NULL, '1771843584647.jpg', '', 'The Title', NULL, 'dsfsdfgsdfgsdfgsdfgsdfg', 'English', 'France', 40, 'hybrid', 'sdfgsdfgsdfgsdfg', 'sdfgdsfgsdfgdsfg', 'Olivier', 'Brun', 'other', 'olivier.brun@laplateforme.io', 1, '+33111111111', '+33111111111', '36 rue Poujeau, bât Deauville, Ent1, Bordeaux, 33200, France', 'social_networks:youtube', 1, '2026-02-23 10:46:27', '2026-02-23 10:46:27');

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
(1, 1),
(2, 2),
(17, 3),
(18, 4),
(24, 8),
(29, 12),
(31, 13),
(34, 14),
(35, 15),
(37, 16),
(38, 17),
(43, 18),
(48, 19);

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
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(14, 6),
(14, 7),
(14, 8),
(14, 9),
(15, 14),
(15, 15),
(16, 16),
(16, 17),
(17, 17),
(16, 18),
(16, 19),
(16, 20),
(16, 21),
(17, 22),
(17, 23),
(18, 25),
(18, 26),
(18, 27),
(29, 27),
(32, 27),
(33, 27),
(18, 28),
(34, 28),
(18, 29),
(18, 30),
(18, 31),
(18, 32),
(24, 41),
(24, 42),
(30, 51),
(42, 51),
(30, 52),
(31, 53),
(32, 53),
(31, 54),
(32, 55),
(33, 55),
(32, 56),
(33, 56),
(32, 57),
(33, 57),
(32, 58),
(33, 58),
(32, 59),
(33, 59),
(32, 60),
(33, 63),
(34, 70),
(34, 71),
(35, 73),
(35, 74),
(35, 75),
(35, 76),
(35, 77),
(36, 78),
(37, 79),
(37, 80),
(37, 81),
(37, 82),
(38, 83),
(38, 84),
(38, 85),
(42, 86),
(48, 93),
(48, 94),
(48, 95),
(49, 96),
(49, 97);

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
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cms_section`
--
ALTER TABLE `cms_section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
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
-- Index pour la table `security_log`
--
ALTER TABLE `security_log`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `admin_video`
--
ALTER TABLE `admin_video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cms_section`
--
ALTER TABLE `cms_section`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contributor`
--
ALTER TABLE `contributor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jury`
--
ALTER TABLE `jury`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- AUTO_INCREMENT pour la table `security_log`
--
ALTER TABLE `security_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `selector_memo`
--
ALTER TABLE `selector_memo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `sponsor`
--
ALTER TABLE `sponsor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT pour la table `still`
--
ALTER TABLE `still`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT pour la table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `video`
--
ALTER TABLE `video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

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
