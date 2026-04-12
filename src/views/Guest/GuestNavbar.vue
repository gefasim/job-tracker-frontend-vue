<script setup lang="ts">
import BaseButtonDropdown from '@/views/Shared/BaseButtonDropdown.vue'
import { useTheme, type ColorScheme } from '@/store/themeStore'
import DarkThemeIcon from '@/assets/icons/DarkThemeIcon.vue'
import LightThemeIcon from '@/assets/icons/LightThemeIcon.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { themeOptions, isDark, setTheme } = useTheme()
const helpOptions = ['About', 'How to?', 'Contact Us']

const handleThemeSelect = (selected: string) => {
  setTheme(selected as ColorScheme)
}

const handleHelpSelect = (selected: string) => {
  if (selected === 'About') {
    router.push('/welcome/about')
  } else if (selected === 'How to?') {
    router.push('/welcome/how-to')
  } else if (selected === 'Contact Us') {
    router.push('/welcome/contact-us')
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/" class="brand">JobTracker</RouterLink>
    </div>

    <div class="navbar-center hidden-mobile">
      <RouterLink :to="{ name: 'landing', hash: '#application' }" class="nav-link">
        Application
      </RouterLink>
      <RouterLink :to="{ name: 'landing', hash: '#documents' }" class="nav-link">
        Documents
      </RouterLink>
      <RouterLink :to="{ name: 'landing', hash: '#contacts' }" class="nav-link">
        Contacts
      </RouterLink>
      <RouterLink :to="{ name: 'landing', hash: '#notes' }" class="nav-link"> Notes </RouterLink>
      <RouterLink :to="{ name: 'landing', hash: '#companies' }" class="nav-link">
        Companies
      </RouterLink>
    </div>

    <div class="navbar-right">
      <BaseButtonDropdown :items="themeOptions" @select="handleThemeSelect">
        <template #buttonValue>
          <div style="display: flex; align-items: center">
            <DarkThemeIcon v-if="isDark" /><LightThemeIcon v-else />
          </div>
        </template>
        <template #item="{ item }">{{ item }}</template>
      </BaseButtonDropdown>

      <BaseButtonDropdown :items="helpOptions" @select="handleHelpSelect" class="hidden-mobile">
        <template #buttonValue>Help</template>
        <template #item="{ item }">{{ item }}</template>
      </BaseButtonDropdown>

      <div class="auth-buttons">
        <RouterLink to="/login" class="btn-outline">Login</RouterLink>
        <RouterLink to="/signup" class="btn-primary">Sign Up</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--nav-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--nav-border);
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.navbar-center {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
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

@media (max-width: 1200px) {
  .hidden-mobile {
    display: none !important;
  }

  .navbar-right {
    gap: 0.5rem;
  }
}
</style>
