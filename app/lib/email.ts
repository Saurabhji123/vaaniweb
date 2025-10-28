// Email Service using Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.error('❌ RESEND_API_KEY not configured');
      return { success: false, error: 'Email service not configured' };
    }

    console.log('📧 Sending email to:', to);
    console.log('📧 Subject:', subject);
    
    const data = await resend.emails.send({
      from: 'VaaniWeb <noreply@vaaniweb.com>',
      to: [to],
      subject: subject,
      html: html,
      replyTo: 'support@vaaniweb.com',
    });

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP verification email - Responsive Design
 */
export async function sendOTPEmail(email: string, otp: string, name: string = 'User') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - VaaniWeb</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { padding: 40px 20px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .logo { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; }
        .subtitle { margin: 10px 0 0; color: #e0e7ff; font-size: 14px; }
        .content { padding: 40px 20px; }
        .title { margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600; }
        .text { margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6; }
        .otp-box { margin: 0 0 30px; padding: 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; }
        .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace; }
        .otp-expires { margin: 10px 0 0; color: #e0e7ff; font-size: 12px; }
        .warning-box { padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 0 0 30px; }
        .warning-text { margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; }
        .footer-text { margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6; }
        .footer { padding: 30px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
        .footer-info { margin: 0 0 15px; color: #6b7280; font-size: 14px; }
        .footer-link { color: #667eea; text-decoration: none; font-weight: 600; }
        .footer-copyright { margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 0 10px; }
          .content { padding: 30px 15px; }
          .title { font-size: 20px; }
          .text { font-size: 14px; }
          .otp-code { font-size: 28px; letter-spacing: 6px; }
          .logo { font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">� VaaniWeb</h1>
            <p class="subtitle">AI-Powered Website Builder</p>
          </div>
          
          <div class="content">
            <h2 class="title">Verify Your Email Address</h2>
            
            <p class="text">Thank you for joining VaaniWeb! To complete your registration and start creating amazing websites, please use the verification code below:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p class="otp-expires">This code expires in 10 minutes</p>
            </div>
            
            <div class="warning-box">
              <p class="warning-text"><strong>⚠️ Security Notice:</strong><br>Never share this code with anyone. VaaniWeb staff will never ask for your verification code.</p>
            </div>
            
            <p class="footer-text">If you didn't create a VaaniWeb account, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p class="footer-info">Need help? Contact us at<br><a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>
            <p class="footer-copyright">© ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Create stunning websites with AI in seconds.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Verify Your Email - VaaniWeb',
    html: html,
  });
}

/**
 * Send welcome email after verification - Responsive Design
 */
export async function sendWelcomeEmail(email: string, name: string = 'User') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to VaaniWeb!</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { padding: 40px 20px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .logo { margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; }
        .subtitle { margin: 10px 0 0; color: #e0e7ff; font-size: 16px; }
        .content { padding: 40px 20px; }
        .title { margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600; }
        .text { margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6; }
        .features-section { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 30px 20px; margin: 0 0 30px; }
        .features-title { margin: 0 0 20px; color: #0369a1; font-size: 18px; font-weight: 600; }
        .feature-item { padding: 10px 0; color: #0c4a6e; font-size: 15px; line-height: 1.6; }
        .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 0 0 30px; }
        .tips-section { border-top: 2px solid #e5e7eb; padding-top: 25px; margin-top: 25px; }
        .tips-title { margin: 0 0 15px; color: #374151; font-size: 18px; font-weight: 600; }
        .tips-list { margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8; }
        .footer { padding: 30px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
        .footer-info { margin: 0 0 15px; color: #6b7280; font-size: 14px; }
        .footer-link { color: #667eea; text-decoration: none; font-weight: 600; }
        .footer-copyright { margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 0 10px; }
          .content { padding: 30px 15px; }
          .logo { font-size: 28px; }
          .subtitle { font-size: 14px; }
          .title { font-size: 20px; }
          .text { font-size: 14px; }
          .features-section { padding: 20px 15px; }
          .features-title { font-size: 16px; }
          .feature-item { font-size: 14px; }
          .cta-button { padding: 14px 30px; font-size: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">� Welcome to VaaniWeb!</h1>
            <p class="subtitle">Your AI-powered website builder is ready!</p>
          </div>
          
          <div class="content">
            <h2 class="title">Hi ${name}! 👋</h2>
            
            <p class="text">Congratulations! Your VaaniWeb account is now active. You're just moments away from creating stunning, professional websites using the power of AI.</p>
            
            <div class="features-section">
              <h3 class="features-title">� What You Can Do:</h3>
              <div class="feature-item">✨ <strong>Voice-to-Website:</strong> Describe your business, we build your site</div>
              <div class="feature-item">🎨 <strong>AI-Powered Design:</strong> Professional templates customized for you</div>
              <div class="feature-item">📱 <strong>Mobile-Ready:</strong> Perfect on every device, every time</div>
              <div class="feature-item">⚡ <strong>Instant Deploy:</strong> Your website live in seconds</div>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_ROOT_URL || 'https://vaaniweb.com'}" class="cta-button">Create Your First Website →</a>
            </center>
            
            <div class="tips-section">
              <h3 class="tips-title">💡 Quick Tips to Get Started:</h3>
              <ul class="tips-list">
                <li>Speak clearly when describing your business for best results</li>
                <li>Include key details: business type, services, contact info</li>
                <li>Mention colors, style preferences for personalized designs</li>
                <li>Free users get 5 websites/month, upgrade anytime for unlimited</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-info">Questions? We're here to help!<br><a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>
            <p class="footer-copyright">© ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Powered by AI • Built with ❤️</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to VaaniWeb - Let\'s Build Something Amazing!',
    html: html,
  });
}

/**
 * Send welcome email for Google OAuth users
 */
export async function sendGoogleWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #6366f1; }
        .welcome-banner { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
        .content { color: #333; line-height: 1.6; }
        .google-badge { display: inline-block; background: white; color: #333; padding: 10px 20px; border-radius: 5px; margin: 15px 0; font-weight: bold; }
        .feature-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6366f1; }
        .button { display: inline-block; padding: 15px 40px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎙️ VaaniWeb</div>
          <p style="color: #666; margin-top: 10px;">Voice-Powered Website Generator</p>
        </div>
        
        <div class="welcome-banner">
          <h1 style="margin: 0; font-size: 36px;">🎉 Welcome!</h1>
          <p style="margin: 10px 0; font-size: 18px;">You signed in with Google</p>
          <div class="google-badge">
            <svg style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Signed in with Google
          </div>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">Hello ${name}! 👋</h2>
          <p>Thanks for choosing VaaniWeb! Your account is ready, and you can start creating amazing websites right away.</p>
          
          <h3 style="color: #6366f1;">✨ What's Next:</h3>
          
          <div class="feature-box">
            <strong>🎤 Create Your First Website</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Click and speak about your business - we'll do the rest!</p>
          </div>
          
          <div class="feature-box">
            <strong>🎨 Explore 22+ Templates</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Professional designs for every business type.</p>
          </div>
          
          <div class="feature-box">
            <strong>📊 Your Dashboard</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Manage all your websites in one place.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_ROOT_URL}" class="button">Start Creating 🚀</a>
          </div>
          
          <p style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong>🎁 Free Tier Includes:</strong><br/>
            5 website generations per month<br/>
            Access to all templates<br/>
            Unlimited website views
          </p>
        </div>
        
        <div class="footer">
          <p>Made with ❤️ by VaaniWeb Team</p>
          <p>Questions? Email us at <a href="mailto:vaaniweb@gmail.com" style="color: #6366f1;">vaaniweb@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to VaaniWeb!',
    html: html,
  });
}
