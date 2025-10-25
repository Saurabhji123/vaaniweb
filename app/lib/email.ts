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
      from: 'VaaniWeb <onboarding@resend.dev>', // Resend's test email (works for development)
      to: [to],
      subject: subject,
      html: html,
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
 * Send OTP verification email
 */
export async function sendOTPEmail(email: string, otp: string, name: string = 'User') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #6366f1; }
        .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
        .content { color: #333; line-height: 1.6; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎙️ VaaniWeb</div>
          <p style="color: #666; margin-top: 10px;">Voice-Powered Website Generator</p>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">Hello ${name}! 👋</h2>
          <p>Thank you for signing up with VaaniWeb! To complete your registration, please verify your email address.</p>
          
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px;">Your Verification Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 12px;">Valid for 10 minutes</p>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code will expire in 10 minutes</li>
            <li>Don't share this code with anyone</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Made with ❤️ by VaaniWeb Team</p>
          <p>Need help? Contact us at <a href="mailto:vaaniweb@gmail.com">vaaniweb@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Verify Your VaaniWeb Account',
    html: html,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email: string, name: string = 'User') {
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
          <h1 style="margin: 0; font-size: 36px;">🎉 Welcome to VaaniWeb!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">You're all set to create amazing websites with your voice!</p>
        </div>
        
        <div class="content">
          <h2 style="color: #333;">Hello ${name}! 👋</h2>
          <p>Welcome to the future of website creation! We're thrilled to have you on board.</p>
          
          <h3 style="color: #6366f1;">✨ What You Can Do Now:</h3>
          
          <div class="feature-box">
            <strong>🎤 Voice to Website</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Simply speak your business description and get a professional website in seconds!</p>
          </div>
          
          <div class="feature-box">
            <strong>🎨 22+ Professional Templates</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Choose from handcrafted templates for cafes, gyms, photographers, and more.</p>
          </div>
          
          <div class="feature-box">
            <strong>📊 Personal Dashboard</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Track all your generated websites in one place.</p>
          </div>
          
          <div class="feature-box">
            <strong>🆓 5 Free Websites/Month</strong>
            <p style="margin: 5px 0 0 0; color: #666;">Start creating immediately with our generous free tier!</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_ROOT_URL}" class="button">Start Creating Now 🚀</a>
          </div>
          
          <h3 style="color: #6366f1; margin-top: 40px;">💡 Quick Tips:</h3>
          <ul style="color: #666;">
            <li>Speak clearly about your business for best results</li>
            <li>Include details like business type, color preferences, and contact info</li>
            <li>You can edit and regenerate websites anytime</li>
            <li>Share your generated websites with unique URLs</li>
          </ul>
          
          <p style="margin-top: 30px;"><strong>Need help?</strong> We're here for you! Contact us at <a href="mailto:vaaniweb@gmail.com" style="color: #6366f1;">vaaniweb@gmail.com</a></p>
        </div>
        
        <div class="footer">
          <p>Made with ❤️ by VaaniWeb Team</p>
          <p>Follow us on <a href="https://twitter.com/vaaniweb" style="color: #6366f1;">Twitter</a> for updates!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to VaaniWeb - Let\'s Create Your First Website!',
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
