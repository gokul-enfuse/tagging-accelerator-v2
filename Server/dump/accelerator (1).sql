-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 24, 2024 at 07:47 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `accelerator`
--

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_app1url`
--

CREATE TABLE `accelerator_app1url` (
  `id` int(20) NOT NULL,
  `appName` varchar(225) NOT NULL,
  `appPort` int(20) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `accelerator_app1url`
--

INSERT INTO `accelerator_app1url` (`id`, `appName`, `appPort`, `createdDate`) VALUES
(5, 'tagging-toolV2', 3001, '2023-11-15 05:11:31'),
(6, 'tagging-tool', 3000, '2023-11-15 05:11:31'),
(7, 'tagging-tool', 3000, '2023-11-15 05:11:31');

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_media_annotation`
--

CREATE TABLE `accelerator_media_annotation` (
  `Id` int(10) NOT NULL,
  `mediaType` varchar(15) NOT NULL,
  `fileName` varchar(25) NOT NULL,
  `filePath` text NOT NULL,
  `taggerId` int(25) NOT NULL,
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_profile`
--

CREATE TABLE `accelerator_profile` (
  `profile_id` int(12) NOT NULL,
  `profile_name` varchar(45) NOT NULL,
  `profile_email` varchar(225) NOT NULL,
  `profile_fullname` varchar(225) NOT NULL,
  `profile_username` varchar(225) NOT NULL,
  `profile_password` varchar(225) NOT NULL,
  `profile_confirmpassword` varchar(225) NOT NULL,
  `profile_role` int(3) NOT NULL,
  `project_id` text NOT NULL,
  `profile_login_session` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'This field contain the login record',
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_profile`
--

INSERT INTO `accelerator_profile` (`profile_id`, `profile_name`, `profile_email`, `profile_fullname`, `profile_username`, `profile_password`, `profile_confirmpassword`, `profile_role`, `project_id`, `profile_login_session`, `createdDate`, `modifiedDate`) VALUES
(1, 'null', 'null', 'null', 'admin', 'U2FsdGVkX1/AYMvSSwWS5oZsgz8flaOoBZl8k/YAP40=', 'admin123', 1, '0', 1, '2023-04-16', '2024-01-17'),
(8, 'Vikas Bose', 'vikas.bose@gmail.com', 'Vikas Bose', 'VikasBose.1608', 'U2FsdGVkX19HcmtkWUUYg0potYniEoSiMLb1GVQFvP8=', 'o97d8ceq', 2, '1', 1, '2023-09-09', '2023-09-09'),
(9, 'Sunanda', 'sunanda@gmail.com', 'Sunanda', 'Sunanda.9668', 'U2FsdGVkX1/YByEOe6cYkn/cVgUbunpfdMp3up3oznQ=', 'lf1jp5ut', 3, '1', 0, '2023-09-09', '2024-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_project`
--

CREATE TABLE `accelerator_project` (
  `project_id` int(12) NOT NULL,
  `project_name` varchar(45) NOT NULL,
  `project_clientname` varchar(45) NOT NULL,
  `project_domain` varchar(45) NOT NULL,
  `project_status` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_project`
--

INSERT INTO `accelerator_project` (`project_id`, `project_name`, `project_clientname`, `project_domain`, `project_status`, `createdDate`, `modifiedDate`) VALUES
(1, 'DELL PROJECT', 'Dell', 'imageTagging', 1, '2023-09-09', '2023-09-09');

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_role`
--

CREATE TABLE `accelerator_role` (
  `role_id` int(12) NOT NULL,
  `role_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_role`
--

INSERT INTO `accelerator_role` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Manager'),
(3, 'Tagger'),
(4, 'Reviewer');

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_tasks`
--

CREATE TABLE `accelerator_tasks` (
  `task_id` int(12) NOT NULL,
  `task_title` varchar(45) NOT NULL,
  `task_status` varchar(8) NOT NULL,
  `reviewer_task_status` varchar(8) NOT NULL,
  `project_id` int(5) NOT NULL,
  `profile_id` int(5) NOT NULL,
  `reviewer_profile_id` int(5) NOT NULL,
  `task_role` int(5) NOT NULL,
  `task_mediatype` varchar(30) NOT NULL,
  `task_filename` varchar(225) NOT NULL COMMENT 'This field content media type name',
  `task_filepath` varchar(225) NOT NULL COMMENT 'This field content media type path',
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_tasks`
--

INSERT INTO `accelerator_tasks` (`task_id`, `task_title`, `task_status`, `reviewer_task_status`, `project_id`, `profile_id`, `reviewer_profile_id`, `task_role`, `task_mediatype`, `task_filename`, `task_filepath`, `createdDate`, `modifiedDate`) VALUES
(31, 'Car_image01', 'To Do', '', 1, 9, 0, 3, 'image', 'image-1705988694796.jpg', 'http://localhost:6075/uploads/images/image-1705988694796.jpg', '2024-01-22', '2024-01-23'),
(32, 'Nature Tagging', 'To Do', '', 1, 9, 0, 3, 'image', 'image-1705988896423.jpg', 'http://localhost:6075/uploads/images/image-1705988896423.jpg', '2024-01-22', '2024-01-23'),
(33, 'Nature Tagging', 'To Do', '', 1, 9, 0, 3, 'image', 'image-1705994076458.jpg', 'http://localhost:6075/uploads/images/image-1705994076458.jpg', '2024-01-22', '2024-01-23');

-- --------------------------------------------------------

--
-- Table structure for table `rectanglebb`
--

CREATE TABLE `rectanglebb` (
  `id` int(30) NOT NULL COMMENT 'This is tagger id.',
  `comments` varchar(225) NOT NULL COMMENT 'tagging note',
  `data_imagename` varchar(50) NOT NULL COMMENT 'image name',
  `geometry_type` varchar(50) NOT NULL,
  `geometry_x` double NOT NULL,
  `geometry_y` double NOT NULL,
  `geometry_width` double NOT NULL,
  `geometry_height` double NOT NULL,
  `createdDate` varchar(30) NOT NULL,
  `modifiedDate` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `rectanglebb`
--

INSERT INTO `rectanglebb` (`id`, `comments`, `data_imagename`, `geometry_type`, `geometry_x`, `geometry_y`, `geometry_width`, `geometry_height`, `createdDate`, `modifiedDate`) VALUES
(1, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 1, 0, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(2, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 15, 4, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(3, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 4, 1, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(4, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 9, 2, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(5, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 11, 4, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(6, 'undefined', 'image-1696336574698.jpg', 'RECT', 92, 85, 18, 7, 'Tue Oct 31 2023 10:32:59 GMT+0', 'Tue Oct 31 2023 10:32:59 GMT+0'),
(7, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 2, 0, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(8, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 17, 6, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(9, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 36, 17, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(10, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 64, 35, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(11, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 140, 98, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(12, 'undefined', 'image-1696336574698.jpg', 'RECT', 230, 114, 191, 146, 'Fri Nov 17 2023 13:06:04 GMT+0', 'Fri Nov 17 2023 13:06:04 GMT+0'),
(13, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 1, 0, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(14, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 4, 3, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(15, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 36, 17, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(16, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 69, 42, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(17, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 111, 77, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(18, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 168, 146, 'Fri Jan 05 2024 15:01:29 GMT+0', 'Fri Jan 05 2024 15:01:29 GMT+0'),
(19, 'undefined', 'image-1696336574698.jpg', 'RECT', 208, 91, 210, 199, 'Fri Jan 05 2024 15:02:35 GMT+0', 'Fri Jan 05 2024 15:02:35 GMT+0'),
(20, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 1, 1, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(21, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 3, 3, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(22, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 9, 12, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(23, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 28, 35, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(24, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 43, 55, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(25, 'undefined', 'image-1696336574698.jpg', 'RECT', 249, 96, 63, 74, 'Fri Jan 05 2024 15:04:34 GMT+0', 'Fri Jan 05 2024 15:04:34 GMT+0'),
(26, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 0, 1, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(27, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 5, 3, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(28, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 15, 11, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(29, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 43, 28, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(30, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 69, 41, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(31, 'undefined', 'image-1696336574698.jpg', 'RECT', 169, 86, 95, 60, 'Mon Jan 08 2024 17:53:17 GMT+0', 'Mon Jan 08 2024 17:53:17 GMT+0'),
(32, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 0, 1, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(33, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 0, 2, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(34, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 2, 8, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(35, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 12, 20, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(36, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 23, 35, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(37, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 50, 69, 'Fri Jan 19 2024 15:03:26 GMT+0', 'Fri Jan 19 2024 15:03:26 GMT+0'),
(38, 'undefined', 'image-1696336574698.jpg', 'RECT', 219, 85, 77, 99, 'Fri Jan 19 2024 15:53:39 GMT+0', 'Fri Jan 19 2024 15:53:39 GMT+0'),
(39, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, 0, -2, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(40, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, 0, -3, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(41, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, -1, -4, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(42, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, -1, -6, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(43, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, -1, -9, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(44, 'undefined', 'image-1705917846290.jpg', 'RECT', 562, 270, -2, -9, 'Mon Jan 22 2024 15:45:44 GMT+0', 'Mon Jan 22 2024 15:45:44 GMT+0'),
(45, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 1, 0, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(46, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 13, 6, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(47, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 38, 25, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(48, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 62, 48, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(49, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 67, 55, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(50, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 80, 70, 'Tue Jan 23 2024 11:39:42 GMT+0', 'Tue Jan 23 2024 11:39:42 GMT+0'),
(51, 'undefined', 'image-1705988694796.jpg', 'RECT', 448, 73, 100, 94, 'Tue Jan 23 2024 11:40:18 GMT+0', 'Tue Jan 23 2024 11:40:18 GMT+0'),
(52, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 2, 0, 'Tue Jan 23 2024 11:47:11 GMT+0', 'Tue Jan 23 2024 11:47:11 GMT+0'),
(53, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 17, 9, 'Tue Jan 23 2024 11:47:11 GMT+0', 'Tue Jan 23 2024 11:47:11 GMT+0'),
(54, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 127, 98, 'Tue Jan 23 2024 11:47:11 GMT+0', 'Tue Jan 23 2024 11:47:11 GMT+0'),
(55, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 80, 54, 'Tue Jan 23 2024 11:47:11 GMT+0', 'Tue Jan 23 2024 11:47:11 GMT+0'),
(56, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 127, 98, 'Tue Jan 23 2024 11:47:14 GMT+0', 'Tue Jan 23 2024 11:47:14 GMT+0'),
(57, 'undefined', 'image-1705988694796.jpg', 'RECT', 438, 525, 124, 98, 'Tue Jan 23 2024 11:47:30 GMT+0', 'Tue Jan 23 2024 11:47:30 GMT+0'),
(58, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 902, 621, 224, 171, 'Tue Jan 23 2024 14:06:56 GMT+0', 'Tue Jan 23 2024 14:06:56 GMT+0'),
(59, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 902, 621, 224, 171, 'Tue Jan 23 2024 14:20:57 GMT+0', 'Tue Jan 23 2024 14:20:57 GMT+0'),
(60, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 902, 617, 224, 171, 'Tue Jan 23 2024 14:20:57 GMT+0', 'Tue Jan 23 2024 14:20:57 GMT+0'),
(61, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 902, 610, 224, 171, 'Tue Jan 23 2024 14:20:57 GMT+0', 'Tue Jan 23 2024 14:20:57 GMT+0'),
(62, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 905, 581, 224, 171, 'Tue Jan 23 2024 14:20:57 GMT+0', 'Tue Jan 23 2024 14:20:57 GMT+0'),
(63, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 906, 561, 224, 171, 'Tue Jan 23 2024 14:20:57 GMT+0', 'Tue Jan 23 2024 14:20:57 GMT+0'),
(64, 'aaaaa', 'image-1705988694796.jpg', 'RECT', 916, 502, 224, 171, 'Tue Jan 23 2024 14:22:02 GMT+0', 'Tue Jan 23 2024 14:22:02 GMT+0');

-- --------------------------------------------------------

--
-- Table structure for table `taggingimages`
--

CREATE TABLE `taggingimages` (
  `imageId` int(30) NOT NULL,
  `imageName` varchar(225) NOT NULL COMMENT 'image name',
  `imagePath` varchar(225) NOT NULL COMMENT 'image Path',
  `subcategoryid` int(30) NOT NULL,
  `createdDate` int(11) NOT NULL,
  `modifiedDate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taggingimagescategory`
--

CREATE TABLE `taggingimagescategory` (
  `id` int(30) NOT NULL,
  `categoryName` varchar(50) NOT NULL COMMENT 'category level and value',
  `createdDate` text NOT NULL,
  `modifiedDate` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taggingimagessubcategory`
--

CREATE TABLE `taggingimagessubcategory` (
  `subid` int(30) NOT NULL COMMENT 'sub category id',
  `subcategoryName` varchar(50) NOT NULL COMMENT 'sub category name ',
  `categoryid` int(11) NOT NULL COMMENT 'ref of category',
  `createdDate` text NOT NULL,
  `modifiedDate` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accelerator_app1url`
--
ALTER TABLE `accelerator_app1url`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accelerator_profile`
--
ALTER TABLE `accelerator_profile`
  ADD PRIMARY KEY (`profile_id`);

--
-- Indexes for table `accelerator_project`
--
ALTER TABLE `accelerator_project`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `accelerator_role`
--
ALTER TABLE `accelerator_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `accelerator_tasks`
--
ALTER TABLE `accelerator_tasks`
  ADD PRIMARY KEY (`task_id`);

--
-- Indexes for table `rectanglebb`
--
ALTER TABLE `rectanglebb`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `taggingimages`
--
ALTER TABLE `taggingimages`
  ADD PRIMARY KEY (`imageId`);

--
-- Indexes for table `taggingimagescategory`
--
ALTER TABLE `taggingimagescategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `taggingimagessubcategory`
--
ALTER TABLE `taggingimagessubcategory`
  ADD PRIMARY KEY (`subid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accelerator_app1url`
--
ALTER TABLE `accelerator_app1url`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `accelerator_profile`
--
ALTER TABLE `accelerator_profile`
  MODIFY `profile_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `accelerator_project`
--
ALTER TABLE `accelerator_project`
  MODIFY `project_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `accelerator_role`
--
ALTER TABLE `accelerator_role`
  MODIFY `role_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `accelerator_tasks`
--
ALTER TABLE `accelerator_tasks`
  MODIFY `task_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `rectanglebb`
--
ALTER TABLE `rectanglebb`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT COMMENT 'This is tagger id.', AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `taggingimages`
--
ALTER TABLE `taggingimages`
  MODIFY `imageId` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `taggingimagescategory`
--
ALTER TABLE `taggingimagescategory`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `taggingimagessubcategory`
--
ALTER TABLE `taggingimagessubcategory`
  MODIFY `subid` int(30) NOT NULL AUTO_INCREMENT COMMENT 'sub category id';
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
