-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2023 at 07:01 AM
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
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_profile`
--

INSERT INTO `accelerator_profile` (`profile_id`, `profile_name`, `profile_email`, `profile_fullname`, `profile_username`, `profile_password`, `profile_confirmpassword`, `profile_role`, `project_id`, `createdDate`, `modifiedDate`) VALUES
(1, 'null', 'null', 'null', 'admin', 'U2FsdGVkX1/AYMvSSwWS5oZsgz8flaOoBZl8k/YAP40=', 'admin123', 1, '0', '2023-04-16', '2023-04-16'),
(8, 'Vikas Bose', 'vikas.bose@gmail.com', 'Vikas Bose', 'VikasBose.1608', 'U2FsdGVkX19HcmtkWUUYg0potYniEoSiMLb1GVQFvP8=', 'o97d8ceq', 2, '1', '2023-09-09', '2023-09-09'),
(9, 'Sunanda', 'sunanda@gmail.com', 'Sunanda', 'Sunanda.9668', 'U2FsdGVkX1/YByEOe6cYkn/cVgUbunpfdMp3up3oznQ=', 'lf1jp5ut', 3, '1', '2023-09-09', '2023-09-09');

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
(16, 'Nature Tagging', 'To Do', '', 1, 9, 0, 3, 'image', 'image-1696169119545.jpg', 'uploads/images/image-1696169119545.jpg', '2023-10-01', '2023-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `rectanglebb`
--

CREATE TABLE `rectanglebb` (
  `id` int(30) NOT NULL COMMENT 'This is tagger id.',
  `data_text` varchar(225) NOT NULL COMMENT 'tagging note',
  `data_imagename` varchar(50) NOT NULL COMMENT 'image name',
  `geometry_type` varchar(50) NOT NULL,
  `geometry_x` double NOT NULL,
  `geometry_y` double NOT NULL,
  `geometry_width` double NOT NULL,
  `geometry_height` double NOT NULL,
  `createdDate` varchar(30) NOT NULL,
  `modifiedDate` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  MODIFY `task_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `rectanglebb`
--
ALTER TABLE `rectanglebb`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT COMMENT 'This is tagger id.';

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
