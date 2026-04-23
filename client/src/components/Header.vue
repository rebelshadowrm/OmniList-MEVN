<template>
<header>
  <nav id="nav">
    <router-link class="logo-link" to="/">
      <img class="logo" src="../assets/logo.png" alt="omni list logo"/>
      <span>mni</span><span class="list l">L</span><span class="list">ist</span>
    </router-link>

    <div class="nav-items">
      <router-link to="/">Home</router-link>
      <router-link v-if="user?.user?.role === 'ADMIN' || user?.user?.role === 'MOD'" to="/admin">Admin</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/anime">Anime</router-link>
      <router-link to="/manga">Manga</router-link>
      <router-link to="/movies">Movies</router-link>
      <router-link to="/tv">TV</router-link>
      <router-link v-if="isLoggedIn" to="/discussions">Discussions</router-link>
      <router-link v-if="isLoggedIn" to="/reviews">Reviews</router-link>
    </div>
    <router-link class="login-link" v-if="!isLoggedIn" to="/login">Login / Register</router-link>
    <div v-if="isLoggedIn" @click.prevent="toggle" class="dropdown">
      <div class="dropdown-title">
        <img class="user"
             v-if="isLoggedIn"
             :src="imageSrc(user?.user?.img, 'avatar', user?.user?.userName)"
             :alt="user?.user?.userName"
             @error="setFallbackImage($event, 'avatar', user?.user?.userName)"/>
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
import TokenService from "../services/TokenService";
import router from "../router";
import setLogin from "../composables/user";
import useTheme from "../composables/theme"
import {imageOrFallback, useFallbackImage} from "../utils/fallbackImages";
export default {
  name: "Header",
  data() {
    return {
      dropdown: false,
    }
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
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
        const {clearThemes} = useTheme()
        clearThemes()
        await router.push('/')
      } else {
        alert('Something went wrong logging you out, please try again later.')
      }
    },
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
  padding: .25rem .75rem .75rem .75rem;
  gap: 1.25em;
  overflow-x: auto;
  overflow-y: clip;
  width: 100%;
  background-color: var(--clr-secondary-800-5);
}
@media (width <= 820px) {
  nav {
    padding: .15rem;
    grid-template-columns: 1fr max-content;
    grid-template-areas: 'logo user'
                          'nav nav';
  }

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
  font-weight: 300;
  font-family: var(--ff-mono);
  text-decoration: none;
  text-transform: uppercase;
}
.nav-items a.active {
  color: var(--clr-accent-400);
  font-weight: 600;
}
.nav-items a::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  background: var(--clr-accent-400);
  height: 2px;
  border-radius: var(--radius-sm);
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
  font-size: var(--txt-lrg);
  align-self: end;
  color: var(--clr-primary-400);
  font-weight: 700;
  letter-spacing: 1px;
  margin-left: -.45rem;
}
.logo {
  grid-area: logo;
  aspect-ratio: 1;
  height: 60px;
  margin: -.15rem -.15rem -.57rem -.2rem;
}
.user {
  grid-area: user;
  aspect-ratio: 1;
  height: 36px;
  border: 1px inset var(--clr-border);
  border-radius: var(--radius);
}
.username {
  place-self: end;
  font-weight: 500;
}
.login-link {
  grid-area: user;
  text-decoration: none;
  color: var(--clr-text);
  font-weight: 600;
  font-size: var(--txt-small);
  align-self: center;
  letter-spacing: 1px;
  padding: 0 .15rem;
}
span.list {
  color: var(--clr-accent-400);
}
span.l {
  margin: 0 -.5rem -1.4rem .15rem;
  font-size: var(--txt-xlrg);
}
</style>
