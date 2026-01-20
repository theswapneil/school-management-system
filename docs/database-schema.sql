-- School Management Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Users table (Admin, Teacher, Student, Parent)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role ENUM('admin', 'teacher', 'student', 'parent') DEFAULT 'student',
  phone VARCHAR(15),
  address TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  section VARCHAR(50),
  grade VARCHAR(50) NOT NULL,
  classTeacherId INT,
  academicYear VARCHAR(20),
  capacity INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (classTeacherId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_grade (grade)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL UNIQUE,
  registrationNumber VARCHAR(50) UNIQUE NOT NULL,
  classId INT NOT NULL,
  parentId INT,
  dateOfBirth DATE,
  enrollmentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE RESTRICT,
  FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_registrationNumber (registrationNumber),
  INDEX idx_classId (classId),
  INDEX idx_status (status)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  attendanceDate DATE NOT NULL,
  status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  remarks TEXT,
  recordedBy INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (recordedBy) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_attendance (studentId, attendanceDate),
  INDEX idx_attendanceDate (attendanceDate),
  INDEX idx_status (status)
);

-- Fee Transactions table
CREATE TABLE IF NOT EXISTS fee_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  academicYear VARCHAR(20) NOT NULL,
  feeType VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
  dueDate DATE,
  paidDate DATE,
  remarks TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_academicYear (academicYear),
  INDEX idx_status (status)
);

-- Sample data for testing
INSERT INTO users (email, password, firstName, lastName, role, phone) VALUES
('admin@school.com', '$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC', 'Admin', 'User', 'admin', '1234567890'),
('teacher@school.com', '$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC', 'John', 'Teacher', 'teacher', '1234567891'),
('parent@school.com', '$2a$10$K9nL4pW3J5bVzC2R6sQ1JO9X8mK5L3pV2qR1T0sN8vX5wY6aZ7bC', 'Jane', 'Parent', 'parent', '1234567892');
