<template>
  <Header />
  <div class="app-banner">
    <HomePreferenceBanner />
  </div>
  <main>
    <router-view/>
  </main>
  <Footer />
</template>
<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import HomePreferenceBanner from "./components/HomePreferenceBanner.vue"

export default {
  name: 'App',
  components: {
    HomePreferenceBanner,
    Header,
    Footer,
  },
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-banner {
  grid-area: banner;
}
</style>
