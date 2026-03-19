<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import RichTextEditor from '../../RichTextEditor.vue'

const jobApplication = defineModel<JobApplication>({ required: true })
</script>

<template>
  <div class="job-info-tab">
    <div class="form-grid" v-if="jobApplication">
      <div class="input-group">
        <label>Company</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>Job Title</label>
        <input v-model="jobApplication.title" type="text" />
      </div>
      <div class="input-group full-row">
        <label>Deadline</label>
        <input v-model="jobApplication.deadline" type="text" placeholder="August 30th, 2025" />
      </div>

      <div class="input-group">
        <label>Post URL</label>
        <input
          v-model="jobApplication.postUrl"
          type="text"
          placeholder="+ add URL e.g. https://google.com"
        />
      </div>
      <div class="input-group">
        <label>Salary</label>
        <input v-model="jobApplication.salary" type="text" />
      </div>

      <div class="input-group">
        <label>Location</label>
        <input v-model="jobApplication.location" type="text" placeholder="+ add location" />
      </div>
      <div class="input-group">
        <label>Color</label>
        <div class="color-picker-box" :style="{ backgroundColor: jobApplication.color }"></div>
      </div>
    </div>

    <!--TODO: resolve a warning message when v-model receives null-->
    <label>Description</label>
    <RichTextEditor v-model="jobApplication.description!" />
  </div>
</template>

<style scoped>
.job-info-tab {
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 24px;
}
</style>
