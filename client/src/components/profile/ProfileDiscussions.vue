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
    const {getUser} = useUser()
    const {user} = getUser().value
    this.isLoading = true
    await this.getDiscussions(user._id)
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