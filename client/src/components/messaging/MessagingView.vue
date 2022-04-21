<template>
<div class="view-container">
  <div v-if="selected?.message?.length > 0" class="reply">
    <div class="message">
      {{selected?.message}}
    </div>
  </div>
  <div v-else class="create">
      // user list
  </div>
  <div class="form">
    <MessagingForm :message="selected"/>
  </div>
</div>
</template>

<script>
import MessagingForm from "./MessagingForm.vue";
export default {
  name: "MessagingView",
  components: {
    MessagingForm,
  },
  props: {
    selected: {},
  }
}
</script>

<style scoped>
.view-container {
  padding: 1rem;
  height: 100%;
  display: grid;
}
.form {
  align-self: end;
}
</style>