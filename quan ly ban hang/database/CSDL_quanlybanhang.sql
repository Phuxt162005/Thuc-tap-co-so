DROP DATABASE IF EXISTS CSDL_quanlybanhang;
CREATE DATABASE CSDL_quanlybanhang;
USE CSDL_quanlybanhang;

-- =========================
-- BRANCH
-- =========================
CREATE TABLE Branch (
    branchId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20) UNIQUE
);

-- =========================
-- EMPLOYEE
-- =========================
CREATE TABLE Employee (
    employeeId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dob DATE,
    phone VARCHAR(20),
    branchId INT NOT NULL,

    FOREIGN KEY (branchId)
    REFERENCES Branch(branchId)
);

-- =========================
-- ATTENDANCE
-- =========================
CREATE TABLE Attendance (
    attendanceId INT PRIMARY KEY AUTO_INCREMENT,
    employeeId INT NOT NULL,
    workDate DATE NOT NULL,
    checkIn TIME,
    checkOut TIME,
    status VARCHAR(20),
    note VARCHAR(255),

    FOREIGN KEY (employeeId)
    REFERENCES Employee(employeeId)
);

-- =========================
-- PAYROLL
-- =========================
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

    FOREIGN KEY (employeeId)
    REFERENCES Employee(employeeId)
);

-- =========================
-- CATEGORY
-- =========================
CREATE TABLE Category (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- =========================
-- PRODUCT
-- =========================
CREATE TABLE Product (
    productId INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    -- giá bán
    price DECIMAL(10,2),

    -- tồn kho hiện tại
    stock INT DEFAULT 0,

    -- giá nhập / 1 sản phẩm
    importUnitPrice DECIMAL(10,2) DEFAULT 0,

    -- tổng số lượng từng nhập
    totalImported INT DEFAULT 0,

    -- tổng tiền nhập
    importPrice DECIMAL(12,2) DEFAULT 0,

    image LONGTEXT,

    categoryId INT NOT NULL,
    branchId INT,

    FOREIGN KEY (categoryId)
    REFERENCES Category(categoryId),

    FOREIGN KEY (branchId)
    REFERENCES Branch(branchId)
);

-- =========================
-- CUSTOMER
-- =========================
CREATE TABLE Customer (
    customerId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE
);

-- =========================
-- INVOICE
-- =========================
CREATE TABLE Invoice (
    invoiceId INT PRIMARY KEY AUTO_INCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,

    employeeId INT NOT NULL,
    customerId INT NOT NULL,

    total DECIMAL(12,2),

    branchId INT,

    FOREIGN KEY (employeeId)
    REFERENCES Employee(employeeId),

    FOREIGN KEY (customerId)
    REFERENCES Customer(customerId),

    FOREIGN KEY (branchId)
    REFERENCES Branch(branchId)
);

-- =========================
-- INVOICE DETAIL
-- =========================
CREATE TABLE InvoiceDetail (
    detailId INT PRIMARY KEY AUTO_INCREMENT,

    invoiceId INT NOT NULL,
    productId INT NOT NULL,

    quantity INT,
    price DECIMAL(10,2),

    FOREIGN KEY (invoiceId)
    REFERENCES Invoice(invoiceId),

    FOREIGN KEY (productId)
    REFERENCES Product(productId)
);

-- =========================
-- USER
-- =========================
CREATE TABLE User (
    userId INT PRIMARY KEY AUTO_INCREMENT,

    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20),

    employeeId INT UNIQUE,

    FOREIGN KEY (employeeId)
    REFERENCES Employee(employeeId)
    ON DELETE SET NULL
);

CREATE TABLE ImportHistory (
    importId INT PRIMARY KEY AUTO_INCREMENT,

    productId INT NOT NULL,

    quantity INT NOT NULL,

    totalPrice DECIMAL(12,2) DEFAULT 0,

    importDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    branchId INT,

    FOREIGN KEY (productId)
    REFERENCES Product(productId),

    FOREIGN KEY (branchId)
    REFERENCES Branch(branchId)
);

-- =========================
-- DATA
-- =========================

-- chi nhánh
INSERT INTO Branch(name, address, phone)
VALUES
("Chi nhánh 1", "282 Quang Trung", "0347813915"),
("Chi nhánh 2", "123 Nguyễn Trãi", "0987654321");

-- nhân viên
INSERT INTO Employee(name, dob, phone, branchId)
VALUES
("Nguyen Van A", "2000-01-01", "0123", 1),
("Tran Van B", "2001-01-01", "0456", 1),
("Nguyen Thi C", "1999-02-10", "0999", 2);

-- user
INSERT INTO User(username, password, role, employeeId)
VALUES
("admin", "123", "admin", NULL),
("manager1", "123", "manager", 1),
("nv1", "123", "employee", 2),
("manager2", "123", "manager", 3);

-- khách lẻ
INSERT INTO Customer(name, phone)
VALUES ("Khách lẻ", "0000");

-- category
INSERT INTO Category(name)
VALUES ("Mặc định");