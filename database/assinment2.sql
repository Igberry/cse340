INSERT INTO account (first_name, last_name, email, password)
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';
DELETE FROM account
WHERE email = 'tony@starkent.com';
UPDATE inventory
SET description = REPLACE(
        description,
        'small interiors',
        'a huge interior'
    )
WHERE make = 'GM'
    AND model = 'Hummer';
SELECT inventory.make,
    inventory.model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');