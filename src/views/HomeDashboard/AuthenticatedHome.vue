<script setup lang="ts">
import LeftSidebar from '@/views/HomeDashboard/LeftSidebar.vue'
</script>
<template>
  <div class="home">
    <LeftSidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
<style>
.home {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: var(--bg-main);
}
.main-content {
  flex: 5;
}
</style>
