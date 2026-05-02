<template>
  <ClientOnly>
    <AdminPanel />
  </ClientOnly>
</template>

<script setup lang="ts">
import AdminPanel from '@omni/shared/views/AdminPanel.vue'

definePageMeta({
  name: 'AdminPanel',
})
</script>
