<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import RichTextEditor from '../RichTextEditor.vue'

const jobApplication = defineModel<JobApplication>({ required: true })
</script>

<template>
  <div v-if="jobApplication">
    <!--TODO: resolve a warning message when v-model receives null-->
    <RichTextEditor v-model="jobApplication.description as string" />
  </div>
</template>

<style></style>
