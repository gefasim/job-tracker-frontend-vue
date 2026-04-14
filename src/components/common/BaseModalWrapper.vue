<script setup lang="ts">
import { useKeydown } from '@/composables/useKeydown'

defineProps<{
  title: string
  width?: string
}>()

const emit = defineEmits(['close', 'save'])

const handleSave = async () => {
  emit('save')
}

useKeydown('Escape', () => {
  emit('close')
})
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content" :style="width ? { width: width } : {}">
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>

      <div class="modal-body">
        <slot name="body"></slot>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="handleSave">Save</button>
        <button class="btn-outline" @click="emit('close')">Discard</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Modal Base */
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
  background: var(--bg-main);
  border-radius: 12px;
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-body {
  display: flex;
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

/* Footer Actions */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  gap: 16px;
  background: var(--bg-main);
  border-radius: 0 0 12px 12px;
}
</style>
