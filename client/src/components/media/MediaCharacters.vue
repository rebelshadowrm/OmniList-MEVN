<template>
<h2>characters</h2>
  <div class="character-cards">
    <div class="character-card" v-for="character in characterSlice">
      <img class="image" :src="character?.node?.image?.medium" alt="">
      <h3 class="title">{{character?.node?.name?.userPreferred}}</h3>
      <p class="role">{{character?.role}}</p>
    </div>
  </div>
</template>

<script>
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
  grid-template-areas:
      'img title'
      'img role';
  gap: 1rem;
  padding: 1rem;
  background-color: var(--clr-secondary-800-3);
  border-radius: 10px;
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