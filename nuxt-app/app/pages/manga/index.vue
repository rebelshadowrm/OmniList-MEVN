<template>
  <ClientOnly>
    <MediaBrowse media-type="MANGA" />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaBrowse from '@omni/shared/views/MediaBrowse.vue'

definePageMeta({
  name: 'MangaBrowse',
})
</script>
