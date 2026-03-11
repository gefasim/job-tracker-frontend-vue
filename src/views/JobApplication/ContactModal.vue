<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Contact } from '@/models/contact.dto'
import { ContactMethodTypeEnum } from '@/models/contact-type.enum'
import type { ContactEmail } from '@/models/contact-email.dto'
import type { ContactPhone } from '@/models/contact-phone.dto'

const props = defineProps<{
  contact: Contact | null
  jobTitle?: string // Для відображення "Linked to"
}>()
const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.contact)

// Ініціалізуємо форму порожніми масивами, щоб уникнути помилок v-for
const form = ref<Partial<Contact>>({
  firstName: '',
  lastName: '',
  jobTitle: '',
  location: '',
  comment: '',
  emails: [],
  phones: [],
  companies: [],
})

onMounted(() => {
  if (props.contact) {
    // Копіюємо дані контакту у форму
    form.value = JSON.parse(JSON.stringify(props.contact))
  }
})

// --- ЛОГІКА ДИНАМІЧНИХ МАСИВІВ ---
const addEmail = () => {
  if (!form.value.emails) form.value.emails = []
  form.value.emails.push({ email: '', type: ContactMethodTypeEnum.WORK } as ContactEmail)
}
const removeEmail = (index: number) => {
  form.value.emails?.splice(index, 1)
}

const addPhone = () => {
  if (!form.value.phones) form.value.phones = []
  form.value.phones.push({ phone: '', type: ContactMethodTypeEnum.PERSONAL } as ContactPhone)
}
const removePhone = (index: number) => {
  form.value.phones?.splice(index, 1)
}

// --- ЗБЕРЕЖЕННЯ ---
const handleSave = () => {
  if (!form.value.firstName || !form.value.lastName) {
    alert('First Name and Last Name are required.')
    return
  }

  // Фільтруємо порожні імейли/телефони перед збереженням
  if (form.value.emails) form.value.emails = form.value.emails.filter((e) => e.email.trim() !== '')
  if (form.value.phones) form.value.phones = form.value.phones.filter((p) => p.phone.trim() !== '')

  // Емітуємо об'єкт (генеруємо ID для нових)
  emit('save', {
    ...form.value,
    id: form.value.id || Date.now().toString(),
  } as Contact)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditMode ? 'Edit Contact' : 'Save New Contact' }}</h3>
      </div>

      <div class="modal-body">
        <div class="form-main">
          <div class="avatar-row">
            <div class="avatar-placeholder">👤</div>
            <div class="form-row flex-1">
              <div class="input-group">
                <label>First Name <span class="required">Required</span></label>
                <input v-model="form.firstName" placeholder="First Name" />
              </div>
              <div class="input-group">
                <label>Last Name <span class="required">Required</span></label>
                <input v-model="form.lastName" placeholder="Last Name" />
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>Job Title</label>
            <input v-model="form.jobTitle" placeholder="i.e: CEO" />
          </div>

          <div class="form-row">
            <div class="input-group">
              <label>Companies</label>
              <input placeholder='i.e: "Google"' />
            </div>
            <div class="input-group">
              <label>Location</label>
              <input v-model="form.location" placeholder="New York, NY, USA" />
            </div>
          </div>

          <div class="input-group">
            <label>Comment</label>
            <textarea v-model="form.comment" placeholder="Any comment about the contact"></textarea>
          </div>

          <div class="input-group">
            <label>Emails</label>
            <div class="dynamic-list">
              <div v-for="(item, index) in form.emails" :key="index" class="dynamic-item">
                <span class="input-icon">✉️</span>
                <input v-model="item.email" placeholder="example@mail.com" class="flex-1" />
                <select v-model="item.type" class="type-select">
                  <option value="WORK">WORK</option>
                  <option value="PERSONAL">PERSONAL</option>
                </select>
                <button @click="removeEmail(index)" class="remove-btn">✕</button>
              </div>
              <button @click="addEmail" class="add-text-btn">+ add email</button>
            </div>
          </div>

          <div class="input-group">
            <label>Phones</label>
            <div class="dynamic-list">
              <div v-for="(item, index) in form.phones" :key="index" class="dynamic-item">
                <span class="input-icon">📞</span>
                <input v-model="item.phone" placeholder="+1 234 567 8900" class="flex-1" />
                <select v-model="item.type" class="type-select">
                  <option value="WORK">WORK</option>
                  <option value="PERSONAL">PERSONAL</option>
                </select>
                <button @click="removePhone(index)" class="remove-btn">✕</button>
              </div>
              <button @click="addPhone" class="add-text-btn">+ add phone</button>
            </div>
          </div>
        </div>

        <div class="form-sidebar">
          <div class="sidebar-block">
            <label class="sidebar-label">Linked to</label>
            <h4>Jobs</h4>
            <div class="linked-job-card">
              <div class="job-title">{{ props.jobTitle || 'Current Job' }}</div>
              <button class="job-menu">•••</button>
            </div>
            <button class="add-link-btn">+ Link Job</button>
          </div>

          <div class="sidebar-block mt-auto">
            <label class="sidebar-label">Created by</label>
            <div class="creator-card">
              <strong>System OOO</strong>
              <span>admin@system.com</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="handleSave">
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
        <button class="btn-outline" @click="emit('close')">Discard</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Модалка загальне */
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
  background: white;
  border-radius: 12px;
  width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.modal-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f1f3f4;
}
.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #202124;
  font-weight: 600;
}

/* Тіло модалки (2 колонки) */
.modal-body {
  display: flex;
  padding: 24px;
  gap: 32px;
  overflow-y: auto;
}
.form-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-sidebar {
  flex: 1;
  border-left: 2px solid #f1f3f4;
  padding-left: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Елементи форми */
.form-row {
  display: flex;
  gap: 16px;
}
.flex-1 {
  flex: 1;
}
.avatar-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.avatar-placeholder {
  width: 48px;
  height: 48px;
  background: #e8f0fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #202124;
  display: flex;
  justify-content: space-between;
}
.required {
  color: #9aa0a6;
  font-weight: 400;
}

input,
textarea,
select {
  padding: 10px 12px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 14px;
  color: #202124;
  background: white;
  transition: border-color 0.2s;
}
input:focus,
textarea:focus,
select:focus {
  border-color: #1a73e8;
  outline: none;
}
textarea {
  resize: vertical;
  min-height: 80px;
}

/* Динамічні списки (Emails / Phones) */
.dynamic-list {
  border: 1px solid #dadce0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dynamic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  padding: 4px 8px;
}
.input-icon {
  color: #5f6368;
  font-size: 16px;
}
.dynamic-item input {
  border: none;
  padding: 6px;
  box-shadow: none;
}
.dynamic-item input:focus {
  border: none;
  outline: none;
}
.type-select {
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px;
}
.remove-btn {
  background: none;
  border: none;
  color: #9aa0a6;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.remove-btn:hover {
  background: #f1f3f4;
  color: #d93025;
}
.add-text-btn {
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  padding: 4px 0;
  width: max-content;
}
.add-text-btn:hover {
  text-decoration: underline;
}

/* Сайдбар */
.sidebar-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar-label {
  font-size: 16px;
  color: #5f6368;
  font-weight: 500;
}
.sidebar-block h4 {
  margin: 0;
  font-size: 14px;
  color: #202124;
}
.linked-job-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #1a73e8;
  border-radius: 6px;
  padding: 10px 12px;
}
.job-title {
  color: #1a73e8;
  font-size: 13px;
}
.job-menu {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 0 4px;
  color: #5f6368;
  cursor: pointer;
}
.add-link-btn {
  background: none;
  border: 1px dashed #dadce0;
  border-radius: 6px;
  padding: 10px;
  color: #5f6368;
  cursor: pointer;
  font-size: 14px;
}
.add-link-btn:hover {
  background: #f8f9fa;
}
.creator-card {
  border: 1px solid #dadce0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #5f6368;
}
.creator-card strong {
  color: #202124;
}

/* Футер */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f3f4;
  display: flex;
  justify-content: center;
  gap: 16px;
  background: #fafafa;
}
.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #3367d6;
}
.btn-outline {
  background: white;
  color: #202124;
  border: 1px solid #dadce0;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8f9fa;
}
</style>
