<template>
<form @submit.prevent="onSubmit">
  <h1>Register</h1>
  <span v-if="errorMsg.length > 0" class="error">{{errorMsg}}</span>
  <div class="input">
    <label for="email">email</label>
    <input id="email" name="email" v-model="email" type="text">
  </div>
  <input id="extraToggle" name="extraToggle" v-model="extraToggle" type="checkbox">
  <label class="extra-details" for="extraToggle">Extra details...</label>
  <div class="extra">
    <div class="input">
      <label for="username">username</label>
      <input id="username" name="username" v-model="username" type="text">
    </div>
    <div class="input">
      <label for="firstName">first</label>
      <input id="firstName" name="firstName" v-model="firstName" type="text">
    </div>
    <div class="input">
      <label for="lastName">last</label>
      <input id="lastName" name="lastName" v-model="lastName" type="text">
    </div>
  </div>
  <div class="input">
    <label for="password">password</label>
    <input id="password" name="password" v-model="password" type="text">
  </div>
  <div class="input">
    <label for="repeatPassword">repeat password</label>
    <input id="repeatPassword" name="repeatPassword" v-model="repeatPassword" type="text">
  </div>
  <input type="submit" value="register">
  <div class="toggle">
    <p>Have an account?</p><button @click="hasAccount">Login</button>
  </div>
</form>
</template>

<script>
import UserService from "../UserService";

export default {
  name: "Register",
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      username: '',
      firstName: '',
      lastName: '',
      extraToggle: false,
      errorMsg: '',
    }
  },
  methods: {
    async onSubmit(e) {
      this.errorMsg = ''
      if( this.email.trim() !== '' &&
          this.password.trim() !== '' &&
          this.repeatPassword.trim() !== ''
      ) {
        if(this.password.trim() === this.repeatPassword.trim()) {
          await this.createUser(e)
        } else {
          this.errorMsg = "Passwords don't match"
        }
      } else {
        this.errorMsg = "Email and Password are required!"
      }
    },
    async createUser(e) {
      const {email, password, username, firstName, lastName} = Object.fromEntries(new FormData(e.target))
      const data = {
        username,
        password,
        firstName,
        lastName,
        email
      }
      const res = await UserService.registerUser(data)
      if(res.status === 201) {
        this.email = ''
        this.password = ''
        this.repeatPassword = ''
        this.username = ''
        this.firstName = ''
        this.lastName = ''
        this.errorMsg = ''
      } else if(res.status === 422) {
        this.errorMsg = "Email already in use"
      } else {
        this.errorMsg = "Something went wrong, try again later"
      }
    },
    hasAccount() {
      this.$emit('toggle-form', true)
    }
  }
}
</script>

<style scoped>
form {
  background: var(--clr-secondary-600-5);
  color: var(--clr-primary-400);
  max-width: calc(100% - 6rem);
  width: 100%;
  margin: 0 auto;
  padding: 2em;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius);
  gap: .75rem;
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
  background: var(--clr-secondary-600-7);
  border-color: var(--clr-border);
  color: var(--clr-primary-400);
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
.extra {
  display: none;
  flex-direction: column;
  gap: .5em;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--clr-secondary-400-3);
  color: var(--clr-primary-400);
}
input[type=checkbox] {
  display: none;
}
.extra-details {
  display: inline-block;
  font-size: var(--txt-med);
  padding: .25em;
  user-select: none;
  cursor: pointer;
}
#extraToggle:checked ~ .extra-details {
  color: var(--clr-accent-200);
}
#extraToggle:checked ~ .extra {
  display: flex;

}

</style>