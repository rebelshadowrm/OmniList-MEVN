<template>
<header>
  <img alt="Vue logo" src="../assets/logo.png" />
  <nav id="nav">
    <router-link  to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </nav>
</header>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
header {
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
}
/*noinspection CssInvalidPropertyValue*/
nav {
  display: flex;
  flex-direction: row;
  padding: .75rem;
  gap: 1.25em;
  overflow-x: auto;
  max-width: calc(100vw - 2rem);
  height: 7vh;
}


a {
  display: block;
  text-decoration: none;
  text-transform: uppercase;
  position: relative;
  transition: transform ease .5s;
  color: var(--clr-text);
  font-size: var(--txt-lrg);
  font-weight: 200;
  font-family: var(--ff-mono);
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
</style>