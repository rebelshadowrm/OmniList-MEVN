<template>
  <ClientOnly>
    <Home />
  </ClientOnly>
</template>

<script setup lang="ts">
import Home from '@omni/shared/views/Home.vue'

definePageMeta({
  name: 'Home',
})
</script>
