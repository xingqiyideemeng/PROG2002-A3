DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE charityevents_db;

CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  about TEXT,
  contact_email VARCHAR(190),
  contact_phone VARCHAR(50),
  website VARCHAR(255)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  short_description VARCHAR(255),
  full_description TEXT,
  image_url VARCHAR(255),
  venue_name VARCHAR(160),
  venue_address VARCHAR(255),
  city VARCHAR(120),
  state_region VARCHAR(120),
  postcode VARCHAR(20),
  country VARCHAR(120) DEFAULT 'Australia',
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  ticket_price_cents INT NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  tickets_total INT DEFAULT NULL,
  tickets_sold INT NOT NULL DEFAULT 0,
  goal_amount_cents INT DEFAULT NULL,
  amount_raised_cents INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_events_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_events_dates (start_at, end_at),
  INDEX idx_events_city (city),
  INDEX idx_events_category (category_id)
);

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  contact_phone VARCHAR(50),
  tickets_count INT NOT NULL DEFAULT 1,
  registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT uq_event_email UNIQUE (event_id, email),
  INDEX idx_registrations_event (event_id),
  INDEX idx_registrations_email (email)
);



INSERT INTO organizations (name, description, about, contact_email, contact_phone, website) VALUES
('HopeWorks Foundation', 'Empowering communities through education and healthcare.', 'We run local programs to improve health and literacy outcomes.', 'info@hopeworks.org', '+61-2-1111-1111', 'https://hopeworks.example.org'),
('Green City Trust', 'Creating sustainable urban futures.', 'We plant trees and support green mobility projects.', 'hello@greencity.org', '+61-2-2222-2222', 'https://greencity.example.org');


INSERT INTO categories (name, description) VALUES
('Fun Run', 'Community running events for fundraising'),
('Gala', 'Formal dinners and celebrations'),
('Auction', 'Silent or live auctions of donated items'),
('Concert', 'Live music performances for a cause');


INSERT INTO events
(org_id, category_id, name, short_description, full_description, image_url,
 venue_name, venue_address, city, state_region, postcode, country,
 start_at, end_at, is_suspended, ticket_price_cents, currency, tickets_total, tickets_sold, goal_amount_cents, amount_raised_cents)
VALUES
(1, 1, 'Run for Reading 5K', 'A community 5K to fund school libraries.', 'Join us for a family-friendly 5K to support local school library upgrades.', 'https://picsum.photos/seed/run/800/400',
 'Centennial Parklands', 'Grand Dr', 'Sydney', 'NSW', '2021', 'Australia',
 '2025-10-15 08:00:00', '2025-10-15 11:00:00', 0, 3000, 'AUD', 500, 120, 1500000, 450000),
(1, 2, 'HopeWorks Annual Gala', 'Black-tie dinner supporting health clinics.', 'An elegant evening with dinner, keynote, and live pledges for our health clinics.', 'https://picsum.photos/seed/gala/800/400',
 'Town Hall Ballroom', '483 George St', 'Sydney', 'NSW', '2000', 'Australia',
 '2025-11-08 18:30:00', '2025-11-08 23:00:00', 0, 15000, 'AUD', 300, 90, 5000000, 1200000),
(2, 3, 'Green Auction Night', 'Bid on eco-friendly items.', 'A silent auction featuring donated eco-goods and experiences.', 'https://picsum.photos/seed/auction/800/400',
 'Riverbank Pavilion', '12 Riverside Ave', 'Brisbane', 'QLD', '4000', 'Australia',
 '2025-10-22 18:00:00', '2025-10-22 21:00:00', 0, 0, 'AUD', 200, 60, 800000, 220000),
(2, 4, 'Harbourfront Benefit Concert', 'Live bands for urban greening.', 'An outdoor concert supporting tree planting in urban heat islands.', 'https://picsum.photos/seed/concert/800/400',
 'Harbourfront Stage', '1 Wharf Rd', 'Melbourne', 'VIC', '3000', 'Australia',
 '2025-12-05 17:00:00', '2025-12-05 21:30:00', 0, 7500, 'AUD', 1000, 250, 3000000, 650000),
(1, 1, 'Spring Family Fun Run', '2K/5K for all ages.', 'Bring the kids and pets for a relaxed fun run in the park.', 'https://picsum.photos/seed/springrun/800/400',
 'Centennial Parklands', 'Grand Dr', 'Sydney', 'NSW', '2021', 'Australia',
 '2025-09-01 08:00:00', '2025-09-01 10:00:00', 0, 2000, 'AUD', 600, 600, 1000000, 1000000),
(1, 2, 'Community Health Gala', 'Dinner to expand clinic services.', 'Support expansion of low-cost clinics across the city.', 'https://picsum.photos/seed/healthgala/800/400',
 'Town Hall Ballroom', '483 George St', 'Sydney', 'NSW', '2000', 'Australia',
 '2025-07-14 18:00:00', '2025-07-14 22:00:00', 0, 0, 'AUD', 250, 250, 2500000, 2500000),
(2, 3, 'Riverbank Silent Auction', 'Art & experiences auction.', 'A curated selection of local art and eco-experiences up for bid.', 'https://picsum.photos/seed/riverauction/800/400',
 'Riverbank Pavilion', '12 Riverside Ave', 'Brisbane', 'QLD', '4000', 'Australia',
 '2025-08-20 17:30:00', '2025-08-20 20:30:00', 0, 0, 'AUD', 180, 175, 600000, 590000),
(2, 4, 'Music for the Planet', 'Indie bands fundraiser.', 'Multiple indie bands perform to raise funds for cycling infrastructure.', 'https://picsum.photos/seed/planetmusic/800/400',
 'Harbourfront Stage', '1 Wharf Rd', 'Melbourne', 'VIC', '3000', 'Australia',
 '2025-06-10 16:00:00', '2025-06-10 20:00:00', 1, 5000, 'AUD', 800, 300, 1200000, 400000),
(1, 1, 'Charity Marathon', 'Full and half marathon.', 'Annual marathon raising funds for community sports facilities.', 'https://picsum.photos/seed/marathon/800/400',
 'City Stadium', '100 Stadium Rd', 'Sydney', 'NSW', '2000', 'Australia',
 '2025-11-20 07:00:00', '2025-11-20 14:00:00', 0, 5000, 'AUD', 2000, 1500, 4000000, 2800000),
(2, 2, 'Eco Gala Dinner', 'Dinner supporting eco-projects.', 'A formal dinner with auctions to fund city-wide sustainability programs.', 'https://picsum.photos/seed/ecogala/800/400',
 'Grand Hotel Ballroom', '45 Queen St', 'Brisbane', 'QLD', '4000', 'Australia',
 '2025-12-12 19:00:00', '2025-12-12 23:30:00', 0, 20000, 'AUD', 400, 180, 7000000, 3500000);


INSERT INTO registrations (event_id, full_name, email, contact_phone, tickets_count)
VALUES
(1, 'Linnea Kallio', 'linnea.kallio@gmail.com', '+61-403-981-742', 1),
(2, 'Fergus MacLeod', 'fergus.macleod@outlook.com', '+61-448-229-115', 2),
(3, 'Priyanka Dasgupta', 'priyanka.dasgupta@mail.com', '+61-474-510-230', 1),
(4, 'Mateo Rojas', 'mateo.rojas@hotmail.com', '+61-405-992-310', 3),
(5, 'Haruto Ishida', 'haruto.ishida@yahoo.co.jp', '+61-497-662-891', 1),
(6, 'Ruth Osei', 'ruth.osei@protonmail.com', '+61-430-119-047', 1),
(7, 'Dimitri Petrov', 'd.petrov@zoho.com', '+61-421-339-522', 2),
(8, 'Eimear Ní Bhraonáin', 'eimear.nib@icloud.com', '+61-449-710-368', 1),
(9, 'Thabo Maseko', 'thabo.maseko@gmail.com', '+61-422-997-531', 4),
(10, 'Selina Tan', 'selina.tan@singnet.com.sg', '+61-478-200-456', 2);

