<template>
<section id="profile">
  <header>
    <ProfileHeader
        :username="name"
        :img="img"
        :img-alt="imgAlt"
        :background-image="bgImg"
    />
    <ProfileNav @active="activeSection" />
  </header>
  <div class="content">
    <ProfileOverview v-if="section === 'overview'"/>
    <ProfileAnimeList v-if="section === 'animelist'"/>
    <ProfileFavorites v-if="section === 'favorites'"/>
    <ProfileStats v-if="section === 'stats'"/>
    <ProfileSocials v-if="section === 'socials'"/>
    <ProfileReviews v-if="section === 'reviews'"/>
  </div>
</section>
</template>

<script>
import UserService from "../services/UserService"
import useUser from "../composables/user"
import ProfileHeader from "../components/profile/ProfileHeader.vue"
import ProfileNav from "../components/profile/ProfileNav.vue"
import ProfileOverview from "../components/profile/ProfileOverview.vue";
import ProfileAnimeList from "../components/profile/ProfileAnimeList.vue";
import ProfileFavorites from "../components/profile/ProfileFavorites.vue";
import ProfileStats from "../components/profile/ProfileStats.vue";
import ProfileSocials from "../components/profile/ProfileSocials.vue";
import ProfileReviews from "../components/profile/ProfileReviews.vue";
import useTheme from "../composables/theme";

export default {
  name: "Profile",
  components: {
    ProfileReviews,
    ProfileSocials,
    ProfileStats,
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
    this.$watch(
        async () => this.$route.params,
        async (toParams) => {
          const {username} = await toParams
          if(username) {
            const {data} = await UserService.getUserByUsername(username)
            await this.updateProfile(data)
          }
        })
    if(this.username) {
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
      const { getLocalColors, HexToHSL,
              setSecondaryColor, setPrimaryColor,
              setAccentColor} = useTheme()
      const localColors = getLocalColors()
      const colors = user?.userPreferences?.themes?.profileTheme
      const primaryHSL = HexToHSL(colors?.primaryColor ?? localColors?.primaryColor ?? '#ff0000')
        setPrimaryColor(primaryHSL)
      if(colors?.secondaryColor) {
        const secondaryHSL = HexToHSL(colors.secondaryColor)
        setSecondaryColor(secondaryHSL)
      } else if (localColors?.secondaryColor) {
        const secondaryHSL = HexToHSL(localColors.secondaryColor)
        setSecondaryColor(secondaryHSL)
      }
      if(colors?.accentColor) {
        const accentHSL = HexToHSL(colors.accentColor)
        setAccentColor(accentHSL)
      } else if (localColors.accentColor) {
        const accentHSL = HexToHSL(localColors.accentColor)
        setAccentColor(accentHSL)
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    const { getLocalColors, setTheme} = useTheme()
    const color = getLocalColors()
    setTheme(color)
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