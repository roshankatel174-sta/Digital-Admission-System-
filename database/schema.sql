-- Digital Admission System Database Schema
-- MySQL Database

CREATE DATABASE IF NOT EXISTS digital_admission;
USE digital_admission;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  address TEXT,
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin'
);

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
  college_id INT PRIMARY KEY AUTO_INCREMENT,
  college_name VARCHAR(150) NOT NULL,
  province VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  description TEXT,
  achievements TEXT,
  facilities TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(30),
  image VARCHAR(255) DEFAULT '',
  status VARCHAR(20) DEFAULT 'active'
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  college_id INT,
  course_name VARCHAR(150) NOT NULL,
  duration VARCHAR(50),
  eligibility TEXT,
  fee DECIMAL(10,2),
  seats INT,
  description TEXT,
  career_opportunities TEXT,
  status VARCHAR(20) DEFAULT 'active',
  FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE SET NULL
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  application_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  course_id INT,
  application_date DATE,
  status VARCHAR(20) DEFAULT 'Pending',
  personal_info TEXT,
  academic_info TEXT,
  payment_status VARCHAR(20) DEFAULT 'Unpaid',
  remarks TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  document_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  file_name VARCHAR(255),
  file_type VARCHAR(100),
  file_path VARCHAR(255),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verification_status VARCHAR(20) DEFAULT 'Pending',
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  application_id INT,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50) DEFAULT 'Online',
  payment_status VARCHAR(20) DEFAULT 'Pending',
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE SET NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT,
  sender_role VARCHAR(20),
  receiver_role VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  user_role VARCHAR(20),
  title VARCHAR(150),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  setting_id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT
);

-- College Reviews table
CREATE TABLE IF NOT EXISTS college_reviews (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  college_id INT,
  student_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- =============================================
-- SEED DATA
-- =============================================

-- Admin user (password: admin123)
INSERT INTO admins (name, email, password, role) VALUES
('System Admin', 'admin@das.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Sample students (password: student123)
INSERT INTO students (name, email, password, phone, address, role) VALUES
('Roshan Sharma', 'roshan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9841234567', 'Kathmandu, Nepal', 'student'),
('Sita Thapa', 'sita@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9851234567', 'Pokhara, Nepal', 'student'),
('Ram Poudel', 'ram@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9861234567', 'Lalitpur, Nepal', 'student');

-- Sample colleges
INSERT INTO colleges (college_name, province, location, description, achievements, facilities, contact_email, contact_phone, image, status) VALUES
('Nepal Engineering College', 'Bagmati', 'Bhaktapur, Nepal', 'A premier engineering college offering world-class education in various engineering disciplines with state-of-the-art facilities and experienced faculty members.', 'Ranked #1 in Engineering, 95% placement rate, ISO Certified, Multiple research publications', 'Library, Computer Lab, Sports Complex, Hostel, Cafeteria, Wi-Fi Campus, Research Center', 'info@nec.edu.np', '01-6638512', '', 'active'),
('Tribhuvan University', 'Bagmati', 'Kirtipur, Kathmandu', 'The oldest and largest university in Nepal, established in 1959. Offers diverse programs across arts, science, management, and technology.', 'Largest university in Nepal, 500+ affiliated colleges, International collaborations, Research excellence', 'Central Library, Museums, Sports Facilities, Student accommodation, Conference halls', 'info@tu.edu.np', '01-4330433', '', 'active'),
('Kathmandu University', 'Bagmati', 'Dhulikhel, Kavre', 'An autonomous, not-for-profit, self-sustaining public institution established in 1991 with a mission to provide quality education.', 'QS Asia ranked, Innovation hub, International partnerships, 90% employment rate', 'Modern Labs, Digital Library, Innovation Center, Hostels, Medical Center, Amphitheater', 'info@ku.edu.np', '011-661399', '', 'active'),
('Pokhara University', 'Gandaki', 'Pokhara, Kaski', 'A leading university in western Nepal offering quality education in engineering, management, health sciences, and humanities.', 'Regional excellence, Industry partnerships, Research grants, Alumni network of 50,000+', 'Science Labs, Computer Center, Library, Auditorium, Sports Ground, Canteen', 'info@pu.edu.np', '061-504072', '', 'active'),
('Purbanchal University', 'Koshi', 'Biratnagar, Morang', 'Eastern Nepal premier university providing accessible quality higher education with focus on regional development.', 'Eastern region leader, Community engagement, Scholarly publications, Technical training center', 'Research Labs, E-Library, Workshop Halls, Student Union, Health Center', 'info@puruni.edu.np', '021-525650', '', 'active');

-- Sample courses
INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES
(1, 'Bachelor of Computer Engineering', '4 years', 'Passed +2 Science with Physics, Chemistry, Mathematics with minimum 50% aggregate', 450000.00, 48, 'Comprehensive program covering software engineering, computer networks, AI, database systems, and embedded systems.', 'Software Developer, Network Engineer, System Analyst, IT Manager, Data Scientist', 'active'),
(1, 'Bachelor of Civil Engineering', '4 years', 'Passed +2 Science with Physics, Chemistry, Mathematics with minimum 50% aggregate', 420000.00, 48, 'Study structural engineering, transportation, water resources, geotechnical engineering, and construction management.', 'Structural Engineer, Construction Manager, Urban Planner, Transportation Engineer', 'active'),
(2, 'Bachelor of Science in Computer Science', '4 years', 'Passed +2 Science/Management with Mathematics', 280000.00, 60, 'Core CS curriculum covering algorithms, data structures, programming languages, operating systems, and software engineering.', 'Software Engineer, Web Developer, Database Administrator, Research Scientist', 'active'),
(2, 'Bachelor of Business Administration', '4 years', 'Passed +2 in any stream with minimum 45% aggregate', 320000.00, 80, 'Comprehensive management program with specializations in finance, marketing, HR, and operations management.', 'Business Analyst, Marketing Manager, HR Manager, Entrepreneur, Consultant', 'active'),
(3, 'Bachelor of Computer Science', '4 years', 'Passed +2 Science with Mathematics, minimum 55% aggregate, entrance exam', 520000.00, 40, 'Cutting-edge CS program with emphasis on AI, machine learning, cybersecurity, and cloud computing.', 'AI Engineer, ML Researcher, Cybersecurity Analyst, Cloud Architect, CTO', 'active'),
(3, 'Bachelor of Pharmacy', '4 years', 'Passed +2 Science with Biology, Chemistry, minimum 50% aggregate', 480000.00, 40, 'Professional pharmacy program covering pharmaceutical chemistry, pharmacology, clinical pharmacy, and drug design.', 'Clinical Pharmacist, Pharmaceutical Researcher, Drug Inspector, Hospital Pharmacist', 'active'),
(4, 'Bachelor of Engineering in IT', '4 years', 'Passed +2 Science with PCM, minimum 50% aggregate', 350000.00, 48, 'IT engineering program covering software development, networking, database management, and web technologies.', 'IT Engineer, Network Administrator, Web Developer, System Analyst', 'active'),
(4, 'Bachelor of Hotel Management', '4 years', 'Passed +2 in any stream with minimum 45% aggregate', 300000.00, 60, 'Hospitality management program covering hotel operations, food & beverage, tourism, and event management.', 'Hotel Manager, Restaurant Manager, Event Planner, Tourism Officer', 'active'),
(5, 'Bachelor of Science in Nursing', '4 years', 'Passed +2 Science with Biology, minimum 50% aggregate', 380000.00, 50, 'Professional nursing program preparing students for clinical practice, community health, and healthcare leadership.', 'Registered Nurse, Clinical Nurse, Nurse Educator, Healthcare Administrator', 'active'),
(5, 'Bachelor of Education', '4 years', 'Passed +2 in any stream with minimum 45% aggregate', 180000.00, 100, 'Teacher preparation program covering pedagogy, curriculum development, educational psychology, and classroom management.', 'School Teacher, Curriculum Developer, Education Counselor, Academic Coordinator', 'active');

-- Sample applications
INSERT INTO applications (student_id, course_id, application_date, status, personal_info, academic_info, payment_status) VALUES
(1, 1, '2026-01-15', 'Approved', '{"father_name":"Hari Sharma","mother_name":"Gita Sharma","dob":"2005-05-15","gender":"Male","nationality":"Nepali"}', '{"gpa":"3.6","board":"NEB","passed_year":"2025","school":"Sunshine Academy"}', 'Paid'),
(1, 5, '2026-02-10', 'Pending', '{"father_name":"Hari Sharma","mother_name":"Gita Sharma","dob":"2005-05-15","gender":"Male","nationality":"Nepali"}', '{"gpa":"3.6","board":"NEB","passed_year":"2025","school":"Sunshine Academy"}', 'Unpaid'),
(2, 3, '2026-01-20', 'Approved', '{"father_name":"Krishna Thapa","mother_name":"Laxmi Thapa","dob":"2005-08-20","gender":"Female","nationality":"Nepali"}', '{"gpa":"3.8","board":"NEB","passed_year":"2025","school":"Himalaya School"}', 'Paid'),
(2, 4, '2026-02-05', 'Rejected', '{"father_name":"Krishna Thapa","mother_name":"Laxmi Thapa","dob":"2005-08-20","gender":"Female","nationality":"Nepali"}', '{"gpa":"3.8","board":"NEB","passed_year":"2025","school":"Himalaya School"}', 'Unpaid'),
(3, 7, '2026-02-15', 'Pending', '{"father_name":"Bishnu Poudel","mother_name":"Saraswati Poudel","dob":"2005-12-01","gender":"Male","nationality":"Nepali"}', '{"gpa":"3.2","board":"NEB","passed_year":"2025","school":"National School"}', 'Unpaid');

-- Sample payments
INSERT INTO payments (student_id, application_id, amount, payment_method, payment_status) VALUES
(1, 1, 450000.00, 'eSewa', 'Completed'),
(2, 3, 280000.00, 'Khalti', 'Completed');

-- Sample notifications
INSERT INTO notifications (user_id, user_role, title, message, is_read) VALUES
(1, 'student', 'Welcome!', 'Welcome to Digital Admission System! Start by browsing colleges and courses.', 0),
(1, 'student', 'Application Approved', 'Your application for Bachelor of Computer Engineering has been approved!', 0),
(2, 'student', 'Welcome!', 'Welcome to Digital Admission System!', 1),
(2, 'student', 'Application Approved', 'Your application for BSc Computer Science has been approved!', 0);

-- Sample messages
INSERT INTO messages (sender_id, sender_role, receiver_role, message) VALUES
(1, 'student', 'admin', 'Hello, I wanted to ask about the scholarship options available for Computer Engineering.'),
(1, 'admin', 'student', 'Hello! We offer merit-based scholarships for students with GPA above 3.5. Please visit our scholarship page for more details.'),
(2, 'student', 'admin', 'When does the new semester start for BSc Computer Science?');

-- Default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'EduPortal Max'),
('site_email', 'info@eduportalmax.com'),
('site_phone', '+977-01-4567890'),
('admission_open', 'true'),
('max_applications', '5'),
('maintenance_mode', 'false');

-- Sample reviews
INSERT INTO college_reviews (college_id, student_id, rating, review_text) VALUES
(1, 1, 5, 'Great engineering college with excellent facilities and faculty.'),
(1, 2, 4, 'Good environment but the library needs more recent books.'),
(2, 3, 5, 'The best university for computer science in the region.');
