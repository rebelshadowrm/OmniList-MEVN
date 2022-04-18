<template>
<div>
  <ThreadComponent :post="post" :responses="responses"/>

</div>
</template>

<script>
import ThreadComponent from "../components/thread/ThreadComponent.vue";
export default {
  name: "Discussion",
  components: {ThreadComponent},
  props: {
    id: [Number, String],
  },
  data() {
    return {
      post: Object,
      responses: Array
    }
  },
  created() {
    //TODO: fetch thread
    const thread = {
          subject: "Some subject 3",
          id: 12345,
          title: "Review Title",
          author: 'Mr.Joe Blow',
          body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur necessitatibus quibusdam repellendus voluptatum. Aut cum doloremque dolorum eveniet ipsum non perferendis saepe tempore veniam voluptatum? Ducimus eaque eligendi, error et hic id natus nulla repellat sit temporibus! Nemo, officiis, quas.",
          comments: [
            {
              userId: "0123",
              userName: "username",
              comment: "I agree with your review"
            },
            {
              userId: "0124",
              userName: "username2",
              comment: "I disagree with your review"
            }
          ]
        }
    this.post = {
      subject: thread.subject,
      id: thread.id,
      title: thread.title,
      author: thread.author,
      body: thread.body
    }
    this.responses = thread.comments
  }
}
</script>

<style scoped>

</style>