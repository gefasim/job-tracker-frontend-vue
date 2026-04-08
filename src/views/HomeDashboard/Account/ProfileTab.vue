<script setup lang="ts">
import { useUser } from '@/store/userStore'
import { ref } from 'vue'
import AvatarIcon from '@/assets/icons/AvatarIcon.vue'
import type { UpdateUser } from '@/models/user/update-user.dto'

const { user, updateUser } = useUser()
const formData = ref<UpdateUser>({})
const isEditMode = ref(false)
const selectedFileName = ref('')

const enterEditMode = () => {
  formData.value = {
    firstName: user.value!.firstName,
    lastName: user.value!.lastName,
    email: user.value!.email,
  }
  selectedFileName.value = ''
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      selectedFileName.value = file.name
      formData.value.profilePic = file
    }
  }
}

const saveChanges = async () => {
  const updatedUser: UpdateUser = {
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    email: formData.value.email,
    profilePic: formData.value.profilePic,
  }

  await updateUser(updatedUser)
  isEditMode.value = false
}
</script>

<template>
  <div class="tab-border">
    <div v-if="!isEditMode" class="view-mode">
      <div class="profile-header">
        <div class="logo-wrapper">
          <img
            v-if="user?.profilePicUrl"
            :src="user.profilePicUrl"
            :alt="user?.firstName"
            class="profile-logo"
          />
          <AvatarIcon v-else class="profile-logo-fallback" />
        </div>

        <div class="header-info">
          <h2 class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</h2>
          <p class="profile-email">{{ user?.email }}</p>
        </div>

        <button class="btn-outline edit-btn" @click="enterEditMode">✎ Edit Profile</button>
      </div>
    </div>

    <div v-else class="edit-mode">
      <div class="edit-header">
        <h2>Edit Profile Info</h2>
      </div>

      <div class="form-grid">
        <div class="input-group full-width">
          <label>Profile Picture</label>
          <div class="file-drop-zone">
            <input
              type="file"
              id="file-upload"
              class="file-input"
              accept="image/*"
              @change="handleFileChange"
            />
            <label for="file-upload" class="upload-btn">Upload Image</label>
            <span class="drop-text">or click to select</span>
            <div v-if="selectedFileName" class="selected-file-name">
              Selected: {{ selectedFileName }}
            </div>
            <div v-else-if="formData.profilePic" class="selected-file-name">
              Current Image Loaded
            </div>
          </div>
        </div>

        <div class="input-group-required input-group">
          <label for="firstName">First Name <span>*</span></label>
          <input
            v-model="formData.firstName"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
          />
        </div>

        <div class="input-group-required input-group">
          <label for="lastName">Last Name <span>*</span></label>
          <input
            v-model="formData.lastName"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <div class="input-group-required input-group full-width">
          <label for="email">Email <span>*</span></label>
          <input
            v-model="formData.email"
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
          />
        </div>
      </div>

      <div class="form-actions">
        <button
          class="btn-primary"
          :disabled="!formData.firstName || !formData.lastName || !formData.email"
          @click="saveChanges"
        >
          Save Changes
        </button>
        <button class="btn-outline" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- VIEW MODE STYLES --- */
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.logo-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-hover);
  flex-shrink: 0;
}

.profile-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-logo-fallback {
  width: 32px;
  height: 32px;
  color: var(--text-secondary);
}

.header-info {
  flex: 1;
}

.profile-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
}

.profile-email {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.edit-btn {
  margin-left: auto;
}

/* File Drop Zone */
.file-drop-zone {
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.upload-btn {
  background-color: var(--surface-hover);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background-color: var(--border-color);
}

.drop-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.selected-file-name {
  font-size: 13px;
  color: #1a73e8;
  margin-top: 8px;
  font-weight: 500;
}

/* --- EDIT MODE STYLES --- */
.edit-header {
  margin-bottom: 20px;
}

.edit-header h2 {
  font-size: 18px;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: span 2;
}

.input-group-required label span {
  color: #d93025;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  padding-top: 16px;
}
</style>
