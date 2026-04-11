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
    price DECIMAL(10,2) CHECK (price > 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
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
    total DECIMAL(12,2) CHECK (total >= 0),
    FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);
CREATE TABLE InvoiceDetail (
    detailId INT PRIMARY KEY AUTO_INCREMENT,
    invoiceId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT CHECK (quantity > 0),
    price DECIMAL(10,2) CHECK (price > 0),
    FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId),
    FOREIGN KEY (productId) REFERENCES Product(productId)
);
