<template>
  <ClientOnly>
    <MediaBrowse media-type="TV" />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaBrowse from '@omni/shared/views/MediaBrowse.vue'

definePageMeta({
  name: 'TvBrowse',
})
</script>
