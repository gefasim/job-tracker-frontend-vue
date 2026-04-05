<template>
  <div class="about-page">
    <div class="about-container">
      <header class="about-header">
        <h1>About JobTracker</h1>
        <p class="subtitle">
          Your comprehensive solution for managing job applications, documents, and professional
          contacts all in one place.
        </p>
      </header>

      <section class="mission-section">
        <div class="mission-card section-card">
          <h2>Our Mission</h2>
          <p>
            JobTracker was created to simplify the job search process. We understand that managing
            multiple job applications, keeping track of interviews, organizing documents, and
            maintaining professional contacts can be overwhelming. Our mission is to provide a
            streamlined platform that brings all these essential tools together.
          </p>
        </div>
      </section>

      <section class="offer-section">
        <h2 class="section-title">What We Offer</h2>
        <div class="features-grid">
          <div class="feature-card section-card">
            <h3>📋 Application Tracking</h3>
            <p>
              Keep track of all your job applications with our intuitive Kanban board. Move
              applications through different stages from Applied to Offer.
            </p>
          </div>
          <div class="feature-card section-card">
            <h3>📄 Document Management</h3>
            <p>
              Upload and organize your resumes, cover letters, and other important documents. Access
              them whenever you need them.
            </p>
          </div>
          <div class="feature-card section-card">
            <h3>👥 Contact Management</h3>
            <p>
              Maintain a database of recruiters, hiring managers, and professional contacts. Never
              lose track of important connections.
            </p>
          </div>
          <div class="feature-card section-card">
            <h3>🔍 Smart Organization</h3>
            <p>
              Filter, search, and organize your applications by company, status, date, and more.
              Find what you need instantly.
            </p>
          </div>
        </div>
      </section>

      <section class="extension-section">
        <div class="extension-card section-card">
          <div class="extension-header">
            <h2>🔌 Browser Extension <span class="badge">NEW</span></h2>
            <p>
              Save time and eliminate manual data entry with our powerful browser extension. Capture
              job details from LinkedIn, Indeed, and other job boards with just a couple of clicks!
            </p>
          </div>
          <div class="extension-grid">
            <div class="ext-feature-card">
              <div class="ext-icon">⚡</div>
              <h4>One-Click Capture</h4>
              <p>
                Automatically scrapes job title, company name, logo, location, description, salary,
                and posting URL.
              </p>
            </div>
            <div class="ext-feature-card">
              <div class="ext-icon">🔄</div>
              <h4>Instant Sync</h4>
              <p>
                Jobs are immediately added to your selected board. If JobTracker is open, it updates
                automatically without refresh.
              </p>
            </div>
            <div class="ext-feature-card">
              <div class="ext-icon">🎯</div>
              <h4>100% Accurate</h4>
              <p>
                No more copy-paste errors or missing information. Every detail is captured exactly
                as it appears on the job posting.
              </p>
            </div>
          </div>
          <div class="extension-action">
            <RouterLink
              :to="{ path: '/how-to', hash: '#browser-extension' }"
              class="btn-primary btn-purple"
              >Learn How to Use the Extension</RouterLink
            >
          </div>
        </div>
      </section>

      <section class="tech-section">
        <div class="tech-card section-card">
          <h2>Built with Modern Technology</h2>
          <p>
            JobTracker is built using cutting-edge web technologies to ensure a fast, secure, and
            reliable experience:
          </p>
          <ul>
            <li>Vue 3 for optimal performance</li>
            <li>TypeScript for type-safe, maintainable code</li>
            <li>Secure authentication and data encryption</li>
          </ul>
        </div>
      </section>

      <section class="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of job seekers who are already using JobTracker to organize their job
          search.
        </p>
        <div class="cta-buttons">
          <button class="btn-primary">Sign Up Free</button>
          <RouterLink to="contact-us" class="btn-secondary">Contact Us</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--bg-main);
  color: var(--text-primary);
}

.about-container {
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Header */
.about-header {
  text-align: center;
}

.about-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.about-header .subtitle {
  font-size: 1.125rem;
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

html.dark .about-header .subtitle {
  color: #9ca3af;
}

/* Section Card */
.section-card {
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Mission Section */
.mission-card {
  background-color: #fffaf0; /* Light cream/yellow */
  border-radius: 12px;
  padding: 2.5rem;
}

html.dark .mission-card {
  background-color: #2a251a;
  border: 1px solid #423826;
}

.mission-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--text-primary);
}

.mission-card p {
  color: #374151;
  line-height: 1.7;
  margin: 0;
}

html.dark .mission-card p {
  color: #d1d5db;
}

/* Offer Section */
.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 0;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-card p {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

html.dark .feature-card p {
  color: #9ca3af;
}

/* Extension Section */
.extension-card {
  background-color: #faf5ff; /* Light purple */
  text-align: center;
}

html.dark .extension-card {
  background-color: #2c1e38;
  border: 1px solid #46305a;
}

.extension-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.badge {
  background-color: #a855f7;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  vertical-align: middle;
}

.extension-header p {
  color: #4b5563;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

html.dark .extension-header p {
  color: #d1d5db;
}

.extension-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  text-align: left;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .extension-grid {
    grid-template-columns: 1fr;
  }
}

.ext-feature-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ext-icon {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.ext-feature-card h4 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.ext-feature-card p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

html.dark .ext-feature-card p {
  color: #9ca3af;
}

.btn-purple {
  background-color: #9333ea !important;
  color: white !important;
  border: none;
  text-decoration: none;
}

.btn-purple:hover {
  background-color: #7e22ce !important;
}

/* Tech Section */
.tech-card {
  background-color: #f0f6ff; /* Light blue */
}

html.dark .tech-card {
  background-color: #1e293b;
  border: 1px solid #334155;
}

.tech-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.tech-card p {
  color: #374151;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

html.dark .tech-card p {
  color: #d1d5db;
}

.tech-card ul {
  color: #4b5563;
  line-height: 2;
  padding-left: 1.5rem;
  margin: 0;
}

html.dark .tech-card ul {
  color: #9ca3af;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 2rem 0;
}

.cta-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.cta-section p {
  color: #4b5563;
  font-size: 1.05rem;
  margin-bottom: 2rem;
}

html.dark .cta-section p {
  color: #d1d5db;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-secondary {
  background-color: #e2e8f0;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  color: #0f172a;
  transition: background-color 0.2s;
  font-size: 0.95rem;
  text-decoration: none;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

html.dark .btn-secondary {
  background-color: #334155;
  color: #f8fafc;
}

html.dark .btn-secondary:hover {
  background-color: #475569;
}
</style>
