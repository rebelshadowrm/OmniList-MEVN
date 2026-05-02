<template>
  <ClientOnly>
    <Reviews />
  </ClientOnly>
</template>

<script setup lang="ts">
import Reviews from '@omni/shared/views/Reviews.vue'

definePageMeta({
  name: 'Reviews',
})
</script>
