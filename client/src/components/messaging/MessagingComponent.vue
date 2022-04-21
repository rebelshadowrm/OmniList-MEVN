<template>
  <div class="main">
    <aside>
      <div class="messages">
        <MessagingItem @selected-message="selected" :message="message" v-for="message in messages" :key="message.id" />
      </div>
      <button @click.prevent="this.selectedMessage = {}" class="create-button">Create Message</button>
    </aside>
    <div class="view">
      <MessagingView :selected="selectedMessage"/>
    </div>
  </div>
</template>

<script>
import MessagingItem from "./MessagingItem.vue";
import MessagingView from "./MessagingView.vue";
export default {
  name: "MessagingComponent",
  components: {
    MessagingView,
    MessagingItem
  },
  data() {
    return {
      messages: [],
      selectedMessage: {}
    }
  },
  async created() {
    //TODO: write fetch
    this.messages = [
      {
        receiver: 'test man',
        sender: "test user",
        message: "test message 1"
      },
      {
        receiver: 'test man',
        sender: "test user",
        message: "test message 2"
      },
      {
        receiver: 'test man',
        sender: "test user",
        message: "test message 3"
      }
    ]
  },
  methods: {
    selected(data) {
      this.selectedMessage = data
    }
  }
}
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-areas: 'aside view';
  height: 100%;
  width: 100%;
}
aside {
  grid-area: aside;
  display: grid;
  padding: .3rem;
  border-style: solid;
  border-width: 1px;
  border-color: var(--clr-border);
}
.view {
  grid-area: view;
  border: 1px solid var(--clr-border);
  border-left: none;
}
.create-button {
  align-self: end;
}
</style>