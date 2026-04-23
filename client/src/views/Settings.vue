<template>
  <section class="settings-page">
    <header class="settings-header">
      <h1>Settings</h1>
      <p v-if="message" class="message">{{ message }}</p>
    </header>

    <div v-if="isReady" class="settings-grid">
      <section class="settings-section identity-section">
        <div class="section-heading">
          <h2>Account</h2>
          <button class="save-btn" @click="saveAccount">
            <i class="fas fa-save"></i>
            Save
          </button>
        </div>

        <form class="settings-form" @submit.prevent="saveAccount">
          <div class="field">
            <label for="userName">Username</label>
            <input
                id="userName"
                v-model.trim="form.userName"
                autocomplete="username"
                type="text">
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                disabled>
          </div>

        </form>
      </section>

      <section class="settings-section profile-section">
        <div class="section-heading">
          <h2>Profile</h2>
          <button class="save-btn" @click="saveProfile">
            <i class="fas fa-save"></i>
            Save
          </button>
        </div>

        <form class="settings-form" @submit.prevent="saveProfile">
          <div class="image-row">
            <img
                class="avatar-preview"
                :src="avatarPreview"
                :alt="form.imgAlt || form.userName">
            <div class="banner-preview" :style="bannerPreviewStyle">
              <span>{{ form.userName }}</span>
            </div>
          </div>

          <div class="field">
            <label for="firstName">First name</label>
            <input
                id="firstName"
                v-model.trim="form.firstName"
                autocomplete="given-name"
                type="text">
          </div>

          <div class="field">
            <label for="lastName">Last name</label>
            <input
                id="lastName"
                v-model.trim="form.lastName"
                autocomplete="family-name"
                type="text">
          </div>

          <div class="field">
            <label for="dateOfBirth">Date of birth</label>
            <input
                id="dateOfBirth"
                v-model="form.dateOfBirth"
                type="date">
          </div>

          <div class="field">
            <label for="img">Avatar URL</label>
            <input
                id="img"
                v-model.trim="form.img"
                type="url">
          </div>

          <div class="field">
            <label for="bgImg">Banner URL</label>
            <input
                id="bgImg"
                v-model.trim="form.bgImg"
                type="url">
          </div>

          <div class="field">
            <label for="imgAlt">Avatar alt text</label>
            <input
                id="imgAlt"
                v-model.trim="form.imgAlt"
                type="text">
          </div>

          <div class="field full-field">
            <label for="bio">Bio</label>
            <textarea
                id="bio"
                v-model.trim="form.bio"
                rows="5"></textarea>
          </div>
        </form>
      </section>

      <ColorPicker
          class="settings-section theme-section"
          :user="currentUser"
          @saved="syncUser"/>
    </div>
  </section>
</template>

<script>
import ColorPicker from "../components/ColorPicker.vue"
import UserService from "../services/UserService"
import TokenService from "../services/TokenService";
import useUser from "../composables/user"
import {imageOrFallback} from "../utils/fallbackImages";

export default {
  name: "Settings",
  components: {
    ColorPicker,
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
      isReady: false,
      message: '',
    }
  },
  computed: {
    currentUser() {
      return this.userState?.value?.user
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
    this.isReady = true
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
        return
      }

      if (res?.status === 409) {
        this.message = 'Username already in use.'
        return
      }

      if (res?.status === 429) {
        this.message = res.data
        return
      }

      this.message = res?.data ?? 'Settings could not be saved.'
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
    syncUser(user) {
      const {setUser} = useUser()
      setUser(user)
      this.loadForm(user)
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

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

h2 {
  color: var(--clr-primary-200);
}

.settings-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field {
  display: grid;
  gap: .35rem;
}

.full-field,
.image-row {
  grid-column: 1 / -1;
}

label {
  font-size: var(--txt-small);
  font-weight: 700;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .45rem .6rem;
  background: var(--clr-bg);
  color: var(--clr-text);
}

input:disabled {
  opacity: .68;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 7rem;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .35rem .75rem;
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 700;
  cursor: pointer;
}

.image-row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1rem;
  align-items: stretch;
}

.avatar-preview {
  aspect-ratio: 1;
  width: 6rem;
  object-fit: cover;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
}

.banner-preview {
  min-height: 6rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--clr-bg);
  background-image: var(--preview-bg);
  background-position: center 40%;
  background-repeat: no-repeat;
  background-size: cover;
  color: hsl(var(--clr-white-200));
  font-weight: 800;
  text-shadow: 0 2px 2px hsl(var(--clr-black) / .7);
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

@media (max-width: 42rem) {
  .settings-form,
  .image-row {
    grid-template-columns: 1fr;
  }

  .avatar-preview {
    width: 5rem;
  }
}
</style>
