-- HisaabKitab Dummy Data Insertion Script
-- This script inserts 100+ realistic dummy records for each table
-- Run this AFTER all migrations are complete
-- WARNING: This will insert data. Use TRUNCATE if you want to reset.

-- ============================================
-- 1. SUPPLIERS (100+ records)
-- ============================================
INSERT INTO suppliers (name, contact_number, total_purchased, total_paid, balance) VALUES
('Al-Karam Electricals', '0300-1234567', 500000.00, 450000.00, 50000.00),
('Hassan Hardware Store', '0312-2345678', 750000.00, 700000.00, 50000.00),
('Karachi Wires & Cables', '021-3456789', 1200000.00, 1100000.00, 100000.00),
('Lahore Switchgear', '042-4567890', 800000.00, 750000.00, 50000.00),
('Islamabad Lighting Solutions', '051-5678901', 600000.00, 580000.00, 20000.00),
('Punjab Pipes & Fittings', '042-6789012', 900000.00, 850000.00, 50000.00),
('Sindh Tools & Equipment', '021-7890123', 650000.00, 600000.00, 50000.00),
('Balochistan Building Materials', '081-8901234', 550000.00, 520000.00, 30000.00),
('KPK Electrical Components', '091-9012345', 700000.00, 680000.00, 20000.00),
('Rawalpindi Wires', '051-0123456', 850000.00, 800000.00, 50000.00),
('Faisalabad Cables', '041-1234567', 950000.00, 900000.00, 50000.00),
('Multan Hardware', '061-2345678', 600000.00, 570000.00, 30000.00),
('Gujranwala Electricals', '055-3456789', 750000.00, 720000.00, 30000.00),
('Sialkot Tools', '052-4567890', 550000.00, 530000.00, 20000.00),
('Quetta Supplies', '081-5678901', 500000.00, 480000.00, 20000.00),
('Peshawar Wholesale', '091-6789012', 800000.00, 770000.00, 30000.00),
('Hyderabad Electricals', '022-7890123', 650000.00, 630000.00, 20000.00),
('Sargodha Hardware', '048-8901234', 700000.00, 680000.00, 20000.00),
('Bahawalpur Supplies', '062-9012345', 600000.00, 580000.00, 20000.00),
('Sukkur Building Materials', '071-0123456', 550000.00, 540000.00, 10000.00),
('Jhang Electricals', '047-1234567', 750000.00, 730000.00, 20000.00),
('Sheikhupura Hardware', '056-2345678', 650000.00, 630000.00, 20000.00),
('Rahim Yar Khan Supplies', '068-3456789', 700000.00, 680000.00, 20000.00),
('Gujrat Wires', '053-4567890', 800000.00, 780000.00, 20000.00),
('Kasur Tools', '049-5678901', 600000.00, 590000.00, 10000.00),
('Mardan Electricals', '093-6789012', 550000.00, 540000.00, 10000.00),
('Mingora Hardware', '094-7890123', 650000.00, 640000.00, 10000.00),
('Abbottabad Supplies', '099-8901234', 700000.00, 690000.00, 10000.00),
('Dera Ghazi Khan', '064-9012345', 600000.00, 590000.00, 10000.00),
('Sahiwal Electricals', '040-0123456', 750000.00, 740000.00, 10000.00),
('Okara Hardware', '044-1234567', 650000.00, 640000.00, 10000.00),
('Chiniot Supplies', '041-2345678', 700000.00, 690000.00, 10000.00),
('Kamoke Wires', '054-3456789', 800000.00, 790000.00, 10000.00),
('Hafizabad Tools', '054-4567890', 600000.00, 590000.00, 10000.00),
('Kotri Electricals', '022-5678901', 550000.00, 545000.00, 5000.00),
('Mirpur Khas Hardware', '023-6789012', 650000.00, 645000.00, 5000.00),
('Nawabshah Supplies', '024-7890123', 700000.00, 695000.00, 5000.00),
('Larkana Building Materials', '074-8901234', 600000.00, 595000.00, 5000.00),
('Jacobabad Electricals', '072-9012345', 750000.00, 745000.00, 5000.00),
('Shikarpur Hardware', '076-0123456', 650000.00, 648000.00, 2000.00),
('Khairpur Supplies', '024-1234567', 700000.00, 698000.00, 2000.00),
('Sukkur Wires', '071-2345678', 800000.00, 798000.00, 2000.00),
('Rohri Tools', '071-3456789', 600000.00, 599000.00, 1000.00),
('Ghotki Electricals', '072-4567890', 550000.00, 549000.00, 1000.00),
('Kandhkot Hardware', '072-5678901', 650000.00, 649000.00, 1000.00),
('Kashmore Supplies', '072-6789012', 700000.00, 699000.00, 1000.00),
('Dadu Building Materials', '025-7890123', 600000.00, 599500.00, 500.00),
('Jamshoro Electricals', '022-8901234', 750000.00, 749500.00, 500.00),
('Thatta Hardware', '029-9012345', 650000.00, 649500.00, 500.00),
('Badin Supplies', '029-0123456', 700000.00, 699500.00, 500.00),
('Tando Adam Wires', '023-1234567', 800000.00, 799500.00, 500.00),
('Tando Allahyar Tools', '023-2345678', 600000.00, 599500.00, 500.00),
('Matli Electricals', '029-3456789', 550000.00, 549500.00, 500.00),
('Digri Hardware', '023-4567890', 650000.00, 649500.00, 500.00),
('Umerkot Supplies', '023-5678901', 700000.00, 699500.00, 500.00),
('Khipro Building Materials', '023-6789012', 600000.00, 599500.00, 500.00),
('Sanghar Electricals', '023-7890123', 750000.00, 749500.00, 500.00),
('Kunri Hardware', '023-8901234', 650000.00, 649500.00, 500.00),
('Samaro Supplies', '023-9012345', 700000.00, 699500.00, 500.00),
('Chhor Wires', '023-0123456', 800000.00, 799500.00, 500.00),
('Mithi Tools', '023-1234567', 600000.00, 599500.00, 500.00),
('Islamkot Electricals', '023-2345678', 550000.00, 549500.00, 500.00),
('Nagarparkar Hardware', '023-3456789', 650000.00, 649500.00, 500.00),
('Mithiani Supplies', '023-4567890', 700000.00, 699500.00, 500.00),
('Daharki Building Materials', '072-5678901', 600000.00, 599500.00, 500.00),
('Pano Aqil Electricals', '071-6789012', 750000.00, 749500.00, 500.00),
('Garhi Khairo Hardware', '072-7890123', 650000.00, 649500.00, 500.00),
('Kandiaro Supplies', '024-8901234', 700000.00, 699500.00, 500.00),
('Naushahro Feroze Wires', '024-9012345', 800000.00, 799500.00, 500.00),
('Moro Tools', '024-0123456', 600000.00, 599500.00, 500.00),
('Bhiria Electricals', '024-1234567', 550000.00, 549500.00, 500.00),
('Mehrabpur Hardware', '024-2345678', 650000.00, 649500.00, 500.00),
('Daur Supplies', '024-3456789', 700000.00, 699500.00, 500.00),
('Bhirkan Building Materials', '024-4567890', 600000.00, 599500.00, 500.00),
('Keti Bunder Electricals', '029-5678901', 750000.00, 749500.00, 500.00),
('Shahbandar Hardware', '029-6789012', 650000.00, 649500.00, 500.00),
('Jati Supplies', '029-7890123', 700000.00, 699500.00, 500.00),
('Bela Wires', '029-8901234', 800000.00, 799500.00, 500.00),
('Ormara Tools', '029-9012345', 600000.00, 599500.00, 500.00),
('Pasni Electricals', '029-0123456', 550000.00, 549500.00, 500.00),
('Gwadar Hardware', '086-1234567', 650000.00, 649500.00, 500.00),
('Turbat Supplies', '085-2345678', 700000.00, 699500.00, 500.00),
('Panjgur Building Materials', '085-3456789', 600000.00, 599500.00, 500.00),
('Khuzdar Electricals', '084-4567890', 750000.00, 749500.00, 500.00),
('Kalat Hardware', '084-5678901', 650000.00, 649500.00, 500.00),
('Mastung Supplies', '084-6789012', 700000.00, 699500.00, 500.00),
('Quetta Wires', '081-7890123', 800000.00, 799500.00, 500.00),
('Chaman Tools', '082-8901234', 600000.00, 599500.00, 500.00),
('Zhob Electricals', '083-9012345', 550000.00, 549500.00, 500.00),
('Loralai Hardware', '083-0123456', 650000.00, 649500.00, 500.00),
('Dera Bugti Supplies', '083-1234567', 700000.00, 699500.00, 500.00),
('Sibi Building Materials', '083-2345678', 600000.00, 599500.00, 500.00),
('Naseerabad Electricals', '083-3456789', 750000.00, 749500.00, 500.00),
('Jaffarabad Hardware', '083-4567890', 650000.00, 649500.00, 500.00),
('Kohlu Supplies', '083-5678901', 700000.00, 699500.00, 500.00),
('Barkhan Wires', '083-6789012', 800000.00, 799500.00, 500.00),
('Musakhel Tools', '083-7890123', 600000.00, 599500.00, 500.00),
('Sherani Electricals', '083-8901234', 550000.00, 549500.00, 500.00),
('Ziarat Hardware', '083-9012345', 650000.00, 649500.00, 500.00),
('Harnai Supplies', '083-0123456', 700000.00, 699500.00, 500.00),
('Killa Saifullah Building Materials', '083-1234567', 600000.00, 599500.00, 500.00),
('Pishin Electricals', '081-2345678', 750000.00, 749500.00, 500.00),
('Killa Abdullah Hardware', '081-3456789', 650000.00, 649500.00, 500.00),
('Chagai Supplies', '081-4567890', 700000.00, 699500.00, 500.00),
('Nushki Wires', '081-5678901', 800000.00, 799500.00, 500.00),
('Washuk Tools', '081-6789012', 600000.00, 599500.00, 500.00),
('Awaran Electricals', '081-7890123', 550000.00, 549500.00, 500.00),
('Lasbela Hardware', '081-8901234', 650000.00, 649500.00, 500.00),
('Kech Supplies', '085-9012345', 700000.00, 699500.00, 500.00);

-- Update balance = total_purchased - total_paid
UPDATE suppliers SET balance = total_purchased - total_paid;

-- ============================================
-- 2. CATEGORIES (30 categories)
-- ============================================
INSERT INTO categories (category_name, status) VALUES
('Electrical Wires & Cables', 'active'),
('Switches & Sockets', 'active'),
('Lighting', 'active'),
('Fans & Ventilation', 'active'),
('Circuit Breakers', 'active'),
('MCBs & Fuses', 'active'),
('Conduit Pipes', 'active'),
('Junction Boxes', 'active'),
('Tools & Equipment', 'active'),
('Safety Equipment', 'active'),
('Batteries', 'active'),
('Transformers', 'active'),
('Motors', 'active'),
('Pipes & Fittings', 'active'),
('Valves', 'active'),
('Pumps', 'active'),
('Water Heaters', 'active'),
('Sanitary Ware', 'active'),
('Tiles', 'active'),
('Cement & Mortar', 'active'),
('Steel & Iron', 'active'),
('Wood & Timber', 'active'),
('Paint & Chemicals', 'active'),
('Hardware Accessories', 'active'),
('Locks & Keys', 'active'),
('Hinges & Handles', 'active'),
('Nails & Screws', 'active'),
('Adhesives', 'active'),
('Sealants', 'active'),
('Miscellaneous', 'active');

-- ============================================
-- 3. SUB_CATEGORIES (100+ sub-categories)
-- ============================================
-- Insert sub-categories using actual category IDs from the categories table
DO $$
DECLARE
    cat_wires INT;
    cat_switches INT;
    cat_lighting INT;
    cat_fans INT;
    cat_breakers INT;
    cat_mcbs INT;
    cat_conduit INT;
    cat_junction INT;
    cat_tools INT;
    cat_safety INT;
    cat_batteries INT;
    cat_pipes INT;
    cat_valves INT;
    cat_pumps INT;
    cat_heaters INT;
    cat_sanitary INT;
    cat_tiles INT;
    cat_cement INT;
    cat_steel INT;
    cat_accessories INT;
    cat_locks INT;
    cat_hinges INT;
    cat_nails INT;
    cat_adhesives INT;
    cat_sealants INT;
    cat_misc INT;
BEGIN
    -- Get actual category IDs
    SELECT c.category_id INTO cat_wires FROM categories c WHERE c.category_name = 'Electrical Wires & Cables';
    SELECT c.category_id INTO cat_switches FROM categories c WHERE c.category_name = 'Switches & Sockets';
    SELECT c.category_id INTO cat_lighting FROM categories c WHERE c.category_name = 'Lighting';
    SELECT c.category_id INTO cat_fans FROM categories c WHERE c.category_name = 'Fans & Ventilation';
    SELECT c.category_id INTO cat_breakers FROM categories c WHERE c.category_name = 'Circuit Breakers';
    SELECT c.category_id INTO cat_mcbs FROM categories c WHERE c.category_name = 'MCBs & Fuses';
    SELECT c.category_id INTO cat_conduit FROM categories c WHERE c.category_name = 'Conduit Pipes';
    SELECT c.category_id INTO cat_junction FROM categories c WHERE c.category_name = 'Junction Boxes';
    SELECT c.category_id INTO cat_tools FROM categories c WHERE c.category_name = 'Tools & Equipment';
    SELECT c.category_id INTO cat_safety FROM categories c WHERE c.category_name = 'Safety Equipment';
    SELECT c.category_id INTO cat_batteries FROM categories c WHERE c.category_name = 'Batteries';
    SELECT c.category_id INTO cat_pipes FROM categories c WHERE c.category_name = 'Pipes & Fittings';
    SELECT c.category_id INTO cat_valves FROM categories c WHERE c.category_name = 'Valves';
    SELECT c.category_id INTO cat_pumps FROM categories c WHERE c.category_name = 'Pumps';
    SELECT c.category_id INTO cat_heaters FROM categories c WHERE c.category_name = 'Water Heaters';
    SELECT c.category_id INTO cat_sanitary FROM categories c WHERE c.category_name = 'Sanitary Ware';
    SELECT c.category_id INTO cat_tiles FROM categories c WHERE c.category_name = 'Tiles';
    SELECT c.category_id INTO cat_cement FROM categories c WHERE c.category_name = 'Cement & Mortar';
    SELECT c.category_id INTO cat_steel FROM categories c WHERE c.category_name = 'Steel & Iron';
    SELECT c.category_id INTO cat_accessories FROM categories c WHERE c.category_name = 'Hardware Accessories';
    SELECT c.category_id INTO cat_locks FROM categories c WHERE c.category_name = 'Locks & Keys';
    SELECT c.category_id INTO cat_hinges FROM categories c WHERE c.category_name = 'Hinges & Handles';
    SELECT c.category_id INTO cat_nails FROM categories c WHERE c.category_name = 'Nails & Screws';
    SELECT c.category_id INTO cat_adhesives FROM categories c WHERE c.category_name = 'Adhesives';
    SELECT c.category_id INTO cat_sealants FROM categories c WHERE c.category_name = 'Sealants';
    SELECT c.category_id INTO cat_misc FROM categories c WHERE c.category_name = 'Miscellaneous';
    
    -- Insert sub-categories with actual category IDs
    INSERT INTO sub_categories (category_id, sub_category_name, status) VALUES
    -- Electrical Wires & Cables
    (cat_wires, 'Copper Wires', 'active'),
    (cat_wires, 'Aluminum Wires', 'active'),
    (cat_wires, 'PVC Cables', 'active'),
    (cat_wires, 'XLPE Cables', 'active'),
    (cat_wires, 'Armored Cables', 'active'),
    (cat_wires, 'Flexible Cables', 'active'),
    (cat_wires, 'Telephone Wires', 'active'),
    (cat_wires, 'Data Cables', 'active'),
    -- Switches & Sockets
    (cat_switches, 'Single Pole Switches', 'active'),
    (cat_switches, 'Double Pole Switches', 'active'),
    (cat_switches, 'Three Way Switches', 'active'),
    (cat_switches, 'Socket Outlets', 'active'),
    (cat_switches, 'USB Sockets', 'active'),
    (cat_switches, 'Switch Sockets', 'active'),
    (cat_switches, 'Dimmer Switches', 'active'),
    (cat_switches, 'Bell Switches', 'active'),
    -- Lighting
    (cat_lighting, 'LED Bulbs', 'active'),
    (cat_lighting, 'CFL Bulbs', 'active'),
    (cat_lighting, 'Tube Lights', 'active'),
    (cat_lighting, 'Panel Lights', 'active'),
    (cat_lighting, 'Spot Lights', 'active'),
    (cat_lighting, 'Chandeliers', 'active'),
    (cat_lighting, 'Wall Lights', 'active'),
    (cat_lighting, 'Emergency Lights', 'active'),
    -- Fans & Ventilation
    (cat_fans, 'Ceiling Fans', 'active'),
    (cat_fans, 'Exhaust Fans', 'active'),
    (cat_fans, 'Table Fans', 'active'),
    (cat_fans, 'Pedestal Fans', 'active'),
    (cat_fans, 'Wall Fans', 'active'),
    (cat_fans, 'Industrial Fans', 'active'),
    -- Circuit Breakers
    (cat_breakers, 'Miniature Circuit Breakers', 'active'),
    (cat_breakers, 'Molded Case Breakers', 'active'),
    (cat_breakers, 'Air Circuit Breakers', 'active'),
    (cat_breakers, 'Residual Current Breakers', 'active'),
    -- MCBs & Fuses
    (cat_mcbs, 'Single Pole MCB', 'active'),
    (cat_mcbs, 'Double Pole MCB', 'active'),
    (cat_mcbs, 'Triple Pole MCB', 'active'),
    (cat_mcbs, 'Cartridge Fuses', 'active'),
    (cat_mcbs, 'Rewirable Fuses', 'active'),
    -- Conduit Pipes
    (cat_conduit, 'PVC Conduit', 'active'),
    (cat_conduit, 'Metal Conduit', 'active'),
    (cat_conduit, 'Flexible Conduit', 'active'),
    (cat_conduit, 'Conduit Fittings', 'active'),
    -- Junction Boxes
    (cat_junction, 'Metal Junction Boxes', 'active'),
    (cat_junction, 'Plastic Junction Boxes', 'active'),
    (cat_junction, 'Weatherproof Boxes', 'active'),
    -- Tools & Equipment
    (cat_tools, 'Screwdrivers', 'active'),
    (cat_tools, 'Pliers', 'active'),
    (cat_tools, 'Wire Strippers', 'active'),
    (cat_tools, 'Multimeters', 'active'),
    (cat_tools, 'Drill Machines', 'active'),
    (cat_tools, 'Cutting Tools', 'active'),
    -- Safety Equipment
    (cat_safety, 'Safety Gloves', 'active'),
    (cat_safety, 'Safety Glasses', 'active'),
    (cat_safety, 'Insulating Mats', 'active'),
    (cat_safety, 'Fire Extinguishers', 'active'),
    -- Batteries
    (cat_batteries, 'Lead Acid Batteries', 'active'),
    (cat_batteries, 'Lithium Batteries', 'active'),
    (cat_batteries, 'Dry Cell Batteries', 'active'),
    -- Pipes & Fittings
    (cat_pipes, 'PVC Pipes', 'active'),
    (cat_pipes, 'GI Pipes', 'active'),
    (cat_pipes, 'CPVC Pipes', 'active'),
    (cat_pipes, 'HDPE Pipes', 'active'),
    (cat_pipes, 'Pipe Fittings', 'active'),
    (cat_pipes, 'Elbows', 'active'),
    (cat_pipes, 'Tees', 'active'),
    (cat_pipes, 'Couplings', 'active'),
    -- Valves
    (cat_valves, 'Ball Valves', 'active'),
    (cat_valves, 'Gate Valves', 'active'),
    (cat_valves, 'Check Valves', 'active'),
    (cat_valves, 'Butterfly Valves', 'active'),
    -- Pumps
    (cat_pumps, 'Centrifugal Pumps', 'active'),
    (cat_pumps, 'Submersible Pumps', 'active'),
    (cat_pumps, 'Jet Pumps', 'active'),
    -- Water Heaters
    (cat_heaters, 'Electric Water Heaters', 'active'),
    (cat_heaters, 'Gas Water Heaters', 'active'),
    (cat_heaters, 'Solar Water Heaters', 'active'),
    -- Sanitary Ware
    (cat_sanitary, 'Toilets', 'active'),
    (cat_sanitary, 'Basins', 'active'),
    (cat_sanitary, 'Faucets', 'active'),
    (cat_sanitary, 'Showers', 'active'),
    -- Tiles
    (cat_tiles, 'Ceramic Tiles', 'active'),
    (cat_tiles, 'Porcelain Tiles', 'active'),
    (cat_tiles, 'Marble Tiles', 'active'),
    -- Cement & Mortar
    (cat_cement, 'Portland Cement', 'active'),
    (cat_cement, 'White Cement', 'active'),
    (cat_cement, 'Mortar Mix', 'active'),
    -- Steel & Iron
    (cat_steel, 'Steel Bars', 'active'),
    (cat_steel, 'Iron Sheets', 'active'),
    (cat_steel, 'Steel Angles', 'active'),
    -- Hardware Accessories
    (cat_accessories, 'Hooks', 'active'),
    (cat_accessories, 'Brackets', 'active'),
    (cat_accessories, 'Clamps', 'active'),
    (cat_accessories, 'Bolts & Nuts', 'active'),
    -- Locks & Keys
    (cat_locks, 'Door Locks', 'active'),
    (cat_locks, 'Padlocks', 'active'),
    (cat_locks, 'Cylinder Locks', 'active'),
    -- Hinges & Handles
    (cat_hinges, 'Door Hinges', 'active'),
    (cat_hinges, 'Window Hinges', 'active'),
    (cat_hinges, 'Door Handles', 'active'),
    (cat_hinges, 'Window Handles', 'active'),
    -- Nails & Screws
    (cat_nails, 'Wood Screws', 'active'),
    (cat_nails, 'Machine Screws', 'active'),
    (cat_nails, 'Nails', 'active'),
    (cat_nails, 'Anchors', 'active'),
    -- Adhesives
    (cat_adhesives, 'Construction Adhesives', 'active'),
    (cat_adhesives, 'Wood Adhesives', 'active'),
    (cat_adhesives, 'Tile Adhesives', 'active'),
    -- Sealants
    (cat_sealants, 'Silicone Sealants', 'active'),
    (cat_sealants, 'Acrylic Sealants', 'active'),
    (cat_sealants, 'Polyurethane Sealants', 'active'),
    -- Miscellaneous
    (cat_misc, 'Electrical Tape', 'active'),
    (cat_misc, 'Cable Ties', 'active'),
    (cat_misc, 'Wire Nuts', 'active'),
    (cat_misc, 'Cable Clips', 'active');
END $$;

-- ============================================
-- 4. CUSTOMERS (100+ customers)
-- ============================================
INSERT INTO customers (name, phone, address, opening_balance, current_balance, customer_type, status) VALUES
('Ahmed Ali', '0300-1111111', 'Karachi', 0, 0, 'walk-in', 'active'),
('Hassan Khan', '0301-2222222', 'Lahore', 5000, 5000, 'retail', 'active'),
('Muhammad Usman', '0302-3333333', 'Islamabad', 0, 0, 'walk-in', 'active'),
('Ali Raza', '0303-4444444', 'Faisalabad', 10000, 10000, 'wholesale', 'active'),
('Bilal Ahmed', '0304-5555555', 'Rawalpindi', 0, 0, 'walk-in', 'active'),
('Zain Malik', '0305-6666666', 'Multan', 7500, 7500, 'retail', 'active'),
('Hamza Sheikh', '0306-7777777', 'Gujranwala', 0, 0, 'walk-in', 'active'),
('Umar Farooq', '0307-8888888', 'Sialkot', 15000, 15000, 'wholesale', 'active'),
('Usman Ali', '0308-9999999', 'Quetta', 0, 0, 'walk-in', 'active'),
('Fahad Khan', '0309-1010101', 'Peshawar', 3000, 3000, 'retail', 'active'),
('Tariq Mehmood', '0310-2020202', 'Hyderabad', 0, 0, 'walk-in', 'active'),
('Sajid Hussain', '0311-3030303', 'Sargodha', 12000, 12000, 'wholesale', 'active'),
('Nadeem Iqbal', '0312-4040404', 'Bahawalpur', 0, 0, 'walk-in', 'active'),
('Kamran Ali', '0313-5050505', 'Sukkur', 8000, 8000, 'retail', 'active'),
('Shahid Raza', '0314-6060606', 'Jhang', 0, 0, 'walk-in', 'active'),
('Rashid Ahmed', '0315-7070707', 'Sheikhupura', 20000, 20000, 'special', 'active'),
('Imran Khan', '0316-8080808', 'Rahim Yar Khan', 0, 0, 'walk-in', 'active'),
('Asif Malik', '0317-9090909', 'Gujrat', 6000, 6000, 'retail', 'active'),
('Waseem Ali', '0318-1111111', 'Kasur', 0, 0, 'walk-in', 'active'),
('Noman Sheikh', '0319-2222222', 'Mardan', 18000, 18000, 'wholesale', 'active'),
('Adnan Khan', '0320-3333333', 'Mingora', 0, 0, 'walk-in', 'active'),
('Farhan Ali', '0321-4444444', 'Abbottabad', 4000, 4000, 'retail', 'active'),
('Salman Ahmed', '0322-5555555', 'Dera Ghazi Khan', 0, 0, 'walk-in', 'active'),
('Aamir Raza', '0323-6666666', 'Sahiwal', 25000, 25000, 'special', 'active'),
('Babar Malik', '0324-7777777', 'Okara', 0, 0, 'walk-in', 'active'),
('Shoaib Khan', '0325-8888888', 'Chiniot', 9000, 9000, 'retail', 'active'),
('Yasir Ali', '0326-9999999', 'Kamoke', 0, 0, 'walk-in', 'active'),
('Junaid Ahmed', '0327-1010101', 'Hafizabad', 14000, 14000, 'wholesale', 'active'),
('Saad Raza', '0328-2020202', 'Kotri', 0, 0, 'walk-in', 'active'),
('Zeeshan Khan', '0329-3030303', 'Mirpur Khas', 7000, 7000, 'retail', 'active'),
('Danish Ali', '0330-4040404', 'Nawabshah', 0, 0, 'walk-in', 'active'),
('Haris Malik', '0331-5050505', 'Larkana', 11000, 11000, 'wholesale', 'active'),
('Ayan Sheikh', '0332-6060606', 'Jacobabad', 0, 0, 'walk-in', 'active'),
('Rayyan Khan', '0333-7070707', 'Shikarpur', 5000, 5000, 'retail', 'active'),
('Hammad Ali', '0334-8080808', 'Khairpur', 0, 0, 'walk-in', 'active'),
('Muneeb Ahmed', '0335-9090909', 'Sukkur', 16000, 16000, 'wholesale', 'active'),
('Arslan Raza', '0336-1111111', 'Rohri', 0, 0, 'walk-in', 'active'),
('Zubair Khan', '0337-2222222', 'Ghotki', 8500, 8500, 'retail', 'active'),
('Talha Ali', '0338-3333333', 'Kandhkot', 0, 0, 'walk-in', 'active'),
('Moiz Malik', '0339-4444444', 'Kashmore', 22000, 22000, 'special', 'active'),
('Hassan Raza', '0340-5555555', 'Dadu', 0, 0, 'walk-in', 'active'),
('Ahmad Khan', '0341-6666666', 'Jamshoro', 6500, 6500, 'retail', 'active'),
('Ibrahim Ali', '0342-7777777', 'Thatta', 0, 0, 'walk-in', 'active'),
('Yusuf Ahmed', '0343-8888888', 'Badin', 13000, 13000, 'wholesale', 'active'),
('Ismail Khan', '0344-9999999', 'Tando Adam', 0, 0, 'walk-in', 'active'),
('Younis Ali', '0345-1010101', 'Tando Allahyar', 9500, 9500, 'retail', 'active'),
('Musa Raza', '0346-2020202', 'Matli', 0, 0, 'walk-in', 'active'),
('Haroon Khan', '0347-3030303', 'Digri', 17000, 17000, 'wholesale', 'active'),
('Zakariya Ali', '0348-4040404', 'Umerkot', 0, 0, 'walk-in', 'active'),
('Yahya Ahmed', '0349-5050505', 'Khipro', 5500, 5500, 'retail', 'active'),
('Idris Khan', '0350-6060606', 'Sanghar', 0, 0, 'walk-in', 'active'),
('Ilyas Malik', '0351-7070707', 'Kunri', 19000, 19000, 'wholesale', 'active'),
('Luqman Ali', '0352-8080808', 'Samaro', 0, 0, 'walk-in', 'active'),
('Sulaiman Raza', '0353-9090909', 'Chhor', 7200, 7200, 'retail', 'active'),
('Dawud Khan', '0354-1111111', 'Mithi', 0, 0, 'walk-in', 'active'),
('Suleman Ali', '0355-2222222', 'Islamkot', 21000, 21000, 'special', 'active'),
('Yaqub Ahmed', '0356-3333333', 'Nagarparkar', 0, 0, 'walk-in', 'active'),
('Ishaq Khan', '0357-4444444', 'Mithiani', 8800, 8800, 'retail', 'active'),
('Ismail Ali', '0358-5555555', 'Daharki', 0, 0, 'walk-in', 'active'),
('Ayyub Raza', '0359-6666666', 'Pano Aqil', 15000, 15000, 'wholesale', 'active'),
('Yusuf Khan', '0360-7777777', 'Garhi Khairo', 0, 0, 'walk-in', 'active'),
('Ayoub Ali', '0361-8888888', 'Kandiaro', 6200, 6200, 'retail', 'active'),
('Shuaib Ahmed', '0362-9999999', 'Naushahro Feroze', 0, 0, 'walk-in', 'active'),
('Hud Raza', '0363-1010101', 'Moro', 23000, 23000, 'special', 'active'),
('Salih Khan', '0364-2020202', 'Bhiria', 0, 0, 'walk-in', 'active'),
('Zakariya Ali', '0365-3030303', 'Mehrabpur', 7800, 7800, 'retail', 'active'),
('Yahya Ahmed', '0366-4040404', 'Daur', 0, 0, 'walk-in', 'active'),
('Idris Khan', '0367-5050505', 'Bhirkan', 24000, 24000, 'special', 'active'),
('Ilyas Malik', '0368-6060606', 'Keti Bunder', 0, 0, 'walk-in', 'active'),
('Luqman Ali', '0369-7070707', 'Shahbandar', 6800, 6800, 'retail', 'active'),
('Sulaiman Raza', '0370-8080808', 'Jati', 0, 0, 'walk-in', 'active'),
('Dawud Khan', '0371-9090909', 'Bela', 26000, 26000, 'special', 'active'),
('Suleman Ali', '0372-1111111', 'Ormara', 0, 0, 'walk-in', 'active'),
('Yaqub Ahmed', '0373-2222222', 'Pasni', 9200, 9200, 'retail', 'active'),
('Ishaq Khan', '0374-3333333', 'Gwadar', 0, 0, 'walk-in', 'active'),
('Ismail Ali', '0375-4444444', 'Turbat', 18000, 18000, 'wholesale', 'active'),
('Ayyub Raza', '0376-5555555', 'Panjgur', 0, 0, 'walk-in', 'active'),
('Yusuf Khan', '0377-6666666', 'Khuzdar', 7400, 7400, 'retail', 'active'),
('Ayoub Ali', '0378-7777777', 'Kalat', 0, 0, 'walk-in', 'active'),
('Shuaib Ahmed', '0379-8888888', 'Mastung', 20000, 20000, 'wholesale', 'active'),
('Hud Raza', '0380-9999999', 'Quetta', 0, 0, 'walk-in', 'active'),
('Salih Khan', '0381-1010101', 'Chaman', 8100, 8100, 'retail', 'active'),
('Zakariya Ali', '0382-2020202', 'Zhob', 0, 0, 'walk-in', 'active'),
('Yahya Ahmed', '0383-3030303', 'Loralai', 27000, 27000, 'special', 'active'),
('Idris Khan', '0384-4040404', 'Dera Bugti', 0, 0, 'walk-in', 'active'),
('Ilyas Malik', '0385-5050505', 'Sibi', 6600, 6600, 'retail', 'active'),
('Luqman Ali', '0386-6060606', 'Naseerabad', 0, 0, 'walk-in', 'active'),
('Sulaiman Raza', '0387-7070707', 'Jaffarabad', 19000, 19000, 'wholesale', 'active'),
('Dawud Khan', '0388-8080808', 'Kohlu', 0, 0, 'walk-in', 'active'),
('Suleman Ali', '0389-9090909', 'Barkhan', 5800, 5800, 'retail', 'active'),
('Yaqub Ahmed', '0390-1111111', 'Musakhel', 0, 0, 'walk-in', 'active'),
('Ishaq Khan', '0391-2222222', 'Sherani', 28000, 28000, 'special', 'active'),
('Ismail Ali', '0392-3333333', 'Ziarat', 0, 0, 'walk-in', 'active'),
('Ayyub Raza', '0393-4444444', 'Harnai', 8900, 8900, 'retail', 'active'),
('Yusuf Khan', '0394-5555555', 'Killa Saifullah', 0, 0, 'walk-in', 'active'),
('Ayoub Ali', '0395-6666666', 'Pishin', 21000, 21000, 'wholesale', 'active'),
('Shuaib Ahmed', '0396-7777777', 'Killa Abdullah', 0, 0, 'walk-in', 'active'),
('Hud Raza', '0397-8888888', 'Chagai', 7600, 7600, 'retail', 'active'),
('Salih Khan', '0398-9999999', 'Nushki', 0, 0, 'walk-in', 'active'),
('Zakariya Ali', '0399-0000000', 'Washuk', 29000, 29000, 'special', 'active'),
('Yahya Ahmed', '0300-1111112', 'Awaran', 0, 0, 'walk-in', 'active'),
('Idris Khan', '0300-1111113', 'Lasbela', 6300, 6300, 'retail', 'active'),
('Ilyas Malik', '0300-1111114', 'Kech', 0, 0, 'walk-in', 'active');

-- ============================================
-- 5. PRODUCTS (100+ products)
-- ============================================
-- Note: This will reference suppliers, categories, and sub-categories
-- We'll use a function to generate products with proper relationships
DO $$
DECLARE
    supplier_ids INT[];
    category_ids INT[];
    sub_category_ids INT[];
    i INT;
    j INT;
    v_supplier_id INT;
    v_category_id INT;
    v_sub_category_id INT;
    product_names TEXT[] := ARRAY[
        'Copper Wire 1.5mm', 'Copper Wire 2.5mm', 'Copper Wire 4mm', 'Aluminum Wire 2.5mm',
        'PVC Cable 3 Core', 'XLPE Cable 4 Core', 'Armored Cable 3x4', 'Flexible Cable 2.5mm',
        'Single Pole Switch', 'Double Pole Switch', 'Three Way Switch', 'Socket Outlet 13A',
        'USB Socket', 'Dimmer Switch', 'LED Bulb 9W', 'LED Bulb 12W', 'LED Bulb 18W',
        'CFL Bulb 23W', 'Tube Light 4ft', 'Panel Light 2x2', 'Spot Light 5W',
        'Ceiling Fan 56"', 'Exhaust Fan 12"', 'Table Fan 16"', 'MCB 6A', 'MCB 10A',
        'MCB 16A', 'MCB 20A', 'MCB 32A', 'RCCB 30mA', 'Cartridge Fuse 5A',
        'PVC Conduit 20mm', 'PVC Conduit 25mm', 'Metal Junction Box', 'Plastic Junction Box',
        'Screwdriver Set', 'Pliers Set', 'Wire Stripper', 'Multimeter', 'Drill Machine',
        'Safety Gloves', 'Safety Glasses', 'Lead Acid Battery 12V', 'Lithium Battery',
        'PVC Pipe 1/2"', 'PVC Pipe 3/4"', 'GI Pipe 1"', 'CPVC Pipe 1/2"',
        'Ball Valve 1/2"', 'Gate Valve 3/4"', 'Check Valve 1"', 'Centrifugal Pump 1HP',
        'Submersible Pump 0.5HP', 'Electric Water Heater 50L', 'Gas Water Heater',
        'Toilet Set', 'Basin', 'Faucet Single', 'Ceramic Tile 2x2', 'Portland Cement 50kg',
        'Steel Bar 12mm', 'Iron Sheet', 'Door Lock', 'Padlock', 'Door Hinge',
        'Door Handle', 'Wood Screw 2"', 'Machine Screw', 'Nails 2"', 'Construction Adhesive',
        'Silicone Sealant', 'Electrical Tape', 'Cable Ties', 'Wire Nuts', 'Cable Clips',
        'Copper Wire 6mm', 'Copper Wire 10mm', 'Aluminum Wire 4mm', 'PVC Cable 4 Core',
        'XLPE Cable 3 Core', 'Armored Cable 3x6', 'Flexible Cable 4mm', 'Switch Socket',
        'Bell Switch', 'LED Bulb 24W', 'LED Bulb 36W', 'CFL Bulb 32W', 'Tube Light 5ft',
        'Panel Light 1x4', 'Spot Light 10W', 'Ceiling Fan 48"', 'Exhaust Fan 6"',
        'Table Fan 12"', 'MCB 40A', 'MCB 63A', 'RCCB 100mA', 'Cartridge Fuse 10A',
        'PVC Conduit 32mm', 'Weatherproof Box', 'Junction Box 4 Way', 'Screwdriver Phillips',
        'Pliers Long Nose', 'Wire Stripper Auto', 'Digital Multimeter', 'Drill Machine Heavy',
        'Safety Gloves Leather', 'Fire Extinguisher', 'Battery 12V 7Ah', 'Battery 12V 100Ah',
        'PVC Pipe 1"', 'PVC Pipe 1.5"', 'GI Pipe 1.5"', 'CPVC Pipe 3/4"',
        'Ball Valve 3/4"', 'Gate Valve 1"', 'Butterfly Valve', 'Centrifugal Pump 2HP',
        'Submersible Pump 1HP', 'Electric Water Heater 80L', 'Solar Water Heater',
        'Toilet Set Premium', 'Basin Wall Mount', 'Faucet Mixer', 'Porcelain Tile',
        'White Cement', 'Steel Bar 16mm', 'Steel Angle', 'Cylinder Lock', 'Door Hinge Heavy',
        'Window Handle', 'Wood Screw 3"', 'Anchor Bolt', 'Nails 3"', 'Tile Adhesive',
        'Acrylic Sealant', 'Cable Tie 100mm', 'Wire Nut Large', 'Cable Clip Metal'
    ];
    product_name TEXT;
    sku_counter INT := 1000;
BEGIN
    -- Get supplier IDs
    SELECT ARRAY_AGG(s.supplier_id) INTO supplier_ids FROM suppliers s;
    -- Get category IDs
    SELECT ARRAY_AGG(c.category_id) INTO category_ids FROM categories c;
    -- Get sub-category IDs
    SELECT ARRAY_AGG(sc.sub_category_id) INTO sub_category_ids FROM sub_categories sc;
    
    -- Insert products
    FOR i IN 1..ARRAY_LENGTH(product_names, 1) LOOP
        -- Select random supplier (with some NULLs)
        IF (i % 3 = 0) THEN
            v_supplier_id := NULL;
        ELSE
            v_supplier_id := supplier_ids[1 + (i % ARRAY_LENGTH(supplier_ids, 1))];
        END IF;
        
        -- Select random category
        v_category_id := category_ids[1 + (i % ARRAY_LENGTH(category_ids, 1))];
        
        -- Select random sub-category from same category
        SELECT sc.sub_category_id INTO v_sub_category_id
        FROM sub_categories sc
        WHERE sc.category_id = v_category_id
        ORDER BY RANDOM()
        LIMIT 1;
        
        product_name := product_names[i];
        
        INSERT INTO products (
            name, item_name_english, item_name_urdu, sku, category_id, sub_category_id,
            purchase_price, retail_price, wholesale_price, special_price, selling_price,
            quantity_in_stock, supplier_id, unit_type, is_frequently_sold, display_order,
            status
        ) VALUES (
            product_name,
            product_name,
            CASE WHEN i % 2 = 0 THEN product_name || ' (اردو)' ELSE NULL END,
            'SKU-' || sku_counter,
            v_category_id,
            v_sub_category_id,
            -- Purchase price: 50-500
            (50 + (i * 3.5))::DECIMAL(10,2),
            -- Retail price: 1.5x purchase price
            ((50 + (i * 3.5)) * 1.5)::DECIMAL(10,2),
            -- Wholesale price: 1.2x purchase price
            ((50 + (i * 3.5)) * 1.2)::DECIMAL(10,2),
            -- Special price: 1.3x purchase price (for some products)
            CASE WHEN i % 5 = 0 THEN ((50 + (i * 3.5)) * 1.3)::DECIMAL(10,2) ELSE NULL END,
            -- Selling price = retail price
            ((50 + (i * 3.5)) * 1.5)::DECIMAL(10,2),
            -- Stock: 10-500 units
            (10 + (i * 4))::INTEGER,
            v_supplier_id,
            CASE (i % 6)
                WHEN 0 THEN 'piece'
                WHEN 1 THEN 'packet'
                WHEN 2 THEN 'meter'
                WHEN 3 THEN 'box'
                WHEN 4 THEN 'kg'
                ELSE 'roll'
            END,
            (i % 3 = 0), -- Frequently sold
            i,
            'active'
        );
        
        sku_counter := sku_counter + 1;
    END LOOP;
END $$;

-- ============================================
-- 6. PURCHASES (100+ purchases)
-- ============================================
-- Generate purchases over last 6 months
DO $$
DECLARE
    supplier_ids INT[];
    product_ids INT[];
    i INT;
    v_supplier_id INT;
    v_product_id INT;
    purchase_date TIMESTAMP;
    quantity INT;
    purchase_price DECIMAL(10,2);
    payment_type TEXT;
BEGIN
    -- Get supplier and product IDs
    SELECT ARRAY_AGG(s.supplier_id) INTO supplier_ids FROM suppliers s;
    SELECT ARRAY_AGG(p.product_id) INTO product_ids FROM products p;
    
    -- Insert 100 purchases
    FOR i IN 1..100 LOOP
        v_supplier_id := supplier_ids[1 + (i % ARRAY_LENGTH(supplier_ids, 1))];
        v_product_id := product_ids[1 + (i % ARRAY_LENGTH(product_ids, 1))];
        
        -- Random date in last 6 months
        purchase_date := CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '180 days');
        
        -- Quantity: 10-100
        quantity := 10 + (i % 91);
        
        -- Purchase price: get from product or random
        SELECT p.purchase_price INTO purchase_price FROM products p WHERE p.product_id = v_product_id;
        IF purchase_price IS NULL THEN
            purchase_price := (50 + (i * 2))::DECIMAL(10,2);
        END IF;
        
        -- Payment type: 70% cash, 30% credit
        payment_type := CASE WHEN (i % 10) < 7 THEN 'cash' ELSE 'credit' END;
        
        INSERT INTO purchases (
            supplier_id, product_id, date, quantity, purchase_price, payment_type
        ) VALUES (
            v_supplier_id, v_product_id, purchase_date, quantity, purchase_price, payment_type
        );
    END LOOP;
END $$;

-- ============================================
-- 7. PURCHASE_ITEMS (300+ items)
-- ============================================
-- Note: This uses the new purchase_items table structure
-- We'll create purchase items for purchases that don't have items yet
DO $$
DECLARE
    purchase_rec RECORD;
    product_ids INT[];
    v_product_id INT;
    item_count INT;
    i INT;
    v_quantity INT;
    cost_price DECIMAL(10,2);
    subtotal DECIMAL(12,2);
BEGIN
    SELECT ARRAY_AGG(p.product_id) INTO product_ids FROM products p;
    
    -- For each purchase, add 1-3 items
    FOR purchase_rec IN SELECT purchase_id, product_id, quantity, purchase_price FROM purchases LIMIT 100 LOOP
        item_count := 1 + (purchase_rec.purchase_id % 3);
        
        FOR i IN 1..item_count LOOP
            IF i = 1 THEN
                -- First item is the original product
                v_product_id := purchase_rec.product_id;
                v_quantity := purchase_rec.quantity;
                cost_price := purchase_rec.purchase_price;
            ELSE
                -- Additional items are random products
                v_product_id := product_ids[1 + ((purchase_rec.purchase_id * i) % ARRAY_LENGTH(product_ids, 1))];
                v_quantity := 5 + (purchase_rec.purchase_id % 20);
                SELECT p.purchase_price INTO cost_price FROM products p WHERE p.product_id = v_product_id;
                IF cost_price IS NULL THEN
                    cost_price := (50 + (purchase_rec.purchase_id * 2))::DECIMAL(10,2);
                END IF;
            END IF;
            
            subtotal := v_quantity * cost_price;
            
            INSERT INTO purchase_items (purchase_id, item_id, quantity, cost_price, subtotal)
            VALUES (purchase_rec.purchase_id, v_product_id, v_quantity, cost_price, subtotal);
        END LOOP;
    END LOOP;
END $$;

-- ============================================
-- 8. SALES (100+ sales)
-- ============================================
DO $$
DECLARE
    customer_ids INT[];
    product_ids INT[];
    i INT;
    v_customer_id INT;
    sale_date TIMESTAMP;
    invoice_number TEXT;
    total_amount DECIMAL(12,2);
    total_profit DECIMAL(12,2);
    payment_type TEXT;
    paid_amount DECIMAL(12,2);
    discount DECIMAL(12,2);
    tax DECIMAL(12,2);
    subtotal DECIMAL(12,2);
BEGIN
    -- Get customer IDs (including NULL for walk-in)
    SELECT ARRAY_AGG(c.customer_id) INTO customer_ids FROM customers c;
    
    -- Insert 100 sales
    FOR i IN 1..100 LOOP
        -- 30% walk-in (no customer), 70% registered customers
        IF (i % 10) < 3 THEN
            v_customer_id := NULL;
        ELSE
            v_customer_id := customer_ids[1 + (i % ARRAY_LENGTH(customer_ids, 1))];
        END IF;
        
        -- Random date in last 6 months
        sale_date := CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '180 days');
        
        invoice_number := 'INV-' || TO_CHAR(sale_date, 'YYYYMMDD') || '-' || LPAD(i::TEXT, 4, '0');
        
        -- Random amounts
        subtotal := (500 + (i * 25))::DECIMAL(12,2);
        discount := CASE WHEN (i % 5) = 0 THEN (subtotal * 0.05)::DECIMAL(12,2) ELSE 0 END;
        tax := (subtotal * 0.05)::DECIMAL(12,2);
        total_amount := subtotal - discount + tax;
        total_profit := (total_amount * 0.25)::DECIMAL(12,2); -- 25% profit margin
        
        -- Payment type
        payment_type := CASE (i % 10)
            WHEN 0 THEN 'cash'
            WHEN 1 THEN 'card'
            WHEN 2 THEN 'credit'
            ELSE 'cash'
        END;
        
        -- Paid amount: full for cash/card, partial for credit
        paid_amount := CASE payment_type
            WHEN 'credit' THEN (total_amount * 0.5)::DECIMAL(12,2)
            ELSE total_amount
        END;
        
        INSERT INTO sales (
            invoice_number, date, customer_id, customer_name,
            subtotal, discount, tax, total_amount, total_profit,
            payment_type, paid_amount
        ) VALUES (
            invoice_number, sale_date, v_customer_id,
            CASE WHEN v_customer_id IS NULL THEN 'Walk-in Customer' ELSE NULL END,
            subtotal, discount, tax, total_amount, total_profit,
            payment_type, paid_amount
        );
    END LOOP;
END $$;

-- ============================================
-- 9. SALE_ITEMS (500+ items)
-- ============================================
DO $$
DECLARE
    sale_rec RECORD;
    product_ids INT[];
    v_product_id INT;
    item_count INT;
    i INT;
    v_quantity INT;
    selling_price DECIMAL(10,2);
    purchase_price DECIMAL(10,2);
    profit DECIMAL(10,2);
BEGIN
    SELECT ARRAY_AGG(p.product_id) INTO product_ids FROM products p;
    
    -- For each sale, add 1-5 items
    FOR sale_rec IN SELECT sale_id, total_amount, total_profit FROM sales LOOP
        item_count := 1 + (sale_rec.sale_id % 5);
        
        FOR i IN 1..item_count LOOP
            v_product_id := product_ids[1 + ((sale_rec.sale_id * i) % ARRAY_LENGTH(product_ids, 1))];
            
            -- Get product prices
            SELECT p.retail_price, p.purchase_price INTO selling_price, purchase_price
            FROM products p WHERE p.product_id = v_product_id;
            
            IF selling_price IS NULL THEN
                selling_price := (100 + (sale_rec.sale_id * 2))::DECIMAL(10,2);
                purchase_price := (selling_price * 0.67)::DECIMAL(10,2);
            END IF;
            
            v_quantity := 1 + (sale_rec.sale_id % 10);
            profit := (selling_price - purchase_price) * v_quantity;
            
            INSERT INTO sale_items (sale_id, product_id, quantity, selling_price, purchase_price, profit)
            VALUES (sale_rec.sale_id, v_product_id, v_quantity, selling_price, purchase_price, profit);
        END LOOP;
    END LOOP;
END $$;

-- ============================================
-- 10. DAILY_EXPENSES (100+ expenses)
-- ============================================
DO $$
DECLARE
    expense_categories TEXT[] := ARRAY[
        'Rent', 'Electricity', 'Water', 'Internet', 'Phone', 'Transportation',
        'Staff Salary', 'Maintenance', 'Stationery', 'Marketing', 'Utilities',
        'Insurance', 'Tax', 'Miscellaneous', 'Office Supplies', 'Cleaning',
        'Security', 'Repairs', 'Fuel', 'Food'
    ];
    payment_methods TEXT[] := ARRAY['cash', 'card', 'bank_transfer'];
    i INT;
    expense_date TIMESTAMP;
    category TEXT;
    amount DECIMAL(12,2);
    payment_method TEXT;
    notes TEXT;
BEGIN
    FOR i IN 1..100 LOOP
        expense_date := CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '180 days');
        category := expense_categories[1 + (i % ARRAY_LENGTH(expense_categories, 1))];
        amount := (500 + (i * 50))::DECIMAL(12,2);
        payment_method := payment_methods[1 + (i % ARRAY_LENGTH(payment_methods, 1))];
        notes := 'Expense #' || i || ' - ' || category;
        
        INSERT INTO daily_expenses (expense_category, amount, expense_date, payment_method, notes)
        VALUES (category, amount, expense_date, payment_method, notes);
    END LOOP;
END $$;

-- ============================================
-- 11. CUSTOMER_PAYMENTS (100+ payments)
-- ============================================
DO $$
DECLARE
    customer_ids INT[];
    v_customer_id INT;
    i INT;
    payment_date TIMESTAMP;
    amount DECIMAL(12,2);
    payment_method TEXT;
    notes TEXT;
BEGIN
    SELECT ARRAY_AGG(c.customer_id) INTO customer_ids FROM customers c WHERE c.current_balance > 0;
    
    FOR i IN 1..100 LOOP
        v_customer_id := customer_ids[1 + (i % ARRAY_LENGTH(customer_ids, 1))];
        payment_date := CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '180 days');
        amount := (1000 + (i * 100))::DECIMAL(12,2);
        payment_method := CASE (i % 3) WHEN 0 THEN 'cash' WHEN 1 THEN 'bank_transfer' ELSE 'other' END;
        notes := 'Payment against outstanding balance';
        
        INSERT INTO customer_payments (customer_id, payment_date, amount, payment_method, notes)
        VALUES (v_customer_id, payment_date, amount, payment_method, notes);
    END LOOP;
END $$;

-- ============================================
-- 12. SUPPLIER_PAYMENTS (100+ payments)
-- ============================================
DO $$
DECLARE
    supplier_ids INT[];
    v_supplier_id INT;
    i INT;
    payment_date TIMESTAMP;
    amount DECIMAL(12,2);
    payment_method TEXT;
    notes TEXT;
BEGIN
    SELECT ARRAY_AGG(s.supplier_id) INTO supplier_ids FROM suppliers s WHERE s.balance > 0;
    
    FOR i IN 1..100 LOOP
        v_supplier_id := supplier_ids[1 + (i % ARRAY_LENGTH(supplier_ids, 1))];
        payment_date := CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '180 days');
        amount := (5000 + (i * 500))::DECIMAL(12,2);
        payment_method := CASE (i % 3) WHEN 0 THEN 'cash' WHEN 1 THEN 'bank_transfer' ELSE 'cheque' END;
        notes := 'Payment against supplier balance';
        
        INSERT INTO supplier_payments (supplier_id, payment_date, amount, payment_method, notes)
        VALUES (v_supplier_id, payment_date, amount, payment_method, notes);
    END LOOP;
END $$;

-- ============================================
-- FINAL UPDATES
-- ============================================

-- Update supplier balances after payments
UPDATE suppliers s
SET balance = s.total_purchased - s.total_paid - COALESCE((
    SELECT SUM(sp.amount) FROM supplier_payments sp WHERE sp.supplier_id = s.supplier_id
), 0);

-- Update customer balances after payments
UPDATE customers c
SET current_balance = c.opening_balance + COALESCE((
    SELECT SUM(s.total_amount) FROM sales s WHERE s.customer_id = c.customer_id AND s.payment_type = 'credit'
), 0) - COALESCE((
    SELECT SUM(cp.amount) FROM customer_payments cp WHERE cp.customer_id = c.customer_id
), 0);

-- Update product stock based on purchases and sales
UPDATE products p
SET quantity_in_stock = COALESCE((
    SELECT SUM(pi.quantity) FROM purchase_items pi WHERE pi.item_id = p.product_id
), 0) - COALESCE((
    SELECT SUM(si.quantity) FROM sale_items si WHERE si.product_id = p.product_id
), 0);

-- Ensure stock is not negative
UPDATE products SET quantity_in_stock = 0 WHERE quantity_in_stock < 0;

-- Update purchase totals
UPDATE purchases p
SET total_amount = COALESCE((
    SELECT SUM(pi.subtotal) FROM purchase_items pi WHERE pi.purchase_id = p.purchase_id
), p.quantity * p.purchase_price);

-- Update sales grand_total (if column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales' AND column_name = 'grand_total') THEN
        EXECUTE 'UPDATE sales SET grand_total = subtotal - discount + tax WHERE grand_total IS NULL OR grand_total = 0';
    END IF;
END $$;

COMMIT;

