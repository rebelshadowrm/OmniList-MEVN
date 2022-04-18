<template>
<div class="discussions">
  <ThreadCollection type="discussion" :threads="threads"/>
</div>
</template>

<script>
import ThreadCollection from "../components/thread/ThreadCollection.vue";
export default {
  name: "Discussions",
  components: {ThreadCollection},
  data() {
    return {
      threads: []
    }
  },
  created() {
    //TODO: fetch discussions
    this.threads = [
      {
        subject: "Some subject 3",
        id: 12345,
        title: "Review Title",
        author: 'Mr.Joe Blow',
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
      },
      {
        subject: "Some subject 4",
        id: 12345,
        title: "Review Title",
        author: 'Mr.Joe Blow',
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
      },
      {
        subject: "Some subject 5",
        id: 12345,
        title: "Review Title",
        author: 'Mr.Joe Blow',
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
    ]
  },
}
</script>

<style scoped>

</style>