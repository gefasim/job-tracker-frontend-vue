<script setup lang="ts">
import BaseButtonDropdown from './Shared/BaseButtonDropdown.vue'
import { useTheme } from '../store/themeStore'

const { theme, setTheme } = useTheme()

const themeOptions = ['Light', 'Dark', 'System']
const helpOptions = ['About', 'How to?', 'Contact Us']

const handleThemeSelect = (selected: string) => {
  setTheme(selected.toLowerCase() as 'light' | 'dark' | 'system')
}

const handleHelpSelect = (selected: string) => {
  // Handle help options click
  console.log('Help selected:', selected)
}
</script>

<template>
  <div class="guest-layout">
    <nav class="navbar">
      <div class="navbar-left">
        <RouterLink to="/" class="brand">JobTracker</RouterLink>
      </div>

      <div class="navbar-center hidden-mobile">
        <a href="#application" class="nav-link">Application</a>
        <a href="#documents" class="nav-link">Documents</a>
        <a href="#contacts" class="nav-link">Contacts</a>
        <a href="#notes" class="nav-link">Notes</a>
        <a href="#companies" class="nav-link">Companies</a>
      </div>

      <div class="navbar-right">
        <BaseButtonDropdown :items="themeOptions" @select="handleThemeSelect">
          <template #buttonValue
            >Theme: {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}</template
          >
          <template #item="{ item }">{{ item }}</template>
        </BaseButtonDropdown>

        <BaseButtonDropdown :items="helpOptions" @select="handleHelpSelect" class="hidden-mobile">
          <template #buttonValue>Help</template>
          <template #item="{ item }">{{ item }}</template>
        </BaseButtonDropdown>

        <div class="auth-buttons">
          <RouterLink to="/login" class="btn-login">Login</RouterLink>
          <RouterLink to="/signup" class="btn-signup">Sign Up</RouterLink>
        </div>
      </div>
    </nav>

    <main class="content">
      <section id="home" class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Track your job search<br />
            <span class="text-blue">visually</span> and
            <span class="text-purple">effortlessly</span>
          </h1>
          <p class="hero-subtitle">
            Organize applications, manage documents, and stay on top of your job hunt with a
            beautiful, intuitive dashboard.
          </p>
          <RouterLink to="/signup" class="btn-get-started">Get Started Free</RouterLink>
          <p class="hero-note">No credit card required</p>
        </div>
        <div class="hero-image">
          <img src="/images/JobsBoard.png" alt="Job Tracker Dashboard" />
        </div>
      </section>

      <section id="application" class="feature-section section-blue">
        <div class="feature-content">
          <h2>Applications</h2>
          <h3>Record and track your job applications.</h3>
          <p>
            Bring all your job search details together—no more scattered spreadsheets or sticky
            notes. Track every opportunity, from company data and job descriptions to interview
            dates, contacts, and more. Your entire job search, organized and accessible in one
            place.
          </p>
        </div>
        <div class="feature-image">
          <img src="/images/Add_Job.png" alt="Applications Feature" />
        </div>
      </section>

      <section id="documents" class="feature-section section-purple">
        <div class="feature-content">
          <h2>Documents</h2>
          <h3>Upload your resumes and cover letters.</h3>
          <p>
            Easily upload and manage your resumes, cover letters, and supporting documents. Attach
            them to jobs, activities, or contacts, so you always have the right file at your
            fingertips when you need it most.
          </p>
        </div>
        <div class="feature-image">
          <img src="/images/Documents.png" alt="Documents Feature" />
        </div>
      </section>

      <section id="contacts" class="feature-section section-green">
        <div class="feature-content">
          <h2>Contacts</h2>
          <h3>Add your job search contacts.</h3>
          <p>
            Keep track of everyone you meet along your journey—recruiters, interviewers, and
            networking connections. Store contact info, add notes, and never lose touch with the
            people who can help you land your next role.
          </p>
        </div>
        <div class="feature-image">
          <img src="/images/Contacts.png" alt="Contacts Feature" />
        </div>
      </section>

      <section id="notes" class="feature-section section-orange">
        <div class="feature-content">
          <h2>Notes</h2>
          <h3>Capture and organize important insights.</h3>
          <p>
            Capture important insights, meeting summaries, and interview feedback as they happen.
            Add notes to jobs, contacts, or activities to keep context at your fingertips and make
            informed decisions throughout your search.
          </p>
        </div>
        <div class="feature-image">
          <img src="/images/Notes.png" alt="Notes Feature" />
        </div>
      </section>

      <section id="companies" class="feature-section section-companies">
        <div class="feature-content">
          <h2>Companies</h2>
          <h3>Keep an eye on companies.</h3>
          <p>Save companies you're interested in and manage everything related to them.</p>
        </div>
        <div class="feature-image">
          <img src="/images/Company.png" alt="Companies Feature" />
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-left">
        <RouterLink to="/" class="footer-link">Home</RouterLink>
      </div>

      <div class="footer-center">
        <div class="footer-col">
          <a href="#" class="footer-link">About Us</a>
          <a href="#" class="footer-link">How it works</a>
          <a href="#" class="footer-link">Features</a>
        </div>
        <div class="footer-col">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="https://github.com" target="_blank" class="footer-link">GitHub</a>
        </div>
      </div>

      <div class="footer-right">
        <p>© 2026 Job Tracker. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Reset and base variables for layout */
.guest-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #fff;
  background-color: #030712;
  scroll-behavior: smooth;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(3, 7, 18, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.navbar-center {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #a1a1aa;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-login {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}
.btn-login:hover {
  color: #ccc;
}

.btn-signup {
  background-color: #3b82f6;
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.btn-signup:hover {
  background-color: #2563eb;
}

/* Sections */
main.content {
  flex: 1;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  min-height: 100vh;
  padding: 0 10%;
  background: radial-gradient(circle at 30% 50%, rgba(20, 30, 60, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 4.5rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.text-blue {
  color: #60a5fa;
}

.text-purple {
  color: #c084fc;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.btn-get-started {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s,
    background-color 0.2s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.btn-get-started:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.hero-note {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 1rem;
}

.feature-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  min-height: 100vh;
  padding: 0 10%;
}

.hero-image,
.feature-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-image img,
.feature-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.feature-content {
  max-width: 500px;
}

.feature-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-content h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 1.5rem;
}

.feature-content p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #9ca3af;
}

.section-blue {
  background: radial-gradient(circle at 20% 50%, rgba(20, 50, 70, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

.section-purple {
  background: radial-gradient(circle at 20% 50%, rgba(50, 10, 70, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

.section-green {
  background: radial-gradient(circle at 20% 50%, rgba(10, 60, 30, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

.section-orange {
  background: radial-gradient(circle at 20% 50%, rgba(80, 40, 10, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

.section-companies {
  background: radial-gradient(circle at 20% 50%, rgba(40, 40, 40, 1) 0%, rgba(3, 7, 18, 1) 100%);
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 5%;
  background-color: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-center {
  display: flex;
  gap: 5rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.footer-right p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none !important;
  }

  .navbar-right {
    gap: 0.5rem;
  }

  .hero-section,
  .feature-section {
    padding: 5rem 5%;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 2rem;
  }

  .hero-content,
  .feature-content {
    max-width: 100%;
  }

  .hero-title {
    font-size: 3rem;
  }

  .footer {
    flex-direction: column;
    text-align: center;
  }

  .footer-center {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
