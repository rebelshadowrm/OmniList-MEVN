<template>
<div class="thread-container">
  <ThreadPost :post="post" />
  <div class="replies">
    <ThreadResponse :response="response" v-for="response in responses" :key="response.id"/>
  </div>
</div>
</template>

<script>
import ThreadPost from "./ThreadPost.vue"
import ThreadResponse from "./ThreadResponse.vue";
export default {
  name: "ThreadComponent",
  components: {
    ThreadPost,
    ThreadResponse
  },
  props: {
    post: Object,
    responses: Array
  },
}
</script>

<style scoped>
.thread-container {
  margin-block: 2rem;
  margin-inline: auto;
  padding: .6rem;
  width: fit-content;
  max-width: calc(100% - 4rem);
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