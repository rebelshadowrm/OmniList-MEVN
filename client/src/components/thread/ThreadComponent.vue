<template>
<div class="thread-container">
  <ThreadPost :post="post" />
  <div class="replies">
    <ThreadResponseForm :type="type" :id="post.id" @update-replies="updateReplies" />
    <ThreadResponse :response="response" v-for="response in responses" :key="response.id"/>
  </div>
</div>
</template>

<script>
import ThreadPost from "./ThreadPost.vue"
import ThreadResponse from "./ThreadResponse.vue";
import ThreadResponseForm from "./ThreadResponseForm.vue";
export default {
  name: "ThreadComponent",
  components: {
    ThreadPost,
    ThreadResponse,
    ThreadResponseForm
  },
  props: {
    type: String,
    post: Object,
    responses: Array
  },
  emits: ['update-replies'],
  methods: {
    updateReplies(data) {
      this.$emit('update-replies', data)
    }
  }
}
</script>

<style scoped>
.thread-container {
  margin-block: 2rem;
  margin-inline: auto;
  padding: .6rem;
  max-width: min(100% - 4rem, 55rem);
  background-color: var(--clr-secondary-800-3);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.replies {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>