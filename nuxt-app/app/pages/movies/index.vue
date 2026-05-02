<template>
  <ClientOnly>
    <MediaBrowse media-type="MOVIE" />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaBrowse from '@omni/shared/views/MediaBrowse.vue'

definePageMeta({
  name: 'MovieBrowse',
})
</script>
