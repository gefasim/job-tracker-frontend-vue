<script setup lang="ts">
import { CurrentUserService } from '@/current-user.service'
import { computed } from 'vue'
import AuthenticatedHome from './AuthenticatedHome.vue'
import GuestHome from './GuestHome.vue'

const isLoggedIn = computed(() => CurrentUserService.getUser() !== null)
</script>
<template>
  <AuthenticatedHome v-if="isLoggedIn"></AuthenticatedHome>
  <GuestHome v-else></GuestHome>
</template>
<style></style>
