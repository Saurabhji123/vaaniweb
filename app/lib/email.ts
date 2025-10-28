// Email Service using Resend// Email Service using Resend

import { Resend } from 'resend';import { Resend } from 'resend';



const resend = new Resend(process.env.RESEND_API_KEY);const resend = new Resend(process.env.RESEND_API_KEY);



interface SendEmailOptions {interface SendEmailOptions {

  to: string;  to: string;

  subject: string;  subject: string;

  html: string;  html: string;

}}



/**/**

 * Send email using Resend * Send email using Resend

 */ */

export async function sendEmail({ to, subject, html }: SendEmailOptions) {export async function sendEmail({ to, subject, html }: SendEmailOptions) {

  try {  try {

    // Check if API key is configured    // Check if API key is configured

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {

      console.error('❌ RESEND_API_KEY not configured');      console.error('❌ RESEND_API_KEY not configured');

      return { success: false, error: 'Email service not configured' };      return { success: false, error: 'Email service not configured' };

    }    }



    console.log('📧 Sending email to:', to);    console.log('📧 Sending email to:', to);

    console.log('📧 Subject:', subject);    console.log('📧 Subject:', subject);

        

    const data = await resend.emails.send({    const data = await resend.emails.send({

      from: 'VaaniWeb <noreply@vaaniweb.com>',      from: 'VaaniWeb <noreply@vaaniweb.com>',

      to: [to],      to: [to],

      subject: subject,      subject: subject,

      html: html,      html: html,

      replyTo: 'support@vaaniweb.com',      replyTo: 'support@vaaniweb.com',

    });    });



    console.log('✅ Email sent successfully:', data);    console.log('✅ Email sent successfully:', data);

    return { success: true, data };    return { success: true, data };

  } catch (error: any) {  } catch (error: any) {

    console.error('❌ Email sending failed:', error);    console.error('❌ Email sending failed:', error);

    console.error('Error details:', error.response?.body || error.message);    console.error('Error details:', error.response?.body || error.message);

    return { success: false, error: error.message };    return { success: false, error: error.message };

  }  }

}}



/**/**

 * Generate 6-digit OTP * Generate 6-digit OTP

 */ */

export function generateOTP(): string {export function generateOTP(): string {

  return Math.floor(100000 + Math.random() * 900000).toString();  return Math.floor(100000 + Math.random() * 900000).toString();

}}



/**/**

 * Send OTP verification email - Spam-proof & Responsive Design * Send OTP verification email - Spam-proof & Responsive Design

 * NO EMOJIS in subject or content to avoid spam filters * NO EMOJIS in subject or content to avoid spam filters

 */ */

export async function sendOTPEmail(email: string, otp: string, name: string = 'User') {export async function sendOTPEmail(email: string, otp: string, name: string = 'User') {

  const html = `  const html = `

    <!DOCTYPE html>    <!DOCTYPE html>

    <html lang="en">    <html lang="en">

    <head>    <head>

      <meta charset="utf-8">      <meta charset="utf-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <meta http-equiv="X-UA-Compatible" content="IE=edge">      <meta http-equiv="X-UA-Compatible" content="IE=edge">

      <title>Verify Your Email - VaaniWeb</title>      <title>Verify Your Email - VaaniWeb</title>

      <style>      <style>

        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; }        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; }

        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }

        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; }        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; }

        .header { padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }        .header { padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

        .logo { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }        .logo { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }

        .subtitle { margin: 8px 0 0; color: #e0e7ff; font-size: 13px; }        .subtitle { margin: 8px 0 0; color: #e0e7ff; font-size: 13px; }

        .content { padding: 32px 24px; }        .content { padding: 32px 24px; }

        .greeting { margin: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600; }        .greeting { margin: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600; }

        .text { margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.5; }        .text { margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.5; }

        .otp-box { margin: 0 0 24px; padding: 24px; background: #f9fafb; border: 2px solid #667eea; border-radius: 8px; text-align: center; }        .otp-box { margin: 0 0 24px; padding: 24px; background: #f9fafb; border: 2px solid #667eea; border-radius: 8px; text-align: center; }

        .otp-label { margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }        .otp-label { margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

        .otp-code { margin: 0 0 8px; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #667eea; font-family: 'Courier New', Courier, monospace; }        .otp-code { margin: 0 0 8px; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #667eea; font-family: 'Courier New', Courier, monospace; }

        .otp-expires { margin: 0; color: #9ca3af; font-size: 12px; }        .otp-expires { margin: 0; color: #9ca3af; font-size: 12px; }

        .notice { padding: 16px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 0 0 24px; }        .notice { padding: 16px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 0 0 24px; }

        .notice-text { margin: 0; color: #92400e; font-size: 13px; line-height: 1.5; }        .notice-text { margin: 0; color: #92400e; font-size: 13px; line-height: 1.5; }

        .footer-text { margin: 0 0 16px; color: #6b7280; font-size: 13px; line-height: 1.5; }        .footer-text { margin: 0 0 16px; color: #6b7280; font-size: 13px; line-height: 1.5; }

        .footer { padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }        .footer { padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }

        .footer-info { margin: 0 0 12px; color: #6b7280; font-size: 13px; }        .footer-info { margin: 0 0 12px; color: #6b7280; font-size: 13px; }

        .footer-link { color: #667eea; text-decoration: none; }        .footer-link { color: #667eea; text-decoration: none; }

        .footer-link:hover { text-decoration: underline; }        .footer-link:hover { text-decoration: underline; }

        .footer-copyright { margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5; }        .footer-copyright { margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5; }

                

        @media only screen and (max-width: 600px) {        @media only screen and (max-width: 600px) {

          .container { margin: 0 8px; border-radius: 0; }          .container { margin: 0 8px; border-radius: 0; }

          .content, .footer { padding: 24px 16px; }          .content, .footer { padding: 24px 16px; }

          .otp-code { font-size: 28px; letter-spacing: 4px; }          .otp-code { font-size: 28px; letter-spacing: 4px; }

        }        }

      </style>      </style>

    </head>    </head>

    <body>    <body>

      <div class="wrapper">      <div class="wrapper">

        <div class="container">        <div class="container">

          <div class="header">          <div class="header">

            <h1 class="logo">VaaniWeb</h1>            <h1 class="logo">VaaniWeb</h1>

            <p class="subtitle">AI-Powered Website Builder</p>            <p class="subtitle">AI-Powered Website Builder</p>

          </div>          </div>

                    

          <div class="content">          <div class="content">

            <p class="greeting">Hello ${name},</p>            <p class="greeting">Hello ${name},</p>

                        

            <p class="text">Thank you for signing up with VaaniWeb. To complete your registration, please verify your email address using the code below:</p>            <p class="text">Thank you for signing up with VaaniWeb. To complete your registration, please verify your email address using the code below:</p>

                        

            <div class="otp-box">            <div class="otp-box">

              <p class="otp-label">Verification Code</p>              <p class="otp-label">Verification Code</p>

              <div class="otp-code">${otp}</div>              <div class="otp-code">${otp}</div>

              <p class="otp-expires">Valid for 10 minutes</p>              <p class="otp-expires">Valid for 10 minutes</p>

            </div>            </div>

                        

            <div class="notice">            <div class="notice">

              <p class="notice-text"><strong>Security Notice:</strong> This is a one-time code. Never share it with anyone. VaaniWeb will never ask you for this code via phone or email.</p>              <p class="notice-text"><strong>Security Notice:</strong> This is a one-time code. Never share it with anyone. VaaniWeb will never ask you for this code via phone or email.</p>

            </div>            </div>

                        

            <p class="footer-text">If you did not create an account with VaaniWeb, please ignore this email or contact our support team if you have concerns.</p>            <p class="footer-text">If you did not create an account with VaaniWeb, please ignore this email or contact our support team if you have concerns.</p>

          </div>          </div>

                    

          <div class="footer">          <div class="footer">

            <p class="footer-info">Need help? Contact us at <a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>            <p class="footer-info">Need help? Contact us at <a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>

            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Building beautiful websites with artificial intelligence.</p>            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Building beautiful websites with artificial intelligence.</p>

          </div>          </div>

        </div>        </div>

      </div>      </div>

    </body>    </body>

    </html>    </html>

  `;  `;



  return sendEmail({  return sendEmail({

    to: email,    to: email,

    subject: 'Verify Your Email Address - VaaniWeb',    subject: 'Verify Your Email Address - VaaniWeb',

    html: html,    html: html,

  });  });

}}



/**/**

 * Send welcome email after verification - Spam-proof & Responsive * Send welcome email after verification - Spam-proof & Responsive

 * NO EMOJIS to avoid spam filters * NO EMOJIS to avoid spam filters

 */ */

export async function sendWelcomeEmail(email: string, name: string = 'User') {export async function sendWelcomeEmail(email: string, name: string = 'User') {

  const html = `  const html = `

    <!DOCTYPE html>    <!DOCTYPE html>

    <html lang="en">    <html lang="en">

    <head>    <head>

      <meta charset="utf-8">      <meta charset="utf-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <meta http-equiv="X-UA-Compatible" content="IE=edge">      <meta http-equiv="X-UA-Compatible" content="IE=edge">

      <title>Welcome to VaaniWeb</title>      <title>Welcome to VaaniWeb</title>

      <style>      <style>

        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; }        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; }

        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }        .wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }

        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; }        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; }

        .header { padding: 40px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }        .header { padding: 40px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

        .logo { margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700; }        .logo { margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700; }

        .welcome-text { margin: 0; color: #e0e7ff; font-size: 16px; }        .welcome-text { margin: 0; color: #e0e7ff; font-size: 16px; }

        .content { padding: 32px 24px; }        .content { padding: 32px 24px; }

        .greeting { margin: 0 0 16px; color: #1f2937; font-size: 22px; font-weight: 600; }        .greeting { margin: 0 0 16px; color: #1f2937; font-size: 22px; font-weight: 600; }

        .text { margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6; }        .text { margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6; }

        .features-section { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 24px; margin: 0 0 24px; }        .features-section { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 24px; margin: 0 0 24px; }

        .features-title { margin: 0 0 16px; color: #0369a1; font-size: 16px; font-weight: 600; }        .features-title { margin: 0 0 16px; color: #0369a1; font-size: 16px; font-weight: 600; }

        .feature-item { padding: 8px 0; color: #0c4a6e; font-size: 14px; line-height: 1.5; }        .feature-item { padding: 8px 0; color: #0c4a6e; font-size: 14px; line-height: 1.5; }

        .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; margin: 8px 0; }        .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; margin: 8px 0; }

        .cta-button:hover { opacity: 0.9; }        .cta-button:hover { opacity: 0.9; }

        .tips-section { border-top: 2px solid #e5e7eb; padding-top: 24px; margin-top: 24px; }        .tips-section { border-top: 2px solid #e5e7eb; padding-top: 24px; margin-top: 24px; }

        .tips-title { margin: 0 0 12px; color: #374151; font-size: 16px; font-weight: 600; }        .tips-title { margin: 0 0 12px; color: #374151; font-size: 16px; font-weight: 600; }

        .tips-list { margin: 0; padding-left: 20px; color: #6b7280; font-size: 13px; line-height: 1.7; }        .tips-list { margin: 0; padding-left: 20px; color: #6b7280; font-size: 13px; line-height: 1.7; }

        .tips-list li { margin-bottom: 4px; }        .tips-list li { margin-bottom: 4px; }

        .footer { padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }        .footer { padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }

        .footer-info { margin: 0 0 12px; color: #6b7280; font-size: 13px; }        .footer-info { margin: 0 0 12px; color: #6b7280; font-size: 13px; }

        .footer-link { color: #667eea; text-decoration: none; }        .footer-link { color: #667eea; text-decoration: none; }

        .footer-link:hover { text-decoration: underline; }        .footer-link:hover { text-decoration: underline; }

        .footer-copyright { margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5; }        .footer-copyright { margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5; }

                

        @media only screen and (max-width: 600px) {        @media only screen and (max-width: 600px) {

          .container { margin: 0 8px; border-radius: 0; }          .container { margin: 0 8px; border-radius: 0; }

          .header { padding: 32px 16px; }          .header { padding: 32px 16px; }

          .logo { font-size: 24px; }          .logo { font-size: 24px; }

          .content, .footer { padding: 24px 16px; }          .content, .footer { padding: 24px 16px; }

          .features-section { padding: 16px; }          .features-section { padding: 16px; }

          .cta-button { padding: 12px 24px; font-size: 14px; }          .cta-button { padding: 12px 24px; font-size: 14px; }

        }        }

      </style>      </style>

    </head>    </head>

    <body>    <body>

      <div class="wrapper">      <div class="wrapper">

        <div class="container">        <div class="container">

          <div class="header">          <div class="header">

            <h1 class="logo">Welcome to VaaniWeb!</h1>            <h1 class="logo">Welcome to VaaniWeb!</h1>

            <p class="welcome-text">Your AI-powered website builder is ready</p>            <p class="welcome-text">Your AI-powered website builder is ready</p>

          </div>          </div>

                    

          <div class="content">          <div class="content">

            <p class="greeting">Hi ${name},</p>            <p class="greeting">Hi ${name},</p>

                        

            <p class="text">Congratulations! Your VaaniWeb account is now active. You can now create stunning, professional websites using the power of artificial intelligence.</p>            <p class="text">Congratulations! Your VaaniWeb account is now active. You can now create stunning, professional websites using the power of artificial intelligence.</p>

                        

            <div class="features-section">            <div class="features-section">

              <h3 class="features-title">What You Can Do:</h3>              <h3 class="features-title">What You Can Do:</h3>

              <div class="feature-item"><strong>Voice-to-Website:</strong> Describe your business, and we build your site automatically</div>              <div class="feature-item"><strong>Voice-to-Website:</strong> Describe your business, and we build your site automatically</div>

              <div class="feature-item"><strong>AI-Powered Design:</strong> Professional templates customized for your business</div>              <div class="feature-item"><strong>AI-Powered Design:</strong> Professional templates customized for your business</div>

              <div class="feature-item"><strong>Mobile-Ready:</strong> Perfect display on all devices automatically</div>              <div class="feature-item"><strong>Mobile-Ready:</strong> Perfect display on all devices automatically</div>

              <div class="feature-item"><strong>Instant Deploy:</strong> Your website goes live in seconds</div>              <div class="feature-item"><strong>Instant Deploy:</strong> Your website goes live in seconds</div>

            </div>            </div>

                        

            <div style="text-align: center;">            <div style="text-align: center;">

              <a href="${process.env.NEXT_PUBLIC_ROOT_URL || 'https://vaaniweb.com'}" class="cta-button">Create Your First Website</a>              <a href="${process.env.NEXT_PUBLIC_ROOT_URL || 'https://vaaniweb.com'}" class="cta-button">Create Your First Website</a>

            </div>            </div>

                        

            <div class="tips-section">            <div class="tips-section">

              <h3 class="tips-title">Quick Tips to Get Started:</h3>              <h3 class="tips-title">Quick Tips to Get Started:</h3>

              <ul class="tips-list">              <ul class="tips-list">

                <li>Speak clearly when describing your business for best AI results</li>                <li>Speak clearly when describing your business for best AI results</li>

                <li>Include key details: business type, services, and contact information</li>                <li>Include key details: business type, services, and contact information</li>

                <li>Mention your preferred colors and style for personalized designs</li>                <li>Mention your preferred colors and style for personalized designs</li>

                <li>Free users get 5 websites per month</li>                <li>Free users get 5 websites per month</li>

              </ul>              </ul>

            </div>            </div>

          </div>          </div>

                    

          <div class="footer">          <div class="footer">

            <p class="footer-info">Questions? Contact us at <a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>            <p class="footer-info">Questions? Contact us at <a href="mailto:support@vaaniweb.com" class="footer-link">support@vaaniweb.com</a></p>

            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Powered by AI. Built with care.</p>            <p class="footer-copyright">&copy; ${new Date().getFullYear()} VaaniWeb. All rights reserved.<br>Powered by AI. Built with care.</p>

          </div>          </div>

        </div>        </div>

      </div>      </div>

    </body>    </body>

    </html>    </html>

  `;  `;



  return sendEmail({  return sendEmail({

    to: email,    to: email,

    subject: 'Welcome to VaaniWeb - Start Creating Amazing Websites',    subject: 'Welcome to VaaniWeb - Start Creating Amazing Websites',

    html: html,    html: html,

  });  });

}}

