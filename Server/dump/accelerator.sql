-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 07:58 AM
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
(1, 'tagging-tool', 3000, '2024-02-22 09:03:52'),
(2, 'tagging-toolV2', 3001, '2024-02-22 09:07:34');

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
(1, 'null', 'null', 'null', 'admin', 'U2FsdGVkX1/AYMvSSwWS5oZsgz8flaOoBZl8k/YAP40=', 'admin123', 1, '0', 0, '2023-04-16', '0000-00-00'),
(25, 'Vikas Bose', 'vikas.bose@gmail.com', 'Vikas Bose', 'VikasBose.1562', 'U2FsdGVkX18aJ1kIL5bAodPbooeqzfMbDFGmNGs843Y=', '0r2dunia', 2, '1', 0, '2024-03-01', '2024-03-01'),
(26, 'saddam', 'saddam@gmail.com', 'saddam', 'saddam.4373', 'U2FsdGVkX18qntNDBv6NJSXQXEMvbPRYtFRNYLNJi8I=', '44pe5alw', 3, '1,1', 0, '2024-03-01', '2024-03-01'),
(28, 'Sunanda', 'sunanda@gmail.com', 'Sunanda', 'Sunanda.7965', 'U2FsdGVkX1+qLg+UvdhntEErdBTRbfAD/QJfwEZI4Yg=', 'ttmv2vfs', 4, '', 0, '2024-03-01', '2024-03-01'),
(29, 'lalitha', 'lalitha@gmail.com', 'lalitha', 'lalitha.5619', 'U2FsdGVkX18DjyHyVhoGhwIgCuMi+3+DIAWzC2s7Vqg=', 'epc5g1rj', 3, '1,1', 0, '2024-03-04', '2024-03-04'),
(30, 'Venkatesh', 'Venkatesh@gmail.com', 'Venkatesh', 'Venkatesh.3935', 'U2FsdGVkX19VpKrmDBdH+6d8GEbX1zgPsI4Ct9gtkho=', 'aqtrxr72', 4, '', 0, '2024-03-04', '2024-03-04'),
(31, 'sunil', 'sunil@gmail.com', 'sunil', 'sunil.6771', 'U2FsdGVkX1/nvK3A5CB4v5ADIMrF2UP6jI6q4EsRyPg=', '7x9f2yqd', 2, '2', 0, '2024-03-22', '2024-03-22'),
(32, 'Neelesh', 'neelesh@gmail.com', 'Neelesh', 'Neelesh.1116', 'U2FsdGVkX1/9tpoYQPVleMKdI31kd+nwVppdpfnmdGA=', 'j7krwtum', 3, ',1,3', 0, '2024-03-30', '2024-03-30');

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
(1, 'CAR-BAZZAR', 'car bazzar', 'imageTagging', 1, '2024-02-07', '2024-02-07'),
(2, 'BICK-IMAGE-TAGGING', 'bick bazzr', 'imageTagging', 1, '2024-02-07', '2024-02-07'),
(3, 'SPARE-PARTS', 'spare-machine', 'imageTagging', 0, '2024-02-07', '2024-02-07');

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
  `task_folder_name` varchar(225) NOT NULL,
  `task_title` varchar(225) NOT NULL,
  `task_status` varchar(40) NOT NULL DEFAULT 'To Do',
  `reviewer_task_status` varchar(40) NOT NULL,
  `project_id` int(30) NOT NULL COMMENT 'add more project id with common separator',
  `profile_id` int(5) NOT NULL COMMENT 'This id belong to Tagger id',
  `numOfItemAssignToTagger` int(255) NOT NULL DEFAULT 0,
  `reviewer_profile_id` int(5) NOT NULL,
  `numOfItemAssignToReviewer` int(225) NOT NULL DEFAULT 0,
  `task_role` int(5) NOT NULL,
  `task_mediatype` varchar(30) NOT NULL,
  `task_zip_folder_name` varchar(225) NOT NULL,
  `task_freezz` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'This is indication that task is now freezz.',
  `task_process_type` varchar(50) NOT NULL DEFAULT 'bulk' COMMENT 'This field indicate which kind of process tagger doing it.',
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accelerator_tasks`
--

INSERT INTO `accelerator_tasks` (`task_id`, `task_folder_name`, `task_title`, `task_status`, `reviewer_task_status`, `project_id`, `profile_id`, `numOfItemAssignToTagger`, `reviewer_profile_id`, `numOfItemAssignToReviewer`, `task_role`, `task_mediatype`, `task_zip_folder_name`, `task_freezz`, `task_process_type`, `createdDate`, `modifiedDate`) VALUES
(1, 'folderName_H1C9HGXi3', 'title_H1C9HGXi3', 'Completed', 'Completed', 1, 26, 0, 28, 0, 4, 'image', 'X7jzZWiuP9_extracted', 1, 'bulk', '2024-03-30', '2024-04-01'),
(2, 'folderName_H1C9HGXi3', 'title_H1C9HGXi3', 'To Do', '', 1, 29, 0, 30, 0, 3, 'image', 'X7jzZWiuP9_extracted', 1, 'bulk', '2024-03-30', '2024-03-30'),
(3, 'folderName_H1C9HGXi3', 'title_H1C9HGXi3', 'To Do', '', 1, 32, 0, 30, 0, 3, 'image', 'X7jzZWiuP9_extracted', 1, 'bulk', '2024-03-30', '2024-03-30'),
(4, 'issues', 'Car_image02', 'To Do', '', 3, 32, 0, 0, 0, 3, 'image', 'oiTKl6Ghk_extracted', 0, 'manual', '2024-04-01', '2024-04-01');

-- --------------------------------------------------------

--
-- Table structure for table `accelerator_task_image`
--

CREATE TABLE `accelerator_task_image` (
  `image_id` int(10) NOT NULL,
  `task_id` int(10) NOT NULL COMMENT 'last inserted id for each task',
  `profile_id` int(10) NOT NULL COMMENT 'assignee profile id ',
  `image_imagename` varchar(50) NOT NULL,
  `image_imagepath` varchar(225) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `accelerator_task_image`
--

INSERT INTO `accelerator_task_image` (`image_id`, `task_id`, `profile_id`, `image_imagename`, `image_imagepath`, `createdDate`, `modifiedDate`) VALUES
(1, 1, 28, '0.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/0.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(2, 1, 28, '120.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/120.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(3, 1, 28, '180.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/180.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(4, 1, 28, '240.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/240.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(5, 1, 28, '300.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/300.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(6, 1, 28, '360.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/360.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(7, 2, 29, '420.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/420.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(8, 2, 29, '480.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/480.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(9, 2, 29, '540.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/540.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(10, 2, 29, '60.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/60.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(11, 2, 29, '600.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/600.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(12, 3, 32, '660.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/660.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(13, 3, 32, '720(1).jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/720(1).jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(14, 3, 32, '720.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/720.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(15, 3, 32, '780.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/780.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(16, 3, 32, '840.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/X7jzZWiuP9_extracted/840.jpg', '2024-03-30 13:26:52', '2024-03-30 13:26:52'),
(17, 4, 32, 'images-1711965868750.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/manual/images-1711965868750.jpg', '2024-03-31 18:30:00', '2024-04-01 04:35:00'),
(18, 4, 32, 'images-1711965868762.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/manual/images-1711965868762.jpg', '2024-03-31 18:30:00', '2024-04-01 04:35:00'),
(19, 4, 32, 'images-1711965868768.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/manual/images-1711965868768.jpg', '2024-03-31 18:30:00', '2024-04-01 04:35:00'),
(20, 4, 32, 'images-1711965868775.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/manual/images-1711965868775.jpg', '2024-03-31 18:30:00', '2024-04-01 04:35:00'),
(21, 4, 32, 'images-1711965868782.jpg', 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/manual/images-1711965868782.jpg', '2024-03-31 18:30:00', '2024-04-01 04:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `rectanglebb`
--

CREATE TABLE `rectanglebb` (
  `id` int(30) NOT NULL COMMENT 'This is tagger id.',
  `image_id` varchar(225) NOT NULL COMMENT 'another unique number',
  `comments` varchar(225) NOT NULL COMMENT 'tagging note',
  `data_imagename` varchar(50) NOT NULL COMMENT 'image name',
  `geometry_type` varchar(50) NOT NULL,
  `geometry_x` double NOT NULL,
  `geometry_y` double NOT NULL,
  `geometry_width` double NOT NULL,
  `geometry_height` double NOT NULL,
  `numannotation` int(40) NOT NULL DEFAULT 1 COMMENT 'content the number of annotation',
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `rectanglebb`
--

INSERT INTO `rectanglebb` (`id`, `image_id`, `comments`, `data_imagename`, `geometry_type`, `geometry_x`, `geometry_y`, `geometry_width`, `geometry_height`, `numannotation`, `createdDate`, `modifiedDate`) VALUES
(1, '8ZxNpm', 'Two wheeler', 'images-1709291579484.jpg', 'RECT', 278, 103, 263, 207, 1, '3/1/2024', '3/1/2024'),
(2, 'KsynMC', 'Street Light', 'images-1709291579484.jpg', 'RECT', 697, 81, 264, 214, 1, '3/1/2024', '3/1/2024'),
(3, 'KsynMC', 'Street Light', 'images-1709291579484.jpg', 'RECT', 697, 81, 264, 214, 1, '3/1/2024', '3/1/2024'),
(4, 's7THzZ', 'Street Light', 'images-1709291579491.jpg', 'RECT', 1067, 169, 341, 278, 1, '3/1/2024', '3/1/2024');

-- --------------------------------------------------------

--
-- Table structure for table `taggingimages`
--

CREATE TABLE `taggingimages` (
  `imageId` int(30) NOT NULL,
  `imageName` varchar(225) NOT NULL COMMENT 'image name',
  `imagePath` varchar(225) NOT NULL COMMENT 'image Path',
  `subcategoryid` int(30) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taggingimagescategory`
--

CREATE TABLE `taggingimagescategory` (
  `id` int(30) NOT NULL,
  `categoryName` varchar(50) NOT NULL COMMENT 'category level and value',
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taggingimagessubcategory`
--

CREATE TABLE `taggingimagessubcategory` (
  `subid` int(30) NOT NULL COMMENT 'sub category id',
  `subcategoryName` varchar(50) NOT NULL COMMENT 'sub category name ',
  `categoryid` int(11) NOT NULL COMMENT 'ref of category',
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp()
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
-- Indexes for table `accelerator_task_image`
--
ALTER TABLE `accelerator_task_image`
  ADD PRIMARY KEY (`image_id`);

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
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `accelerator_profile`
--
ALTER TABLE `accelerator_profile`
  MODIFY `profile_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `accelerator_project`
--
ALTER TABLE `accelerator_project`
  MODIFY `project_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `accelerator_role`
--
ALTER TABLE `accelerator_role`
  MODIFY `role_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `accelerator_tasks`
--
ALTER TABLE `accelerator_tasks`
  MODIFY `task_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `accelerator_task_image`
--
ALTER TABLE `accelerator_task_image`
  MODIFY `image_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `rectanglebb`
--
ALTER TABLE `rectanglebb`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT COMMENT 'This is tagger id.', AUTO_INCREMENT=5;

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
