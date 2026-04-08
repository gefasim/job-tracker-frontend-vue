<script setup lang="ts">
import { useUser } from '@/store/userStore'
import { ref, computed, type CSSProperties } from 'vue'
import type { UpdateUser } from '@/models/user/update-user.dto'
import ProfileImage from '@/views/Shared/ProfileImage.vue'
import BaseButtonDropdown from '@/views/Shared/BaseButtonDropdown.vue'

const { user, updateUser } = useUser()
const formData = ref<UpdateUser>({})
const tempProfilePicUrl = ref<string | null>(null)
const isEditMode = ref(false)
const selectedFileName = ref('')

const profilePictureButtonStyles = computed<CSSProperties>(() => {
  return {
    position: 'absolute',
    bottom: selectedFileName.value ? '1rem' : '0',
    right: '0',
  }
})

const enterEditMode = () => {
  formData.value = {
    firstName: user.value!.firstName,
    lastName: user.value!.lastName,
    email: user.value!.email,
  }
  tempProfilePicUrl.value = user.value!.profilePicUrl
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

const handleMenuItemClick = (item: string) => {
  if (item === 'Upload Image') {
    document.getElementById('file-upload')?.click()
  } else if (item === 'Remove Image') {
    formData.value.profilePic = null
    tempProfilePicUrl.value = null
    selectedFileName.value = ''
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
        <ProfileImage :src="user?.profilePicUrl" :alt="user?.firstName" size="64px" />

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
        <div style="position: relative; width: fit-content">
          <input
            type="file"
            id="file-upload"
            class="file-input"
            accept="image/*"
            @change="handleFileChange"
          />
          <ProfileImage :src="tempProfilePicUrl" :alt="formData.firstName" size="128px" />
          <div v-if="selectedFileName" class="selected-file-name">
            Selected: {{ selectedFileName }}
          </div>
          <div :style="profilePictureButtonStyles">
            <BaseButtonDropdown
              :items="['Upload Image', 'Remove Image']"
              @select="handleMenuItemClick"
              ><template #buttonValue>✎</template>
              <template #item="{ item }">{{ item }}</template>
            </BaseButtonDropdown>
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
  margin: 0;
}

.edit-btn {
  margin-left: auto;
}

/* Profile Picture */
.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.selected-file-name {
  font-size: 0.8rem;
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
