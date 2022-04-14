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
    post: {},
    responses: []
  },
}
</script>

<style scoped>

</style>