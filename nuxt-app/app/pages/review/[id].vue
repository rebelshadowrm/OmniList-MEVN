<template>
  <ClientOnly>
    <Review :id="id" />
  </ClientOnly>
</template>

<script setup lang="ts">
import Review from '@omni/shared/views/Review.vue'

const route = useRoute()
const id = computed(() => `${route.params.id ?? ''}`)

definePageMeta({
  name: 'Review',
})
</script>
