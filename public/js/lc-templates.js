const TEMPLATES = [
  {
    id: 'saas-launch',
    name: 'SaaS Launch',
    category: 'saas',
    desc: 'Perfect for software product launches',
    icon: '🚀',
    colors: ['#6c63ff', '#a855f7'],
    blocks: ['navbar','hero','logo-strip','features','stats','pricing','testimonial','email-form','footer']
  },
  {
    id: 'ecom-product',
    name: 'Product Sale',
    category: 'ecommerce',
    desc: 'Drive product conversions',
    icon: '🛒',
    colors: ['#f59e0b', '#ef4444'],
    blocks: ['navbar','hero','features','pricing','testimonial','cta','footer']
  },
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    category: 'agency',
    desc: 'Showcase your agency work',
    icon: '💼',
    colors: ['#0ea5e9', '#6c63ff'],
    blocks: ['navbar','hero','logo-strip','features','team','testimonial','cta','contact-form','footer']
  },
  {
    id: 'startup-mvp',
    name: 'Startup MVP',
    category: 'startup',
    desc: 'Validate your idea fast',
    icon: '⚡',
    colors: ['#10b981', '#6c63ff'],
    blocks: ['navbar','hero','features','stats','pricing','email-form','footer']
  },
  {
    id: 'webinar-event',
    name: 'Webinar / Event',
    category: 'webinar',
    desc: 'Drive event registrations',
    icon: '🎤',
    colors: ['#ff6584', '#6c63ff'],
    blocks: ['navbar','hero','features','countdown','testimonial','email-form','footer']
  },
  {
    id: 'freelance-portfolio',
    name: 'Freelance Portfolio',
    category: 'portfolio',
    desc: 'Show off your skills',
    icon: '🎨',
    colors: ['#f59e0b', '#10b981'],
    blocks: ['navbar','hero','features','team','testimonial','contact-form','footer']
  },
  {
    id: 'app-download',
    name: 'App Download',
    category: 'saas',
    desc: 'Mobile app landing page',
    icon: '📱',
    colors: ['#3b82f6', '#8b5cf6'],
    blocks: ['navbar','hero','features','stats','testimonial','cta','footer']
  },
  {
    id: 'lead-gen',
    name: 'Lead Generation',
    category: 'ecommerce',
    desc: 'Capture and convert leads',
    icon: '🎯',
    colors: ['#ef4444', '#f59e0b'],
    blocks: ['navbar','hero','features','stats','email-form','testimonial','faq','footer']
  },
  {
    id: 'consulting',
    name: 'Consulting Firm',
    category: 'agency',
    desc: 'B2B consulting landing page',
    icon: '📊',
    colors: ['#1e40af', '#0ea5e9'],
    blocks: ['navbar','hero','logo-strip','features','team','testimonial','faq','contact-form','footer']
  },
  {
    id: 'course-launch',
    name: 'Online Course',
    category: 'startup',
    desc: 'Sell your online course',
    icon: '🎓',
    colors: ['#7c3aed', '#ec4899'],
    blocks: ['navbar','hero','features','testimonial','pricing','faq','email-form','footer']
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'startup',
    desc: 'Grow your email list',
    icon: '📨',
    colors: ['#10b981', '#0ea5e9'],
    blocks: ['navbar','hero','features','testimonial','newsletter','footer']
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    category: 'webinar',
    desc: 'Build hype before launch',
    icon: '⏳',
    colors: ['#1a1d27', '#6c63ff'],
    blocks: ['navbar','hero','countdown','email-form','footer']
  }
];

// HTML generators for each block type
const BLOCK_GENERATORS = {
  navbar: () => `
<nav class="lc-navbar canvas-element" data-type="navbar">
  <div class="lc-navbar-inner" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
    <div class="nav-brand">BrandName</div>
    <ul class="nav-links" style="display:flex;gap:28px;list-style:none;">
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <button class="nav-cta">Get Started</button>
  </div>
</nav>`,

  hero: () => `
<div class="lc-hero canvas-element" data-type="hero">
  <div class="lc-badge" style="padding:0;margin-bottom:20px;display:inline-block;">
    <span>🔥 New – Just Launched</span>
  </div>
  <h1>The Smarter Way to<br>Grow Your Business</h1>
  <p>All-in-one platform that helps you attract customers, close deals, and scale revenue — without the complexity.</p>
  <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
    <button class="lc-btn">Start Free Trial</button>
    <button style="background:transparent;border:2px solid rgba(255,255,255,0.6);color:#fff;padding:13px 28px;border-radius:50px;font-size:1rem;cursor:pointer;">Watch Demo ▶</button>
  </div>
  <p style="margin-top:20px;font-size:0.82rem;opacity:0.7;">No credit card required · Cancel anytime</p>
</div>`,

  cta: () => `
<div class="lc-cta canvas-element" data-type="cta">
  <h2>Ready to Transform Your Business?</h2>
  <p>Join over 50,000 companies already growing with us.</p>
  <button class="lc-btn">Get Started Free →</button>
</div>`,

  features: () => `
<div class="lc-features canvas-element" data-type="features">
  <h2>Everything You Need to Succeed</h2>
  <p class="subtitle">Powerful features designed to help you grow faster</p>
  <div class="features-grid">
    <div class="feature-card"><i class="fa fa-rocket"></i><h3>Lightning Fast</h3><p>Deploy in minutes with our streamlined setup. No technical skills required.</p></div>
    <div class="feature-card"><i class="fa fa-shield-halved"></i><h3>Enterprise Security</h3><p>Bank-grade encryption and compliance. Your data is always safe with us.</p></div>
    <div class="feature-card"><i class="fa fa-chart-line"></i><h3>Advanced Analytics</h3><p>Real-time insights into your performance. Make data-driven decisions.</p></div>
    <div class="feature-card"><i class="fa fa-plug"></i><h3>200+ Integrations</h3><p>Connect with your favorite tools seamlessly. Zapier, Slack, and more.</p></div>
    <div class="feature-card"><i class="fa fa-headset"></i><h3>24/7 Support</h3><p>Expert support whenever you need it. Average response time under 2 minutes.</p></div>
    <div class="feature-card"><i class="fa fa-wand-magic-sparkles"></i><h3>AI-Powered</h3><p>Let AI handle the heavy lifting so you can focus on what matters most.</p></div>
  </div>
</div>`,

  pricing: () => `
<div class="lc-pricing canvas-element" data-type="pricing">
  <h2>Simple, Transparent Pricing</h2>
  <div class="pricing-grid">
    <div class="pricing-card">
      <h3>Starter</h3>
      <div class="price">$0<span>/mo</span></div>
      <ul>
        <li>Up to 1,000 contacts</li>
        <li>5 landing pages</li>
        <li>Basic analytics</li>
        <li>Email support</li>
      </ul>
      <button class="lc-btn">Get Started Free</button>
    </div>
    <div class="pricing-card featured">
      <div class="badge">Most Popular</div>
      <h3>Pro</h3>
      <div class="price">$49<span>/mo</span></div>
      <ul>
        <li>Unlimited contacts</li>
        <li>Unlimited pages</li>
        <li>Advanced analytics</li>
        <li>Priority support</li>
        <li>A/B testing</li>
        <li>Custom domain</li>
      </ul>
      <button class="lc-btn">Start Free Trial</button>
    </div>
    <div class="pricing-card">
      <h3>Enterprise</h3>
      <div class="price">$199<span>/mo</span></div>
      <ul>
        <li>Everything in Pro</li>
        <li>Dedicated account manager</li>
        <li>SSO & SAML</li>
        <li>SLA guarantee</li>
        <li>Custom integrations</li>
      </ul>
      <button class="lc-btn">Contact Sales</button>
    </div>
  </div>
</div>`,

  testimonial: () => `
<div class="lc-testimonial canvas-element" data-type="testimonial">
  <h2>Loved by Thousands of Customers</h2>
  <div class="testimonial-grid">
    <div class="testimonial-card">
      <div class="stars">★★★★★</div>
      <p>"This product completely transformed how we do marketing. Our conversion rate jumped 300% in the first month."</p>
      <div class="testimonial-author">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#a855f7);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">S</div>
        <div><div class="name">Sarah Johnson</div><div class="role">CEO, TechStartup</div></div>
      </div>
    </div>
    <div class="testimonial-card">
      <div class="stars">★★★★★</div>
      <p>"Incredible tool. We went from zero to $100k MRR in 6 months using this platform. Highly recommend it."</p>
      <div class="testimonial-author">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#43e97b,#38f9d7);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">M</div>
        <div><div class="name">Marcus Chen</div><div class="role">Founder, GrowthLabs</div></div>
      </div>
    </div>
    <div class="testimonial-card">
      <div class="stars">★★★★★</div>
      <p>"The best investment we made this year. Setup took 10 minutes and we were generating leads by day one."</p>
      <div class="testimonial-author">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ff6584,#ff9a9e);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">A</div>
        <div><div class="name">Aisha Patel</div><div class="role">Marketing Director</div></div>
      </div>
    </div>
  </div>
</div>`,

  faq: () => `
<div class="lc-faq canvas-element" data-type="faq">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-item">
    <div class="faq-q">How does the free trial work? <i class="fa fa-plus"></i></div>
    <div class="faq-a">Start free for 14 days — no credit card required. You get full access to all Pro features during your trial.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">Can I cancel anytime? <i class="fa fa-plus"></i></div>
    <div class="faq-a">Yes, absolutely. Cancel at any time with no questions asked. Your data will remain accessible for 30 days after cancellation.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">Do you offer refunds? <i class="fa fa-plus"></i></div>
    <div class="faq-a">We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full — no questions asked.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">Is my data secure? <i class="fa fa-plus"></i></div>
    <div class="faq-a">Yes. We use bank-grade AES-256 encryption, are GDPR compliant, and undergo regular third-party security audits.</div>
  </div>
</div>`,

  stats: () => `
<div class="lc-stats canvas-element" data-type="stats">
  <div class="stats-grid">
    <div class="stat-item"><div class="stat-num">50K+</div><div class="stat-label">Happy Customers</div></div>
    <div class="stat-item"><div class="stat-num">300%</div><div class="stat-label">Average ROI</div></div>
    <div class="stat-item"><div class="stat-num">$2.4B</div><div class="stat-label">Revenue Generated</div></div>
    <div class="stat-item"><div class="stat-num">99.9%</div><div class="stat-label">Uptime SLA</div></div>
  </div>
</div>`,

  countdown: () => `
<div class="lc-countdown canvas-element" data-type="countdown">
  <h2>Limited Time Offer Ends In</h2>
  <p>Don't miss out — this deal won't last forever</p>
  <div class="countdown-timer">
    <div class="countdown-block"><span class="num" id="cd-days">03</span><span class="label">Days</span></div>
    <div class="countdown-block"><span class="num" id="cd-hours">18</span><span class="label">Hours</span></div>
    <div class="countdown-block"><span class="num" id="cd-mins">42</span><span class="label">Minutes</span></div>
    <div class="countdown-block"><span class="num" id="cd-secs">00</span><span class="label">Seconds</span></div>
  </div>
</div>`,

  team: () => `
<div class="lc-team canvas-element" data-type="team">
  <h2>Meet Our Team</h2>
  <div class="team-grid">
    <div class="team-card"><div class="avatar">J</div><h3>James Wilson</h3><p>CEO & Co-Founder</p></div>
    <div class="team-card"><div class="avatar">L</div><h3>Lisa Torres</h3><p>Head of Product</p></div>
    <div class="team-card"><div class="avatar">R</div><h3>Raj Kumar</h3><p>Lead Engineer</p></div>
    <div class="team-card"><div class="avatar">E</div><h3>Elena Vasquez</h3><p>Head of Marketing</p></div>
  </div>
</div>`,

  'email-form': () => `
<div class="lc-email-form canvas-element" data-type="email-form">
  <h2>Join 50,000+ Subscribers</h2>
  <p>Get exclusive tips, strategies, and resources delivered to your inbox.</p>
  <div class="email-capture-form">
    <input type="email" placeholder="Enter your email address">
    <button>Get Access →</button>
  </div>
  <p style="font-size:0.78rem;opacity:0.7;margin-top:12px;">No spam, ever. Unsubscribe in one click.</p>
</div>`,

  'contact-form': () => `
<div class="lc-contact-form canvas-element" data-type="contact-form">
  <h2>Get In Touch</h2>
  <div class="contact-form">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <input type="text" placeholder="Your Name">
      <input type="email" placeholder="Email Address">
    </div>
    <input type="text" placeholder="Subject">
    <textarea placeholder="Your message..."></textarea>
    <button>Send Message →</button>
  </div>
</div>`,

  newsletter: () => `
<div class="lc-newsletter canvas-element" data-type="newsletter">
  <h3>Stay in the Loop</h3>
  <p>Weekly insights on growth, marketing, and building great products.</p>
  <div class="newsletter-form">
    <input type="email" placeholder="Your email address">
    <button>Subscribe</button>
  </div>
</div>`,

  'logo-strip': () => `
<div class="lc-logo-strip canvas-element" data-type="logo-strip">
  <p>Trusted by leading companies worldwide</p>
  <div class="logo-strip-items">
    <span>ACME Corp</span>
    <span>TechGiant</span>
    <span>StartupXYZ</span>
    <span>GrowthCo</span>
    <span>ScaleUp</span>
    <span>Ventura</span>
  </div>
</div>`,

  heading: () => `
<div class="lc-heading canvas-element" data-type="heading">
  <h1>Your Headline Goes Here</h1>
</div>`,

  subheading: () => `
<div class="lc-subheading canvas-element" data-type="subheading">
  <h2>Your Subheading Goes Here</h2>
</div>`,

  paragraph: () => `
<div class="lc-paragraph canvas-element" data-type="paragraph">
  <p>Add your text content here. This is a paragraph block that you can customize with your own copy. Double-click to edit directly.</p>
</div>`,

  'bullet-list': () => `
<div class="lc-bullet-list canvas-element" data-type="bullet-list">
  <ul>
    <li>First key benefit or feature point here</li>
    <li>Second important reason why this matters</li>
    <li>Third compelling point that drives action</li>
    <li>Fourth point that closes the deal</li>
  </ul>
</div>`,

  quote: () => `
<div class="lc-quote canvas-element" data-type="quote">
  <blockquote>"The best marketing doesn't feel like marketing. Build something people love and the growth takes care of itself."<br><strong style="font-style:normal;font-size:0.85rem;">— Seth Godin</strong></blockquote>
</div>`,

  badge: () => `
<div class="lc-badge canvas-element" data-type="badge">
  <span>✨ New Feature Available</span>
</div>`,

  button: () => `
<div class="lc-button canvas-element" data-type="button">
  <a href="#">Get Started Free →</a>
</div>`,

  divider: () => `
<div class="lc-divider canvas-element" data-type="divider">
  <hr>
</div>`,

  spacer: () => `
<div class="lc-spacer canvas-element" data-type="spacer" style="height:60px;"></div>`,

  image: () => `
<div class="lc-image canvas-element" data-type="image">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Featured image">
</div>`,

  video: () => `
<div class="lc-video canvas-element" data-type="video">
  <div class="video-placeholder">
    <span>▶ Click to add video URL</span>
  </div>
</div>`,

  icon: () => `
<div class="lc-icon canvas-element" data-type="icon">
  <i class="fa fa-star fa-3x" style="color:#6c63ff;"></i>
</div>`,

  section: () => `
<div class="lc-section canvas-element" data-type="section" style="background:#f8f9ff;padding:40px;">
  <p style="text-align:center;color:#aaa;font-size:0.88rem;">Custom Section — drag components inside or edit this block</p>
</div>`,

  'two-col': () => `
<div class="lc-two-col canvas-element" data-type="two-col">
  <div class="col-placeholder">Column 1 Content</div>
  <div class="col-placeholder">Column 2 Content</div>
</div>`,

  'three-col': () => `
<div class="lc-three-col canvas-element" data-type="three-col">
  <div class="col-placeholder">Column 1</div>
  <div class="col-placeholder">Column 2</div>
  <div class="col-placeholder">Column 3</div>
</div>`,

  footer: () => `
<div class="lc-footer canvas-element" data-type="footer">
  <div class="footer-grid">
    <div>
      <div class="footer-brand">BrandName</div>
      <p class="footer-desc">Building great products for ambitious teams. Trusted by 50,000+ companies worldwide.</p>
    </div>
    <div class="footer-col"><h4>Product</h4><ul><li><a href="#">Features</a></li><li><a href="#">Pricing</a></li><li><a href="#">Changelog</a></li><li><a href="#">Roadmap</a></li></ul></div>
    <div class="footer-col"><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Blog</a></li><li><a href="#">Careers</a></li><li><a href="#">Press</a></li></ul></div>
    <div class="footer-col"><h4>Legal</h4><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Security</a></li><li><a href="#">Cookies</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2024 BrandName. All rights reserved.</span><span>Made with ❤️ LandingCraft</span></div>
</div>`
};
