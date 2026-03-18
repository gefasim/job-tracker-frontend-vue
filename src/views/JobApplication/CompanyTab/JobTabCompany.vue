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
        <DefaultCompanyLogo v-else />
        <h2>{{ company.name }}</h2>
      </div>
      <p>{{ company.description }}</p>
      <a v-if="company.url" :href="company.url!" class="fit-content"
        ><button class="btn-primary fit-content" style="width: fit-content">
          Visit website
        </button></a
      >
      <button v-else class="btn-primary fit-content" style="width: fit-content" disabled="true">
        Visit website
      </button>
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
  margin-top: 2rem;
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
  justify-content: space-evenly;
  gap: 1rem;
  border: 1px solid #dadce0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
  padding: 0 1.5rem;
  width: 25%;
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
.btn-primary:disabled,
.btn-primary[disabled] {
  background-color: #e8eaed;
  color: #9aa0a6;
  cursor: not-allowed;
  pointer-events: none;
}
.fit-content {
  width: fit-content;
}
</style>
