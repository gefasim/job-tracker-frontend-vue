<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Contact } from '@/models/contact.dto'
import GitHubIcon from '@/assets/external/GitHubIcon.vue'
import TwitterIcon from '@/assets/external/TwitterIcon.vue'
import FacebookIcon from '@/assets/external/FacebookIcon.vue'
import LinkedInIcon from '@/assets/external/LinkedInIcon.vue'

const props = defineProps<{ contact: Contact }>()
const emit = defineEmits(['edit', 'unlink'])

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.menu-container')) {
    isMenuOpen.value = false
  }
}

const editContact = (contact: Contact) => {
  emit('edit', contact)
  isMenuOpen.value = false
}

const unlinkContact = (contact: Contact) => {
  emit('unlink', contact.id)
  isMenuOpen.value = false
}

// http/https at the beginning marks the link as an external link,
// otherwise Vue treats the link as an internal link
const wrapExternalLink = (link: string): string => {
  if (!link) return ''
  if (link.startsWith('http://') || link.startsWith('https://')) return link
  return 'https://' + link
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))

const fullName = computed(() => `${props.contact.firstName} ${props.contact.lastName}`)
const primaryCompany = computed(() => props.contact.companies?.[0]?.name || '')
const primaryEmail = computed(() => props.contact.emails?.[0]?.email || 'none')
const primaryPhone = computed(() => props.contact.phones?.[0]?.phone || 'none')
</script>

<template>
  <div class="contact-card">
    <div class="card-header">
      <img v-if="contact.photoUrl" :src="contact.photoUrl" class="avatar" alt="Avatar" />
      <div v-else class="avatar-placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <div class="header-info">
        <h3 class="name" :title="fullName">{{ fullName }}</h3>
        <div class="title">{{ contact.jobTitle || 'No Title' }}</div>
        <div v-if="primaryCompany" class="company">{{ primaryCompany }}</div>
      </div>

      <div class="menu-container">
        <button class="menu-btn" @click.stop="toggleMenu">•••</button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <button @click="editContact(contact)">✏️ Edit</button>
          <button @click="unlinkContact(contact)" class="text-danger">🔗 Unlink</button>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="icon">📍</span> <span class="text">{{ contact.location || 'none' }}</span>
      </div>
      <div class="info-row">
        <span class="icon">✉️</span> <span class="text">{{ primaryEmail }}</span>
      </div>
      <div class="info-row">
        <span class="icon">📞</span> <span class="text">{{ primaryPhone }}</span>
      </div>
    </div>

    <div class="card-socials">
      <a :href="wrapExternalLink(contact.linkedinUrl)" target="_blank" class="social-icon"
        ><LinkedInIcon
      /></a>
      <a :href="wrapExternalLink(contact.facebookUrl)" target="_blank" class="social-icon"
        ><FacebookIcon
      /></a>
      <a :href="wrapExternalLink(contact.twitterUrl)" target="_blank" class="social-icon"
        ><TwitterIcon
      /></a>
      <a :href="wrapExternalLink(contact.githubUrl)" target="_blank" class="social-icon"
        ><GitHubIcon
      /></a>
    </div>

    <div class="card-footer">Created by System OOO</div>
  </div>
</template>

<style scoped>
.contact-card {
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.contact-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
  gap: 12px;
}
.avatar,
.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.avatar-placeholder {
  background: #e8f0fe;
  color: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-info {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  margin: 0;
  font-size: 15px;
  color: #202124;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title,
.company {
  font-size: 13px;
  color: #5f6368;
  margin-top: 2px;
}

.menu-container {
  position: absolute;
  right: 12px;
  top: 12px;
}
.menu-btn {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 12px;
  padding: 2px 8px;
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
  top: 100%;
  margin-top: 4px;
  background: white;
  border: 1px solid #dadce0;
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

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #f1f3f4;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #5f6368;
}
.info-row .icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}
.info-row .text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-socials {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #f1f3f4;
}
.social-icon {
  color: #9aa0a6;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  transition: color 0.2s;
}
.social-icon:hover {
  color: #1a73e8;
}

.card-footer {
  padding: 12px 16px;
  font-size: 12px;
  color: #9aa0a6;
  background: #fafafa;
}
</style>
