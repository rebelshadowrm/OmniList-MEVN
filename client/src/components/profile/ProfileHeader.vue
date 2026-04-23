<template>
<div>
  <div class="hero" :style="heroStyle">
    <div class="user" >
      <img :src="imageSrc(img, 'avatar', username)"
           :alt="imgAlt"
           @error="setFallbackImage($event, 'avatar', username)">
      <h1>{{username}}</h1>
    </div>
  </div>

</div>
</template>

<script>
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";

export default {
  name: "ProfileHeader",
  props: {
    username: String,
    img: String,
    imgAlt: String,
    backgroundImage: String,
  },
  computed: {
    heroStyle() {
      const background = imageOrFallback(this.backgroundImage, 'banner', this.username)

      return {
        '--bgImg': `url("${background}")`
      }
    },
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
  },
}
</script>

<style scoped>
.hero {
  --bgImg: initial;
  display: grid;
  background-color: var(--clr-bg);
  background-image: var(--bgImg);
  background-position: center 40%;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: screen;
  min-height: 28vh;
  overflow: hidden;
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
  filter: drop-shadow(2px 2px 1px hsl(var(--clr-black) / var(--opacity-7)));
}
img {
  margin-top: auto;
  aspect-ratio: 13/14;
  max-height: 18vh;
  border: 1px inset var(--clr-border);
  border-radius: var(--radius);
}

</style>
