<template>
<header>
  <nav id="nav">
    <img class="logo" src="../assets/logo.png" alt=""/>
    <div class="nav-items">
      <router-link  to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link :to="'/profile/'+user.user?.userName ?? ''">Profile</router-link>
    </div>
    <p v-if="isLoggedIn">{{user?.user?.userName ?? ''}}</p>
    <img class="user" v-if="isLoggedIn" :src="user.user?.img ?? 'https://picsum.photos/seed/user/50'"  alt=""/>
  </nav>
</header>
</template>

<script>
export default {
  name: "Header",
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
/*noinspection CssInvalidPropertyValue*/
nav {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content 1fr max-content;
  grid-template-areas:'logo nav user';
  max-width: 100vw;
  padding: .75rem;
  gap: 1.25em;
  overflow-x: auto;
  width: 100%;
}
.nav-items {
  grid-area: nav;
  display: flex;
  flex-direction: row;
  gap: 1.25em;
  justify-self: center;
}
a {
  place-self: center;
  position: relative;
  display: block;
  color: var(--clr-text);
  font-size: var(--txt-lrg);
  font-weight: 200;
  font-family: var(--ff-mono);
  text-decoration: none;
  text-transform: uppercase;
}
a.active {
  font-weight: 500;
}
a::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  background: var(--clr-text);
  height: 2px;
  transform: scaleX(0%);
  transition: transform ease .5s;
}
a:hover::after {
  transform: scaleX(100%);
}
.logo {
  grid-area: logo;
  aspect-ratio: 1;
  height: 50px;
}
.user {
  grid-area: user;
  aspect-ratio: 1;
  height: 50px;
  border: 1px inset hsl(var(--clr-white-200) / .5);
  border-radius: 10px;
}
</style>