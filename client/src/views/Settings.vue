<template>
  <section class="settings-page">
    <header class="settings-header">
      <h1>Settings</h1>
      <p v-if="message" class="message">{{ message }}</p>
    </header>

    <div v-if="isReady" class="settings-grid">
      <SettingsAccountPanel
          v-model="form"
          class="settings-section identity-section"
          @save="saveAccount"/>

      <SettingsProfilePanel
          v-model="form"
          class="settings-section profile-section"
          :avatar-preview="avatarPreview"
          :banner-preview-style="bannerPreviewStyle"
          @save="saveProfile"/>

      <ColorPicker
          class="settings-section theme-section"
          :user="currentUser"
          @saved="syncUser"/>

      <HomePreferencePanel
          id="home-preferences"
          class="settings-section home-section"
          :value="homePreferences"
          :message="homePreferenceMessage"
          @save="saveHomePreferences"/>
    </div>
  </section>
</template>

<script>
import ColorPicker from "../components/theme/ColorPicker.vue"
import HomePreferencePanel from "../components/home/HomePreferencePanel.vue"
import SettingsAccountPanel from "../components/settings/SettingsAccountPanel.vue"
import SettingsProfilePanel from "../components/settings/SettingsProfilePanel.vue"
import UserService from "../services/UserService"
import TokenService from "../services/TokenService";
import useUser from "../composables/user"
import {imageOrFallback} from "../utils/fallbackImages";
import {
  defaultHomePreferences,
  homePreferencesFromUser,
  readLocalHomePreferences,
  saveLocalHomePreferences,
} from "../config/homePreferences";

export default {
  name: "Settings",
  components: {
    ColorPicker,
    HomePreferencePanel,
    SettingsAccountPanel,
    SettingsProfilePanel,
  },
  data() {
    return {
      userState: null,
      form: {
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        img: '',
        imgAlt: '',
        bgImg: '',
        dateOfBirth: '',
        bio: '',
      },
      homePreferences: defaultHomePreferences(),
      homePreferenceMessage: '',
      isReady: false,
      message: '',
    }
  },
  computed: {
    currentUser() {
      const userState = this.userState?.value ?? this.userState

      return userState?.user
    },
    avatarPreview() {
      return imageOrFallback(this.form.img, 'avatar', this.form.userName)
    },
    bannerPreviewStyle() {
      return {
        '--preview-bg': `url("${imageOrFallback(this.form.bgImg, 'banner', this.form.userName)}")`
      }
    },
  },
  async created() {
    const user = await this.resolveUser()
    this.loadForm(user)
    this.loadHomePreferences(user)
    this.isReady = true
    this.focusHomePreferences()
  },
  methods: {
    async resolveUser() {
      const {getUser, initializeUser, decodeJWT, setUser} = useUser()
      await initializeUser()
      this.userState = getUser()

      let user = this.currentUser
      if (user?._id) return user

      const {_id} = decodeJWT(TokenService.getAccessToken())?.user ?? {}
      if (!_id) {
        this.message = 'Please log in again to edit settings.'
        return null
      }

      const res = await UserService.getUser(_id)
      if (res?.status !== 200) {
        this.message = 'Settings could not load your account.'
        return null
      }

      setUser(res.data)
      this.userState = getUser()
      return res.data
    },
    loadForm(user) {
      this.form = {
        userName: user?.userName ?? '',
        email: user?.email ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        img: user?.img ?? '',
        imgAlt: user?.imgAlt ?? 'profile image',
        bgImg: user?.bgImg ?? '',
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        bio: user?.userProfile?.bio ?? '',
      }
    },
    loadHomePreferences(user) {
      this.homePreferences = homePreferencesFromUser(user)
          ?? readLocalHomePreferences()
          ?? defaultHomePreferences()
    },
    focusHomePreferences() {
      if (this.$route.query.section !== 'home') return

      this.$nextTick(() => {
        document.getElementById('home-preferences')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    },
    validateUsername() {
      const username = this.form.userName?.trim()?.toLowerCase()
      if (!username || username.length < 3 || username.length > 30) {
        this.message = 'Username must be between 3 and 30 characters.'
        return null
      }
      if (!/^[a-z0-9._-]+$/.test(username) || /^\S+@\S+\.\S+$/.test(username)) {
        this.message = 'Username can only use letters, numbers, periods, underscores, and hyphens.'
        return null
      }
      return username
    },
    async updateUser(data, successMessage) {
      const user = this.currentUser
      if (!user?._id) return

      const res = await UserService.updateUser(user._id, data)
      if (res?.status === 200) {
        this.syncUser(res.data)
        this.message = successMessage
        return true
      }

      if (res?.status === 409) {
        this.message = 'Username already in use.'
        return false
      }

      if (res?.status === 429) {
        this.message = res.data
        return false
      }

      this.message = res?.data ?? 'Settings could not be saved.'
      return false
    },
    async saveAccount() {
      const username = this.validateUsername()
      if (!username) return

      await this.updateUser({
        userName: username,
      }, 'Account saved.')
    },
    async saveProfile() {
      await this.updateUser({
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        img: this.form.img,
        imgAlt: this.form.imgAlt,
        bgImg: this.form.bgImg,
        dateOfBirth: this.form.dateOfBirth,
        bio: this.form.bio,
      }, 'Profile saved.')
    },
    async saveHomePreferences(preferences) {
      const savedPreferences = saveLocalHomePreferences(preferences)
      this.homePreferences = savedPreferences
      this.homePreferenceMessage = 'Saving home preferences...'

      const saved = await this.updateUser({
        userPreferences: {
          dashboardLayout: {
            home: savedPreferences,
          },
        },
      }, 'Home preferences saved.')

      this.homePreferenceMessage = saved ? 'Home preferences saved.' : 'Home preferences saved locally only.'
    },
    syncUser(user) {
      const {setUser} = useUser()
      setUser(user)
      this.loadForm(user)
      this.loadHomePreferences(user)
    },
  },
}
</script>

<style scoped>
.settings-page {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
  padding: 2rem 0 3rem;
  display: grid;
  gap: 1.5rem;
}

.settings-header {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.settings-header h1 {
  color: var(--clr-primary-200);
  font-size: var(--txt-lrg);
}

.message {
  color: var(--clr-primary-200);
  font-weight: 700;
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, .8fr);
  gap: 1.25rem;
  align-items: start;
}

.settings-section {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

.profile-section {
  grid-column: 1;
}

.theme-section {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.home-section {
  grid-column: 1 / -1;
}

@media (max-width: 58rem) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .profile-section,
  .theme-section {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
