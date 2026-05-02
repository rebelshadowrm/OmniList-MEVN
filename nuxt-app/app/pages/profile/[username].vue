<template>
  <ClientOnly>
    <Profile :username="username" />
  </ClientOnly>
</template>

<script setup lang="ts">
import Profile from '@omni/shared/views/Profile.vue'

const route = useRoute()
const username = computed(() => `${route.params.username ?? ''}`)

definePageMeta({
  name: 'Profile',
})
</script>
