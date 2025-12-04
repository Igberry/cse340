-- Insert missing Custom classification if not exists
INSERT INTO classification (classification_name)
VALUES ('Custom') ON CONFLICT (classification_name) DO NOTHING;
-- Insert all missing inventory data
INSERT INTO public.inventory (
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
        'Chevy',
        'Camaro',
        2018,
        'If you want to look cool this is the car you need! This car has great performance at an affordable price. Own it today!',
        '/images/vehicles/camaro.jpg',
        '/images/vehicles/camaro-tn.jpg',
        25000,
        101222,
        'Silver',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sport'
        )
    ),
    (
        'Batmobile',
        'Custom',
        2007,
        'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through traffic during rush hour.',
        '/images/vehicles/batmobile.jpg',
        '/images/vehicles/batmobile-tn.jpg',
        65000,
        29887,
        'Black',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'FBI',
        'Surveillance Van',
        2016,
        'Do you like police shows? You will feel right at home driving this van, comes complete with surveillance equipment for an extra fee of $2,000 a month.',
        '/images/vehicles/survan.jpg',
        '/images/vehicles/survan-tn.jpg',
        20000,
        19851,
        'Brown',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'Dog',
        'Car',
        1997,
        'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the original Dog Car complete with fluffy ears.',
        '/images/vehicles/dog-car.jpg',
        '/images/vehicles/dog-car-tn.jpg',
        35000,
        71632,
        'White',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'Jeep',
        'Wrangler',
        2019,
        'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the rocks or in the mud!',
        '/images/vehicles/wrangler.jpg',
        '/images/vehicles/wrangler-tn.jpg',
        28045,
        41205,
        'Yellow',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'SUV'
        )
    ),
    (
        'Lamborghini',
        'Aventador',
        2016,
        'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws.',
        '/images/vehicles/aventador.jpg',
        '/images/vehicles/aventador-tn.jpg',
        417650,
        71003,
        'Blue',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sport'
        )
    ),
    (
        'Aerocar International',
        'Aerocar',
        1963,
        'Are you sick of rush hour traffic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
        '/images/vehicles/aerocar.jpg',
        '/images/vehicles/aerocar-tn.jpg',
        700000,
        18956,
        'Red',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'Monster',
        'Truck',
        1995,
        'Most trucks are for working, this one is for fun. This beast comes with 60 inch tires giving you traction needed to jump and roll in the mud.',
        '/images/vehicles/monster-truck.jpg',
        '/images/vehicles/monster-truck-tn.jpg',
        150000,
        3998,
        'Purple',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'Cadillac',
        'Escalade',
        2019,
        'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
        '/images/vehicles/escalade.jpg',
        '/images/vehicles/escalade-tn.jpg',
        75195,
        41958,
        'Black',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Truck'
        )
    ),
    (
        'Mechanic',
        'Special',
        1964,
        'Not sure where this car came from. however with a little tlc it will run as good as new.',
        '/images/vehicles/mechanic.jpg',
        '/images/vehicles/mechanic-tn.jpg',
        100,
        200125,
        'Rust',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sedan'
        )
    ),
    (
        'Ford',
        'Model T',
        1921,
        'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
        '/images/vehicles/model-t.jpg',
        '/images/vehicles/model-t-tn.jpg',
        30000,
        26357,
        'Black',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sedan'
        )
    ),
    (
        'Mystery',
        'Machine',
        1999,
        'Scooby and the gang always found luck in solving their mysteries because of their 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
        '/images/vehicles/mystery-van.jpg',
        '/images/vehicles/mystery-van-tn.jpg',
        10000,
        128564,
        'Green',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Custom'
        )
    ),
    (
        'Spartan',
        'Fire Truck',
        2012,
        'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
        '/images/vehicles/fire-truck.jpg',
        '/images/vehicles/fire-truck-tn.jpg',
        50000,
        38522,
        'Red',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Truck'
        )
    ),
    (
        'Ford',
        'Crown Victoria',
        2013,
        'After the police force updated their fleet these cars are now available to the public! These cars come equipped with the siren which is convenient for college students running late to class.',
        '/images/vehicles/crwn-vic.jpg',
        '/images/vehicles/crwn-vic-tn.jpg',
        10000,
        108247,
        'White',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sedan'
        )
    ) ON CONFLICT DO NOTHING;