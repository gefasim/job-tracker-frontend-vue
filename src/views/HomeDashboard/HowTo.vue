<template>
  <div class="howto-page">
    <div class="howto-container">
      <div class="header-section">
        <h1 class="page-title">How to Use JobTracker</h1>
        <p class="page-subtitle">
          A comprehensive guide to help you make the most of JobTracker's features and streamline your job search.
        </p>
      </div>

      <div class="sections-container">
        <!-- Getting Started -->
        <section class="section-card theme-amber">
          <h2 class="section-title">Getting Started</h2>
          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="step-title">Create Your Account</h3>
                <p>Sign up with your email address and create a secure password. Verify your email to activate your account.</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="step-title">Set Up Your Profile</h3>
                <p>Add your personal information and preferences to customize your JobTracker experience.</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="step-title">Start Adding Applications</h3>
                <p>Begin tracking your job applications by adding company names, positions, and application dates.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Company Autocomplete -->
        <section class="section-card theme-blue text-center-content">
          <h2 class="section-title">Adding a New Job Application with Company Autocomplete</h2>
          <p class="section-subtitle max-width-text mx-auto">
            JobTracker makes it easy to add new job applications by helping you quickly find and select the correct company name using our smart autocomplete feature.
          </p>
          <ol class="ordered-list max-width-list">
            <li>
              <strong>Start typing the company name:</strong> In the <span class="font-semibold">Company</span> field, enter the first 2–3 letters of the company you want to add. For example, type <span class="highlight-text">Mic</span> for Microsoft.
            </li>
            <li>
              <strong>View suggestions:</strong> As you type, a dropdown will appear with a list of matching company names and their logos. This helps you quickly find the correct company and avoid typos.
            </li>
            <li>
              <strong>Select the correct company:</strong> Click on the company name from the suggestions list. The company name and logo will automatically fill the field.
            </li>
            <li>
              <strong>Continue filling out the form:</strong> Complete the rest of the job application details as usual.
            </li>
          </ol>
          <div class="image-wrapper pt-8">
            <img alt="Demo: Adding a job with company autocomplete" class="demo-img border-blue" src="/gifs/Add_a_job.gif" />
          </div>
        </section>

        <!-- Browser Extension -->
        <section id="browser-extension" class="section-card theme-purple">
          <h2 class="section-title text-center">Using the JobTracker Browser Extension</h2>
          <p class="section-subtitle text-center max-width-text mx-auto">
            Save time by automatically capturing job details directly from LinkedIn, Indeed, and other job boards with just a couple of clicks!
          </p>

          <div class="feature-block">
            <h3 class="subsection-title">How It Works</h3>
            <ol class="ordered-list max-width-list">
              <li><strong>Install the Extension:</strong> Add the JobTracker browser extension from the Chrome Web Store (link available from your dashboard).</li>
              <li><strong>Browse Job Listings:</strong> Navigate to any job posting on LinkedIn, Indeed, or other supported job boards.</li>
              <li>
                <strong>Click the Extension Icon:</strong> When you're viewing a job you want to save, click the JobTracker extension icon in your browser toolbar. The extension will automatically scrape the job details including:
                <ul class="bullet-list ml-6">
                  <li>Job Title</li>
                  <li>Company Name and Logo</li>
                  <li>Location</li>
                  <li>Job Description</li>
                  <li>Salary Information (when available)</li>
                  <li>Direct Link to the Job Posting</li>
                </ul>
              </li>
              <li><strong>Review and Select Board:</strong> The extension popup will display the captured information. Choose which board you want to save the job to (e.g., "Wishlist", "Applied", etc.).</li>
              <li><strong>Save to JobTracker:</strong> Click the "Save Job" button. The job will be instantly added to your selected board. If you have JobTracker open in another tab, it will automatically update without needing to refresh!</li>
            </ol>
          </div>

          <div class="feature-block">
            <h3 class="subsection-title text-center">Example: Saving a Job from LinkedIn</h3>
            <div class="image-wrapper">
              <img alt="Demo: Using browser extension to save a job from LinkedIn" class="demo-img border-purple" src="/gifs/linkedin-demo.gif" />
            </div>
          </div>

          <div class="feature-block">
            <h3 class="subsection-title text-center">Example: Saving a Job from Indeed</h3>
            <div class="image-wrapper">
              <img alt="Demo: Using browser extension to save a job from Indeed" class="demo-img border-purple" src="/gifs/indeed-demo.gif" />
            </div>
          </div>

          <div class="benefits-panel">
            <h3 class="benefits-title"><span class="icon">⚡</span> Benefits of Using the Extension</h3>
            <ul class="benefits-list">
              <li><span class="check-icon">✓</span><span><strong>Save Time:</strong> No need to manually copy and paste job details</span></li>
              <li><span class="check-icon">✓</span><span><strong>Avoid Errors:</strong> Automatically captures accurate information</span></li>
              <li><span class="check-icon">✓</span><span><strong>Stay Organized:</strong> Jobs are instantly saved to your chosen board</span></li>
              <li><span class="check-icon">✓</span><span><strong>Tab Reuse:</strong> If JobTracker is already open, it reuses that tab automatically</span></li>
              <li><span class="check-icon">✓</span><span><strong>Company Logos:</strong> Automatically fetches and displays company logos</span></li>
            </ul>
          </div>
        </section>

        <!-- Managing Your Job Applications -->
        <section>
          <h2 class="section-title">Managing Your Job Applications</h2>
          <div class="inner-cards-container">
            <div class="inner-card">
              <h3 class="inner-card-title">📋 Adding a New Application</h3>
              <p>Click the "Add Job" button to create a new application entry. Fill in the company name, position, job description, and any relevant links.</p>
              <ul class="bullet-list mt-3">
                <li>Company name is required</li>
                <li>Add the job posting URL for easy reference</li>
                <li>Set the application date to track your timeline</li>
                <li>Add notes about the position or company</li>
              </ul>
            </div>
            <div class="inner-card">
              <h3 class="inner-card-title">🔄 Using the Kanban Board</h3>
              <p>Our Kanban board visualizes your application pipeline. Drag and drop applications between columns as they progress:</p>
              <ul class="bullet-list mt-3">
                <li><strong>Wishlist:</strong> Companies you're interested in</li>
                <li><strong>Applied:</strong> Applications you've submitted</li>
                <li><strong>Interview:</strong> Scheduled or completed interviews</li>
                <li><strong>Offer:</strong> Job offers received</li>
                <li><strong>Rejected:</strong> Applications that didn't move forward</li>
              </ul>
            </div>
            <div class="inner-card">
              <h3 class="inner-card-title">✏️ Editing Applications</h3>
              <p>Click on any application card to view details. Use the edit button to update information, add interview dates, or include follow-up notes.</p>
            </div>
          </div>
        </section>

        <!-- Document Management -->
        <section class="section-card theme-lightblue">
          <h2 class="section-title">Document Management</h2>
          <p class="section-subtitle">Keep all your job search documents organized in one place:</p>
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">📄</span>
              <div class="feature-desc"><strong>Upload Documents:</strong> Store multiple versions of your resume, cover letters, portfolios, and certificates.</div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🏷️</span>
              <div class="feature-desc"><strong>Categorize Files:</strong> Tag documents by type (Resume, Cover Letter, Portfolio, etc.) for easy filtering.</div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <div class="feature-desc"><strong>Link to Applications:</strong> Attach relevant documents to specific job applications.</div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⬇️</span>
              <div class="feature-desc"><strong>Download Anytime:</strong> Access your documents whenever you need them, from any device.</div>
            </div>
          </div>
        </section>

        <!-- Managing Contacts -->
        <section>
          <h2 class="section-title">Managing Contacts</h2>
          <div class="inner-card">
            <p class="mb-4">Build and maintain your professional network within JobTracker:</p>
            <ul class="bullet-list ml-4">
              <li>Add recruiters, hiring managers, and professional contacts</li>
              <li>Store contact information, company, and role</li>
              <li>Link contacts to relevant job applications</li>
              <li>Add notes about your interactions and conversations</li>
              <li>Set reminders for follow-ups</li>
            </ul>
          </div>
        </section>

        <!-- Tips & Best Practices -->
        <section class="section-card theme-green">
          <h2 class="section-title">💡 Tips &amp; Best Practices</h2>
          <ul class="tips-list">
            <li><span class="check-icon green">✓</span><span>Update your applications regularly to keep track of their current status</span></li>
            <li><span class="check-icon green">✓</span><span>Use the notes field to record interview questions, feedback, or important details</span></li>
            <li><span class="check-icon green">✓</span><span>Set reminders for follow-up emails or upcoming interviews</span></li>
            <li><span class="check-icon green">✓</span><span>Keep your documents up-to-date and tailored to different types of positions</span></li>
            <li><span class="check-icon green">✓</span><span>Regularly review your wishlist and convert prospects into active applications</span></li>
            <li><span class="icon purple">🔌</span><span><strong>Browser Extension - Sync Issue:</strong> If the extension shows "Sync required" message, click the "Rescan &amp; Sync" button at the top right of the extension popup to refresh the job data</span></li>
            <li><span class="icon purple">🔌</span><span><strong>Browser Extension - No Data Fetched:</strong> If clicking the extension icon doesn't load any job details, try refreshing the job posting page and then click the extension icon again. This is especially helpful on LinkedIn where pages load dynamically</span></li>
          </ul>
        </section>

        <!-- Need More Help? -->
        <section class="help-section text-center">
          <h2 class="section-title">Need More Help?</h2>
          <p class="section-subtitle max-width-text mx-auto">If you have questions or need assistance, we're here to help!</p>
          <a class="btn-primary support-btn" href="/contact-us">Contact Support</a>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.howto-page {
  background-color: var(--bg-main);
  color: var(--text-primary);
  min-height: 100vh;
}

.howto-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 5rem 1rem 9rem 1rem;
}

@media (min-width: 640px) {
  .howto-container { padding-left: 1.5rem; padding-right: 1.5rem; }
}
@media (min-width: 1024px) {
  .howto-container { padding-left: 2rem; padding-right: 2rem; }
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .page-title { font-size: 3rem; line-height: 1; }
}

.page-subtitle {
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #4b5563;
  max-width: 48rem;
  margin: 0 auto;
}

html.dark .page-subtitle { color: #9ca3af; }

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section-card {
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Theme classes */
.theme-amber { background-color: #fffbeb; }
html.dark .theme-amber { background-color: #1e293b; }

.theme-blue { background-color: #dbeafe; }
html.dark .theme-blue { background-color: #334155; }

.theme-purple { background-color: #f3e8ff; }
html.dark .theme-purple { background-color: #334155; }

.theme-lightblue { background-color: #eff6ff; }
html.dark .theme-lightblue { background-color: #1e293b; }

.theme-green { background-color: #f0fdf4; }
html.dark .theme-green { background-color: #1e293b; }

.section-title {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.section-subtitle {
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #374151;
  margin-bottom: 1.5rem;
  margin-top: 0;
}
html.dark .section-subtitle { color: #e5e7eb; }

/* Getting Started Steps */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background-color: var(--btn-primary-bg, #2563eb);
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.step-content p { color: #374151; margin-top: 0.5rem; margin-bottom: 0; }
html.dark .step-content p { color: #cbd5e1; }

.step-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Mixed content utilities */
.text-center-content { text-align: center; }
.text-center { text-align: center; }
.max-width-list { max-width: 42rem; margin-left: auto; margin-right: auto; text-align: left; }
.max-width-text { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

.font-semibold { font-weight: 600; }
.highlight-text {
  background-color: #e2e8f0;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
}
html.dark .highlight-text { background-color: #475569; }

.ordered-list {
  list-style-type: decimal;
  list-style-position: inside;
  color: #374151;
  padding: 0;
}
html.dark .ordered-list { color: #e5e7eb; }
.ordered-list > li { margin-bottom: 1rem; line-height: 1.5; }

.bullet-list {
  list-style-type: disc;
  list-style-position: inside;
  color: #4b5563;
  padding: 0;
}
html.dark .bullet-list { color: #9ca3af; }
.bullet-list > li { margin-bottom: 0.25rem; line-height: 1.5; }
.bullet-list.ml-6 { margin-left: 1.5rem; margin-top: 0.5rem; }
.bullet-list.mt-3 { margin-top: 0.75rem; }
.bullet-list.ml-4 { margin-left: 1rem; }

/* Images */
.image-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.pt-8 { padding-top: 2rem; }

.demo-img {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 100%;
  height: auto;
  border: 1px solid transparent;
}

.border-blue { border-color: #60a5fa; }
.border-purple { border-color: #c084fc; }

/* Extensions specific */
.feature-block { margin-bottom: 2rem; }
.subsection-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  margin-top: 0;
}

.benefits-panel {
  background-color: #e9d5ff; /* purple-200 */
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
}
html.dark .benefits-panel { background-color: #475569; /* slate-600 */ }

.benefits-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon { font-size: 1.5rem; }
.benefits-list, .tips-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #374151;
  padding: 0;
  margin: 0;
  list-style: none;
}
html.dark .benefits-list, html.dark .tips-list { color: #e5e7eb; }

.benefits-list li, .tips-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5;
}

.check-icon {
  color: #9333ea; /* purple-600 */
  font-weight: 700;
  margin-top: 0.1rem;
}
html.dark .check-icon { color: #d8b4fe; } /* purple-300 */
.check-icon.green { color: #16a34a; } /* green-600 */
html.dark .check-icon.green { color: #4ade80; } /* green-400 */
.icon.purple { color: #9333ea; font-weight: 700; margin-top: -0.1rem; }
html.dark .icon.purple { color: #c084fc; }

/* Inner cards (Management sections) */
.inner-cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.inner-card {
  background-color: var(--bg-card); /* white / slate-800 */
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color); /* slate-200 / slate-700 */
}

.inner-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin-top: 0;
}

.inner-card p {
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}
html.dark .inner-card p { color: #9ca3af; }

.mb-4 { margin-bottom: 1rem !important; }

/* Features list */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #374151;
}
html.dark .features-list { color: #cbd5e1; }

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  line-height: 1.5;
}
.feature-icon { font-size: 1.5rem; margin-top: -0.2rem; }

.help-section { padding-top: 2rem; padding-bottom: 2rem; }

.support-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;
  margin-top: 1rem;
}
.support-btn:hover {
  transform: scale(1.02);
}
</style>
