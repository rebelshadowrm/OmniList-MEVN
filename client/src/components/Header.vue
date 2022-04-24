<template>
<header>
  <nav id="nav">
    <router-link class="logo-link" to="/">
      <img class="logo" src="../assets/logo.png" alt="omni list logo"/>
      <span>OmniList</span>
    </router-link>

    <div class="nav-items">
      <router-link  to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/anime">Anime</router-link>
      <router-link to="/discussions">Discussions</router-link>
      <router-link to="/reviews">Reviews</router-link>
    </div>
    <div v-if="isLoggedIn" @click.prevent="toggle" class="dropdown">
      <div class="dropdown-title">
        <img class="user" v-if="isLoggedIn" :src="user?.user?.img ?? `https://picsum.photos/seed/${user?.user?.userName}/50`"  alt=""/>
        <p class="username" v-if="isLoggedIn">{{user?.user?.userName ?? ''}}</p>
      </div>
      <div v-if="dropdown" class="dropdown-items-nav">
        <router-link :to="'/profile/'+user?.user?.userName ?? ''">Profile</router-link>
        <router-link to="/inbox">inbox</router-link>
        <router-link to="/settings">settings</router-link>
        <a @click.prevent="logout" href="javascript:void(0)">logout</a>
      </div>
    </div>
  </nav>
</header>
</template>

<script>
import TokenService from "../TokenService";
import router from "../router";
import setLogin from "../composables/user";
export default {
  name: "Header",
  data() {
    return {
      dropdown: false,
    }
  },
  methods: {
    toggle(e) {
      this.dropdown = !this.dropdown
    },
    async logout(e) {
      const refreshToken = TokenService.getRefreshToken()
      const res =await fetch("/api/logout",{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          refreshToken
        })
      })
      if(res.status === 204) {
        const {setIsLoggedIn} = setLogin()
        setIsLoggedIn(false)
        TokenService.clearTokens()
        await router.push('/')
      } else {
        alert('Something went wrong logging you out, please try again later.')
      }
    }
  }
}
</script>
<script setup>
import useUser from "../composables/user";
const {getIsLoggedIn, getUser} = useUser()
const isLoggedIn = getIsLoggedIn()
const user = getUser()
</script>

<style scoped>
header {
  display: grid;
  position: relative;
  z-index: 1;
}
nav {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content 1fr max-content;
  grid-template-areas:'logo nav user';
  max-width: 100vw;
  padding: .75rem;
  gap: 1.25em;
  overflow-x: auto;
  overflow-y: clip;
  width: 100%;
  background-color: var(--clr-secondary-800-3);
}
.nav-items {
  grid-area: nav;
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-self: center;
  align-self: end;
}
.nav-items a {
  position: relative;
  display: inline-block;
  color: var(--clr-text);
  font-size: var(--txt-med);
  font-weight: 200;
  font-family: var(--ff-mono);
  text-decoration: none;
  text-transform: uppercase;
}
.nav-items a.active {
  font-weight: 500;
}
.nav-items a::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  background: var(--clr-text);
  height: 2px;
  border-radius: 5px;
  visibility: hidden;
  transform: scaleX(0);
  transition: transform ease .5s;
}
.nav-items a:hover::after {
  visibility: visible;
  transform: scaleX(1);
}
.logo-link {
  display: flex;
  text-decoration: none;
  place-items: end;
}
.logo-link span {
  font-size: var(--txt-med);
  align-self: end;
  text-transform: initial;
  color: hsl(204deg 80% 55%);
  font-weight: 600;
  letter-spacing: 1px;
  margin-left: -.3rem;
}
.logo {
  grid-area: logo;
  aspect-ratio: 1;
  height: 50px;
}
.user {
  grid-area: user;
  aspect-ratio: 1;
  height: 36px;
  border: 1px inset hsl(var(--clr-white-200) / .5);
  border-radius: 10px;
}
.username {
  place-self: end;
  font-weight: 500;
}
</style>