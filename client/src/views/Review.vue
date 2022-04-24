<template>
<div>
  <ThreadComponent type="review" @update-replies="updateReplies" :post="post" :responses="responses"/>
</div>
</template>

<script>
import ThreadComponent from "../components/thread/ThreadComponent.vue";
import ThreadService from "../services/ThreadService";
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
  watch: {
    responses() {
      this.getReview()
    }
  },
  async created() {
    await this.getReview()
  },
  methods: {
    async getReview() {
      try {
        const thread = await ThreadService.getReviewsById(this.id)
        if (thread) {
          this.post = {
            subject: thread?.subject ?? '',
            subjectId: thread?.subjectId ?? '',
            id: thread?._id ?? '',
            title: thread?.title ?? '',
            author: thread?.user?.userName ?? '',
            authorId: thread?.user?._id ?? '',
            authorImg: thread?.user?.img,
            body: thread?.body ?? ''
          }
          this.responses = thread?.comments ?? []
        }

      } catch (err) {
        console.log(err.message)
      }
    },
    updateReplies(data) {
      this.responses = data.comments
    }
  }
}
</script>

<style scoped>

</style>