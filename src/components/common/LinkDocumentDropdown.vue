<script setup lang="ts">
import BaseLinkDropdown from './BaseLinkDropdown.vue'
import type { Document } from '@/types/dtos/document.dto'
import DocumentCategoryBadge from './DocumentCategoryBadge.vue'

defineProps<{
  items: Document[]
}>()

const emit = defineEmits<{
  (e: 'select', item: Document): void
}>()

const searchFilter = (document: Document, query: string) => {
  return document.title.toLowerCase().includes(query) ?? false
}

const selectItem = (document: Document) => {
  emit('select', document)
}
</script>

<template>
  <BaseLinkDropdown
    :items="items"
    placeholder="Search documents"
    :searchFilter="searchFilter"
    @select="selectItem"
  >
    <template #trigger>Link Document</template>
    <template #item="{ item }">
      <div class="item">
        <span>{{ item.title }}</span>
        <DocumentCategoryBadge :category="item.category"></DocumentCategoryBadge>
      </div>
    </template>
  </BaseLinkDropdown>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
