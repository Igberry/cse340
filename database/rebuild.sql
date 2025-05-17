-- Drop tables if they already exist (optional, good for resetting during testing)
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;
DROP TYPE IF EXISTS account_type_enum;
-- 1. Create ENUM Type for account_type
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');
-- 2. Create Tables
-- Account Table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type account_type_enum DEFAULT 'Client'
);
-- Classification Table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(30) UNIQUE NOT NULL
);
-- Inventory Table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INT NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image TEXT NOT NULL,
    inv_thumbnail TEXT NOT NULL,
    inv_price NUMERIC(10, 2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT REFERENCES classification(classification_id)
);
-- 3. Insert Initial Data into Classification
INSERT INTO classification (classification_name)
VALUES ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');
-- 4. Insert Initial Inventory Data
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'GM',
        'Hummer',
        2010,
        'The GM Hummer is built for tough terrains with small interiors.',
        '/images/hummer.jpg',
        '/images/hummer-thumb.jpg',
        48000.00,
        60000,
        'Black',
        2
    ),
    (
        'Ford',
        'F-150',
        2022,
        'The Ford F-150 is a reliable and powerful truck.',
        '/images/f150.jpg',
        '/images/f150-thumb.jpg',
        52000.00,
        15000,
        'Blue',
        3
    );
-- 5. Update Hummer Description (Query #4)
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 6. Update Image Paths (Query #6)
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');