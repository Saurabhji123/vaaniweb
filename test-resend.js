// Test Resend API Key
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🔑 API Key:', process.env.RESEND_API_KEY ? 'Found' : 'Missing');
  console.log('📧 Testing Resend email service...\n');

  try {
    const data = await resend.emails.send({
      from: 'VaaniWeb <onboarding@resend.dev>',
      to: ['vaaniweb@gmail.com'], // Replace with your test email
      subject: 'Test Email from VaaniWeb',
      html: '<h1>Hello!</h1><p>This is a test email from VaaniWeb.</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Response:', data);
  } catch (error) {
    console.error('❌ Email failed!');
    console.error('Error:', error.message);
    console.error('Details:', error.response?.body || error);
  }
}

testEmail();
