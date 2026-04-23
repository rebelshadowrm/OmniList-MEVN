<template>
  <aside v-if="shouldShow" class="preference-banner">
    <div>
      <strong>Personalize your home dashboard</strong>
      <p>Pick the media you care about and choose a starting layout style.</p>
    </div>
    <div class="banner-actions">
      <button type="button" class="text-btn" @click="dismiss">Later</button>
      <button type="button" @click="openPreferences">Set preferences</button>
    </div>
  </aside>
</template>

<script>
import useUser from "../composables/user"
import {
  HOME_BANNER_DISMISSED_KEY,
  homePreferencesFromUser,
  readLocalHomePreferences,
} from "../config/homePreferences"

export default {
  name: "HomePreferenceBanner",
  data() {
    return {
      userState: null,
      loggedInState: null,
      dismissed: false,
    }
  },
  computed: {
    isLoggedIn() {
      return !!(this.loggedInState?.value ?? this.loggedInState)
    },
    currentUser() {
      const userState = this.userState?.value ?? this.userState

      return userState?.user
    },
    dismissKey() {
      return `${HOME_BANNER_DISMISSED_KEY}.${this.currentUser?._id ?? 'guest'}`
    },
    hasHomePreferences() {
      return !!(homePreferencesFromUser(this.currentUser)?.updatedAt || readLocalHomePreferences()?.updatedAt)
    },
    shouldShow() {
      return this.isLoggedIn
          && !this.dismissed
          && !this.hasHomePreferences
          && this.$route.name !== 'Settings'
    },
  },
  watch: {
    dismissKey: 'syncDismissed',
  },
  created() {
    const {getIsLoggedIn, getUser} = useUser()
    this.loggedInState = getIsLoggedIn()
    this.userState = getUser()
    this.syncDismissed()
  },
  methods: {
    syncDismissed() {
      this.dismissed = localStorage.getItem(this.dismissKey) === 'true'
    },
    dismiss() {
      localStorage.setItem(this.dismissKey, 'true')
      this.dismissed = true
    },
    openPreferences() {
      this.$router.push({name: 'Settings', query: {section: 'home'}})
    },
  },
}
</script>

<style scoped>
.preference-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: .5rem;
  padding: .85rem 1.25rem;
  border-block: 1px solid var(--clr-border);
  background: var(--clr-secondary-800-7);
}

strong {
  color: var(--clr-primary-200);
}

p {
  font-size: var(--txt-small);
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: .5rem;
}

button {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .4rem .7rem;
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 800;
  cursor: pointer;
}

.text-btn {
  color: var(--clr-text);
  background: transparent;
}

@media (max-width: 42rem) {
  .preference-banner {
    align-items: stretch;
    flex-direction: column;
  }

  .banner-actions {
    justify-content: start;
  }
}
</style>
