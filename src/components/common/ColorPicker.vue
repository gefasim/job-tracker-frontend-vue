<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    predefinedColors?: string[]
    boardColors?: string[]
  }>(),
  {
    modelValue: '#1a73e8',
    predefinedColors: () => [
      '#d93025',
      '#f29900',
      '#188038',
      '#1a73e8',
      '#a142f4',
      '#202124',
      '#9aa0a6',
      '#ffffff',
    ],
    boardColors: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', color: string): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const localHex = ref(props.modelValue)

const isValidHex = (hex: string) => /^#([0-9A-F]{3}){1,2}$/i.test(hex)

// Sync parent changes to local state
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localHex.value) {
      localHex.value = newVal
    }
  },
)

const handleTextInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let val = target.value.trim()

  if (val.length > 0 && !val.startsWith('#')) {
    val = '#' + val
  }

  localHex.value = val

  if (isValidHex(val)) {
    emit('update:modelValue', val)
  }
}

// Handle native color picker or swatch clicks
const selectColor = (color: string) => {
  localHex.value = color
  emit('update:modelValue', color)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeOnOutsideClick = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', closeOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', closeOnOutsideClick)
})
</script>

<template>
  <div class="color-picker-wrapper" ref="dropdownRef">
    <button type="button" class="dropdown-trigger" @click="toggleDropdown">
      <span class="color-indicator" :style="{ backgroundColor: localHex }"></span>
      <span class="hex-label">{{ localHex }}</span>
      <span class="chevron" :class="{ 'is-open': isOpen }">▼</span>
    </button>

    <div v-if="isOpen" class="color-picker-dropdown">
      <div class="input-row">
        <label class="color-preview-wrapper" :style="{ backgroundColor: localHex }">
          <input
            type="color"
            :value="localHex"
            @input="selectColor(($event.target as HTMLInputElement).value)"
            class="native-color-input"
          />
        </label>

        <div class="hex-input-wrapper">
          <input
            type="text"
            :value="localHex"
            @input="handleTextInput"
            class="form-control hex-input"
            maxlength="7"
            placeholder="#XXXXXX"
          />
        </div>
      </div>

      <div v-if="boardColors.length > 0" class="palette-section">
        <span class="palette-label">Board Colors</span>
        <div class="swatches-grid">
          <button
            v-for="color in boardColors"
            :key="'board-' + color"
            type="button"
            class="color-swatch"
            :class="{ active: modelValue?.toLowerCase() === color.toLowerCase() }"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
            :aria-label="`Select board color ${color}`"
          ></button>
        </div>
      </div>

      <div v-if="predefinedColors.length > 0" class="palette-section">
        <span class="palette-label">Default Colors</span>
        <div class="swatches-grid">
          <button
            v-for="color in predefinedColors"
            :key="'default-' + color"
            type="button"
            class="color-swatch"
            :class="{ active: modelValue?.toLowerCase() === color.toLowerCase() }"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
            :aria-label="`Select default color ${color}`"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker-wrapper {
  position: relative;
  display: inline-block;
}

/* button trigger */
.dropdown-trigger {
  width: stretch;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px 6px 8px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  color: var(--input-text);
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.dropdown-trigger:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}
html.dark .dropdown-trigger:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
  border-color: color-mix(in srgb, var(--border-color), white 10%);
}

.color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  display: inline-block;
}

.hex-label {
  text-transform: uppercase;
  font-family: monospace;
}

.chevron {
  font-size: 10px;
  color: #5f6368;
  transition: transform 0.2s;
}

.chevron.is-open {
  transform: rotate(180deg);
}

/* dropdown */
.color-picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: stretch;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* inputs */
.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-preview-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.native-color-input {
  position: absolute;
  opacity: 0;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  cursor: pointer;
}

.hex-input-wrapper {
  flex: 1;
}

.hex-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  color: var(--input-text);
  outline: none;
  text-transform: uppercase;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.hex-input:focus {
  border-color: #1a73e8;
}

.palette-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-label {
  font-size: 12px;
  font-weight: 500;
  color: #5f6368;
}

.swatches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));
  gap: 8px;
  max-width: 220px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-swatch.active {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
  border-color: transparent;
}
</style>
