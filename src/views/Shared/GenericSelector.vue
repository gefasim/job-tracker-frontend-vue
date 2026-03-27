<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'

interface Props<T> {
  items: T[]
  selectedItem: T | null
  label: string
  displayProperty: keyof T
  valueProperty: keyof T
  id?: string
}

const props = withDefaults(defineProps<Props<T>>(), {
  id: 'generic-select',
})

const emit = defineEmits<{
  'update:selectedItem': [item: T]
}>()

const inputId = computed(() => props.id)
const localValue = ref<string>('')

// Watch for changes in selectedItem prop and update local value
watch(
  () => props.selectedItem,
  (newItem) => {
    localValue.value = newItem ? String(getValue(newItem)) : ''
  },
  { immediate: true },
)

const getDisplay = (item: T): string => {
  return String(item[props.displayProperty])
}

const getValue = (item: T): string | number => {
  return item[props.valueProperty] as string | number
}

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedValue = target.value

  // Find the item that matches the selected value
  const selectedItem = props.items.find((item) => String(getValue(item)) === selectedValue)

  if (selectedItem) {
    emit('update:selectedItem', selectedItem)
  }
}
</script>
<template>
  <div v-if="items.length > 0" class="generic-selector">
    <label :for="inputId">{{ label }}</label>
    <select :id="inputId" v-model="localValue" @change="onChange" class="generic-dropdown">
      <option v-for="item in items" :key="getValue(item)" :value="getValue(item)">
        {{ getDisplay(item) }}
      </option>
    </select>
  </div>
</template>
<style scoped>
.generic-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.generic-selector label {
  font-weight: 500;
  color: #202124;
}

.generic-dropdown {
  padding: 0.5rem 1rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.875rem;
  color: #202124;
  cursor: pointer;
  min-width: 200px;
}

.generic-dropdown:focus {
  outline: none;
  border-color: #1f73e6;
  box-shadow: 0 0 0 2px rgba(31, 115, 230, 0.2);
}
</style>
