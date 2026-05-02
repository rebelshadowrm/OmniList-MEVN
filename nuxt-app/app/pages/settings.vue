<template>
  <ClientOnly>
    <Settings />
  </ClientOnly>
</template>

<script setup lang="ts">
import Settings from '@omni/shared/views/Settings.vue'

definePageMeta({
  name: 'Settings',
})
</script>
