// Seeds Richfield 2027 prospectus modules and clearly fictional demo tutors.
// Run from the server directory: node seed-richfield-2027.js
import "./config.js"; // loads server/.env
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Subject from "./models/Subject.js";
import User from "./models/User.js";
import TutorProfile from "./models/TutorProfile.js";

const curriculum = {
  "BSc Information Technology (BSc IT)": [
    "Information Systems 511", "Information Systems 512", "Programming 511", "Programming 512", "Web Technology 511", "Web Technology 512", "Networks 511", "Networks 512", "Mathematics 511", "Mathematics 512", "Data Science 500",
    "Information Systems 621", "Information Systems 622", "Programming 621", "Programming 622", "Database Systems 600", "Big Data & IOT 600", "Cloud Computing 600", "Machine Learning 600", "Internet Programming 621", "Internet Programming 622", "Data Manipulation & Visualisation 600", "Statistics for Data Science 600", "Business Analysis 621", "Business Analysis 622", "Computer Architecture 600", "Server Technology 600",
    "Software Engineering 700", "IT Project 700", "Programming 731", "Programming 732", "Cyber Security 700", "Mobile App Development 700", "Artificial Intelligence 700", "Work Integrated Learning 700", "Human Computer Interaction 700", "Operating Systems 700", "Programming 741", "Programming 742", "Machine Learning 700", "Autonomous Systems & Robotics 700", "IT Strategic Management 731", "IT Strategic Management 732", "Networks 731", "Networks 732"
  ],
  "Diploma in Information Technology (DIT)": [
    "Software Development 500", "Business Communication 500", "M-Commerce 621", "M-Commerce 622", "Database Systems 621", "Database Systems 622", "Business Management 621", "Business Management 622", "Networks 621", "Networks 622", "Software Engineering 600", "Quantitative Techniques 600", "IT Project Management 600", "IT Project 600", "Management Information Systems 600", "Human Computer Interaction 600", "Operating Systems 600", "Programming 631", "Programming 632", "Networks 631", "Networks 632", "Business Analysis 631", "Business Analysis 632"
  ],
  "Higher Certificate in Information Technology (HCIT)": [
    "Introduction to Computers 500", "System Software 500", "e-Commerce 511", "e-Commerce 512", "Introduction to Web Tech 500", "Introduction to Programming 500", "Introduction to Information Technology 500", "Business Communication 500", "Work Integrated Learning 500", "IT Help Desk 500"
  ],
  "Higher Certificate in Computer Forensics": [
    "Forensic Computing Foundations 500", "Forensic Science 500", "Forensic Exploitation and Intelligence 500", "Internet Forensics 500", "Digital Crime and Investigation 500", "Network Forensics 500", "Advanced Forensic Computing 500"
  ],
  "BSc Honours in Information Technology": [
    "Information and Cyber Security 800", "Metaverse 800", "Research Methodology 800", "Big Data Analytics 800", "Information Technology Strategy and Governance 800", "Research Project 800", "Advanced Software Engineering 800", "IT Entrepreneurship and Innovation", "IT Law and Ethics"
  ],
  "BSc IT Honours Bridging Programme": [
    "Elementary Algebra", "Emerging Technologies", "Fundamentals of Research Methodology", "Theory of Programming", "Web Technology"
  ],
  "Bachelor of Commerce (BCom)": [
    "Business Ethics 500", "Economics 511", "Economics 512", "Accounting 511", "Accounting 512", "Statistics 511", "Statistics 512", "Information Systems 511", "Information Systems 512", "Human Resource Management 511", "Human Resource Management 512", "Marketing Management 511", "Marketing Management 512", "Entrepreneurship 500", "Economics 621", "Economics 622", "Stakeholder Relations 621", "Stakeholder Relations 622", "Commercial Law 621", "Commercial Law 622", "Accounting 621", "Accounting 622", "Marketing Management 621", "Marketing Management 622", "Human Resource Management 621", "Human Resource Management 622", "Strategic Management 731", "Strategic Management 732", "Market Research 700", "Training & Development 700", "Entrepreneurship & Small Business Management 700", "Total Quality Management 700", "Contemporary Issues in Industrial Relations 700", "Work Integrated Learning 700", "Accounting 731", "Accounting 732", "Marketing Management 731", "Marketing Management 732", "Human Resource Management 731", "Human Resource Management 732"
  ],
  "Bachelor of Commerce (AGA)": [
    "Auditing 621", "Auditing 622", "Taxation 621", "Taxation 622", "Financial Management & Managerial Accounting 621", "Financial Management & Managerial Accounting 622", "Auditing and Assurance 731", "Auditing and Assurance 732", "Taxation 731", "Taxation 732", "Financial Management & Managerial Accounting 731", "Financial Management & Managerial Accounting 732"
  ],
  "Bachelor of Commerce (AGA IT)": [
    "Business Ethics 500", "Economics 511", "Economics 512", "Accounting 511", "Accounting 512", "Statistics 511", "Statistics 512", "Information Systems 511", "Information Systems 512", "Entrepreneurship 500", "Auditing 621", "Auditing 622", "Information Technology Governance, Risk and Compliance 621", "Information Technology Governance, Risk and Compliance 622", "Applied Programming and Automation for Business 621", "Applied Programming and Automation for Business 622", "Accounting 621", "Accounting 622", "Financial Management & Managerial Accounting 621", "Financial Management & Managerial Accounting 622", "Taxation 621", "Taxation 622", "Accounting 731", "Accounting 732", "Applied Programming and Automation for Business 731", "Applied Programming and Automation for Business 732", "Information Technology Governance, Risk and Compliance 731", "Information Technology Governance, Risk and Compliance 732"
  ],
  "Bachelor of Business Administration (BBA)": [
    "Business Communication 511", "Business Communication 512", "Business Management 511", "Business Management 512", "Economics 511", "Economics 512", "Information Systems 511", "Information Systems 512", "Accounting 511", "Accounting 512", "Human Resource Management 511", "Human Resource Management 512", "Marketing Management 511", "Marketing Management 512", "Supply Chain Management 511", "Supply Chain Management 512", "Business Statistics 621", "Business Statistics 622", "Industrial Psychology 621", "Industrial Psychology 622", "Commercial Law 621", "Commercial Law 622", "Business Ethics 621", "Business Ethics 622", "Business Management 621", "Business Management 622", "Supply Chain Management 621", "Supply Chain Management 622", "Entrepreneurship and SBM 731", "Entrepreneurship and SBM 732", "Project Management 731", "Project Management 732", "Total Quality Management 731", "Total Quality Management 732", "Research Methodology 700", "Supply Chain Management 731", "Supply Chain Management 732"
  ],
  "Bachelor of Public Management (BPM)": [
    "Public Management 511", "Public Management 512", "Introduction to Economics 511", "Public Sector Economics 512", "Communication 500", "Fundamentals of Research 500", "Information Systems 511", "Information Systems 512", "Public Management 621", "Public Management 622", "Local Government Management 621", "Local Government Management 622", "Introduction to Politics 600", "Public Law 600", "Public Sector HRM 600", "Project Management 600", "Public Management 731", "Public Management 732", "Local Government Management 731", "Local Government Management 732", "Ethics in Public Sector 700", "Research Project 700", "Public Sector Finance 700", "Work Integrated Learning 700"
  ],
  "Diploma in Business Administration (DBA)": [
    "Business Communication 511", "Business Communication 512", "Business Management 511", "Business Management 512", "Information Systems 511", "Information Systems 512", "Accounting 511", "Accounting 512", "Training and Development 511", "Training and Development 512", "Economics 511", "Economics 512", "Human Resource Management 511", "Human Resource Management 512", "Supply Chain Management 511", "Supply Chain Management 512", "Business Management 621", "Business Management 622", "Business Statistics 621", "Business Statistics 622", "Commercial Law 621", "Commercial Law 622", "Marketing Management 621", "Marketing Management 622", "Total Quality Management 621", "Total Quality Management 622", "Local Government Management 631", "Local Government Management 632", "Strategic Management 631", "Strategic Management 632", "Fundamentals of Research 600", "Entrepreneurship and Small Business Management 631", "Entrepreneurship and Small Business Management 632", "Industrial Psychology 631", "Industrial Psychology 632", "Disaster Management 600", "Work Integrated Learning 600", "Project Management 631", "Project Management 632", "Economics 631", "Economics 632", "Public Management 631", "Public Management 632", "Human Resource Management 631", "Human Resource Management 632", "Supply Chain Management 631", "Supply Chain Management 632"
  ],
  "Diploma in Local Government Management (DLGM)": [
    "Local Government Management 511", "Local Government Management 512", "Public Management 511", "Public Management 512", "Information Systems 511", "Information Systems 512", "Business Communication 511", "Business Communication 512", "Local Government Management 621", "Local Government Management 622", "Economics 621", "Economics 622", "Local Government HRM 621", "Local Government HRM 622", "Local Government Procurement 600", "Local Government Policy Process 600", "Local Government Ethics and Professionalism 600", "Local Economic Development 600", "Professionalism 600", "Local Government Mandates 600", "Local Government Project Management 600", "Local Government Management 631", "Local Government Management 632", "Disaster Management 600", "Work Integrated Learning 600", "Public Management 631", "Public Management 632", "Local Government Service Delivery Mandates 600", "Research Project 600", "Local Government Finance 500", "Local Government Policing 500", "Ethics and Professionalism 500"
  ],
  "Higher Certificate in Business Administration (HCBA)": [
    "Economic Environment 500", "General Management 511", "General Management 512", "Fundamentals of Accounting 511", "Fundamentals of Accounting 512", "Information Systems 511", "Information Systems 512", "Introduction to Commercial Law 500", "Human Relations 500", "Marketing Management 500", "Work Integrated Learning 500"
  ],
  "Higher Certificate in Office Administration (HCOA)": [
    "Office Administration 511", "Office Administration 512", "Office Communication 511", "Office Communication 512", "Fundamentals of Accounting 511", "Fundamentals of Accounting 512", "Information Systems 511", "Information Systems 512", "Economic Environment 500", "Introduction to Commercial Law 500", "General Management 511", "General Management 512", "Human Relations 500", "Marketing Management 500", "Work Integrated Learning 500"
  ],
  "Higher Certificate in Local Government Management": [
    "Local Government Management 500", "Project Management 500", "Local Government HRM 500", "Disaster Management 500", "Local Government Policing 500", "Ethics and Professionalism 500", "Local Government Finance 500", "Work Integrated Learning 500"
  ],
  "Higher Certificate in Recognition of Prior Learning Activities": [
    "Facilitate Implementation of RPL 511", "RPL Applications 512", "Work Integrated Learning 500 (RPL)", "Profile 511"
  ],
  "Master of Business Administration (MBA)": [
    "Strategic Leadership 900", "Business Research 900", "Strategic Operations Management 900", "International Business Strategy 900", "Innovative Talent Management 900", "Managing Digital Transformation 900", "Strategic Financial Management 900", "Strategic Marketing Management 900", "Strategic Information Technology Management 900", "Entrepreneurship and Innovation 900", "Business Ethics and Corporate Governance 900", "Women in Leadership", "Emerging & Disruptive Technologies", "Global Immersion"
  ],
  "Postgraduate Diploma in Management (PGDM)": [
    "Managerial Economics 800", "Managerial Finance 800", "Marketing Management 800", "Human Resource Management 800", "Research Methodology 800", "Research Report 800", "Innovation and Change Management 800", "IT Management 800", "Operations Management 800", "Entrepreneurship and Innovation 800", "Public Sector Management 800", "Data Analytics for Managers 800"
  ],
  "Postgraduate Bridging Course: Management Technology and Research Foundation": [
    "Business Innovation", "Emerging Technologies", "Financial Management", "Fundamentals of Research Methodology", "Applied Economics"
  ]
};

// Demo identities are fictional placeholders, not real Richfield tutors.
const tutorDefinitions = [
  { name: "Demo Tutor 01 - Programming", email: "demo.tutor01@example.com", bio: "Demo profile for programming, web development, software engineering and mobile application modules.", match: /program|web technology|internet programming|software|mobile app|human computer interaction|system software|operating systems|theory of programming/i },
  { name: "Demo Tutor 02 - Networks & Security", email: "demo.tutor02@example.com", bio: "Demo profile for networking, systems, cyber security and computer forensics modules.", match: /network|cyber|security|forensic|digital crime|computer architecture|server technology|cloud computing/i },
  { name: "Demo Tutor 03 - Data & AI", email: "demo.tutor03@example.com", bio: "Demo profile for data science, analytics, statistics, AI and machine learning modules.", match: /data|statistics|machine learning|artificial intelligence|big data|analytics|mathematics|algebra|robotics|iot|visualisation/i },
  { name: "Demo Tutor 04 - IT Systems", email: "demo.tutor04@example.com", bio: "Demo profile for information systems, databases, IT projects, research and technology management.", match: /information systems|database|it project|project management|research|technology|metaverse|digital transformation|business analysis|e-commerce|m-commerce/i },
  { name: "Demo Tutor 05 - Accounting", email: "demo.tutor05@example.com", bio: "Demo profile for accounting, auditing, taxation and financial management modules.", match: /accounting|auditing|taxation|financial management|finance|it audit/i },
  { name: "Demo Tutor 06 - Economics & Quantitative", email: "demo.tutor06@example.com", bio: "Demo profile for economics, statistics, quantitative techniques and business mathematics modules.", match: /economics|statistics|quantitative|business statistics|algebra/i },
  { name: "Demo Tutor 07 - Business Management", email: "demo.tutor07@example.com", bio: "Demo profile for business management, strategy, entrepreneurship and quality management modules.", match: /business management|strategic management|entrepreneurship|small business|quality management|general management|operations management|innovation|mba|leadership|change management/i },
  { name: "Demo Tutor 08 - Human Resources", email: "demo.tutor08@example.com", bio: "Demo profile for human resources, industrial psychology, training and labour relations modules.", match: /human resource|hrm|industrial psychology|training|development|human relations|industrial relations|talent/i },
  { name: "Demo Tutor 09 - Marketing & Communication", email: "demo.tutor09@example.com", bio: "Demo profile for marketing, business communication, stakeholder relations and office communication modules.", match: /marketing|communication|stakeholder|market research|business ethics|commercial law/i },
  { name: "Demo Tutor 10 - Supply Chain", email: "demo.tutor10@example.com", bio: "Demo profile for supply chain, procurement, logistics and operations modules.", match: /supply chain|procurement|logistics/i },
  { name: "Demo Tutor 11 - Public Management", email: "demo.tutor11@example.com", bio: "Demo profile for public management, public-sector finance, public law and policy modules.", match: /public management|public sector|public law|politics|policy|ethics in public|public-sector/i },
  { name: "Demo Tutor 12 - Local Government", email: "demo.tutor12@example.com", bio: "Demo profile for local government, municipal management, finance and public administration modules.", match: /local government|municipal|disaster management|local government finance|local government policing|professionalism/i },
  { name: "Demo Tutor 13 - Office Administration", email: "demo.tutor13@example.com", bio: "Demo profile for office administration, office communication and administrative support modules.", match: /office administration|office communication|facilitate implementation|rpl applications|profile 511/i },
  { name: "Demo Tutor 14 - General Academic Support", email: "demo.tutor14@example.com", bio: "Demo profile for general management, research, work-integrated learning and cross-disciplinary modules.", match: /./ }
];

const DEMO_PASSWORD = "DemoTutor2027!"; // Local demonstration only. Change/remove before deployment.

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing. Check server/.env.");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const programmeByModule = new Map();
  for (const [programme, modules] of Object.entries(curriculum)) {
    for (const rawName of modules) {
      const name = rawName.trim().replace(/\s+/g, " ");
      if (!programmeByModule.has(name)) programmeByModule.set(name, new Set());
      programmeByModule.get(name).add(programme);
    }
  }

  const subjectByName = new Map();
  for (const [name, programmes] of programmeByModule.entries()) {
    const description = `Richfield 2027 prospectus module. Programme(s): ${[...programmes].join("; ")}. Tutor profiles in this app are demonstration profiles.`;
    const subject = await Subject.findOneAndUpdate(
      { name },
      { $set: { description } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    subjectByName.set(name, subject);
  }
  console.log(`Created/updated ${subjectByName.size} curriculum module subjects.`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  let assigned = 0;
  for (const tutorDef of tutorDefinitions) {
    let user = await User.findOne({ email: tutorDef.email });
    if (!user) {
      user = await User.create({ name: tutorDef.name, email: tutorDef.email, password: passwordHash, role: "tutor" });
    } else {
      // These reserved example.com accounts are only the seed's own demo accounts.
      user.name = tutorDef.name;
      user.password = passwordHash;
      user.role = "tutor";
      await user.save();
    }

    const subjectIds = [...subjectByName.entries()]
      .filter(([name]) => tutorDef.match.test(name))
      .map(([, subject]) => subject._id);
    await TutorProfile.findOneAndUpdate(
      { user: user._id },
      { $set: { bio: tutorDef.bio, subjects: subjectIds } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    assigned += subjectIds.length;
    console.log(`${tutorDef.name}: ${subjectIds.length} subjects`);
  }

  console.log("\nRichfield 2027 demo seed complete.");
  console.log(`Unique subjects: ${subjectByName.size}`);
  console.log(`Demo tutor profiles: ${tutorDefinitions.length}`);
  console.log(`Total tutor-to-subject assignments: ${assigned}`);
  console.log(`Demo tutor password for local testing: ${DEMO_PASSWORD}`);
  console.log("Do not deploy demo tutor accounts to a public/production site.");
}

main()
  .catch((error) => {
    console.error("Richfield seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
