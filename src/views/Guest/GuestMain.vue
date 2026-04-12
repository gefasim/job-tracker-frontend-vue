<script setup lang="ts">
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import NoteNavTabIcon from '@/assets/icons/NoteNavTabIcon.vue'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import JobInfoNavTabIcon from '@/assets/icons/JobInfoNavTabIcon.vue'
import CompanyNavTabIcon from '@/assets/icons/CompanyNavTabIcon.vue'
</script>

<template>
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
        <RouterLink to="/signup" class="btn-primary btn-get-started">Get Started Free</RouterLink>
        <p class="hero-note">No credit card required</p>
      </div>
      <div class="hero-image">
        <img src="/images/JobsBoard.png" alt="Job Tracker Dashboard" />
      </div>
    </section>

    <section id="application" class="feature-section section-blue">
      <div class="feature-content">
        <div class="feature-header">
          <span class="icon-wrapper" style="background-color: rgba(59, 130, 246, 1)">
            <JobInfoNavTabIcon size="2rem" />
          </span>
          <h2>Applications</h2>
        </div>
        <h3>Record and track your job applications.</h3>
        <p>
          Bring all your job search details together—no more scattered spreadsheets or sticky notes.
          Track every opportunity, from company data and job descriptions to interview dates,
          contacts, and more. Your entire job search, organized and accessible in one place.
        </p>
      </div>
      <div class="feature-image">
        <img src="/images/Add_Job.png" alt="Applications Feature" />
      </div>
    </section>

    <section id="documents" class="feature-section section-purple">
      <div class="feature-content">
        <div class="feature-header">
          <span class="icon-wrapper" style="background-color: rgba(168, 85, 247, 1)">
            <DocumentNavTabIcon size="2rem" />
          </span>
          <h2>Documents</h2>
        </div>
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
        <div class="feature-header">
          <span class="icon-wrapper" style="background-color: rgba(2, 129, 76, 1)">
            <ContactNavTabIcon size="2rem" />
          </span>
          <h2>Contacts</h2>
        </div>
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
        <div class="feature-header">
          <span class="icon-wrapper" style="background-color: rgba(249, 115, 22, 1)">
            <NoteNavTabIcon size="2rem" />
          </span>
          <h2>Notes</h2>
        </div>
        <h3>Capture and organize important insights.</h3>
        <p>
          Capture important insights, meeting summaries, and interview feedback as they happen. Add
          notes to jobs, contacts, or activities to keep context at your fingertips and make
          informed decisions throughout your search.
        </p>
      </div>
      <div class="feature-image">
        <img src="/images/Notes.png" alt="Notes Feature" />
      </div>
    </section>

    <section id="companies" class="feature-section section-companies">
      <div class="feature-content">
        <div class="feature-header">
          <span class="icon-wrapper" style="background-color: rgba(239, 68, 68, 1)">
            <CompanyNavTabIcon size="2rem" />
          </span>
          <h2>Companies</h2>
        </div>
        <h3>Build your target company database.</h3>
        <p>
          Build a comprehensive database of target companies with detailed profiles, culture
          insights, and job openings. Track your interactions, save company research, and identify
          the best opportunities that align with your career goals.
        </p>
      </div>
      <div class="feature-image">
        <img src="/images/Company.png" alt="Companies Feature" />
      </div>
    </section>
  </main>
</template>

<style scoped>
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
  background: var(--hero-bg);
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
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.btn-get-started {
  display: inline-block;
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
  color: var(--text-muted);
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

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  padding: 1rem;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: white;
}

.feature-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.feature-content p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.section-blue {
  background: var(--sec-blue-bg);
}

.section-purple {
  background: var(--sec-purple-bg);
}

.section-green {
  background: var(--sec-green-bg);
}

.section-orange {
  background: var(--sec-orange-bg);
}

.section-companies {
  background: var(--sec-companies-bg);
}

/* Responsive */
@media (max-width: 1400px) {
  .hero-title {
    font-size: 3rem;
  }
}
@media (max-width: 1200px) {
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

  .feature-header {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .icon-wrapper {
    margin: 0;
  }

  .feature-content h2 {
    margin: 0;
  }
}
</style>
