<template>
<div :style="cssProps">
  <div class="hero" >
    <div class="user" >
      <img :src="img" :alt="imgAlt">
      <h1>{{username}}</h1>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: "ProfileHeader",
  props: {
    username: String,
    img: String,
    imgAlt: String,
    backgroundImage: String,
  },
  computed: {
    cssProps() {
      return {
        '--bgImg': 'url('+(this.backgroundImage)+')'
      }
    }
  }
}
</script>

<style scoped>
.hero {
  display: grid;
  background-color: var(--clr-bg);
  background-image: var(--bgImg);
  background-blend-mode: screen;
  min-height: 28vh;
}
.user {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-self: end;
  justify-self: start;
  padding-inline: 2rem;
}
h1 {
  align-self: end;
}
img {
  margin-top: auto;
  aspect-ratio: 13/14;
  max-height: 18vh;
  border: 1px inset hsl(var(--clr-white-200) / .7);
  border-radius: var(--radius);
}

</style>