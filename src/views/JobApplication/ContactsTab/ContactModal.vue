<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Contact } from '@/models/contact.dto'
import { ContactMethodTypeEnum } from '@/models/contact-type.enum'
import type { ContactEmail } from '@/models/contact-email.dto'
import type { ContactPhone } from '@/models/contact-phone.dto'
import TwitterIcon from '@/assets/icons/external/TwitterIcon.vue'
import FacebookIcon from '@/assets/icons/external/FacebookIcon.vue'
import LinkedInIcon from '@/assets/icons/external/LinkedInIcon.vue'
import GitHubIcon from '@/assets/icons/external/GitHubIcon.vue'
import { api } from '@/api/api'
import { useRoute } from 'vue-router'
import type { JobApplication } from '@/models/job-application.dto'
import { CurrentBoard } from '@/current-board.service'
import AvatarIcon from '@/assets/icons/AvatarIcon.vue'
import BaseModalWithJobLinkWrapper from '@/views/Shared/BaseModalWithJobLinkWrapper.vue'

// TODO: implement multiple job assignment
const props = defineProps<{
  contact: Contact | null
  jobApplication: JobApplication
}>()
const emit = defineEmits(['close', 'save'])
const route = useRoute()

const isModalOpen = ref(false)
const isEditMode = computed(() => !!props.contact)
const linkedJobs = ref<JobApplication[]>([])
let linkedJobIdsBeforeUpdate: string[] = []

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
  if (isEditMode.value) {
    form.value = JSON.parse(JSON.stringify(props.contact))
    linkedJobs.value = getJobsLinkedToContact()
    linkedJobIdsBeforeUpdate = linkedJobs.value.map((j) => j.id)
  } else {
    linkedJobs.value = [props.jobApplication]
  }
  isModalOpen.value = true
})

const getJobsLinkedToContact = (): JobApplication[] => {
  return CurrentBoard.getBoard()!
    .columns.flatMap((c) => c.jobApplications)
    .filter((j) =>
      j.contacts ? j.contacts.filter((c) => c.id === props.contact!.id).length > 0 : false,
    )
}

// --- Email & Phone handlers ---
const addEmail = () => {
  if (!form.value.emails) form.value.emails = []
  form.value.emails.push({ email: '', type: ContactMethodTypeEnum.WORK } as ContactEmail)
}
const removeEmail = (index: number) => {
  form.value.emails?.splice(index, 1)
}

const addPhone = () => {
  if (!form.value.phones) form.value.phones = []
  form.value.phones.push({ phone: '', type: ContactMethodTypeEnum.WORK } as ContactPhone)
}
const removePhone = (index: number) => {
  form.value.phones?.splice(index, 1)
}

const handleSave = async (linkedJobIds: string[]) => {
  if (!form.value.firstName || !form.value.lastName) {
    alert('First Name and Last Name are required.')
    return
  }

  // Exclude empty email/phone before save
  if (form.value.emails) form.value.emails = form.value.emails.filter((e) => e.email.trim() !== '')
  if (form.value.phones) form.value.phones = form.value.phones.filter((p) => p.phone.trim() !== '')

  // TODO: implement Company save
  const boardId = route.params.boardId
  const contact = { ...form.value, boardId } as Contact
  const savedContact = isEditMode.value
    ? await api.contacts.update(contact)
    : await api.contacts.create(contact)

  sendAssignOrUnassignJobRequests(savedContact.id, linkedJobIds)

  emit('save', savedContact)
}

const sendAssignOrUnassignJobRequests = (contactId: string, linkedJobIds: string[]) => {
  const jobIdsToLink = linkedJobIds.filter((id) => !linkedJobIdsBeforeUpdate.includes(id))
  const jobIdsToUnLink = linkedJobIdsBeforeUpdate.filter((id) => !linkedJobIds.includes(id))

  jobIdsToLink.forEach(async (jobId) => {
    await api.contacts.assignJobApplication(contactId, jobId)
  })

  jobIdsToUnLink.forEach(async (jobId) => {
    await api.contacts.unassignJobApplication(contactId, jobId)
  })
}
</script>

<template>
  <BaseModalWithJobLinkWrapper
    v-if="isModalOpen"
    :title="isEditMode ? 'Edit Contact' : 'Create Contact'"
    :linkedJobsParam="linkedJobs"
    @close="emit('close')"
    @save="handleSave"
  >
    <template #form>
      <div class="avatar-row">
        <div class="avatar-placeholder"><AvatarIcon width="30" height="30" /></div>
        <div class="form-row flex-1">
          <div class="input-group input-group-required">
            <label>First Name <span>*</span></label>
            <input v-model="form.firstName" placeholder="First Name" />
          </div>
          <div class="input-group input-group-required">
            <label>Last Name <span>*</span></label>
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

      <div class="input-group external-url">
        <div class="external-url-row">
          <TwitterIcon />
          <input
            v-model="form.twitterUrl"
            type="text"
            name="twitter-url"
            placeholder="Twitter URL"
          />
        </div>
        <div class="external-url-row">
          <FacebookIcon />
          <input
            v-model="form.facebookUrl"
            type="text"
            name="facebook-url"
            placeholder="Facebook URL"
          />
        </div>
        <div class="external-url-row">
          <LinkedInIcon />
          <input
            v-model="form.linkedinUrl"
            type="text"
            name="linkedin-url"
            placeholder="LinkedIn URL"
          />
        </div>
        <div class="external-url-row">
          <GitHubIcon />
          <input v-model="form.githubUrl" type="text" name="github-url" placeholder="GitHub URL" />
        </div>
      </div>
    </template>
  </BaseModalWithJobLinkWrapper>
</template>

<style scoped>
/* Form Controls */
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
  width: 60px;
  height: 60px;
  background: #e8f0fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
  color: #1a73e8;
}

.external-url {
  border: 1px solid #dadce0;
  border-radius: 6px;
  padding: 12px;
}
.external-url-row {
  display: flex;
  align-items: center;
}
.external-url-row input {
  flex: 1;
  border: none;
}

/* Emails/Phones dynamic list */
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
</style>
