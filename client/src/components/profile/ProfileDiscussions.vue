<template>
  <div v-if="isLoading" class="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else class="loaded">
    <ThreadCollection type="review" :threads="discussions"/>
  </div>
</template>

<script>
import ThreadCollection from "../thread/ThreadCollection.vue";
import useUser from "../../composables/user"
import ThreadService from "../../services/ThreadService";
import UserService from "../../services/UserService";
export default {
  name: "ProfileDiscussions",
  components: {
    ThreadCollection
  },
  data() {
    return {
      discussions: [],
      isLoading: false,
    }
  },
  async created() {
    const username = this?.$route?.params?.username
    const res =  await UserService.getUserByUsername(username)
    if(res.status === 200) {
      this.isLoading = true
      await this.getDiscussions(res.data._id)
    }
  },
  methods: {
    async getDiscussions(id) {
      try {
        this.discussions = await ThreadService.getDiscussionsByUser(id)
        this.isLoading = false
      } catch(err) {
        console.log(err.message)
      }

    }
  }
}
</script>

<style scoped>
.loading {
  margin-inline: auto;
  text-align: center;
  margin-top: 2rem;
}
</style>