<script setup lang="ts"></script>
<template>
  <div class="home">
    <div class="left-sidebar">
      <div>
        <div>Contacts</div>
        <div>Documents</div>
        <hr />
        Your boards:
        <div>Board1</div>
        <div>Board2</div>
        <hr />
        Help
        <div>About</div>
        <div>Contact Us</div>
        <div>How to?</div>
        <hr />
      </div>
      <div>
        <div>Theme</div>
        <div>LogOut</div>
      </div>
    </div>
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
.left-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
  min-width: 10vw;
}
.main-content {
  flex: 5;
}
</style>
