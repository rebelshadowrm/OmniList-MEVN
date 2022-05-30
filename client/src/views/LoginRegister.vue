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
import router from "../router";
export default {
  name: "LoginRegister",
  components: {
    Login,
    Register
  },
  data() {
    return {
      isLoggedIn: false,
      hasAccount: false,
    }
  },
  async created() {
    const {getIsLoggedIn} = useUser()
    this.isLoggedIn = getIsLoggedIn()
  },
  async updated() {
    if(this.isLoggedIn === true) await router.push('Home')
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