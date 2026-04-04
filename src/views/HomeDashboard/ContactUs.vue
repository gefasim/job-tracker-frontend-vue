<template>
  <div class="contact-page">
    <div class="contact-container">
      <header class="contact-header">
        <h1>Contact Us</h1>
        <p class="subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </header>

      <div class="contact-card">
        <form @submit.prevent>
          <div class="form-group">
            <label for="name">Name <span class="required">*</span></label>
            <input type="text" id="name" placeholder="Your name" class="form-control" />
          </div>

          <div class="form-group">
            <label for="email">Email Address <span class="required">*</span></label>
            <input type="email" id="email" placeholder="your.email@example.com" class="form-control" />
          </div>

          <div class="form-group">
            <label for="message">Message <span class="required">*</span></label>
            <textarea
              id="message"
              placeholder="Tell us how we can help you..."
              rows="5"
              class="form-control"
            ></textarea>
          </div>

          <button type="submit" class="btn-primary btn-submit">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--bg-main);
  color: var(--text-primary);
}

.contact-container {
  max-width: 650px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Header */
.contact-header {
  text-align: center;
}

.contact-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--text-primary);
}

.contact-header .subtitle {
  font-size: 1.125rem;
  color: #4b5563;
  margin: 0;
}

html.dark .contact-header .subtitle {
  color: #9ca3af;
}

/* Card */
.contact-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.required {
  color: #ef4444; /* red-500 */
}

.form-control {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-control::placeholder {
  color: var(--input-placeholder);
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

html.dark .form-control:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}

textarea.form-control {
  resize: vertical;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #1d4ed8;
}

html.dark .btn-submit {
  background-color: #3b82f6;
}

html.dark .btn-submit:hover {
  background-color: #2563eb;
}
</style>
