<script setup lang="ts">
import AboutIcon from '@/assets/AboutIcon.vue'
import BoardIcon from '@/assets/BoardIcon.vue'
import ContactNavTabIcon from '@/assets/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/DocumentNavTabIcon.vue'
import ContactUsIcon from '@/assets/ContactUsIcon.vue'
import HowToIcon from '@/assets/HowToIcon.vue'
import LightThemeIcon from '@/LightThemeIcon.vue'
import DarkThemeIcon from '@/assets/DarkThemeIcon.vue'
</script>
<template>
  <div class="left-sidebar">
    <div>
      <div><ContactNavTabIcon /> Contacts</div>
      <div><DocumentNavTabIcon /> Documents</div>
      <hr />
      Your boards:
      <div><BoardIcon /> Board1</div>
      <div><BoardIcon /> Board2</div>
      <hr />
      Help
      <div><AboutIcon /> About</div>
      <div><ContactUsIcon /> Contact Us</div>
      <div><HowToIcon /> How to?</div>
      <hr />
    </div>
    <div>
      <div><LightThemeIcon /> <DarkThemeIcon /> Theme</div>
      <div>Personal Account Settings</div>
      <div>Log Out</div>
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
}
</style>
