<template>
<div @click="selected" class="message-item">
  <p class="message">{{message.message}}</p>
</div>
</template>

<script>
export default {
  name: "MessagingItem",
  props: {
    message: {},
  },
  emits: ['selected-message'],
  methods: {
    selected() {
      this.$emit('selected-message', this.message)
    }
  }
}
</script>

<style scoped>
.message-item {
  padding: .5rem;
  width: 20ch;
  max-width: 20ch;
}
.message-item:hover {
  background-color: var(--clr-secondary-400-3);
  cursor: pointer;
}
</style>