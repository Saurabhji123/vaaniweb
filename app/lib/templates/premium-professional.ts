// Premium Professional Templates with Hero, Testimonials, Pricing, Stats, FAQs
import { getCurrentYear, getPexelsImage } from '../utils';

export function generatePremiumBusinessLayout(data: any): string {
  const { title, tagline, description, theme_color, sections, pics } = data;
  const businessName = title;
  const themeColor = theme_color || 'blue';
  const imageKeywords = pics || ['business', 'professional', 'office'];
  const about = sections?.about || description || `${businessName} provides exceptional services with dedication and expertise.`;
  const features = sections?.features || ['Quality Service', 'Expert Team', 'Customer Focus', 'Innovation', 'Reliability', 'Excellence'];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${tagline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a;
            scroll-behavior: smooth;
        }
        
        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            padding: 1rem 0;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 900;
            color: ${themeColor};
        }
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 600;
            transition: color 0.3s;
        }
        .nav-links a:hover {
            color: ${themeColor};
        }
        
        /* Hero Section */
        .hero {
            margin-top: 70px;
            min-height: 100vh;
            background: linear-gradient(135deg, ${themeColor}15 0%, #ffffff 100%);
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 800px;
            height: 800px;
            background: ${themeColor};
            opacity: 0.05;
            border-radius: 50%;
        }
        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        .hero-content h1 {
            font-size: 4rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 30px;
            color: #1a1a1a;
        }
        .hero-content p {
            font-size: 1.3rem;
            color: #666;
            margin-bottom: 40px;
            line-height: 1.8;
        }
        .hero-buttons {
            display: flex;
            gap: 20px;
        }
        .btn {
            padding: 18px 40px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
        }
        .btn-primary {
            background: ${themeColor};
            color: white;
        }
        .btn-primary:hover {
            background: #333;
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .btn-secondary {
            background: transparent;
            color: ${themeColor};
            border: 2px solid ${themeColor};
        }
        .btn-secondary:hover {
            background: ${themeColor};
            color: white;
        }
        .hero-image {
            width: 100%;
            height: 500px;
            border-radius: 20px;
            object-fit: cover;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        
        /* Stats Section */
        .stats {
            padding: 80px 20px;
            background: ${themeColor};
            color: white;
        }
        .stats-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            text-align: center;
        }
        .stat-item h3 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 10px;
        }
        .stat-item p {
            font-size: 1.2rem;
            opacity: 0.95;
        }
        
        /* Services Section */
        .services {
            padding: 120px 20px;
            background: #f8f9fa;
        }
        .section-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 60px;
            color: #1a1a1a;
        }
        .section-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: -40px auto 60px;
        }
        .services-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
        }
        .service-card {
            background: white;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s;
        }
        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .service-icon {
            font-size: 3rem;
            margin-bottom: 25px;
        }
        .service-card h3 {
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 15px;
            color: #1a1a1a;
        }
        .service-card p {
            color: #666;
            line-height: 1.8;
        }
        
        /* Testimonials */
        .testimonials {
            padding: 120px 20px;
            background: white;
        }
        .testimonials-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
        }
        .testimonial {
            background: #f8f9fa;
            padding: 40px;
            border-radius: 20px;
            position: relative;
        }
        .quote-icon {
            font-size: 3rem;
            color: ${themeColor};
            opacity: 0.2;
            position: absolute;
            top: 20px;
            right: 30px;
        }
        .stars {
            color: #ffd700;
            font-size: 1.3rem;
            margin-bottom: 20px;
        }
        .testimonial-text {
            font-style: italic;
            margin-bottom: 30px;
            line-height: 1.8;
            color: #333;
        }
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .author-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${themeColor}, #667eea);
        }
        .author-info h4 {
            font-weight: 700;
            margin-bottom: 5px;
        }
        .author-info p {
            color: #666;
            font-size: 0.9rem;
        }
        
        /* Pricing */
        .pricing {
            padding: 120px 20px;
            background: linear-gradient(135deg, ${themeColor}10 0%, #ffffff 100%);
        }
        .pricing-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
        }
        .pricing-card {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s;
            position: relative;
        }
        .pricing-card.featured {
            background: ${themeColor};
            color: white;
            transform: scale(1.05);
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .popular-badge {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffd700;
            color: #1a1a1a;
            padding: 8px 25px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
        }
        .plan-name {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .plan-price {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 10px;
        }
        .plan-price span {
            font-size: 1.5rem;
            font-weight: 600;
        }
        .plan-period {
            color: #666;
            margin-bottom: 40px;
        }
        .featured .plan-period {
            color: rgba(255,255,255,0.9);
        }
        .plan-features {
            list-style: none;
            margin-bottom: 40px;
            text-align: left;
        }
        .plan-features li {
            padding: 15px 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .featured .plan-features li {
            border-bottom-color: rgba(255,255,255,0.2);
        }
        .plan-features li::before {
            content: '✓';
            color: ${themeColor};
            font-weight: 900;
            font-size: 1.3rem;
        }
        .featured .plan-features li::before {
            color: #ffd700;
        }
        .plan-btn {
            width: 100%;
            padding: 18px;
            background: ${themeColor};
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }
        .featured .plan-btn {
            background: white;
            color: ${themeColor};
        }
        .plan-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        /* FAQ Section */
        .faq {
            padding: 120px 20px;
            background: white;
        }
        .faq-container {
            max-width: 900px;
            margin: 0 auto;
        }
        .faq-item {
            background: #f8f9fa;
            margin-bottom: 20px;
            border-radius: 15px;
            overflow: hidden;
        }
        .faq-question {
            width: 100%;
            padding: 30px;
            background: none;
            border: none;
            text-align: left;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }
        .faq-question:hover {
            background: rgba(0,0,0,0.02);
        }
        .faq-answer {
            padding: 0 30px 30px;
            color: #666;
            line-height: 1.8;
        }
        
        /* Contact */
        .contact {
            padding: 120px 20px;
            background: #f8f9fa;
        }
        .contact-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .contact form {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            margin-bottom: 25px;
        }
        .form-group {
            display: grid;
            gap: 12px;
        }
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        .form-group label {
            font-weight: 700;
            color: #1a1a1a;
        }
        .form-group input,
        .form-group textarea {
            padding: 18px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: ${themeColor};
            box-shadow: 0 0 0 3px ${themeColor}15;
        }
        .submit-btn {
            width: 100%;
            padding: 20px;
            background: ${themeColor};
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }
        .submit-btn:hover {
            background: #333;
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        /* Newsletter */
        .newsletter {
            padding: 80px 20px;
            background: ${themeColor};
            color: white;
            text-align: center;
        }
        .newsletter h2 {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 20px;
        }
        .newsletter p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.95;
        }
        .newsletter-form {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            gap: 15px;
        }
        .newsletter-form input {
            flex: 1;
            padding: 20px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
        }
        .newsletter-form button {
            padding: 20px 45px;
            background: white;
            color: ${themeColor};
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }
        .newsletter-form button:hover {
            background: #f0f0f0;
            transform: translateY(-2px);
        }
        
        footer {
            background: #1a1a1a;
            color: white;
            padding: 60px 20px 30px;
        }
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            margin-bottom: 40px;
        }
        .footer-section h3 {
            font-size: 1.3rem;
            margin-bottom: 20px;
        }
        .footer-section ul {
            list-style: none;
        }
        .footer-section ul li {
            margin-bottom: 12px;
        }
        .footer-section a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            transition: color 0.3s;
        }
        .footer-section a:hover {
            color: white;
        }
        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.6);
        }
        
        @media (max-width: 768px) {
            .hero-container { grid-template-columns: 1fr; }
            .hero-content h1 { font-size: 2.5rem; }
            .stats-container { grid-template-columns: repeat(2, 1fr); }
            .services-grid,
            .testimonials-grid,
            .pricing-grid,
            .footer-content { grid-template-columns: 1fr; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="nav-container">
            <div class="logo">${businessName}</div>
            <ul class="nav-links">
                <li><a href="#services">Services</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonials">Reviews</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1>${businessName}</h1>
                <p>${description}</p>
                <div class="hero-buttons">
                    <a href="#services" class="btn btn-primary">Get Started</a>
                    <a href="#contact" class="btn btn-secondary">Learn More</a>
                </div>
            </div>
            <img src="${getPexelsImage(imageKeywords[0] || 'business', 1200, 800)}" alt="${businessName}" class="hero-image">
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
        <div class="stats-container">
            <div class="stat-item">
                <h3>500+</h3>
                <p>Happy Clients</p>
            </div>
            <div class="stat-item">
                <h3>99%</h3>
                <p>Satisfaction Rate</p>
            </div>
            <div class="stat-item">
                <h3>15+</h3>
                <p>Years Experience</p>
            </div>
            <div class="stat-item">
                <h3>24/7</h3>
                <p>Support</p>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <h2 class="section-title">Our Services</h2>
        <p class="section-subtitle">We provide comprehensive solutions tailored to your needs</p>
        <div class="services-grid">
            ${sections.features.slice(0, 6).map((feature: string, i: number) => `
            <div class="service-card">
                <div class="service-icon">${['🎯', '⚡', '💎', '🚀', '✨', '🏆'][i]}</div>
                <h3>${feature.split(':')[0]}</h3>
                <p>${feature.split(':')[1] || 'Premium quality service with attention to detail and customer satisfaction.'}</p>
            </div>
            `).join('')}
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials" id="testimonials">
        <h2 class="section-title">What Our Clients Say</h2>
        <p class="section-subtitle">Real feedback from real customers</p>
        <div class="testimonials-grid">
            <div class="testimonial">
                <div class="quote-icon">"</div>
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"Absolutely outstanding service! ${businessName} exceeded all my expectations. Professional, reliable, and delivers exceptional results every time."</p>
                <div class="testimonial-author">
                    <div class="author-img"></div>
                    <div class="author-info">
                        <h4>Rajesh Kumar</h4>
                        <p>Business Owner</p>
                    </div>
                </div>
            </div>
            <div class="testimonial">
                <div class="quote-icon">"</div>
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"Working with ${businessName} was a game-changer for us. Their expertise and dedication made all the difference. Highly recommended!"</p>
                <div class="testimonial-author">
                    <div class="author-img"></div>
                    <div class="author-info">
                        <h4>Priya Sharma</h4>
                        <p>Entrepreneur</p>
                    </div>
                </div>
            </div>
            <div class="testimonial">
                <div class="quote-icon">"</div>
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-text">"Five stars aren't enough! The quality of service and attention to detail is unmatched. ${businessName} is the best in the business."</p>
                <div class="testimonial-author">
                    <div class="author-img"></div>
                    <div class="author-info">
                        <h4>Amit Patel</h4>
                        <p>Regular Customer</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing" id="pricing">
        <h2 class="section-title">Choose Your Plan</h2>
        <p class="section-subtitle">Flexible pricing options for every budget</p>
        <div class="pricing-grid">
            <div class="pricing-card">
                <h3 class="plan-name">Starter</h3>
                <div class="plan-price">₹<span>2,999</span></div>
                <p class="plan-period">per month</p>
                <ul class="plan-features">
                    <li>Basic Features</li>
                    <li>Email Support</li>
                    <li>5 Projects</li>
                    <li>Monthly Reports</li>
                    <li>Community Access</li>
                </ul>
                <button class="plan-btn">Get Started</button>
            </div>
            <div class="pricing-card featured">
                <div class="popular-badge">MOST POPULAR</div>
                <h3 class="plan-name">Professional</h3>
                <div class="plan-price">₹<span>5,999</span></div>
                <p class="plan-period">per month</p>
                <ul class="plan-features">
                    <li>All Starter Features</li>
                    <li>Priority Support</li>
                    <li>Unlimited Projects</li>
                    <li>Weekly Reports</li>
                    <li>Advanced Analytics</li>
                    <li>Custom Solutions</li>
                </ul>
                <button class="plan-btn">Get Started</button>
            </div>
            <div class="pricing-card">
                <h3 class="plan-name">Enterprise</h3>
                <div class="plan-price">₹<span>12,999</span></div>
                <p class="plan-period">per month</p>
                <ul class="plan-features">
                    <li>All Pro Features</li>
                    <li>24/7 Phone Support</li>
                    <li>Dedicated Manager</li>
                    <li>Daily Reports</li>
                    <li>White Label Options</li>
                    <li>API Access</li>
                </ul>
                <button class="plan-btn">Contact Sales</button>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">Everything you need to know</p>
        <div class="faq-container">
            <div class="faq-item">
                <button class="faq-question">
                    What services do you offer?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    We offer comprehensive ${sections.about.slice(0, 100)}... Our team is dedicated to providing top-quality service.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">
                    How long does it take to get started?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    You can get started immediately! Simply choose your plan and we'll have you up and running within 24 hours.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">
                    Do you offer refunds?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll provide a full refund, no questions asked.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">
                    Can I upgrade or downgrade my plan?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    Absolutely! You can change your plan at any time. Upgrades are instant, and downgrades take effect at the next billing cycle.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">
                    What payment methods do you accept?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    We accept all major credit cards, debit cards, UPI, net banking, and digital wallets for your convenience.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">
                    Is there a contract or can I cancel anytime?
                    <span>+</span>
                </button>
                <div class="faq-answer">
                    No long-term contracts required! You can cancel your subscription at any time. Your service will continue until the end of your billing period.
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">Ready to start your journey with us?</p>
        <div class="contact-container">
            <form>
                <div class="form-grid">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" placeholder="John" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Doe" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="john@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" placeholder="+91 98765 43210" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Message</label>
                        <textarea rows="6" placeholder="Tell us about your requirements..." required></textarea>
                    </div>
                </div>
                <button type="submit" class="submit-btn">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for the latest updates and exclusive offers</p>
        <form class="newsletter-form">
            <input type="email" placeholder="Enter your email address" required>
            <button type="submit">Subscribe</button>
        </form>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>${businessName}</h3>
                <p style="color: rgba(255,255,255,0.7); margin-top: 15px;">${tagline}</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Support</h3>
                <ul>
                    <li><a href="#faq">FAQ</a></li>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <ul>
                    <li style="color: rgba(255,255,255,0.7);">Email: info@${businessName.toLowerCase().replace(/\s+/g, '')}.com</li>
                    <li style="color: rgba(255,255,255,0.7);">Phone: +91 98765 43210</li>
                    <li style="color: rgba(255,255,255,0.7);">Location: India</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${getCurrentYear()} ${businessName}. All rights reserved. | Created with ❤️ by VaaniWeb</p>
        </div>
    </footer>
</body>
</html>`;
}

