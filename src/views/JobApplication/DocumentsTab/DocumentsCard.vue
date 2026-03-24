<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Document } from '@/models/document.dto'
import type { User } from '@/models/user.dto'
import DocumentCategoryBadge from '@/views/Shared/DocumentCategoryBadge.vue'

const props = defineProps<{ document: Document }>()
const emit = defineEmits(['edit', 'unlink'])

const isMenuOpen = ref(false)

const closeMenu = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.menu-container')) {
    isMenuOpen.value = false
  }
}

const editDocument = (document: Document) => {
  emit('edit', document)
  isMenuOpen.value = false
}

const unlinkDocument = (document: Document) => {
  emit('unlink', document.id)
  isMenuOpen.value = false
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))

// Format file size from bytes to KB/MB
const formattedSize = computed(() => {
  if (!props.document.fileSize) return ''
  const kb = props.document.fileSize / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
})

// Build the subtitle (e.g., "TXT - 0.0 KB" or just "TXT")
const fileInfo = computed(() => {
  const ext = props.document.fileExtension?.toUpperCase() || 'FILE'
  return formattedSize.value ? `${ext} - ${formattedSize.value}` : ext
})

// Mock upload time formatter (assuming createdAt exists in BaseDto)
// In a real app, use dayjs or date-fns
const uploadTime = computed(() => {
  // Mocking the "uploaded 20 minutes ago" format
  return 'uploaded recently'
})

// Extract user name safely
const uploaderName = computed(() => {
  // Assuming User has firstName/lastName or a name property
  const user = props.document.user as User
  return user?.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown User'
})
</script>

<template>
  <div class="document-card">
    <div class="card-header">
      <h3 class="title" :title="document.title">{{ document.title }}</h3>
      <div class="subtitle">
        {{ fileInfo }}
      </div>
    </div>

    <div class="card-preview">
      <div class="file-icon-box">
        {{ document.fileExtension?.toUpperCase() || 'FILE' }}
      </div>
    </div>

    <div class="card-uploader">
      <div class="user-info">
        <div class="avatar-placeholder">
          {{ uploaderName.charAt(0).toUpperCase() }}
        </div>
        <span class="user-name">{{ uploaderName }}</span>
      </div>
      <div class="upload-time">{{ uploadTime }}</div>
    </div>

    <div class="card-footer">
      <DocumentCategoryBadge :category="document.category"></DocumentCategoryBadge>

      <div class="menu-container">
        <button class="menu-btn" @click.stop="isMenuOpen = !isMenuOpen">•••</button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <button @click="editDocument(document)">✏️ Edit</button>
          <button @click="unlinkDocument(document)" class="text-danger">🔗 Unlink</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.document-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  transition: box-shadow 0.2s;
}

.document-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Header */
.card-header {
  text-align: center;
}
.title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subtitle {
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #5f6368;
}

/* Preview Box */
.card-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
.file-icon-box {
  width: 64px;
  height: 64px;
  border: 2px solid #e8eaed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #5f6368;
  background-color: #f8f9fa;
}

/* Uploader Info */
.card-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar-placeholder {
  width: 20px;
  height: 20px;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}
.user-name {
  font-size: 13px;
  font-weight: 500;
}
.upload-time {
  font-size: 12px;
  color: #9aa0a6;
}

/* Footer & Badges */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.category-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}
.badge-purple {
  background-color: #7b61ff;
}
.badge-green {
  background-color: #00c48c;
}
.badge-blue {
  background-color: #4285f4;
}
.badge-yellow {
  background-color: #fbbc04;
  color: #202124;
}
.badge-gray {
  background-color: #9aa0a6;
}

/* Menu */
.menu-container {
  position: relative;
}
.menu-btn {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  color: #5f6368;
  letter-spacing: 1px;
}
.menu-btn:hover {
  background: #f8f9fa;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: 100%;
  margin-bottom: 4px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 120px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dropdown-menu button {
  background: none;
  border: none;
  padding: 10px 16px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
  color: #3c4043;
}
.dropdown-menu button:hover {
  background: #f1f3f4;
}
.text-danger {
  color: #d93025 !important;
}
</style>
