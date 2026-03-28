<script setup lang="ts">
import { useNavbarFilter } from '@/store/navbarFilterStore'

const { textFilter } = useNavbarFilter()
</script>
<template>
  <nav class="top-navbar">
    <div class="nav-brand">
      <h2>Job Tracker</h2>
    </div>
    <div class="nav-menu">
      <input v-model="textFilter" type="text" placeholder="Search..." />
    </div>
  </nav>
</template>
<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}
.nav-brand h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}
</style>
