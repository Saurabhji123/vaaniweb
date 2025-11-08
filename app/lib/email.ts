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
      console.error('Γ¥î RESEND_API_KEY not configured');
      return { success: false, error: 'Email service not configured' };
    }

    console.log('≡ƒôº Sending email to:', to);
    console.log('≡ƒôº Subject:', subject);
    
    const data = await resend.emails.send({
      from: 'VaaniWeb <noreply@vaaniweb.com>',
      to: [to],
      subject: subject,
      html: html,
      replyTo: 'support@vaaniweb.com',
    });

    console.log('Γ£à Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Γ¥î Email sending failed:', error);
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

export async function sendOTPEmail(email: string, otp: string, name: string = 'User') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Verify Your Email - VaaniWeb</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { padding: 40px 20px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .logo-table { margin: 0 auto 10px; }
        .logo-icon { width: 48px; height: 48px; display: block; vertical-align: middle; }
        .logo-text { margin: 0; padding: 0 0 0 12px; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 48px; vertical-align: middle; display: inline-block; }
        .subtitle { margin: 10px 0 0; color: #e0e7ff; font-size: 14px; }
        .content { padding: 40px 20px; }
        .title { margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600; }
        .text { margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6; }
        .otp-box { margin: 0 0 30px; padding: 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; }
        .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', Consolas, monospace; }
        .otp-expires { margin: 10px 0 0; color: #e0e7ff; font-size: 12px; }
        .warning-box { padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 0 0 30px; }
        .warning-text { margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; }
        .footer-text { margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6; }
        .footer { padding: 30px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
        .footer-info { margin: 0 0 15px; color: #6b7280; font-size: 14px; }
        .footer-link { color: #667eea; text-decoration: none; font-weight: 600; }
        .footer-copyright { margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 0 10px; border-radius: 8px; }
          .content { padding: 30px 15px; }
          .title { font-size: 20px; }
          .text { font-size: 14px; }
          .otp-code { font-size: 28px; letter-spacing: 6px; }
          .logo-text { font-size: 24px; }
          .logo-icon { width: 40px; height: 40px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <table class="logo-table" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align: middle;">
                  <svg class="logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
                      </linearGradient>
                    </defs>
                    <rect width="48" height="48" rx="12" fill="url(#logoGradient)"/>
                    <rect x="19" y="14" width="10" height="14" rx="5" fill="white"/>
                    <path d="M15 27C15 29.5 17 31.5 19.5 32V36M28.5 32C31 31.5 33 29.5 33 27M19.5 36H28.5M19.5 36V38H28.5V36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td style="vertical-align: middle;">
                  <h1 class="logo-text">VaaniWeb</h1>
                </td>
              </tr>
            </table>
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
              <p class="warning-text"><strong>Security Notice:</strong><br>Never share this code with anyone. VaaniWeb staff will never ask for your verification code.</p>
            </div>
            
            <p class="footer-text">If you didn't create a VaaniWeb account, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p class="footer-info">Need help? Contact us at<br><a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Create stunning websites with AI in seconds.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address - VaaniWeb',
    html: html,
  });
}

export async function sendWelcomeEmail(email: string, name: string = 'User') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>Welcome to VaaniWeb!</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { padding: 40px 20px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .logo-table { margin: 0 auto 10px; }
        .logo-icon { width: 48px; height: 48px; display: block; vertical-align: middle; }
        .logo-text { margin: 0; padding: 0 0 0 12px; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 48px; vertical-align: middle; display: inline-block; }
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
          .container { margin: 0 10px; border-radius: 8px; }
          .content { padding: 30px 15px; }
          .logo-text { font-size: 28px; }
          .logo-icon { width: 40px; height: 40px; }
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
            <table class="logo-table" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align: middle;">
                  <svg class="logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
                      </linearGradient>
                    </defs>
                    <rect width="48" height="48" rx="12" fill="url(#logoGradient2)"/>
                    <rect x="19" y="14" width="10" height="14" rx="5" fill="white"/>
                    <path d="M15 27C15 29.5 17 31.5 19.5 32V36M28.5 32C31 31.5 33 29.5 33 27M19.5 36H28.5M19.5 36V38H28.5V36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td style="vertical-align: middle;">
                  <h1 class="logo-text">VaaniWeb</h1>
                </td>
              </tr>
            </table>
            <p class="subtitle">Your AI-powered website builder is ready!</p>
          </div>
          
          <div class="content">
            <h2 class="title">Hi ${name}!</h2>
            
            <p class="text">Congratulations! Your VaaniWeb account is now active. You're just moments away from creating stunning, professional websites using the power of AI.</p>
            
            <div class="features-section">
              <h3 class="features-title">What You Can Do:</h3>
              <div class="feature-item"><strong>Voice-to-Website:</strong> Describe your business, we build your site</div>
              <div class="feature-item"><strong>AI-Powered Design:</strong> Professional templates customized for you</div>
              <div class="feature-item"><strong>Mobile-Ready:</strong> Perfect on every device, every time</div>
              <div class="feature-item"><strong>Instant Deploy:</strong> Your website live in seconds</div>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_ROOT_URL || 'https://vaaniweb.com'}" class="cta-button">Create Your First Website</a>
            </center>
            
            <div class="tips-section">
              <h3 class="tips-title">Quick Tips to Get Started:</h3>
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
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Powered by AI - Built with care</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to VaaniWeb - Let\'s Build Something Amazing!',
    html: html,
  });
}

export async function sendGoogleWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo-table { margin: 0 auto 10px; }
        .logo-icon { width: 48px; height: 48px; display: block; vertical-align: middle; }
        .logo-text { margin: 0; padding: 0 0 0 12px; font-size: 32px; font-weight: bold; color: #6366f1; line-height: 48px; vertical-align: middle; display: inline-block; }
        .welcome-banner { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
        .content { color: #333; line-height: 1.6; }
        .google-badge { display: inline-block; background: white; color: #333; padding: 10px 20px; border-radius: 5px; margin: 15px 0; font-weight: bold; }
        .feature-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6366f1; }
        .button { display: inline-block; padding: 15px 40px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 20px 10px; padding: 30px 20px; }
          .logo-text { font-size: 28px; }
          .logo-icon { width: 40px; height: 40px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <table class="logo-table" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="vertical-align: middle;">
                <svg class="logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="48" height="48" rx="12" fill="url(#logoGradient3)"/>
                  <rect x="19" y="14" width="10" height="14" rx="5" fill="white"/>
                  <path d="M15 27C15 29.5 17 31.5 19.5 32V36M28.5 32C31 31.5 33 29.5 33 27M19.5 36H28.5M19.5 36V38H28.5V36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <div class="logo-text">VaaniWeb</div>
              </td>
            </tr>
          </table>
          <p style="color: #666; margin-top: 10px;">Voice-Powered Website Generator</p>
        </div>
        
        <div class="welcome-banner">
          <h1 style="margin: 0; font-size: 36px;">Welcome!</h1>
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
          <h2 style="color: #333;">Hello ${name}!</h2>
          <p>Thanks for choosing VaaniWeb! Your account is ready, and you can start creating amazing websites right away.</p>
          
          <h3 style="color: #6366f1;">What's Next:</h3>
          
          <div class="feature-box">
            <strong>Create Your First Website</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Click and speak about your business - we'll do the rest!</p>
          </div>
          
          <div class="feature-box">
            <strong>Explore 22+ Templates</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Professional designs for every business type.</p>
          </div>
          
          <div class="feature-box">
            <strong>Your Dashboard</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Manage all your websites in one place.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_ROOT_URL}" class="button">Start Creating</a>
          </div>
          
          <p style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong>Free Tier Includes:</strong><br/>
            5 website generations per month<br/>
            Access to all templates<br/>
            Unlimited website views
          </p>
        </div>
        
        <div class="footer">
          <p>Made by VaaniWeb Team</p>
          <p>Questions? Email us at <a href="mailto:vaaniweb@gmail.com" style="color: #6366f1;">vaaniweb@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to VaaniWeb!',
    html: html,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string, expiresAt: Date) {
  const expiryString = expiresAt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your VaaniWeb password</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12); overflow: hidden; }
        .header { padding: 32px 24px 16px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); color: white; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
        .content { padding: 32px 28px; color: #1f2937; }
        .content h2 { margin-top: 0; font-size: 22px; }
        .content p { line-height: 1.6; margin: 12px 0; font-size: 15px; }
        .reset-button { display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .code-box { margin: 24px 0; padding: 18px 20px; background: #f1f5f9; border-radius: 10px; font-family: 'Courier New', Consolas, monospace; color: #0f172a; font-size: 15px; }
        .footer { padding: 24px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; line-height: 1.6; text-align: center; }
        @media only screen and (max-width: 600px) {
          .container { margin: 0 12px; border-radius: 10px; }
          .content { padding: 28px 20px; }
          .reset-button { width: 100%; text-align: center; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Reset your password</h1>
            <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.85;">Secure your account in less than a minute</p>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'},</h2>
            <p>We received a request to reset the password for your VaaniWeb account. You can set a new password by clicking the button below. This link is valid until <strong>${expiryString}</strong>.</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="reset-button">Set a new password</a>
            </p>
            <p>If the button does not work, copy and paste this URL into your browser:</p>
            <div class="code-box">${resetLink}</div>
            <p><strong>Security tip:</strong> If you did not request this change, ignore this email. Your existing password will continue to work.</p>
          </div>
          <div class="footer">
            <p>Questions? Write to <a href="mailto:support@vaaniweb.com" style="color: #4f46e5; text-decoration: none; font-weight: 600;">support@vaaniweb.com</a></p>
            <p>© ${new Date().getFullYear()} VaaniWeb. Built for creators and teams.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your VaaniWeb password',
    html
  });
}
