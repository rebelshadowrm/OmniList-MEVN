<template>
<div class="reviews">
  <button @click.prevent="toggle = !toggle">Add Review</button>
  <ThreadForm class="form" v-if="toggle"/>
  <ThreadCollection type="review" :threads="threads"/>
</div>
</template>

<script>
import ThreadCollection from "../components/thread/ThreadCollection.vue";
import ThreadForm from "../components/thread/ThreadForm.vue";
export default {
  name: "Reviews",
  components: {
    ThreadCollection,
    ThreadForm
  },
  data() {
    return {
      threads: [],
      toggle: false
    }
  },
  created() {
    //TODO: fetch reviews
    this.threads = [
      {
        subject: "Some subject 1",
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
        subject: "Some subject 2",
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
.reviews {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
  margin-block: 2rem;
}
button {
  display: block;
  margin-inline: auto;
}
.form {
  padding: 2rem;
  max-width: min(100% - 2rem, 65ch);
  margin-inline: auto;
}
</style>