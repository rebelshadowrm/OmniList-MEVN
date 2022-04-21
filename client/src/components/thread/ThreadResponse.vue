<template>
<div class="response">
  <p class="username">
    <router-link :to="`/profile/${response?.comment?.user?.userName}`">{{response?.comment?.user?.userName}}</router-link>
  </p>
  <p class="comment">{{response?.comment?.comment}}</p>
</div>
</template>

<script>
export default {
  name: "ThreadResponse",
  props: {
    response: {}
  }
}
</script>

<style scoped>
.response {
  background-color: var(--clr-bg);
  margin-inline: 1rem;
  padding: 1em 2em;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  border-radius: var(--radius);
}
.comment {
  font-size: var(--txt-med);
}
.username a {
  display: block;
  font-size: var(--txt-small);
  text-decoration: none;
  color: var(--clr-text);
  max-width: fit-content;
}
</style>