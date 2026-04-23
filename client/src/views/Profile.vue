<template>
  <section id="profile">
    <header>
      <ProfileHeader
          :username="name"
          :img="img"
          :img-alt="imgAlt"
          :background-image="bgImg"
      />
      <ProfileNav @active="activeSection"/>
    </header>
    <div class="content">
      <ProfileOverview v-if="section === 'overview'"/>
      <ProfileMediaList v-if="section === 'mediaList'"/>
      <ProfileFavorites v-if="section === 'favorites'"/>
      <ProfileSocials v-if="section === 'socials'"/>
      <ProfileReviews v-if="section === 'reviews'"/>
      <ProfileDiscussions v-if="section === 'discussions'"/>
    </div>
  </section>
</template>

<script>
import UserService from "../services/UserService"
import ProfileHeader from "../components/profile/ProfileHeader.vue"
import ProfileNav from "../components/profile/ProfileNav.vue"
import ProfileOverview from "../components/profile/ProfileOverview.vue";
import ProfileMediaList from "../components/profile/ProfileMediaList.vue";
import ProfileFavorites from "../components/profile/ProfileFavorites.vue";
import ProfileDiscussions from "../components/profile/ProfileDiscussions.vue";
import ProfileSocials from "../components/profile/ProfileSocials.vue";
import ProfileReviews from "../components/profile/ProfileReviews.vue";
import useTheme from "../composables/theme";
import {imageOrFallback} from "../utils/fallbackImages";

export default {
  name: "Profile",
  components: {
    ProfileDiscussions,
    ProfileReviews,
    ProfileSocials,
    ProfileFavorites,
    ProfileMediaList,
    ProfileOverview,
    ProfileHeader,
    ProfileNav,
  },
  props: {
    username: String,
  },
  data() {
    return {
      user: {},
      mediaList: [],
      email: '',
      name: '',
      first: '',
      last: '',
      img: '',
      imgAlt: '',
      bgImg: '',
      section: '',
    }
  },
  async created() {
    await this.loadProfile(this.$route.params.username ?? this.username)
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadProfile(to.params.username ?? this.username)
    next()
  },
  methods: {
    activeSection(section) {
      this.section = section
    },
    async loadProfile(username) {
      if (!username) return

      const res = await UserService.getUserByUsername(username)
      await this.updateProfile(res?.data)
    },
    async updateProfile(user) {
      this.email = user?.email
      this.name = user?.userName === '' ? user?.email : user?.userName ?? 'Not Found'
      this.first = user?.firstName
      this.last = user?.lastName
      this.img = imageOrFallback(user?.img, 'avatar', this.name)
      this.imgAlt = user?.imgAlt ?? 'profile image'
      this.bgImg = imageOrFallback(user?.bgImg, 'banner', this.name)
      const {applyTheme} = useTheme()
      const colors = user?.userPreferences?.themes?.profileTheme
      applyTheme(colors)
    },
  },
  beforeRouteLeave(to, from, next) {
    const {getLocalColors, applyTheme} = useTheme()
    const colors = getLocalColors()
    applyTheme(colors)
    next()
  }
}
</script>

<style scoped>
.content {
  margin-inline: auto;
  padding: 1.5rem 2rem;
}
</style>
