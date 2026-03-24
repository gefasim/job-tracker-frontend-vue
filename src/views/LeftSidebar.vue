<script setup lang="ts">
import AboutIcon from '@/assets/icons/AboutIcon.vue'
import BoardIcon from '@/assets/icons/BoardIcon.vue'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import ContactUsIcon from '@/assets/icons/ContactUsIcon.vue'
import HowToIcon from '@/assets/icons/HowToIcon.vue'
import LightThemeIcon from '@/LightThemeIcon.vue'
import DarkThemeIcon from '@/assets/icons/DarkThemeIcon.vue'
import { useTheme } from '@/store/themeStore'

const { isDark } = useTheme()
</script>
<template>
  <div class="left-sidebar">
    <div>
      <div class="sidebar-item"><ContactNavTabIcon /> Contacts</div>
      <div class="sidebar-item"><DocumentNavTabIcon /> Documents</div>
      <hr />
      Your boards:
      <div class="sidebar-item"><BoardIcon /> Board1</div>
      <div class="sidebar-item"><BoardIcon /> Board2</div>
      <hr />
      Help
      <div class="sidebar-item"><AboutIcon /> About</div>
      <div class="sidebar-item"><ContactUsIcon /> Contact Us</div>
      <div class="sidebar-item"><HowToIcon /> How to?</div>
      <hr />
    </div>
    <div>
      <div class="sidebar-item"><DarkThemeIcon v-if="isDark" /><LightThemeIcon v-else /> Theme</div>
      <div class="sidebar-item">Personal Account Settings</div>
      <div class="sidebar-item">Log Out</div>
    </div>
  </div>
</template>
<style>
.left-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
  min-width: 10vw;
  padding: 0.5rem;
  padding-top: 20px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
}

.sidebar-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
}

html.dark .sidebar-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
}
</style>
