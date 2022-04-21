<template>
<section class="container">
  <header>
    <h1>{{user?.user?.userName}}'s Inbox</h1>
  </header>
  <MessagingComponent />
</section>
</template>

<script>
import MessagingComponent from "../components/messaging/MessagingComponent.vue";
import useUsers from "../composables/user"
export default {
  name: "Inbox",
  components: {
    MessagingComponent
  },
  data() {
    return {
      user: {}
    }
  },
  created() {
    const {getUser} = useUsers()
    this.user = getUser()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: min(100% - 4rem, 60rem);
  height: 100%;
  margin-inline: auto;
  margin-block: 2rem;
}
h1 {
  text-align: center;
}
header {
  padding-bottom: 1rem;
}
</style>