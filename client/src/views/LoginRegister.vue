<template>
  <div class="forms">
    <Login @toggle-form="toggleForm" v-if="hasAccount === true && isLoggedIn === false"/>
    <Register @toggle-form="toggleForm" v-if="hasAccount === false && isLoggedIn === false"/>
  </div>
</template>

<script>
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import useUser from "../composables/user";
export default {
  name: "LoginRegister",
  components: {
    Login,
    Register
  },
  data() {
    return {
      loggedInState: null,
      hasAccount: false,
    }
  },
  async created() {
    const {getIsLoggedIn} = useUser()
    this.loggedInState = getIsLoggedIn()
  },
  computed: {
    isLoggedIn() {
      return !!(this.loggedInState?.value ?? this.loggedInState)
    }
  },
  async updated() {
    if(this.isLoggedIn === true) await this.$router.push({name: 'Home'})
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
  padding: 2rem;
  margin-block: auto;
}
</style>
