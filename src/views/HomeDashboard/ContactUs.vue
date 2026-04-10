<template>
  <div class="contact-page">
    <div class="contact-container">
      <header class="contact-header">
        <h1>Contact Us</h1>
        <p class="subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </header>

      <div class="contact-card">
        <div class="input-group input-group-required">
          <label for="name">Name <span>*</span></label>
          <input type="text" id="name" placeholder="Your name" />
        </div>

        <div class="input-group input-group-required">
          <label for="email">Email Address <span>*</span></label>
          <input type="email" id="email" placeholder="your.email@example.com" />
        </div>

        <div class="input-group input-group-required">
          <label for="message">Message <span>*</span></label>
          <textarea id="message" placeholder="Tell us how we can help you..." rows="5"></textarea>
        </div>

        <button type="submit" class="btn-primary">Send Message</button>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
</style>
