<script setup lang="ts">
import { ref, computed } from 'vue'
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
</script>

<template>
  <div class="tab-border settings-container">
    <div>
      <h2>Delete Account</h2>
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
        <div class="input-group full-width">
          <label for="confirmCode">Please type your verification code from email to confirm</label>
          <input
            id="confirmCode"
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
.settings-container {
  padding: 24px;
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
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
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

.input-group input:focus {
  outline: none;
  border-color: #d93025;
  box-shadow: 0 0 0 2px rgba(217, 48, 37, 0.2);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.confirm-btn {
  padding: 10px 16px;
}
</style>
