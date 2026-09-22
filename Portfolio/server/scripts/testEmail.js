import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { emailService, getEmailConfig } from '../services/emailService.js';

async function runEmailDiagnostic() {
  console.log('\n==================================================');
  console.log('       MZK PORTFOLIO - EMAIL SERVICE DIAGNOSTIC   ');
  console.log('==================================================\n');

  const config = getEmailConfig();
  const shouldSendTest = process.argv.includes('--send');

  console.log('Configuration Inspection:');
  console.log(`- EMAIL_HOST:     ${config.host || '(NOT SET)'}`);
  console.log(`- EMAIL_PORT:     ${config.port}`);
  console.log(`- EMAIL_USER:     ${config.user || '(NOT SET)'}`);
  console.log(`- EMAIL_PASSWORD: ${config.pass ? '******** (configured)' : '(NOT SET)'}`);
  console.log(`- EMAIL_FROM:     ${config.from}`);
  console.log(`- EMAIL_TO:       ${config.to}`);
  console.log(`- Secure (SSL):   ${config.secure}`);
  console.log(`- Configured:     ${emailService.isConfigured() ? 'YES' : 'NO'}`);
  console.log('--------------------------------------------------\n');

  if (!emailService.isConfigured()) {
    console.warn('⚠️  Email service is not fully configured.');
    console.warn('Please define EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in server/.env.');
    console.log('\nFor Gmail SMTP:');
    console.log('  EMAIL_HOST=smtp.gmail.com');
    console.log('  EMAIL_PORT=587');
    console.log('  EMAIL_USER=zaidkhan24082006@gmail.com');
    console.log('  EMAIL_PASSWORD=<16-character-Google-App-Password>');
    console.log('  EMAIL_FROM="Mohammad Zaid Khan" <zaidkhan24082006@gmail.com>');
    console.log('  EMAIL_TO=zaidkhan24082006@gmail.com');
    console.log('==================================================\n');
    process.exit(1);
  }

  console.log('Verifying SMTP connection to provider...');
  const verification = await emailService.verifyConnection();

  if (verification.verified) {
    console.log('✓ SMTP Connection Verified:', verification.message);
  } else {
    console.error('✗ SMTP Connection Failed:', verification.message);
    console.log('==================================================\n');
    process.exit(1);
  }

  if (shouldSendTest) {
    console.log(`\nDispatching test email to ${config.to}...`);
    const testSubmission = {
      name: 'Diagnostic Test Runner',
      email: config.to,
      company: 'Antigravity Test Suite',
      phone: '+1-555-0100',
      purpose: 'General Inquiry',
      subject: 'Automated SMTP Diagnostic Test',
      message: 'This is a diagnostic test email verifying that the portfolio email delivery system is functioning correctly.',
      createdAt: new Date().toISOString()
    };

    const result = await emailService.sendContactNotification(testSubmission);
    if (result.sent) {
      console.log(`✓ Test email delivered successfully! Message ID: ${result.messageId}`);
    } else {
      console.error(`✗ Test email delivery failed: ${result.error || result.reason}`);
      process.exit(1);
    }
  } else {
    console.log('\nℹ  To send an actual test email to your inbox, re-run with:');
    console.log('   node scripts/testEmail.js --send');
  }

  console.log('\n==================================================\n');
}

runEmailDiagnostic().catch((err) => {
  console.error('Fatal diagnostic error:', err);
  process.exit(1);
});
