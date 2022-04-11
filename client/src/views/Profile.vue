<template>
<section>
  <header>
    <ProfileHeader
        :username="name"
        :img="img"
        :img-alt="imgAlt"
        :background-image="bgImg"
    />
    <ProfileNav @active="activeSection" />
    <div class="content">
      <ProfileOverview v-if="section === 'overview'"/>
      <ProfileAnimeList v-if="section === 'animelist'"/>
      <ProfileFavorites v-if="section === 'favorites'"/>
      <ProfileStats v-if="section === 'stats'"/>
      <ProfileSocials v-if="section === 'socials'"/>
      <ProfileReviews v-if="section === 'reviews'"/>
    </div>
  </header>
</section>
</template>

<script>
import UserService from "../UserService"
import useUser from "../composables/user"
import ProfileHeader from "../components/ProfileHeader.vue"
import ProfileNav from "../components/ProfileNav.vue"
import ProfileOverview from "../components/ProfileOverview.vue";
import ProfileAnimeList from "../components/ProfileAnimeList.vue";
import ProfileFavorites from "../components/ProfileFavorites.vue";
import ProfileStats from "../components/ProfileStats.vue";
import ProfileSocials from "../components/ProfileSocials.vue";
import ProfileReviews from "../components/ProfileReviews.vue";

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
      this.bgImg = user?.bgImg ?? 'https://picsum.photos/2000/400'
    }
  }
}
</script>

<style scoped>
.content {
  margin-inline: auto;
  padding: 1.5rem 2rem;
}
</style>