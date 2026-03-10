<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import RichTextEditor from '../RichTextEditor.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { api } from '@/api/api'
import type { JobApplicationNote } from '@/models/job-application-note.dto'

const jobApplication = defineModel<JobApplication>({ required: true })
const noteToAdd = ref<string>('')

const editingNoteId = ref<string | null>(null)
const editingContent = ref<string>('')

const activeMenuId = ref<string | null>(null)
const noteToDelete = ref<string | null>(null)

const formatRelativeDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 24) {
    return diffHours === 0 ? 'Just now' : `${diffHours}h ago`
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const startEditing = (note: JobApplicationNote) => {
  editingNoteId.value = note.id
  editingContent.value = note.content!
  activeMenuId.value = null
}

// --- CRUD ---
const createNote = async () => {
  if (!noteToAdd.value.trim()) return

  try {
    const newNote = await api.jobNotes.create(jobApplication.value.id, noteToAdd.value)
    if (!jobApplication.value.notes) jobApplication.value.notes = []
    jobApplication.value.notes.push(newNote)
    noteToAdd.value = ''
  } catch (error) {
    console.error('Failed to create note', error)
  }
}

const saveEdit = async () => {
  if (!editingNoteId.value) return

  try {
    const updatedNote = await api.jobNotes.update(editingNoteId.value!, editingContent.value)

    const index = jobApplication.value.notes?.findIndex((n) => n.id === editingNoteId.value)
    if (index !== undefined && index !== -1 && jobApplication.value.notes) {
      jobApplication.value.notes[index] = updatedNote
    }

    cancelEdit()
  } catch (error) {
    console.error('Failed to update note', error)
  }
}

const cancelEdit = () => {
  editingNoteId.value = null
  editingContent.value = ''
}

const confirmDelete = async () => {
  if (!noteToDelete.value) return

  try {
    await api.jobNotes.delete(noteToDelete.value)
    if (jobApplication.value.notes) {
      jobApplication.value.notes = jobApplication.value.notes.filter(
        (n) => n.id !== noteToDelete.value,
      )
    }
    noteToDelete.value = null
  } catch (error) {
    console.error('Failed to delete note', error)
  }
}

// --- Note's menu ---
const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

const closeMenuOnClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.menu-container')) {
    activeMenuId.value = null
  }
}

onMounted(() => document.addEventListener('click', closeMenuOnClickOutside))
onUnmounted(() => document.removeEventListener('click', closeMenuOnClickOutside))
</script>

<template>
  <div v-if="jobApplication" class="notes-tab">
    <div class="note-div">
      <label>Add note</label>
      <!-- TODO: clean up RichTextEditor on Save button click -->
      <RichTextEditor v-model="noteToAdd" />
      <button @click="createNote" class="overlap-button btn-primary">Save</button>
    </div>

    <div class="notes-grid">
      <div v-for="note in jobApplication.notes" :key="note.id" class="note-card">
        <div v-if="editingNoteId === note.id" class="note-edit-mode">
          <RichTextEditor v-model="editingContent" />
          <div class="edit-actions">
            <button @click="cancelEdit" class="btn-secondary">Cancel</button>
            <button @click="saveEdit" class="btn-primary">Update</button>
          </div>
        </div>

        <div v-else class="note-view-mode">
          <div class="menu-container">
            <button @click.stop="toggleMenu(note.id)" class="menu-btn">⋮</button>
            <div v-if="activeMenuId === note.id" class="dropdown-menu">
              <button @click="startEditing(note)">✏️ Edit</button>
              <button
                @click="((noteToDelete = note.id), (activeMenuId = null))"
                class="text-danger"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div class="note-preview" v-html="note.content"></div>

          <span class="note-date">{{ formatRelativeDate(note.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="noteToDelete !== null" class="confirm-overlay" @click.self="noteToDelete = null">
        <div class="confirm-dialog">
          <h3>Delete Note?</h3>
          <p>Are you sure you want to delete this note? This action cannot be undone.</p>
          <div class="confirm-actions">
            <button @click="noteToDelete = null" class="btn-secondary">Cancel</button>
            <button @click="confirmDelete" class="btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.notes-tab {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* --- Note creation --- */
.note-div {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #3c4043;
}

.overlap-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

/* --- Grid of Notes --- */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.note-card {
  position: relative;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}

.note-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* --- Note preview --- */
.note-view-mode {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.note-preview {
  color: #3c4043;
  font-size: 14px;
  line-height: 1.5;
  /* Обрізаємо текст на 4-му рядку */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 24px; /* Місце для дати */
}

/* Date overlap */
.note-date {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 11px;
  color: #70757a;
  background: #fff; /* prevents note text from overlapping with the date */
  padding-left: 4px;
}

/* --- Note's menu --- */
.menu-container {
  position: absolute;
  top: 8px;
  right: 8px;
}

.menu-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #5f6368;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.menu-btn:hover {
  background: #f1f3f4;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  z-index: 20;
  overflow: hidden;
}

.dropdown-menu button {
  background: transparent;
  border: none;
  padding: 10px 16px;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
}

.dropdown-menu button:hover {
  background: #f1f3f4;
}

.text-danger {
  color: #d93025 !important;
}

/* --- Note's edit --- */
.note-edit-mode {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* --- Confirmation popup --- */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.confirm-dialog h3 {
  margin: 0 0 8px 0;
  color: #202124;
}

.confirm-dialog p {
  color: #5f6368;
  font-size: 14px;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* --- general buttons --- */
.btn-primary {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  background: transparent;
  color: #5f6368;
  border: 1px solid #dadce0;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-danger {
  background: #d93025;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
