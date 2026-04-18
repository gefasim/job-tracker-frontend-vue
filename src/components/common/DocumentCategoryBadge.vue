<script setup lang="ts">
import { DocumentCategoryEnum, type DocumentCategoryType } from '@/types/dtos/document-category.enum'
import { computed } from 'vue'

const props = defineProps<{ category: DocumentCategoryType }>()

const badgeColors: Record<DocumentCategoryType, string> = {
  [DocumentCategoryEnum.Transcript]: '#2563EB',
  [DocumentCategoryEnum.Portfolio]: '#16A34A',
  [DocumentCategoryEnum.Recommendation]: '#DC2626',
  [DocumentCategoryEnum.OfferLetter]: '#D97706',
  [DocumentCategoryEnum.Resume]: '#7C3AED',
  [DocumentCategoryEnum.CoverLetter]: '#DB2777',
  [DocumentCategoryEnum.WritingSample]: '#0D9488',
  [DocumentCategoryEnum.Certification]: '#4B5563',
  [DocumentCategoryEnum.Other]: '#9A3412',
  [DocumentCategoryEnum.JobPost]: '#4F46E5',
}

const badgeStyle = computed(() => {
  return {
    backgroundColor: badgeColors[props.category],
  }
})
</script>
<template>
  <span class="category-badge badge-green" :style="badgeStyle">{{ category.toString() }}</span>
</template>
<style>
.category-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}
</style>
