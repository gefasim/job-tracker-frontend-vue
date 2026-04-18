<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'

interface Props<T> {
  items: T[]
  selectedItem: T | null
  label: string
  displayProperty: keyof T
  valueProperty: keyof T
  id?: string
  hideLabel?: boolean
  maxWidth?: string
}

const props = withDefaults(defineProps<Props<T>>(), {
  id: 'generic-select',
})

const emit = defineEmits<{
  'update:selectedItem': [item: T]
}>()

const inputId = computed(() => props.id)
const localValue = ref<string>('')

const getDisplay = (item: T): string => {
  return String(item[props.displayProperty])
}

const getValue = (item: T): string | number => {
  return item[props.valueProperty] as string | number
}

// Watch for changes in selectedItem prop and update local value
watch(
  () => props.selectedItem,
  (newItem) => {
    localValue.value = newItem ? String(getValue(newItem)) : ''
  },
  { immediate: true },
)

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
  <div v-if="items.length > 0" :style="{ maxWidth: maxWidth }">
    <label v-if="!hideLabel" :for="inputId">{{ label }}</label>
    <select :id="inputId" v-model="localValue" @change="onChange" class="generic-dropdown">
      <option v-for="item in items" :key="getValue(item)" :value="getValue(item)">
        {{ getDisplay(item) }}
      </option>
    </select>
  </div>
</template>
<style scoped>
.generic-dropdown {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: #5f6368;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.generic-dropdown:focus {
  outline: none;
  border-color: #1f73e6;
  box-shadow: 0 0 0 2px rgba(31, 115, 230, 0.2);
}
</style>
