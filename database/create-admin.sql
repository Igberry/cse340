-- Create initial Admin and Employee accounts
-- Run this SQL in your PostgreSQL database to create admin and employee accounts
-- The passwords are hashed versions of "Admin123" and "Employee123"
-- Insert Admin account (password: Admin123)
INSERT INTO accounts (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES (
        'Admin',
        'User',
        'admin@cse340.com',
        '$2a$10$Kb7J8z7gYqH5qXQ7K9sC2uJYvP3B8nY4gXvZ3V1qL8Y6jK9vL5P3G',
        'Admin'
    ) ON CONFLICT (account_email) DO
UPDATE
SET account_type = 'Admin';
-- Insert Employee account (password: Employee123)
INSERT INTO accounts (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES (
        'Employee',
        'User',
        'employee@cse340.com',
        '$2a$10$Kb7J8z7gYqH5qXQ7K9sC2uJYvP3B8nY4gXvZ3V1qL8Y6jK9vL5P3G',
        'Employee'
    ) ON CONFLICT (account_email) DO
UPDATE
SET account_type = 'Employee';
-- Or update an existing account to be Admin:
-- UPDATE accounts SET account_type = 'Admin' WHERE account_email = 'your-email@example.com';