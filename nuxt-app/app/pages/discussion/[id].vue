<template>
  <ClientOnly>
    <Discussion :id="id" />
  </ClientOnly>
</template>

<script setup lang="ts">
import Discussion from '@omni/shared/views/Discussion.vue'

const route = useRoute()
const id = computed(() => `${route.params.id ?? ''}`)

definePageMeta({
  name: 'Discussion',
})
</script>
