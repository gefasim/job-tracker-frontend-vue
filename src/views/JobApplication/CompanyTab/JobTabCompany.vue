<script setup lang="ts">
import { computed, ref } from 'vue'
import DefaultCompanyLogo from '@/assets/DefaultCompanyLogo.vue'
import type { Company } from '@/models/company.dto'
import type { JobApplication } from '@/models/job-application.dto'

const jobApplication = defineModel<JobApplication>({ required: true })
const company = computed(() => jobApplication.value.company!)

const isEditMode = ref(false)
const formData = ref<Partial<Company>>({})

const enterEditMode = () => {
  formData.value = { ...jobApplication.value.company }
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
}

const saveChanges = () => {
  const updatedCompany = {
    ...jobApplication.value.company,
    ...formData.value,
  } as Company

  isEditMode.value = false
}
</script>

<template>
  <div class="company-tab">
    <div v-if="!isEditMode" class="view-mode">
      <div class="company-header">
        <div class="logo-wrapper">
          <img v-if="company.logo" :src="company.logo" :alt="company.name" class="company-logo" />
          <DefaultCompanyLogo v-else class="company-logo-fallback" />
        </div>

        <div class="header-info">
          <h2 class="company-name">{{ company.name }}</h2>
          <a
            v-if="company.url"
            :href="company.url"
            target="_blank"
            rel="noopener noreferrer"
            class="company-link"
          >
            {{ company.url }}
          </a>
        </div>

        <button class="btn-outline edit-btn" @click="enterEditMode">✎ Edit Company</button>
      </div>

      <div class="company-details">
        <div class="detail-group" v-if="company.industry">
          <label>Industry</label>
          <p>{{ company.industry }}</p>
        </div>

        <div class="detail-group" v-if="company.description">
          <label>Description</label>
          <p class="description-text">{{ company.description }}</p>
        </div>

        <div v-if="!company.industry && !company.description" class="no-data">
          <p>No additional details provided for this company.</p>
        </div>
      </div>
    </div>

    <div v-else class="edit-mode">
      <div class="edit-header">
        <h2>Edit Company Info</h2>
      </div>

      <div class="form-grid">
        <div class="form-group full-width">
          <label for="company-logo">Logo URL</label>
          <input
            v-model="formData.logo"
            id="company-logo"
            name="companyLogo"
            type="text"
            class="form-control"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div class="form-group">
          <label for="company-name">Company Name <span class="required">*</span></label>
          <input
            v-model="formData.name"
            id="company-name"
            name="companyName"
            type="text"
            class="form-control"
            placeholder="Enter company name"
          />
        </div>

        <div class="form-group">
          <label for="company-industry">Industry</label>
          <input
            v-model="formData.industry"
            id="company-industry"
            name="companyIndustry"
            type="text"
            class="form-control"
            placeholder="e.g. Technology, Healthcare"
          />
        </div>

        <div class="form-group full-width">
          <label for="company-url">Website URL</label>
          <input
            v-model="formData.url"
            id="company-url"
            name="companyUrl"
            type="url"
            class="form-control"
            placeholder="https://..."
          />
        </div>

        <div class="form-group full-width">
          <label for="company-description">Description</label>
          <textarea
            v-model="formData.description"
            id="company-description"
            name="companyDescription"
            class="form-control textarea"
            placeholder="About the company..."
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-primary" :disabled="!formData.name" @click="saveChanges">
          Save Changes
        </button>
        <button class="btn-outline" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-tab {
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 24px;
}

/* --- VIEW MODE STYLES --- */
.company-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f3f4;
}

.logo-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 1px solid #e8eaed;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-logo-fallback {
  width: 32px;
  height: 32px;
  color: #9aa0a6;
}

.header-info {
  flex: 1;
}

.company-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #202124;
  font-weight: 600;
}

.company-link {
  font-size: 14px;
  color: #1a73e8;
  text-decoration: none;
}

.company-link:hover {
  text-decoration: underline;
}

.edit-btn {
  margin-left: auto;
}

.detail-group {
  margin-bottom: 16px;
}

.detail-group label {
  display: block;
  font-size: 13px;
  color: #5f6368;
  font-weight: 500;
  margin-bottom: 4px;
}

.detail-group p {
  margin: 0;
  font-size: 15px;
  color: #202124;
  line-height: 1.5;
}

.description-text {
  white-space: pre-wrap;
}

.no-data {
  color: #9aa0a6;
  font-style: italic;
  font-size: 14px;
}

/* --- EDIT MODE STYLES --- */
.edit-header {
  margin-bottom: 20px;
}

.edit-header h2 {
  font-size: 18px;
  margin: 0;
  color: #202124;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 6px;
}

.required {
  color: #d93025;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 14px;
  color: #202124;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #1a73e8;
}

.textarea {
  min-height: 100px;
  resize: vertical;
  background-color: white;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

/* --- BUTTONS --- */
.btn-primary {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1557b0;
}

.btn-primary:disabled {
  background-color: #e8eaed;
  color: #9aa0a6;
  cursor: not-allowed;
}

.btn-outline {
  background-color: white;
  color: #202124;
  border: 1px solid #dadce0;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
}

.btn-outline:hover {
  background-color: #f8f9fa;
}
</style>
