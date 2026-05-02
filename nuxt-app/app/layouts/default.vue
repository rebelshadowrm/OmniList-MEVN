<template>
  <ClientOnly>
    <SharedHeader />
    <div class="app-banner">
      <HomePreferenceBanner />
    </div>
  </ClientOnly>
  <main>
    <slot />
  </main>
  <ClientOnly>
    <SharedFooter />
  </ClientOnly>
</template>

<script setup lang="ts">
import SharedFooter from '@omni/shared/components/Footer.vue'
import SharedHeader from '@omni/shared/components/Header.vue'
import HomePreferenceBanner from '@omni/shared/components/HomePreferenceBanner.vue'
import useUser from '@omni/shared/composables/user'

onMounted(() => {
  const { initializeUser } = useUser()
  initializeUser()
})
</script>

<style scoped>
.app-banner {
  grid-area: banner;
}
</style>
