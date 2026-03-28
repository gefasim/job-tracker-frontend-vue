<script setup lang="ts">
import LeftSidebar from '@/views/HomeDashboard/LeftSidebar.vue'
import TopNavbar from './TopNavbar.vue'
</script>
<template>
  <div class="home">
    <TopNavbar />
    <div class="content-with-sidebar">
      <LeftSidebar />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<style>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-main);
}
.content-with-sidebar {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}
.main-content {
  flex: 5;
  overflow-y: auto;
}
</style>
