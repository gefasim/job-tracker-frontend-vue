<template>
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
</template>

<style scoped>
/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 5%;
  background-color: var(--footer-bg);
  border-top: 1px solid var(--footer-border);
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
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--text-primary);
}

.footer-right p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1200px) {
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
