<template>
  <ClientOnly>
    <MediaBrowse media-type="ANIME" />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaBrowse from '@omni/shared/views/MediaBrowse.vue'

definePageMeta({
  name: 'AnimeBrowse',
})
</script>
