<script setup lang="ts">
import LeftSidebar from '@/views/HomeDashboard/LeftSidebar.vue'
import TopNavbar from './TopNavbar.vue'
</script>
<template>
  <div class="home">
    <LeftSidebar />
    <div class="content-with-navbar">
      <TopNavbar />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<style>
.home {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: var(--bg-main);
}
.content-with-navbar {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.main-content {
  flex: 5;
  overflow-y: auto;
}
</style>
