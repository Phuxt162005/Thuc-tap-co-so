DROP DATABASE IF EXISTS CSDL_quanlybanhang;
CREATE DATABASE CSDL_quanlybanhang;
USE CSDL_quanlybanhang;

CREATE TABLE Branch (
    branchId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20) UNIQUE
);

CREATE TABLE Employee (
    employeeId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dob DATE,
    phone VARCHAR(20),
    branchId INT NOT NULL,
    FOREIGN KEY (branchId) REFERENCES Branch(branchId)
);

CREATE TABLE Attendance (
    attendanceId INT PRIMARY KEY AUTO_INCREMENT,
    employeeId INT NOT NULL,
    workDate DATE NOT NULL,
    checkIn TIME,
    checkOut TIME,
    status VARCHAR(20),
    note VARCHAR(255),
    FOREIGN KEY (employeeId) REFERENCES Employee(employeeId)
);

CREATE TABLE Payroll (
    payrollId INT PRIMARY KEY AUTO_INCREMENT,
    employeeId INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    workingDays INT DEFAULT 0,
    basicSalary DECIMAL(12,2),
    bonus DECIMAL(12,2) DEFAULT 0,
    deduction DECIMAL(12,2) DEFAULT 0,
    totalSalary DECIMAL(12,2),
    paymentDate DATE,
    FOREIGN KEY (employeeId) REFERENCES Employee(employeeId)
);

CREATE TABLE Category (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Product (
    productId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    categoryId INT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES Category(categoryId)
);

CREATE TABLE Customer (
    customerId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE
);

CREATE TABLE Invoice (
    invoiceId INT PRIMARY KEY AUTO_INCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    employeeId INT NOT NULL,
    customerId INT NOT NULL,
    total DECIMAL(12,2),
    FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

CREATE TABLE InvoiceDetail (
    detailId INT PRIMARY KEY AUTO_INCREMENT,
    invoiceId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);

-- USER
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20),
    employeeId INT,
    FOREIGN KEY (employeeId)
        REFERENCES Employee(employeeId)
        ON DELETE SET NULL
);

-- DATA
INSERT INTO Branch(name) VALUES ("Chi nhánh 1");

INSERT INTO Employee(name, dob, phone, branchId, role) VALUES
("Nguyen Van A", "2000-01-01", "0123", 1, "employee"),
("Tran Van B", "2001-01-01", "0456", 1, "employee");

INSERT INTO User(username, password, role, employeeId) VALUES
("admin", "123", "admin", NULL),
("manager", "123", "manager", NULL),
("nv1", "123", "employee", 1),
("nv2", "123", "employee", 2);

UPDATE Employee e
JOIN User u ON e.employeeId = u.employeeId
SET e.role = u.role;