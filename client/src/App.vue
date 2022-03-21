<template>
  <Header :username="result.user?.username === undefined ? result.user?.email : result.user?.username" />
  <main>
    <router-view/>
  </main>
  <Footer />
</template>
<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import useUsers from './composables/user.js'
import TokenService from "./TokenService";
import UserService from "./UserService";

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      result: ''
    }
  },
  async created() {
    try {
      const {setUser, decodeJWT, getUser} = useUsers()
      const token = TokenService.getAccessToken()
      const {user} = decodeJWT(token).user
      const checkUser = await UserService.getUser(user._id)
      if(checkUser.status === 200) {
        setUser(checkUser.data)
        this.result = getUser()
      }
    } catch(err) {
      console.log(err.message)
    }
  }
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
