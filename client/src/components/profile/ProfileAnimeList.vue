<template>
  <div v-if="loading" class="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else class="loaded">
    <h3>Watching</h3>
    <ListComponent :animeList="watching" />
    <h3>Completed</h3>
    <ListComponent :animeList="completed" />
    <h3>On Hold</h3>
    <ListComponent :animeList="onHold" />
    <h3>Dropped</h3>
    <ListComponent :animeList="dropped" />
  </div>
</template>

<script>
import ListComponent from "../ListComponent.vue";
import AnimeService from "../../services/AnimeService";
import UserService from "../../services/UserService";
export default {
  name: "ProfileAnimeList",
  components: {
    ListComponent
  },
  data() {
    return {
      watching: [],
      completed: [],
      onHold: [],
      dropped: [],
      loading: true,
    }
  },
  async beforeCreate() {
    const username = this?.$route?.params?.username
    const res =  await UserService.getUserByUsername(username)
    if(res.status === 200) {
      const user = res.data
      if(user?._id) {
        this.loading = true
        const list = await AnimeService.getUserAnimeList(user?._id)
        this.watching = list.filter( ({status}) => status === 'watching' )
        this.completed = list.filter( ({status}) => status === 'completed' )
        this.onHold = list.filter( ({status}) => status === 'on-hold' )
        this.dropped = list.filter( ({status}) => status === 'dropped' )
        this.loading = false
      }
    }

  }

}
</script>

<style scoped>
.loading {
  display: grid;
  place-items: center;
  margin-top: 2rem;
}
.loaded {
  display: grid;
  place-items: center;
}
h3 {
  display: block;
  width: 100%;
  max-width: min(100%, 70rem);
  padding: 1rem 0;
  background-color: var(--clr-secondary-200-1);
  text-align: center;
  font-size: var(--txt-med);
}
</style>