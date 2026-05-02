<template>
  <ClientOnly>
    <MediaBrowse media-type="BOOK" />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaBrowse from '@omni/shared/views/MediaBrowse.vue'

definePageMeta({
  name: 'BookBrowse',
})
</script>
