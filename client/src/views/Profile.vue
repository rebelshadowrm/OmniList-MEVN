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
      <ProfileAnimeList v-if="section === 'animelist'"/>
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
import ProfileAnimeList from "../components/profile/ProfileAnimeList.vue";
import ProfileFavorites from "../components/profile/ProfileFavorites.vue";
import ProfileDiscussions from "../components/profile/ProfileDiscussions.vue";
import ProfileSocials from "../components/profile/ProfileSocials.vue";
import ProfileReviews from "../components/profile/ProfileReviews.vue";
import useTheme from "../composables/theme";

export default {
  name: "Profile",
  components: {
    ProfileDiscussions,
    ProfileReviews,
    ProfileSocials,
    ProfileFavorites,
    ProfileAnimeList,
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
      animeList: [],
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
  async beforeCreate() {
        const username = this?.$route?.params?.username
        if (username) {
          const {data} = await UserService.getUserByUsername(username)
          await this.updateProfile(data)
        }
    if (this.username) {
      const {data} = await UserService.getUserByUsername(this.username)
      await this.updateProfile(data)
    }
  },
  async beforeUpdate() {
    this.$watch(
        async () => this.$route.params,
        async (toParams) => {
          const {username} = await toParams
          if (username) {
            const {data} = await UserService.getUserByUsername(username)
            await this.updateProfile(data)
          }
        })
    if (this.username) {
      const {data} = await UserService.getUserByUsername(this.username)
      await this.updateProfile(data)
    }
  },
  methods: {
    activeSection(section) {
      this.section = section
    },
    async updateProfile(user) {
      this.email = user?.email
      this.name = user?.userName === '' ? user?.email : user?.userName ?? 'Not Found'
      this.first = user?.firstName
      this.last = user?.lastName
      //TODO: add better methods for image fallbacks
      this.img = user?.img ?? `https://picsum.photos/seed/${this.name}/260/280`
      this.imgAlt = user?.imgAlt ?? 'profile image'
      this.bgImg = user?.bgImg ?? `https://picsum.photos/seed/${this.email}/2000/400`
      const {
        getLocalColors, HexToHSL,
        setSecondaryColor, setPrimaryColor,
        setAccentColor
      } = useTheme()
      const localColors = getLocalColors()
      const colors = user?.userPreferences?.themes?.profileTheme
      const primaryHSL = HexToHSL(colors?.primaryColor ?? localColors?.primaryColor ?? '#e85e30')
      setPrimaryColor(primaryHSL)
      if (colors?.secondaryColor) {
        const secondaryHSL = HexToHSL(colors.secondaryColor)
        setSecondaryColor(secondaryHSL)
      } else if (localColors?.secondaryColor) {
        const secondaryHSL = HexToHSL(localColors.secondaryColor)
        setSecondaryColor(secondaryHSL)
      }
      if (colors?.accentColor) {
        const accentHSL = HexToHSL(colors.accentColor)
        setAccentColor(accentHSL)
      } else if (localColors?.accentColor) {
        const accentHSL = HexToHSL(localColors.accentColor)
        setAccentColor(accentHSL)
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    document.documentElement.style.removeProperty('--clr-primary-h')
    document.documentElement.style.removeProperty('--clr-primary-s')
    document.documentElement.style.removeProperty('--clr-secondary-h')
    document.documentElement.style.removeProperty('--clr-secondary-s')
    document.documentElement.style.removeProperty('--clr-accent-h')
    document.documentElement.style.removeProperty('--clr-accent-s')
    const {
      getLocalColors, HexToHSL, setPrimaryColor,
      setSecondaryColor, setAccentColor
    } = useTheme()
    const colors = getLocalColors()
    if(colors?.primaryColor) {
      const primaryHSL = HexToHSL(colors?.primaryColor)
      setPrimaryColor(primaryHSL)
    }
    if (colors?.secondaryColor) {
      const secondaryHSL = HexToHSL(colors?.secondaryColor)
      setSecondaryColor(secondaryHSL)
    }
    if (colors?.accentColor) {
      const accentHSL = HexToHSL(colors?.accentColor)
      setAccentColor(accentHSL)
    }
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