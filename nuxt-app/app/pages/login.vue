<template>
  <ClientOnly>
    <LoginRegister />
  </ClientOnly>
</template>

<script setup lang="ts">
import LoginRegister from '@omni/shared/views/LoginRegister.vue'

definePageMeta({
  name: 'LoginRegister',
})
</script>
