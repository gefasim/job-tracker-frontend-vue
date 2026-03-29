<script setup lang="ts">
import BaseModalWrapper from '@/views/Shared/BaseModalWrapper.vue'
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const boardName = ref('')

const handleSave = async () => {
  emit('save', boardName.value)
}
</script>

<template>
  <BaseModalWrapper title="Create Board" @save="handleSave" @close="emit('close')">
    <template #body>
      <div class="form-group">
        <label for="board-name">Board Name</label>
        <input id="board-name" v-model="boardName" type="text" placeholder="Enter board name" />
      </div>
    </template>
  </BaseModalWrapper>
</template>
