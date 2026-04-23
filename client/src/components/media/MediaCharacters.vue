<template>
<h2>characters</h2>
  <div class="character-cards">
    <div class="character-card"
         v-for="character in characterSlice"
         :key="character?.node?.id ?? character?.node?.name?.userPreferred">
      <img class="image"
           :src="imageSrc(character?.node?.image?.medium, 'avatar', character?.node?.name?.userPreferred)"
           :alt="character?.node?.name?.userPreferred"
           @error="setFallbackImage($event, 'avatar', character?.node?.name?.userPreferred)">
      <h3 class="title">{{character?.node?.name?.userPreferred}}</h3>
      <p class="role">{{character?.role}}</p>
    </div>
  </div>
</template>

<script>
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";

export default {
  name: "MediaCharacters",
  props: {
    section: String,
    characters: Array,
  },
  data() {
    return {
      limit: 6
    }
  },
  computed: {
    characterSlice() {
      return this?.limit ? this?.characters?.slice(0, this?.limit) : this?.characters
    }
  },
  created() {
    if (this && this?.section === 'characters') this.limit = null
    if (this && this?.section === 'overview') this.limit = 6
  },
  updated() {
    if (this && this?.section === 'characters') this.limit = null
    if (this && this?.section === 'overview') this.limit = 6
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
  }
}
</script>

<style scoped>
.character-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 75rem;
}
.character-card {
  flex: 1 1 30%;
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-items: end;
  grid-template-areas:
      'img title'
      'img role';
  gap: 1rem;
  padding: 1rem;
  background-color: var(--clr-secondary-800-5);
  border-radius: var(--radius);
  min-width: 25ch;
}
.character-card .image {
  grid-area: img;
  aspect-ratio: 1 / 1.5;
  max-height: 100px;
  border-radius: var(--radius);
}
.character-card .title {
  grid-area: title;
}
.character-card .role {
  grid-area: role;
}
</style>
