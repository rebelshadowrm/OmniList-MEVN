<template>
<div>
  <ThreadComponent type="discussion" @update-replies="updateReplies" :post="post" :responses="responses"/>
</div>
</template>

<script>
import ThreadComponent from "../components/thread/ThreadComponent.vue";
import ThreadService from "../services/ThreadService";
export default {
  name: "Discussion",
  components: {ThreadComponent},
  props: {
    id: [Number, String],
  },
  data() {
    return {
      post: {},
      responses: [],
    }
  },
  async created() {
    await this.getDiscussion()
    this.timer = setInterval(this.getDiscussion, 5000)
  },
  beforeUnmount() {
    this.cancelAutoUpdate()
  },
  methods: {
    async getDiscussion() {
      try {
        const thread = await ThreadService.getDiscussionsById(this.id)
        if(thread) {
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
          const comments  = thread?.comments ?? []
          const filtered = comments.filter( ({comment}) => comment.suspended === false)
          filtered.sort( (a, b) => {
            return new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
          })
          this.responses = filtered
        }

      } catch(err) {
        console.log(err.message)
      }
    },
    async updateReplies() {
      await this.getDiscussion()
    },
    cancelAutoUpdate() {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>

</style>