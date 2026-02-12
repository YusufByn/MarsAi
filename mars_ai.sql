-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2026 at 08:32 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mars_ai`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_video`
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
-- Table structure for table `assignation`
--

CREATE TABLE `assignation` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Admin ou sélectionneur assigné',
  `video_id` int UNSIGNED NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `award`
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
-- Table structure for table `cms_section`
--

CREATE TABLE `cms_section` (
  `id` int UNSIGNED NOT NULL,
  `phase` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'before | during | after | always',
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

-- --------------------------------------------------------

--
-- Table structure for table `contributor`
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
-- Table structure for table `event`
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
-- Table structure for table `jury`
--

CREATE TABLE `jury` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `illustration` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Photo',
  `biographie` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter`
--

CREATE TABLE `newsletter` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `new_post`
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
-- Table structure for table `reservation`
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
-- Table structure for table `selector_memo`
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

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` int UNSIGNED NOT NULL,
  `platform` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'instagram | facebook | linkedin | tiktok | youtube | website | x',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sponsor`
--

CREATE TABLE `sponsor` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Logo URL',
  `url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lien site',
  `sort_order` smallint UNSIGNED DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `still`
--

CREATE TABLE `still` (
  `id` int UNSIGNED NOT NULL,
  `video_id` int UNSIGNED NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` tinyint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id`, `name`) VALUES
(4, 'ChatGPT'),
(8, 'D-ID'),
(6, 'ElevenLabs'),
(11, 'HeyGen'),
(10, 'MetaHuman'),
(1, 'Midjourney'),
(3, 'Pika Labs'),
(2, 'Runway Gen-2'),
(5, 'Sora'),
(7, 'Stable Diffusion'),
(9, 'Unreal Engine 5');

-- --------------------------------------------------------

--
-- Table structure for table `user`
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
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password_hash`, `role`, `name`, `lastname`, `last_login_at`, `created_at`, `updated_at`, `login_attempts`, `lock_until`) VALUES
(1, 'admin@marsia.fr', '$2b$10$EXAMPLE_HASH', 'superadmin', 'Admin', 'MarsIA', NULL, '2026-01-27 08:35:44', '2026-01-27 08:35:44', 0, NULL),
(2, 'a@am.com', '$2b$10$NCQnf81UG7hhMQD0uV31Lueg9mGidTvvWPuu3OOc67yEwbDr0mloi', 'user', 'retretre', 'ertertret', NULL, '2026-01-28 15:35:28', '2026-01-28 15:35:28', 0, NULL),
(3, 'azz@ama.com', '$2b$10$2v0bxDHAcrgX7AvV5sge2Oue3KgV8Ng8h3ynXHJzt.My50GKU3wLm', 'user', 'ABOUBACAR', 'DENIE', NULL, '2026-01-29 10:47:31', '2026-01-29 10:47:31', 0, NULL),
(4, 'azz@am.com', '$2b$10$losEVhhsAZXXop5fuzdTZe504307aoai4wjfZE6rvVy2q3Pcjjb5S', 'user', 'cake', 'cakkee', NULL, '2026-01-29 12:26:04', '2026-01-29 12:26:04', 0, NULL),
(5, 'julien.dupond@cine.ma', '$2b$10$fakehash', 'user', 'Julien', 'Dupond', NULL, '2026-02-03 08:19:01', '2026-02-03 08:19:01', 0, NULL),
(6, 'sarah.connor@sky.net', '$2b$10$fakehash', 'user', 'Sarah', 'Connor', NULL, '2026-02-03 08:19:01', '2026-02-03 08:19:01', 0, NULL),
(10, 'test.valid2@marsia.fr', '$2b$10$EVTMwBwYdnoMVWGHqN5n5eaeBYVlCz0oRArwcKUKjAlLV9rEowqYS', 'user', 'Jean', 'Dupont', NULL, '2026-02-10 15:15:41', '2026-02-10 15:15:41', 0, NULL),
(11, 'testvalid2@marsia.fr', '$2b$10$0OQaoxekGGlp6lNSY0Auxedua1fjrvlMQBNk.DhmD4pPnhOp1YkKu', 'admin', 'Jean', 'Dupont', NULL, '2026-02-10 15:15:53', '2026-02-10 15:19:18', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL COMMENT 'Créateur/soumetteur',
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
  `birthday` date DEFAULT NULL,
  `mobile_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fixe_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acquisition_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Comment a connu le festival',
  `rights_accepted` tinyint(1) DEFAULT '0' COMMENT 'Checkbox cession droits',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `is_public` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`id`, `user_id`, `youtube_url`, `video_file_name`, `srt_file_name`, `cover`, `title`, `title_en`, `synopsis`, `synopsis_en`, `language`, `country`, `duration`, `classification`, `tech_resume`, `creative_resume`, `realisator_name`, `realisator_lastname`, `realisator_gender`, `email`, `birthday`, `mobile_number`, `fixe_number`, `address`, `acquisition_source`, `rights_accepted`, `created_at`, `updated_at`, `status`, `is_public`) VALUES
(1, 1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, NULL, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', 'Synthetica : L\'Aube', NULL, 'Voyage onirique IA.', NULL, NULL, 'France', 720, 'ia', 'Midjourney, Runway Gen-2', NULL, 'Julien', 'Dupond', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-03 08:25:06', '2026-02-03 08:25:06', 'approved', 0),
(2, 1, 'https://example.com', NULL, NULL, 'https://images.unsplash.com/photo-1535378437323-9555f3e7f671', 'Cyber Punk 2099', NULL, 'Le futur est sombre.', NULL, NULL, 'USA', 900, 'ia', 'Pika Labs, ChatGPT', NULL, 'Sarah', 'Connor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-03 08:25:06', '2026-02-03 08:25:06', 'pending', 0),
(3, 1, 'https://example.com', NULL, NULL, 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', 'L\'Écho des Abysses', NULL, 'Documentaire sous-marin.', NULL, NULL, 'Canada', 1200, 'ia', 'Sora, ElevenLabs', NULL, 'Marc', 'Lavoine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-03 08:25:06', '2026-02-03 08:25:06', 'rejected', 0),
(4, 1, 'https://example.com', NULL, NULL, 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e', 'Glitch Memories', NULL, 'Souvenirs androïdes.', NULL, NULL, 'Allemagne', 480, 'hybrid', 'Stable Diffusion, D-ID', NULL, 'Elena', 'Vargo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-03 08:25:06', '2026-02-03 08:25:06', 'pending', 0),
(5, 1, 'https://example.com', NULL, NULL, 'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6', 'Paris 2050', NULL, 'Vision utopique.', NULL, NULL, 'France', 300, 'ia', 'Midjourney, Photoshop AI', NULL, 'Lucas', 'Martin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-02-03 08:25:06', '2026-02-03 08:25:06', 'approved', 0);

-- --------------------------------------------------------

--
-- Table structure for table `video_award`
--

CREATE TABLE `video_award` (
  `video_id` int UNSIGNED NOT NULL,
  `award_id` int UNSIGNED NOT NULL,
  `year` smallint UNSIGNED DEFAULT NULL COMMENT 'Année d''attribution'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_social_media`
--

CREATE TABLE `video_social_media` (
  `video_id` int UNSIGNED NOT NULL,
  `social_media_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_tag`
--

CREATE TABLE `video_tag` (
  `video_id` int UNSIGNED NOT NULL,
  `tag_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_video`
--
ALTER TABLE `admin_video`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `video_id` (`video_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `fk_admin_video_user` (`user_id`);

--
-- Indexes for table `assignation`
--
ALTER TABLE `assignation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_video` (`user_id`,`video_id`),
  ADD KEY `idx_video_id` (`video_id`);

--
-- Indexes for table `award`
--
ALTER TABLE `award`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cms_section`
--
ALTER TABLE `cms_section`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_phase` (`phase`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `fk_cms_created_by` (`created_by`);

--
-- Indexes for table `contributor`
--
ALTER TABLE `contributor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_created_by` (`created_by`);

--
-- Indexes for table `jury`
--
ALTER TABLE `jury`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `new_post`
--
ALTER TABLE `new_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_published_at` (`published_at`),
  ADD KEY `fk_new_post_created_by` (`created_by`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qrcode` (`qrcode`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_qrcode` (`qrcode`);

--
-- Indexes for table `selector_memo`
--
ALTER TABLE `selector_memo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_video` (`user_id`,`video_id`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_playlist` (`playlist`),
  ADD KEY `idx_rating` (`rating`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_platform` (`platform`);

--
-- Indexes for table `sponsor`
--
ALTER TABLE `sponsor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `still`
--
ALTER TABLE `still`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_id` (`video_id`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_classification` (`classification`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `video_award`
--
ALTER TABLE `video_award`
  ADD PRIMARY KEY (`video_id`,`award_id`),
  ADD KEY `fk_video_award_award` (`award_id`);

--
-- Indexes for table `video_social_media`
--
ALTER TABLE `video_social_media`
  ADD PRIMARY KEY (`video_id`,`social_media_id`),
  ADD KEY `fk_video_social_media` (`social_media_id`);

--
-- Indexes for table `video_tag`
--
ALTER TABLE `video_tag`
  ADD PRIMARY KEY (`video_id`,`tag_id`),
  ADD KEY `fk_video_tag_tag` (`tag_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_video`
--
ALTER TABLE `admin_video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignation`
--
ALTER TABLE `assignation`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `award`
--
ALTER TABLE `award`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cms_section`
--
ALTER TABLE `cms_section`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contributor`
--
ALTER TABLE `contributor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jury`
--
ALTER TABLE `jury`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `new_post`
--
ALTER TABLE `new_post`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `selector_memo`
--
ALTER TABLE `selector_memo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsor`
--
ALTER TABLE `sponsor`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `still`
--
ALTER TABLE `still`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_video`
--
ALTER TABLE `admin_video`
  ADD CONSTRAINT `fk_admin_video_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_admin_video_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignation`
--
ALTER TABLE `assignation`
  ADD CONSTRAINT `fk_assignation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignation_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cms_section`
--
ALTER TABLE `cms_section`
  ADD CONSTRAINT `fk_cms_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contributor`
--
ALTER TABLE `contributor`
  ADD CONSTRAINT `fk_contributor_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `new_post`
--
ALTER TABLE `new_post`
  ADD CONSTRAINT `fk_new_post_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_reservation_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `selector_memo`
--
ALTER TABLE `selector_memo`
  ADD CONSTRAINT `fk_selector_memo_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_selector_memo_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `still`
--
ALTER TABLE `still`
  ADD CONSTRAINT `fk_still_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `fk_video_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `video_award`
--
ALTER TABLE `video_award`
  ADD CONSTRAINT `fk_video_award_award` FOREIGN KEY (`award_id`) REFERENCES `award` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_award_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_social_media`
--
ALTER TABLE `video_social_media`
  ADD CONSTRAINT `fk_video_social_media` FOREIGN KEY (`social_media_id`) REFERENCES `social_media` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_social_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_tag`
--
ALTER TABLE `video_tag`
  ADD CONSTRAINT `fk_video_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_tag_video` FOREIGN KEY (`video_id`) REFERENCES `video` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
