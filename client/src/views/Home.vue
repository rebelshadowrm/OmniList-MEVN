<template>
  <PostComponent v-if="isLoggedIn === true"/>
  <div class="forms">
    <Login @toggle-form="toggleForm" v-if="hasAccount === true && isLoggedIn === false"/>
    <Register @toggle-form="toggleForm" v-if="hasAccount === false && isLoggedIn === false"/>
  </div>
</template>

<script>
import PostComponent from "../components/PostComponent.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue";
import useUser from "../composables/user.js"
import UserService from "../UserService";

export default {
  name: "Home",
  components: {
    PostComponent,
    Login,
    Register
  },
  data() {
    return {
      isLoggedIn: false,
      hasAccount: false,
      users: []
    }
  },
  async created() {
    const {getIsLoggedIn} = useUser()
    this.isLoggedIn = getIsLoggedIn()
  },
  methods: {
    toggleForm(e) {
      this.hasAccount = e
    },
  }
}
</script>

<style scoped>
.forms {
  margin-block: auto;
}
</style>