-- Tạo database
CREATE DATABASE IF NOT EXISTS hsinhdb;

-- Chọn database
USE hsinhdb;

-- Tạo bảng hsinh
CREATE TABLE IF NOT EXISTS hsinh (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    major VARCHAR(50)
);

DESCRIBE students;
