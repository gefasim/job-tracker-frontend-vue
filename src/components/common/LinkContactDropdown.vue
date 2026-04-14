<script setup lang="ts">
import type { Contact } from '@/types/dtos/contact.dto'
import BaseLinkDropdown from './BaseLinkDropdown.vue'

defineProps<{
  items: Contact[]
}>()

const emit = defineEmits<{
  (e: 'select', item: Contact): void
}>()

const searchFilter = (contact: Contact, query: string) => {
  const fullName = `${contact.firstName} ${contact.lastName}`
  return (
    contact.firstName.toLowerCase().includes(query) ||
    contact.lastName.toLowerCase().includes(query) ||
    fullName.toLocaleLowerCase().includes(query)
  )
}

const selectItem = (item: Contact) => {
  emit('select', item)
}
</script>

<template>
  <BaseLinkDropdown
    :items="items"
    placeholder="Search contacts"
    :searchFilter="searchFilter"
    @select="selectItem"
  >
    <template #trigger>Link Contact</template>
    <template #item="{ item }">{{ item.firstName }} {{ item.lastName }}</template>
  </BaseLinkDropdown>
</template>
