<script setup lang="ts">
import { computed } from 'vue'
import type { Document } from '@/models/document.dto'

const props = defineProps<{
  document: Document | null
  jobTitle?: string
}>()

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.document)

const handleSave = () => {
  // Placeholder logic for saving
  // Emit a mock document to satisfy the typing temporarily
  emit('save', {
    id: props.document?.id || Date.now().toString(),
    title: 'New Document.pdf',
    // add other required fields here based on your form...
  } as Partial<Document>)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditMode ? 'Edit Document' : 'Upload New Document' }}</h3>
      </div>

      <div class="modal-body">
        <div class="placeholder-text">Document form implementation goes here...</div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="handleSave">
          {{ isEditMode ? 'Update' : 'Upload' }}
        </button>
        <button class="btn-outline" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f1f3f4;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #202124;
  font-weight: 600;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  min-height: 200px;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: #9aa0a6;
  font-style: italic;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f3f4;
  display: flex;
  justify-content: center;
  gap: 16px;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
}

.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #3367d6;
}
.btn-outline {
  background: white;
  color: #202124;
  border: 1px solid #dadce0;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8f9fa;
}
</style>
