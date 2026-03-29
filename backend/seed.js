const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

// Procedural 1000+ Word Generator
function generateHugeDescription(collegeName, province) {
  const p1 = `Welcome to the official institutional profile of ${collegeName}, a premier and highly distinguished establishment of higher learning proudly situated in the vibrant province of ${province}. Since its inception, ${collegeName} has remained steadfastly committed to the noble cause of democratizing education and pushing the boundaries of academic excellence, technological innovation, and societal development. This institution was not merely built as a physical space for learning, but envisioned as a transformative ecosystem where raw potential is sculpted into global competence. Here, students from entirely diverse socioeconomic and geographical backgrounds converge with a shared ambition: to redefine their futures, empower their communities, and contribute meaningfully to the rapidly evolving global workforce. The province of ${province} provides a uniquely enriching backdrop to this educational journey, offering a harmonious blend of cultural heritage and modern advancement. The dynamic local economy and community initiatives in ${province} closely intertwine with the university's holistic curriculum, ensuring that the theoretical knowledge imparted within the four walls of the classroom is always supplemented by practical, real-world applicability.`;
  
  const p2 = `The historical legacy of ${collegeName} is a testament to resilience, academic integrity, and forward-thinking leadership. Founded during a period of transformative educational reform, the institution began its operations with a modest cohort of students and a handful of dedicated visionaries. Through relentless perseverance, strategic expansion, and an unwavering commitment to quality assurance, it has organically blossomed into a multi-disciplinary powerhouse widely recognized across national and international educational paradigms. The founders believed unequivocally that education should not be a static transfer of information, but a dynamic, lifelong process of inquiry, rigorous debate, and creative problem-solving. Over the decades, ${collegeName} has completely revolutionized its pedagogical methodologies, seamlessly integrating modern technology, artificial intelligence, data analytics, and interactive e-learning modules into its core instructional fabric. Today, its historic main building stands as a powerful symbol of heritage, while its newly inaugurated science and technology parks embody an ambitious leap into the digital future.`;

  const p3 = `Academically, ${collegeName} operates across a vast and comprehensive spectrum of disciplines, offering an exhaustive array of undergraduate, postgraduate, and specialized doctoral programs. The institution prides itself on housing a world-class faculty composed of seasoned industry experts, published researchers, and decorated academicians who bring a wealth of practical experience and intellectual rigor to the academic tables. The curriculum is meticulously crafted and continuously audited by an independent board of educational authorities to maintain rigorous alignment with international accreditation standards. Students at ${collegeName} are relentlessly encouraged to question the status quo, engage in cross-disciplinary projects, and participate in cutting-edge research. Whether a student is pursuing advanced software engineering, molecular biology, business administration, aerospace mechanics, or the fine arts, they are guaranteed access to state-of-the-art laboratories, high-tech simulation centers, and an expansive digital library that subscribes to thousands of premium global academic journals. The rigorous evaluation system implemented here ensures that graduates do not merely memorize facts but deeply internalize the underlying principles, rendering them highly competitive in the fierce global job market.`;

  const p4 = `The infrastructure and campus facilities at ${collegeName} are nothing short of spectacular, meticulously architected to provide an optimal and immersive learning environment. Spanning hundreds of acres of lush, eco-friendly green spaces, the campus is entirely self-sufficient, featuring a massive central library with millions of physical and digital volumes, technologically advanced smart-classrooms equipped with interactive digital boards, and massive auditorium halls capable of hosting global symposia. Furthermore, the campus features fully integrated high-speed Wi-Fi, specialized innovation hubs, and incubation centers dedicated solely to nurturing student startups. For student well-being, the campus boasts a comprehensive sports complex featuring an Olympic-sized swimming pool, indoor courts, and extensive outdoor fields, promoting physical fitness alongside academic rigor. The residential hostels are world-class, providing safe, comfortable, and highly secure accommodations that foster a tightly-knit, vibrant community of scholars. A fully equipped, 24/7 medical center operates on campus to guarantee the health and safety of every individual, while diverse, hygienic cafeterias cater to a multitude of dietary preferences.`;

  const p5 = `A critical pillar of the ${collegeName} experience is its deeply ingrained culture of research, innovation, and global collaboration. The institution boldly champions the pursuit of uncharted knowledge, allocating massive operational budgets annually entirely toward securing cutting-edge research grants and establishing interdisciplinary research institutes. Students are paired with faculty mentors from day one, participating in groundbreaking studies in renewable energy, artificial intelligence, public health, sustainable agriculture, and advanced robotics. The institution has proudly signed Memorandum of Understandings (MoUs) with dozens of top-tier international universities across North America, Europe, and Asia, facilitating massive student exchange programs, joint research initiatives, and globally recognized dual-degree programs. By exposing students to an international learning ecosystem, ${collegeName} inherently fosters a rich, multicultural perspective, tearing down geographical barriers and building a highly competent, globally aware generation of future leaders.`;

  const p6 = `Beyond academics and research, student life at ${collegeName} is celebrated as a wildly vibrant, dynamic, and unforgettable journey. The administration firmly believes that a highly restrictive, purely academic focus limits true human potential. Therefore, the university is home to over a hundred diverse student-led clubs, societies, and organizations spanning robotics, drama, music, debate, entrepreneurship, and volunteering. Annual cultural festivals, highly competitive hackathons, and massive sports tournaments routinely transform the campus into a magnificent celebration of talent, diversity, and collaborative spirit. This incredibly active student ecosystem inherently develops crucial soft skills such as leadership, public speaking, conflict resolution, and teamwork. The Career Services Office works tirelessly round the clock to bridge the gap between academia and industry, organizing massive job fairs, hosting weekly corporate seminars, and maintaining a robust alumni network. Graduates from ${collegeName} are aggressively sought after by top multinational corporations, leading research institutes, and governmental agencies, a strong testament to the incredible and unparalleled value of an education received at this spectacular institution located within ${province}.`;

  return [p1, p2, p3, p4, p5, p6].join('\n\n');
}

const ALL_COLLEGES = [
  // Koshi
  { name: 'Koshi Technology Institute', province: 'Koshi', loc: 'Biratnagar', type: 'Tech' },
  { name: 'Eastern Region University', province: 'Koshi', loc: 'Dharan', type: 'General' },
  { name: 'Purbanchal Science College', province: 'Koshi', loc: 'Itahari', type: 'Science' },
  { name: 'Mechi Management Campus', province: 'Koshi', loc: 'Bhadrapur', type: 'Business' },
  { name: 'Sunsari Medical Academy', province: 'Koshi', loc: 'Duhabi', type: 'Medical' },
  
  // Madhesh
  { name: 'Madhesh National University', province: 'Madhesh', loc: 'Janakpur', type: 'General' },
  { name: 'Birgunj Institute of Technology', province: 'Madhesh', loc: 'Birgunj', type: 'Tech' },
  { name: 'Janaki Medical College', province: 'Madhesh', loc: 'Janakpur', type: 'Medical' },
  { name: 'Lahan Business School', province: 'Madhesh', loc: 'Lahan', type: 'Business' },
  { name: 'Terai Agriculture Campus', province: 'Madhesh', loc: 'Rajbiraj', type: 'Science' },

  // Bagmati
  { name: 'Himalayan Institute of Technology', province: 'Bagmati', loc: 'Kathmandu', type: 'Tech' },
  { name: 'Bagmati State University', province: 'Bagmati', loc: 'Lalitpur', type: 'General' },
  { name: 'Capital Business Academy', province: 'Bagmati', loc: 'Kathmandu', type: 'Business' },
  { name: 'Chitwan Medical Sciences', province: 'Bagmati', loc: 'Bharatpur', type: 'Medical' },
  { name: 'Hetauda Forest & Agriculture', province: 'Bagmati', loc: 'Hetauda', type: 'Science' },

  // Gandaki
  { name: 'Gandaki Global University', province: 'Gandaki', loc: 'Pokhara', type: 'General' },
  { name: 'Pokhara Engineering College', province: 'Gandaki', loc: 'Pokhara', type: 'Tech' },
  { name: 'Mount Annapurna Institute', province: 'Gandaki', loc: 'Lekhnath', type: 'Business' },
  { name: 'Gorkha Academy of Arts', province: 'Gandaki', loc: 'Gorkha', type: 'General' },
  { name: 'Dhaulagiri Medical Campus', province: 'Gandaki', loc: 'Baglung', type: 'Medical' },

  // Lumbini
  { name: 'Lumbini Buddha University', province: 'Lumbini', loc: 'Bhairahawa', type: 'General' },
  { name: 'Butwal IT Academy', province: 'Lumbini', loc: 'Butwal', type: 'Tech' },
  { name: 'Rapti Engineering College', province: 'Lumbini', loc: 'Ghorahi', type: 'Tech' },
  { name: 'Tansen Management School', province: 'Lumbini', loc: 'Tansen', type: 'Business' },
  { name: 'Kapilvastu Science College', province: 'Lumbini', loc: 'Taulihawa', type: 'Science' },

  // Karnali
  { name: 'Karnali Central University', province: 'Karnali', loc: 'Birendranagar', type: 'General' },
  { name: 'Surkhet Technical College', province: 'Karnali', loc: 'Surkhet', type: 'Tech' },
  { name: 'Jumla Medical Sciences', province: 'Karnali', loc: 'Jumla', type: 'Medical' },
  { name: 'Mid-Western Business Academy', province: 'Karnali', loc: 'Dailekh', type: 'Business' },
  { name: 'Rara Environmental College', province: 'Karnali', loc: 'Mugu', type: 'Science' },

  // Sudurpashchim
  { name: 'Sudurpashchim State University', province: 'Sudurpashchim', loc: 'Dhangadhi', type: 'General' },
  { name: 'Far-West Engineering Institute', province: 'Sudurpashchim', loc: 'Mahendranagar', type: 'Tech' },
  { name: 'Tikapur Agriculture Campus', province: 'Sudurpashchim', loc: 'Tikapur', type: 'Science' },
  { name: 'Doti Management College', province: 'Sudurpashchim', loc: 'Dipayal', type: 'Business' },
  { name: 'Mahakali Medical Academy', province: 'Sudurpashchim', loc: 'Kanchanpur', type: 'Medical' },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('Resetting entire database gracefully...');
  await connection.query('DROP DATABASE IF EXISTS digital_admission');
  await connection.query('CREATE DATABASE digital_admission');
  await connection.query('USE digital_admission');

  // Load and execute Schema
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  const statements = schema.split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.toUpperCase().includes('CREATE TABLE'));

  for (let stmt of statements) {
    if (stmt) await connection.query(stmt);
  }
  console.log('Tables re-created from scratch!');

  // Base Data
  const adminHash = await bcrypt.hash('admin123', 10);
  const studentHash = await bcrypt.hash('student123', 10);
  await connection.query('INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)', ['System Admin', 'admin@eduportalmax.com', adminHash, 'admin']);
  
  const students = [
    ['Roshan Sharma', 'roshan@example.com', studentHash, '9841234567', 'Kathmandu, Nepal'],
    ['Sita Thapa', 'sita@example.com', studentHash, '9851234567', 'Pokhara, Nepal'],
    ['Ram Poudel', 'ram@example.com', studentHash, '9861234567', 'Lalitpur, Nepal'],
  ];
  for (const s of students) {
    await connection.query('INSERT INTO students (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)', [...s, 'student']);
  }

  // Settings
  const settings = [
    ['site_name', 'EduPortal Max'],
    ['site_email', 'info@eduportalmax.com'],
    ['site_phone', '+977-01-4567890'],
    ['admission_open', 'true'],
    ['max_applications', '5'],
    ['maintenance_mode', 'false'],
  ];
  for (const s of settings) {
    await connection.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', s);
  }

  console.log('Seeding 35 Massive Proceedurally Generated Colleges...');
  for (const col of ALL_COLLEGES) {
    const desc = generateHugeDescription(col.name, col.province);
    const achievements = `Globally ranked #Top regional institution | ISO 9001:2026 Certified | 95%+ Graduate Placement | 50+ Ongoing Global Research Grants`;
    const facilities = `Central Smart Library, Advanced Computing Network, Modern Robotics Labs, 24/7 Health Clinic, Twin Auditorium Centers, Massive Sports Complex, Incubation Centers`;
    const email = `contact@${col.name.toLowerCase().replace(/[^a-z]/g, '')}.edu.np`;
    const res = await connection.query(
      'INSERT INTO colleges (college_name, province, location, description, achievements, facilities, contact_email, contact_phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [col.name, col.province, col.loc, desc, achievements, facilities, email, '01-4000000', 'active']
    );
    
    // Seed 2 courses per college to make platform rich
    const cid = res[0].insertId;
    
    if (col.type === 'Tech') {
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'Bachelor of Computer Engineering', '4 years', '+2 Science with Physics, Math (Min 50%)', 450000, 48, 'Intensive software and hardware engineering.', 'Software Dev, Systems Arch, AI Engineer', 'active']);
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'BSc Artificial Intelligence', '4 years', '+2 Science (Math), Min 55%', 500000, 48, 'Cutting edge AI, ML, Neural Networks.', 'ML Engineer, Data Scientist', 'active']);
    } else if (col.type === 'Medical') {
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'BSc Nursing', '4 years', '+2 Science (Biology), Min 50%', 650000, 40, 'Advanced clinical and surgical nursing.', 'Registered Nurse, Head Nurse', 'active']);
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'Bachelor of Pharmacy', '4 years', '+2 Science, Min 50%', 550000, 48, 'Pharmacological research and clinical chemistry.', 'Pharmacist, QA Manager', 'active']);
    } else if (col.type === 'Business') {
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'Bachelor of Business Administration', '4 years', '+2 Any Stream, Min 45%', 350000, 80, 'Finance, Marketing, HR deep dive.', 'Corporate Manager, Analyst, Entrepreneur', 'active']);
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'BSc Actuarial Science', '4 years', '+2 Science/Management (Math)', 450000, 48, 'Risk analysis, mathematics, and high-level finance.', 'Actuary, Financial Analyst', 'active']);
    } else {
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'BSc Computer Science', '4 years', '+2 Science, Min 50%', 350000, 60, 'Core computer science fundamentals and development.', 'Full-stack Dev, QA', 'active']);
      await connection.query('INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cid, 'Bachelor of Arts (Economics)', '4 years', '+2 Any Stream, Min 45%', 250000, 100, 'Global macro and micro economics.', 'Economist, Researcher', 'active']);
    }
  }

  console.log('✅ ALL SEED DATA SUCCESSFULLY GENERATED (35 Colleges / 7 Provinces)!');
  await connection.end();
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
