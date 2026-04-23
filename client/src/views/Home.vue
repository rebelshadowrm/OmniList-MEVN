<template>
  <section class="home-page" :class="homeStyleClass">
    <section v-if="!isLoggedIn" class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow">OmniList</p>
        <h1>{{ heroTitle }}</h1>
        <p>{{ heroCopy }}</p>
        <div class="hero-actions">
          <router-link class="primary-action" to="/login">
            Create account
          </router-link>
          <router-link class="secondary-action" to="/anime">
            Browse anime
          </router-link>
          <router-link class="secondary-action" to="/movies">
            Browse movies
          </router-link>
        </div>
      </div>

      <div class="hero-panel">
        <h2>Save the way you browse</h2>
        <p>Accounts keep your lists, favorites, reviews, discussions, themes, and home preferences synced.</p>
        <ul class="benefit-list">
          <li>Keep media lists and favorites together.</li>
          <li>Carry profile themes across devices.</li>
          <li>Shape the home dashboard around your interests.</li>
        </ul>
        <ThemePresetToggle label="" />
      </div>
    </section>

    <HomeDashboardGrid
        :modules="dashboardModules"
        :columns="dashboardColumns"
        :rows="dashboardRows"
    />
  </section>
</template>

<script>
import useUser from "../composables/user"
import ThemePresetToggle from "../components/ThemePresetToggle.vue"
import HomeDashboardGrid from "../components/home/HomeDashboardGrid.vue"
import {HOME_STYLE_PRESETS, homePreferencesFromUser, readLocalHomePreferences, defaultHomePreferences} from "../config/homePreferences"
import {buildHomeModules} from "../config/homeLayout"

export default {
  name: "Home",
  components: {
    HomeDashboardGrid,
    ThemePresetToggle,
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

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, .8fr);
  gap: 1.25rem;
  align-items: stretch;
  min-height: 19rem;
}

.hero-copy {
  display: grid;
  align-content: center;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background:
      linear-gradient(135deg, var(--clr-secondary-800-7), var(--clr-bg)),
      var(--clr-bg);
}

.eyebrow {
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 15ch;
  color: var(--clr-primary-200);
  font-size: 4rem;
  line-height: 1;
}

.hero-copy > p:not(.eyebrow) {
  max-width: 65ch;
  font-size: var(--txt-med);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

.hero-actions a,
.hero-panel a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .45rem .75rem;
  font-weight: 800;
  text-decoration: none;
}

.primary-action,
.hero-panel a {
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
}

.secondary-action {
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
}

.hero-panel {
  display: grid;
  align-content: start;
  gap: .85rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

.hero-panel {
  align-content: center;
}

.benefit-list {
  display: grid;
  gap: .45rem;
  padding-left: 1.1rem;
  font-size: var(--txt-small);
}

h2 {
  color: var(--clr-primary-200);
}

@media (max-width: 66rem) {
  .home-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 42rem) {
  .home-page {
    width: min(100% - 1rem, 86rem);
    padding-top: 1rem;
  }

  .hero-copy {
    padding: 1.25rem;
  }

  h1 {
    font-size: 2.4rem;
  }
}
</style>
