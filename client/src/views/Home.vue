<template>
  <PostComponent v-if="isLoggedIn === true"/>
  <Login @toggle-form="toggleForm" v-if="hasAccount === true && isLoggedIn === false"/>
  <Register @toggle-form="toggleForm" v-if="hasAccount === false && isLoggedIn === false"/>
</template>

<script>
import PostComponent from "../components/PostComponent.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue";
import useUser from "../composables/user.js"

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
    }
  },
  created() {
    const {getIsLoggedIn} = useUser()
    this.isLoggedIn = getIsLoggedIn()
  },
  methods: {
    toggleForm(e) {
      this.hasAccount = e
    }
  }
}
</script>

<style scoped>

</style>