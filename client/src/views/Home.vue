<template>
  <div class="landing">
    <div class="featured">
      <div class="anime-feature">

      </div>
      <!--more featured content-->
    </div>
    <News class="ann"/>
  </div>
</template>

<script>
import useUser from "../composables/user.js"
import News from "../components/News.vue"

export default {
  name: "Home",
  components: {News},
  data() {
    return {
      isLoggedIn: false,
      hasAccount: false,
      users: [],
    }
  },
  async created() {
    const {getIsLoggedIn} = useUser()
    this.isLoggedIn = getIsLoggedIn()
  },

}
</script>

<style scoped>

.landing {
  display: grid;
  grid-template-areas: "featured news";
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  padding: 2rem 1.5rem;
}

.featured {
  grid-area: featured;
}

.ann {
  grid-area: news;
}


</style>