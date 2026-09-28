import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../../client/public');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
const outputPath = path.join(targetDir, 'Mohammad_Zaid_Khan_Resume.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 32, bottom: 32, left: 36, right: 36 },
  info: {
    Title: 'Mohammad Zaid Khan - Software Engineer Resume',
    Author: 'Mohammad Zaid Khan',
    Subject: 'Software Engineer, Full-Stack Developer, Competitive Programmer Resume',
    Keywords: 'Software Engineer, Full Stack, React, Node.js, Python, DSA, Competitive Programming'
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const primaryColor = '#111827';
const secondaryColor = '#374151';
const accentColor = '#2563eb';
const mutedColor = '#6b7280';

// Header
doc.fontSize(20).font('Helvetica-Bold').fillColor(primaryColor).text('MOHAMMAD ZAID KHAN', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(10.5).font('Helvetica-Bold').fillColor(accentColor).text('Software Engineer | Full-Stack Developer | Competitive Programmer', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(8.5).font('Helvetica').fillColor(mutedColor).text('Noida, India  •  zaidkhan24082006@gmail.com  •  github.com/zaid786-collab  •  linkedin.com/in/mohammad-zaid-khan-a2927a370', { align: 'center' });

function addSectionHeader(title) {
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase());
  const y = doc.y;
  doc.strokeColor('#d1d5db').lineWidth(0.6).moveTo(36, y).lineTo(559, y).stroke();
  doc.moveDown(0.3);
}

// Education
addSectionHeader('Education');
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('ABES Engineering College', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text(' — Ghaziabad, India', { continued: true });
doc.font('Helvetica-Oblique').fillColor(mutedColor).text(' (2025 – 2029)', { align: 'right' });
doc.fontSize(8.5).font('Helvetica').fillColor(secondaryColor).text('Bachelor of Technology in Computer Science & Engineering  |  CGPA: 9.1');

// Technical Skills
addSectionHeader('Technical Skills');
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Languages: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('C, C++, Java, JavaScript, Python');

doc.font('Helvetica-Bold').fillColor(primaryColor).text('Frontend: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('React, HTML5, CSS3, Tailwind CSS, Vite, Framer Motion');

doc.font('Helvetica-Bold').fillColor(primaryColor).text('Backend & Databases: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('Node.js, Express.js, Flask, FastAPI, MongoDB, Mongoose, SQL');

doc.font('Helvetica-Bold').fillColor(primaryColor).text('Developer Tools & Focus Areas: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('Git, GitHub, Docker, RESTful APIs, Data Structures & Algorithms, AI/GenAI Fundamentals');

// Competitive Programming
addSectionHeader('Competitive Programming');
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('LeetCode: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('334+ Problems Solved  |  Contest Rating: 1637  |  Badges: 50 Days, 100 Days, 200 Days Badge  (leetcode.com/u/MOHAMMADZAIDKHAN7)');

doc.font('Helvetica-Bold').fillColor(primaryColor).text('CodeChef: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('619+ Problems Solved  |  Rating: 1420 (2-Star Division 3)  |  Diamond Badge  (codechef.com/users/zaid_khan07)');

doc.font('Helvetica-Bold').fillColor(primaryColor).text('Codeforces: ', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text('Active Contest Participant  (codeforces.com/profile/MohammadZaidKhan)');

// Projects
addSectionHeader('Featured Software Engineering Projects');

// Intervista AI
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Intervista AI', { continued: true });
doc.font('Helvetica-Oblique').fillColor(accentColor).text(' — Next-Gen AI Technical Interview Platform', { continued: true });
doc.font('Helvetica-Bold').fillColor(mutedColor).text(' [Project Leader]', { align: 'right' });
doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(mutedColor).text('Tech Stack: React 18, FastAPI, Python, Large Language Models, Vite, Tailwind CSS');
doc.font('Helvetica').fillColor(secondaryColor).list([
  'Architected an enterprise-grade AI technical interview simulation platform pairing LLMs with audio/video feedback and real-time speech-to-text.',
  'Integrated an in-browser code editor supporting automated test case execution, time/space complexity analysis, and ATS resume scoring with PDF reporting.'
], { bulletRadius: 1.5, textIndent: 8 });

// Crime Lens
doc.moveDown(0.2);
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Crime Lens', { continued: true });
doc.font('Helvetica-Oblique').fillColor(accentColor).text(' — Cybernetic Crime Investigation & Telemetry Platform', { continued: true });
doc.font('Helvetica-Bold').fillColor(mutedColor).text(' [Project Leader]', { align: 'right' });
doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(mutedColor).text('Tech Stack: React 19, Vite, Network Graph Visualization, JavaScript, CSS3');
doc.font('Helvetica').fillColor(secondaryColor).list([
  'Constructed tactical intelligence platform featuring an interactive Network Nexus graph for multi-hop entity resolution and financial flow tracking.',
  'Built chronological event timeline with anomaly spike detection, Entity 360 dossiers, and cryptographic evidence sealing adhering to chain-of-custody standards.'
], { bulletRadius: 1.5, textIndent: 8 });

// Smart Stocks
doc.moveDown(0.2);
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Smart Stocks', { continued: true });
doc.font('Helvetica-Oblique').fillColor(accentColor).text(' — AI-Powered Investment Intelligence Platform', { continued: true });
doc.font('Helvetica-Bold').fillColor(mutedColor).text(' [Project Leader]', { align: 'right' });
doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(mutedColor).text('Tech Stack: React, Vite, Lucide React, Tailwind CSS, PostCSS');
doc.font('Helvetica').fillColor(secondaryColor).list([
  'Developed market data intelligence interface analyzing real-time price indicators, trend projections, company health metrics, and automated risk scoring.'
], { bulletRadius: 1.5, textIndent: 8 });

// Experience & Leadership
addSectionHeader('Experience & Leadership');
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Freelance Microsoft Dynamics 365 Analyst', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text(' — IT Solutions', { continued: true });
doc.font('Helvetica-Oblique').fillColor(mutedColor).text(' (Ongoing | Remote)', { align: 'right' });
doc.fontSize(8.5).font('Helvetica').fillColor(secondaryColor).list([
  'Delivering technical analysis and configuration on Microsoft Dynamics 365 implementations, workflow automations, and enterprise data integrations.'
], { bulletRadius: 1.5, textIndent: 8 });

doc.moveDown(0.2);
doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Team Leader', { continued: true });
doc.font('Helvetica').fillColor(secondaryColor).text(' — Smart India Hackathon (SIH) & Build with Bharat', { continued: true });
doc.font('Helvetica-Oblique').fillColor(mutedColor).text(' (Hackathon Leadership)', { align: 'right' });
doc.fontSize(8.5).font('Helvetica').fillColor(secondaryColor).list([
  'Led multidisciplinary teams in architecting scalable solutions for real-world problem statements, coordinating rapid development, sprint timelines, and technical presentations.'
], { bulletRadius: 1.5, textIndent: 8 });

// Certifications
addSectionHeader('Certifications & Professional Credentials');
doc.fontSize(8.5).font('Helvetica').fillColor(secondaryColor).text('• NIELIT O Level (3 Completed, 1 In Progress) — National Institute of Electronics & Information Technology');
doc.text('• Microsoft Certified Data Analyst — Microsoft');
doc.text('• Generative AI: Introduction, Applications & Prompt Engineering Basics — IBM / Leading Providers');
doc.text('• Python for Data Science, AI & Development — IBM');
doc.text('• Claude AI — PW Skills');

doc.end();

writeStream.on('finish', () => {
  console.log(`✓ ATS-friendly 1-page resume PDF generated at: ${outputPath}`);
});
