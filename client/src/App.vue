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
import useTheme from './composables/theme.js'
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
        const {_id} = decodeJWT(token).user
        const checkUser = await UserService.getUser(_id)
        if(checkUser.status === 200) {
          console.log(checkUser.data)
          setUser(checkUser.data)
        }
      }
    } catch(err) {
      console.log(err.message)
    }
  },
  async created() {
    const {getLocalColors, HexToHSL,
          setPrimaryColor, setSecondaryColor,
          setAccentColor} = useTheme()
    const colors = getLocalColors()
    const primaryHSL = HexToHSL(colors?.primaryColor ?? '#ff0000')
    setPrimaryColor(primaryHSL)
    if(colors?.secondaryColor) {
      const secondaryHSL = HexToHSL(colors.secondaryColor)
      setSecondaryColor(secondaryHSL)
    }
    if(colors?.accentColor) {
      const accentHSL = HexToHSL(colors.accentColor)
      setAccentColor(accentHSL)
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
