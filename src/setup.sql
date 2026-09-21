-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Playground Rebuild', 'Replacing old equipment and laying new safe flooring.', 'Centennial Park', '2026-10-15'),
(1, 'Community Center Roof Repair', 'Patching leaks and replacing damaged shingles.', 'Downtown Community Center', '2026-10-22'),
(1, 'Wheelchair Ramp Installation', 'Building accessible ramps for three local businesses.', 'Main Street', '2026-11-05'),
(1, 'Shelter Renovation', 'Painting and installing new beds in the local shelter.', 'Hope House', '2026-11-12'),
(1, 'Bus Stop Upgrades', 'Installing benches and solar lighting at transit stops.', 'Westside District', '2026-11-19'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Fall Crop Planting', 'Sowing winter vegetables in the community plots.', 'Northside Community Garden', '2026-10-10'),
(2, 'Composting Workshop', 'Teaching locals how to build and maintain compost bins.', 'Civic Center Annex', '2026-10-17'),
(2, 'Rain Barrel Installation', 'Setting up water collection systems for urban farmers.', 'Southside High School', '2026-10-24'),
(2, 'Community Harvest Festival', 'Harvesting autumn crops and distributing to food banks.', 'Northside Community Garden', '2026-11-01'),
(2, 'Soil Testing Drive', 'Testing local soil samples for urban agriculture safety.', 'GreenHarvest HQ', '2026-11-08'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Annual Food Drive', 'Collecting and sorting non-perishable food items.', 'City Hall Plaza', '2026-10-18'),
(3, 'Senior Center Tech Help', 'Assisting seniors with smartphones and computers.', 'Golden Years Center', '2026-10-25'),
(3, 'Park Cleanup Sprint', 'Clearing litter and debris from the riverfront.', 'Riverfront Park', '2026-11-02'),
(3, 'Winter Coat Distribution', 'Sorting and handing out donated winter clothing.', 'Community Gym', '2026-11-15'),
(3, 'After-School Reading Program', 'Reading with elementary students and organizing the library.', 'Lincoln Elementary', '2026-11-20');



-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================================
-- Project_Category Junction Table (Many-to-Many)
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Construction & Maintenance'),
('Environmental & Agricultural'),
('Community Support & Outreach');

-- ========================================
-- Associate Projects with Categories
-- ========================================
-- Assuming BrightFuture projects are IDs 1-5, GreenHarvest 6-10, UnityServe 11-15
INSERT INTO project_category (project_id, category_id) VALUES
-- BrightFuture Builders -> Construction (ID 1)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
-- GreenHarvest Growers -> Environmental (ID 2)
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
-- UnityServe Volunteers -> Community Support (ID 3)
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3),
-- Adding a couple of secondary categories for realism
(4, 3), -- Shelter Renovation is also Community Support
(9, 3); -- Community Harvest is also Community Support