<template>
<div class="post">
  <h1 class="title">{{post?.title}}</h1>
  <p class="subject">{{post?.subject}}</p>
  <router-link :to="`/profile/${post?.author}`">by: {{post?.author}}</router-link>
  <p class="body">{{post?.body}}</p>

</div>
</template>

<script>
export default {
  name: "ThreadPost",
  props: {
    post: Object
  }
}
</script>

<style scoped>
.post {
  padding: 1em 2em;
  background-color: var(--clr-bg);
  border-radius: var(--radius);
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
}
.title {
  font-weight: 500;
  font-size: var(--txt-med);
}
.subject {
  font-weight: 700;
  font-size: var(--txt-small);
}
.body {
  font-size: var(--txt-small);
  margin-block: 1em;
}
a {
  display: block;
  color: var(--clr-text);
  font-weight: 300;
  text-decoration: none;
  font-size: var(--txt-small);
  max-width: fit-content;
}
</style>