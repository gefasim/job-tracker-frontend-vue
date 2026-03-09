<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import RichTextEditor from '../RichTextEditor.vue'
import { ref } from 'vue'
import { api } from '@/api/api'

const jobApplication = defineModel<JobApplication>({ required: true })
const noteToAdd = ref<string>('')

const createNote = async () => {
  if (noteToAdd.value) await api.jobNotes.create(jobApplication.value.id, noteToAdd.value)
}
</script>

<template>
  <div v-if="jobApplication">
    <div class="note-div">
      <label>Add note</label>
      <!--TODO: resolve a warning message when v-model receives null-->
      <RichTextEditor v-model="noteToAdd" />
      <button v-on:click="createNote" class="overlap-button">Save</button>
    </div>
  </div>
</template>

<style>
.note-div {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.overlap-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
