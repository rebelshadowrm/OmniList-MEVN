<template>
  <Header />
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
  async beforeCreate() {
    try {
      const {setUser, decodeJWT} = useUsers()
      const token = TokenService.getAccessToken()
      if(token) {
        const res = decodeJWT(token)
        const {user} = res.user
        const checkUser = await UserService.getUser(user._id)
        if(checkUser.status === 200) {
          setUser(checkUser.data)
        }
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
