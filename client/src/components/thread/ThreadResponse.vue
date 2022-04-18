<template>
<div class="response">
  <p class="comment">{{response?.comment}}</p>
  <p class="username">
    <router-link :to="`/profile/${response?.userName}`">{{response.userName}}</router-link>
  </p>
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
  padding: 1em;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  border-radius: var(--radius);
}
.comment {
  font-size: var(--txt-med);
}
.username a {
  font-size: var(--txt-small);
  text-decoration: none;
  color: var(--clr-text)
}
</style>