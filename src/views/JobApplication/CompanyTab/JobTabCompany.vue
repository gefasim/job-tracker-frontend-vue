<script setup lang="ts">
import DefaultCompanyLogo from '@/assets/DefaultCompanyLogo.vue'
import type { JobApplication } from '@/models/job-application.dto'
import { computed } from 'vue'

const jobApplication = defineModel<JobApplication>({ required: true })
const company = computed(() => jobApplication.value.company!)
</script>
<template>
  <div class="tab-header"><button class="btn-primary">Edit Company</button></div>
  <div class="company-info">
    <div class="company-info-left">
      <div class="logo-title">
        <img v-if="company.logo" :src="company.logo" />
        <DefaultCompanyLogo v-if="!company.logo" />
        <h2>{{ company.name }}</h2>
      </div>
      <p>{{ company.description }}</p>
      <button class="btn-primary">Visit website</button>
    </div>
    <div class="company-info-right">
      <div class="p-6 pt-0 flex flex-col gap-4">
        <h3 class="mt-4">Website</h3>
        <p class="text-sm text-muted-foreground">{{ company.url }}</p>
        <hr class="" />
        <h3>Industry</h3>
        <p class="text-sm text-muted-foreground">{{ company.industry }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.contacts-tab {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.tab-header {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
/* Company display in two columns */
.company-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 30px;
}
.company-info-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.logo-title {
  display: flex;
  align-items: center;
  gap: 20px;
}
.company-info-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* Buttons general */
.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #3367d6;
}
</style>
