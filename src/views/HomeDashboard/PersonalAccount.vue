<script setup lang="ts">
import { AccountTabEnum } from './Account/account-tabs'
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Tab navigation
const activeTab = computed<AccountTabEnum>(() => {
  if (route.name === 'account-settings') return AccountTabEnum.Settings
  if (route.name === 'account-notifications') return AccountTabEnum.Notifications
  return AccountTabEnum.Profile
})

const navigateToTab = (tab: AccountTabEnum) => {
  if (tab === AccountTabEnum.Profile) router.push({ name: 'account-profile' })
  else if (tab === AccountTabEnum.Settings) router.push({ name: 'account-settings' })
  else if (tab === AccountTabEnum.Notifications) router.push({ name: 'account-notifications' })
}
</script>

<template>
  <div>
    <nav class="modal-tabs">
      <button
        v-for="tab in Object.values(AccountTabEnum)"
        :key="tab"
        :class="['tab-item', { active: activeTab === tab }]"
        @click="navigateToTab(tab)"
      >
        {{ tab }}
      </button>
    </nav>
    <main class="modal-body">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
/* Tabs */
.modal-tabs {
  display: flex;
  background: #f1f4f9;
  padding: 8px 32px;
  gap: 8px;
}
html.dark .modal-tabs {
  background: #1e293b;
}

.tab-border {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #5f6368;
  gap: 8px;
  font-weight: 500;
  position: relative; /* for badge */
}

.tab-item.active {
  background: var(--bg-main);
  color: #1a73e8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.tab-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  fill: currentColor;
}

/* Form Layout */
.modal-body {
  padding: 32px;
  background: var(--bg-main);
  overflow-y: auto;
  max-height: 70vh;
}
</style>
