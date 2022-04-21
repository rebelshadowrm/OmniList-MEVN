<template>
<div>
  <ThreadComponent type="review" @update-replies="updateReplies" :post="post" :responses="responses"/>
</div>
</template>

<script>
import ThreadComponent from "../components/thread/ThreadComponent.vue";
import ThreadService from "../ThreadService";
export default {
  name: "Review",
  components: {ThreadComponent},
  props: {
    id: [Number, String],
  },
  data() {
    return {
      post: {},
      responses: []
    }
  },
  async created() {
    try {
      const thread = await ThreadService.getReviewsById(this.id)
      if (thread) {
        this.post = {
          subject: thread?.subject ?? '',
          id: thread?._id ?? '',
          title: thread?.title ?? '',
          author: thread?.user?.userName ?? '',
          body: thread?.body ?? ''
        }
        this.responses = thread?.comments ?? []
      }

    } catch (err) {
      console.log(err.message)
    }
  },
  methods: {
    updateReplies(data) {
      this.responses = data.comments
    }
  }
}
</script>

<style scoped>

</style>