<template>
<div class="post">
  <h1>{{post?.subject}}</h1>
  <p class="title">{{post?.title}}:
    <router-link :to="`/profile/${post?.author}`">{{post?.author}}</router-link></p>
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
  padding: 1em;
  background-color: var(--clr-bg);
  border-radius: var(--radius);
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
}
h1 {
  font-weight: 600;
  font-size: var(--txt-lrg);
}
.title {
  font-size: var(--txt-small);
  font-weight: 500;
  margin-bottom: .75em;
}
.body {
  font-size: var(--txt-med);
}
a {
  color: var(--clr-text);
  font-weight: 300;
  text-decoration: none;
}
</style>