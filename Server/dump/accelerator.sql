-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2023 at 02:37 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
(3, 'Vikas Bose', 'vikas.bose@enfuse-solutions.com', 'null', 'vikas.bose@enfuse-solutions.com', 'U2FsdGVkX19uMfaJqpQaxSTN0bmmpySHlFlFHqfsiV4=', 'abc123', 2, '0', '2023-04-17', '2023-04-17'),
(4, 'Vikas Bose', 'vikas.bose@enfuse-solutions.com', 'null', 'vikas.bose@enfuse-solutions.com', 'U2FsdGVkX19uMfaJqpQaxSTN0bmmpySHlFlFHqfsiV4=', 'abc123', 2, '0', '2023-04-17', '2023-04-17'),
(5, 'Vikas Bose', 'vikas.bose@enfuse-solutions.com', 'null', 'vikas.bose@enfuse-solutions.com', 'U2FsdGVkX19uMfaJqpQaxSTN0bmmpySHlFlFHqfsiV4=', 'abc123', 2, '0', '2023-04-17', '2023-04-17'),
(6, 'Vikas Bose', 'vikas.bose@enfuse-solutions.com', 'null', 'vikas.bose@enfuse-solutions.com', 'U2FsdGVkX19uMfaJqpQaxSTN0bmmpySHlFlFHqfsiV4=', 'abc123', 2, '0', '2023-04-17', '2023-04-17'),
(7, 'Vikas Bose', 'vikas.bose@enfuse-solutions.com', 'null', 'vikas.bose@enfuse-solutions.com', 'U2FsdGVkX19uMfaJqpQaxSTN0bmmpySHlFlFHqfsiV4=', 'abc123', 2, '0', '2023-04-17', '2023-04-17');

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
  `profile_id` int(5) NOT NULL,
  `task_role` int(5) NOT NULL,
  `createdDate` date NOT NULL,
  `modifiedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accelerator_profile`
--
ALTER TABLE `accelerator_profile`
  MODIFY `profile_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `accelerator_project`
--
ALTER TABLE `accelerator_project`
  MODIFY `project_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accelerator_role`
--
ALTER TABLE `accelerator_role`
  MODIFY `role_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `accelerator_tasks`
--
ALTER TABLE `accelerator_tasks`
  MODIFY `task_id` int(12) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
