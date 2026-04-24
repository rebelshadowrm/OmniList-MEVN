<template>
  <section class="home-page" :class="homeStyleClass">
    <HomeGuestHero v-if="!isLoggedIn" :title="heroTitle" :copy="heroCopy" />

    <HomeDashboardGrid
        :modules="dashboardModules"
        :columns="dashboardColumns"
        :rows="dashboardRows"
        :areas="dashboardAreas"
    />
  </section>
</template>

<script>
import useUser from "../composables/user"
import HomeGuestHero from "../components/home/HomeGuestHero.vue"
import HomeDashboardGrid from "../components/home/HomeDashboardGrid.vue"
import {HOME_STYLE_PRESETS, homePreferencesFromUser, readLocalHomePreferences, defaultHomePreferences} from "../config/homePreferences"
import {buildHomeModules} from "../config/homeLayout"

export default {
  name: "Home",
  components: {
    HomeGuestHero,
    HomeDashboardGrid,
  },
  data() {
    return {
      loggedInState: null,
      userState: null,
    }
  },
  created() {
    const {getIsLoggedIn, getUser} = useUser()
    this.loggedInState = getIsLoggedIn()
    this.userState = getUser()
  },
  computed: {
    isLoggedIn() {
      return !!(this.loggedInState?.value ?? this.loggedInState)
    },
    currentUser() {
      const userState = this.userState?.value ?? this.userState

      return userState?.user
    },
    preferences() {
      return homePreferencesFromUser(this.currentUser)
          ?? readLocalHomePreferences()
          ?? defaultHomePreferences()
    },
    activeStyle() {
      return HOME_STYLE_PRESETS.find(style => style.value === this.preferences.style) ?? HOME_STYLE_PRESETS[0]
    },
    homeStyleClass() {
      return `style-${this.activeStyle.value}`
    },
    heroTitle() {
      return 'Track anime, manga, movies, and TV in one place.'
    },
    heroCopy() {
      return 'Browse details without an account, or sign up to save lists, favorites, reviews, discussions, themes, and home preferences.'
    },
    dashboard() {
      return buildHomeModules({
        preferences: this.preferences,
        isLoggedIn: this.isLoggedIn,
      })
    },
    dashboardModules() {
      return this.dashboard.modules
    },
    dashboardColumns() {
      return this.dashboard.columns
    },
    dashboardRows() {
      return this.dashboard.rows
    },
    dashboardAreas() {
      return this.dashboard.areas
    },
  },
}
</script>

<style scoped>
.home-page {
  display: grid;
  gap: 2rem;
  width: min(100% - 2rem, 86rem);
  margin-inline: auto;
  padding: 2rem 0 3rem;
}

@media (max-width: 42rem) {
  .home-page {
    width: min(100% - 1rem, 86rem);
    padding-top: 1rem;
  }
}
</style>
