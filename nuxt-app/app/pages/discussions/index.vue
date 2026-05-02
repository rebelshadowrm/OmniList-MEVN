<template>
  <ClientOnly>
    <Discussions />
  </ClientOnly>
</template>

<script setup lang="ts">
import Discussions from '@omni/shared/views/Discussions.vue'

definePageMeta({
  name: 'Discussions',
})
</script>
