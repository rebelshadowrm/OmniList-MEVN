<template>
  <div class="threads-container">
    <div  v-if="threads.length > 0"
         v-for="thread in threads"
         :key="thread?.id" class="thread-card">
        <router-link :to="`/${type}/${thread?._id}`">
          <div class="thread-info">
            <p class="title">{{thread?.title}}</p>
            <p class="subject">{{thread?.subject}}</p>
            <p class="comments">comments: {{thread?.comments?.length}}</p>
            <p class="author">{{thread?.user?.userName}}</p>
          </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThreadCollection",
  props: {
    type: String,
    threads: Array,
  },
}
</script>

<style scoped>
.threads-container {
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 2rem;
  gap: 1.35rem;
}
a {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: var(--clr-text);
}
.thread-card {
  border-style: solid;
  border-radius: var(--radius);
  border-width: 1px;
  border-color: var(--clr-border);
  background-color: var(--clr-accent-800-3);
  width: 100%;
}
.thread-info {
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-template-areas:
    'title comments'
    'subject author';
  gap: 1rem;
}
.thread-info .title {
  grid-area: title;
  font-size: var(--txt-med);
}
.thread-info .comments {
  grid-area: comments;
  font-size: var(--txt-small);
}
.thread-info .subject {
  grid-area: subject;
  font-size: var(--txt-small);
}
.thread-info .author {
  grid-area: author;
  font-size: var(--txt-small);
}

@media only screen and (max-width: 600px) {
  .thread-info {
    grid-template-columns: 1fr;
    grid-template-areas:
      'title title'
      'subject subject'
      'author comments';
  }
}
</style>