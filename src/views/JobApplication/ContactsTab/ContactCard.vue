<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Contact } from '@/models/contact.dto'
import GitHubIcon from '@/assets/icons/external/GitHubIcon.vue'
import TwitterIcon from '@/assets/icons/external/TwitterIcon.vue'
import FacebookIcon from '@/assets/icons/external/FacebookIcon.vue'
import LinkedInIcon from '@/assets/icons/external/LinkedInIcon.vue'
import AvatarIcon from '@/assets/icons/AvatarIcon.vue'

const props = defineProps<{
  contact: Contact
  showUnlinkButton: boolean
  showDeleteButton: boolean
}>()
const emit = defineEmits(['edit', 'unlink', 'delete'])

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

const deleteContact = (contact: Contact) => {
  emit('delete', contact.id)
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
        <AvatarIcon width="24" height="24" />
      </div>

      <div class="header-info">
        <h3 class="name" :title="fullName">{{ fullName }}</h3>
        <div class="title">{{ contact.jobTitle || 'No Title' }}</div>
        <div v-if="primaryCompany" class="company">{{ primaryCompany }}</div>
      </div>

      <div class="menu-container">
        <button class="menu-btn" @click.stop="toggleMenu">•••</button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <div @click="editContact(contact)">Edit</div>
          <div v-if="props.showUnlinkButton" @click="unlinkContact(contact)">Unlink</div>
          <div v-if="props.showDeleteButton" @click="deleteContact(contact)">Delete</div>
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
      <a
        :href="wrapExternalLink(contact.twitterUrl)"
        target="_blank"
        class="social-icon"
        :class="{ socialIconNoLink: !contact.twitterUrl }"
        ><TwitterIcon
      /></a>
      <a
        :href="wrapExternalLink(contact.facebookUrl)"
        target="_blank"
        class="social-icon"
        :class="{ socialIconNoLink: !contact.facebookUrl }"
        ><FacebookIcon
      /></a>
      <a
        :href="wrapExternalLink(contact.linkedinUrl)"
        target="_blank"
        class="social-icon"
        :class="{ socialIconNoLink: !contact.linkedinUrl }"
        ><LinkedInIcon
      /></a>
      <a
        :href="wrapExternalLink(contact.githubUrl)"
        target="_blank"
        class="social-icon"
        :class="{ socialIconNoLink: !contact.githubUrl }"
        ><GitHubIcon
      /></a>
    </div>
  </div>
</template>

<style scoped>
.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
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
  border-bottom: 1px solid var(--border-color);
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
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title,
.company {
  font-size: 13px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-container {
  position: absolute;
  right: 12px;
  top: 12px;
}
.menu-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2px 8px;
  cursor: pointer;
  color: var(--input-text);
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
.dropdown-menu > div {
  background: none;
  border: none;
  padding: 10px 16px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
}
.dropdown-menu > div:hover {
  background: #f1f3f4;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}
.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
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
.socialIconNoLink {
  pointer-events: none;
}
</style>
