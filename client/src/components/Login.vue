<template>
  <form @submit.prevent="login">
    <h1>Login</h1>
    <span v-if="errorMsg.length > 0" class="error">{{errorMsg}}</span>
    <div class="input">
      <label for="email">email</label>
      <input id="email" v-model="email" type="text">
    </div>
    <div class="input">
      <label for="password">password</label>
      <input id="password" v-model="password" type="password">
    </div>
    <input type="submit" value="login">
    <div class="toggle">
      <p>Don't have an account?</p><button @click="hasAccount">Register</button>
    </div>
  </form>
</template>

<script>
import UserService from "../services/UserService.js"
import TokenService from "../services/TokenService.js"
import useUsers from "../composables/user.js"
import useTheme from "../composables/theme"

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      errorMsg: ''
    }
  },
  methods: {
    async login() {
      try {
        const {setUser, decodeJWT} = useUsers()
        if (this.email.trim() !== '' && this.password.trim() !== '') {
          const data = {
            "email": this.email,
            "password": this.password
          }
          const res = await UserService.loginUser(data)
          if (res.status === 200) {
            const {accessToken, refreshToken} = res?.data
            const user = decodeJWT(accessToken)?.user
            if(user.status === 'SUSPENDED') {
              return this.errorMsg = "This account has been suspended"
            }
            TokenService.setAccessToken(accessToken)
            TokenService.setRefreshToken(refreshToken)
            const response = await UserService.getUser(user?._id)
            if(response.status === 200) {
              const user = response.data
              setUser(user)
              this.themeSetup(user)
              this.email = ''
              this.password = ''
            }
          } else {
            this.errorMsg = "Invalid login"
          }
        } else {
          this.errorMsg = "Email and Password and required fields"
        }
      } catch(err) {
        console.log(err)
      }
    },
    hasAccount() {
      this.$emit('toggle-form', false)
    },
    themeSetup(user) {
      const { setTheme, HexToHSL, setPrimaryColor,
              setSecondaryColor, setAccentColor} = useTheme()
      const colors = user?.userPreferences?.themes?.profileTheme
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
}
</script>

<style scoped>
form {
  background: var(--clr-secondary-800-5);
  color: var(--clr-text);
  max-width: calc(100% - 6rem);
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  margin-block: 1rem;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--clr-border);
  border-radius: 10px;
  gap: .5rem;
}
h1 {
  font-size: var(--txt-lrg);
  color: var(--clr-primary-200);
}
.input > *{
  display: block;
  width: 100%;
}
.toggle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  place-items: center;
}
input[type=submit],
.toggle button{
  cursor: pointer;
  font-weight: 600;
  padding: .5em 1em;
  max-width: max-content;
  border-color: var(--clr-border);
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
}
.toggle button {
  padding: .15em .5em;
}
input[type=submit] {
  margin-top: .35rem;
}
.input {
  display: flex;
  gap: .25rem;
  flex-direction: column;
}
label {
  margin-left: .5rem;
  font-weight: 600;
}
label,
input,
button {
  font-size: var(--txt-med);
  border-radius: var(--radius-input);
}
label,
input[type=submit],
button {
  text-transform: capitalize;
}
p {
  font-size: var(--txt-med);
}
input[type=text],
input[type=email],
input[type=password] {
  background: var(--clr-bg);
  color: var(--clr-text);
  padding: .25em .5em;
  border-color: var(--clr-border);
}
@media screen and (min-width: 50rem) {
  form {
    max-width: 65ch;
  }
}

</style>