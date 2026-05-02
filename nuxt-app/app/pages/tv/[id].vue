<template>
  <ClientOnly>
    <Media :id="id" media-type="TV" />
  </ClientOnly>
</template>

<script setup lang="ts">
import Media from '@omni/shared/views/Media.vue'

const route = useRoute()
const id = computed(() => `${route.params.id ?? ''}`)

definePageMeta({
  name: 'Tv',
})
</script>
