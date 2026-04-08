<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/userStore'
import { api } from '@/api/api'
import { useBoards } from '@/store/boardStore'
import { useCurrentBoard } from '@/store/currentBoardStore'
import { useDocumentStore } from '@/store/documentStore'
import { useContacts } from '@/store/contactStore'
import { useTheme } from '@/store/themeStore'

const router = useRouter()
const { clearUser } = useUser()
const { clearBoards } = useBoards()
const { clearCurrentBoard } = useCurrentBoard()
const { clearDocuments } = useDocumentStore()
const { clearContacts } = useContacts()
const { clearTheme } = useTheme()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordUpdated = ref(false)
const passwordUpdateError = ref(false)

const showConfirmation = ref(false)
const confirmationCode = ref('')

const isDeleteEnabled = computed(() => confirmationCode.value.length === 6)

const initiateDelete = async () => {
  await api.users.createVerificationCodeForDelete()
  showConfirmation.value = true
}

const cancelDelete = () => {
  showConfirmation.value = false
  confirmationCode.value = ''
}

const confirmDelete = async () => {
  if (!isDeleteEnabled.value) return

  try {
    await api.users.delete(confirmationCode.value)
    clearAllData()
    router.push('/welcome')
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

const clearAllData = () => {
  clearUser()
  clearBoards()
  clearCurrentBoard()
  clearDocuments()
  clearContacts()
  clearTheme()
}

const updatePassword = async () => {
  try {
    await api.users.updatePassword(currentPassword.value, newPassword.value)
    showUpdatePasswordMessage(passwordUpdated)
  } catch {
    showUpdatePasswordMessage(passwordUpdateError)
  }
  clearPasswordFileds()
}

const showUpdatePasswordMessage = (field: Ref<boolean>) => {
  field.value = true
  setTimeout(() => {
    field.value = false
  }, 5000)
}

const clearPasswordFileds = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <div class="tab-border">
    <div class="section">
      <div class="header">
        <h2>Password update</h2>
      </div>
      <div class="password-update-container">
        <div class="input-group">
          <label for="currentPassword">Current Passwor</label>
          <input
            v-model="currentPassword"
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Current Password"
          />
        </div>
        <div class="input-group">
          <label for="newPassword">New Password</label>
          <input
            v-model="newPassword"
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="New Password"
          />
        </div>
        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
        </div>
      </div>
      <div class="form-actions">
        <button
          class="btn-primary"
          :disabled="
            currentPassword === '' ||
            newPassword === '' ||
            confirmPassword === '' ||
            newPassword !== confirmPassword
          "
          @click="updatePassword"
        >
          Save Changes
        </button>
        <button class="btn-outline" @click="clearPasswordFileds">Cancel</button>
        <span v-if="passwordUpdated" class="password-updated-message">
          Password updated successfully
        </span>
        <span v-if="passwordUpdateError" class="password-update-error-message">
          Password update failed
        </span>
      </div>
    </div>
    <hr />
    <div class="section">
      <div class="header">
        <h2>Delete Account</h2>
      </div>
      <p class="warning-text">
        Warning: Deleting your account will permanently remove all your data, including job
        applications, contacts, and documents.
      </p>

      <div v-if="!showConfirmation">
        <button class="btn-danger" @click="initiateDelete">Delete Account</button>
      </div>

      <div v-else class="confirmation-box">
        <p class="confirmation-message">
          <strong>This action cannot be undone.</strong> Your account and all related data will be
          deleted immediately and permanently.
        </p>
        <div class="input-group input-group-danger full-width">
          <label for="confirmCode">Please type your verification code from email to confirm</label>
          <input
            id="confirmCode"
            name="confirmCode"
            v-model="confirmationCode"
            type="text"
            placeholder="Verification Code"
          />
        </div>
        <div class="form-actions">
          <button
            class="btn-danger confirm-btn"
            :disabled="!isDeleteEnabled"
            @click="confirmDelete"
          >
            Permanently Delete Account
          </button>
          <button class="btn-outline" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.section:first-child {
  margin-top: 0;
}
.section:last-child {
  margin-bottom: 0;
}
.password-update-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.password-updated-message {
  font-weight: 300;
  font-size: 0.7rem;
  color: gray;
}

.password-update-error-message {
  font-weight: 300;
  font-size: 0.7rem;
  color: #d93025;
}

.delete-section h2 {
  margin-top: 0;
  color: #d93025;
  font-size: 18px;
  margin-bottom: 8px;
}

.warning-text {
  font-size: 14px;
  margin-bottom: 20px;
}

.btn-danger {
  background-color: #d93025;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b3261e;
}

.btn-danger:disabled {
  background-color: #f1a9a4;
  cursor: not-allowed;
  opacity: 0.7;
}

.confirmation-box {
  margin-top: 24px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirmation-message {
  color: #d93025;
  background-color: rgba(217, 48, 37, 0.1);
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  border-left: 4px solid #d93025;
}

.input-group-danger input:focus {
  outline: none;
  border-color: #d93025;
  box-shadow: 0 0 0 2px rgba(217, 48, 37, 0.2);
}

.confirm-btn {
  padding: 10px 16px;
}
</style>
