<template>
  <ClientOnly>
    <Inbox />
  </ClientOnly>
</template>

<script setup lang="ts">
import Inbox from '@omni/shared/views/Inbox.vue'

definePageMeta({
  name: 'Inbox',
})
</script>
