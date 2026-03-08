<script setup lang="ts">
import { useClickOutside } from '@/composables/useClickOutside'
import { useKeydown } from '@/composables/useKeydown'
import type { JobApplication } from '@/models/job-application.dto'
import { ref, watch } from 'vue'

const props = defineProps<{
  jobApplicationParam: JobApplication | null
}>()
const emit = defineEmits(['close'])
const modalContent = ref<HTMLElement | null>(null)
const jobApplication = ref<JobApplication | null>(null) // Shallow copy of jobApplicationParam

// Every time a new modal is opened, we copy the data from the props
watch(
  () => props.jobApplicationParam,
  (newJobApplication) => {
    if (newJobApplication) {
      jobApplication.value = { ...newJobApplication }
    } else {
      jobApplication.value = null
    }
  },
  { immediate: true },
)

useKeydown('Escape', () => emit('close', jobApplication.value))
useClickOutside(modalContent, () => emit('close', jobApplication.value))
</script>

<template>
  <Teleport to="body">
    <div v-if="jobApplicationParam && jobApplication" class="modal-mask">
      <div class="modal-container" ref="modalContent">
        <div class="modal-header">
          <slot name="header">default header</slot>
          <h2>JobId: {{ jobApplication?.id }}</h2>
          <h2>Title: {{ jobApplication?.title }}</h2>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
          <input type="text" v-model="jobApplication.title" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
