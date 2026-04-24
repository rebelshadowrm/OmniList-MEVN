<template>
  <ThreadComponent :type="mode" @update-replies="updateReplies" :post="post" :responses="responses"/>
</template>

<script>
import ThreadComponent from "./ThreadComponent.vue"
import ThreadService from "../../services/ThreadService"

export default {
  name: "ThreadDetailView",
  components: {ThreadComponent},
  props: {
    id: [Number, String],
    mode: {
      type: String,
      required: true,
      validator: value => ['discussion', 'review'].includes(value),
    },
  },
  data() {
    return {
      post: {},
      responses: [],
      timer: null,
    }
  },
  async created() {
    await this.loadThread()
    this.timer = setInterval(this.loadThread, 5000)
  },
  beforeUnmount() {
    this.cancelAutoUpdate()
  },
  methods: {
    async loadThread() {
      try {
        const thread = this.mode === 'discussion'
            ? await ThreadService.getDiscussionsById(this.id)
            : await ThreadService.getReviewsById(this.id)

        if (thread) {
          this.post = {
            subject: thread?.subject ?? '',
            subjectId: thread?.subjectId ?? '',
            mediaType: thread?.mediaType ?? 'ANIME',
            source: thread?.source ?? 'ANILIST',
            id: thread?._id ?? '',
            title: thread?.title ?? '',
            author: thread?.user?.userName ?? '',
            authorId: thread?.user?._id ?? '',
            authorImg: thread?.user?.img,
            body: thread?.body ?? ''
          }
          const comments = thread?.comments ?? []
          const filtered = comments.filter(({comment}) => comment.suspended === false)
          filtered.sort((a, b) => {
            return new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
          })
          this.responses = filtered
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async updateReplies() {
      await this.loadThread()
    },
    cancelAutoUpdate() {
      clearInterval(this.timer)
    }
  }
}
</script>
