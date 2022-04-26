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

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
}
</script>
<script setup>
import useUsers from "./composables/user";
import TokenService from "./services/TokenService";
import UserService from "./services/UserService";
import useTheme from "./composables/theme";

async function setup() {
  try {
    const {setUser, decodeJWT} = useUsers()
    const token = TokenService.getAccessToken()
    if(token) {
      const {_id} = decodeJWT(token)?.user
      const checkUser = await UserService.getUser(_id)
      if(checkUser.status === 200) {
        setUser(checkUser.data)
        const { setTheme, HexToHSL, setPrimaryColor,
          setSecondaryColor, setAccentColor} = useTheme()
        const colors = checkUser?.data?.userPreferences?.themes?.profileTheme
        setTheme(colors)
        const primaryHSL = HexToHSL(colors?.primaryColor ?? '#e85e30')
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
  } catch(err) {
    console.log(err.message)
  }
}

setup()

</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
