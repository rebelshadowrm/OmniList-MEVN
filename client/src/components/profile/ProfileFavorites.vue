<template>
<div class="favorites">
  <div class="favorite-section">
    <div class="header">
      <h2>Anime</h2>
      <button class="reorder" v-if="favorites?.anime !== undefined && favorites?.anime.length > 0">Reorder</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.anime !== undefined && favorites?.anime.length > 0"
           v-for="anime in favorites.anime" :key="anime.id" class="favorite">
        <img :src="anime.img" :alt="anime.alt">
      </div>
      <p v-else >No favorites yet...</p>
    </div>
  </div>
  <div class="favorite-section">
    <div class="header">
      <h2>Characters</h2>
      <button class="reorder" v-if="favorites?.characters !== undefined && favorites?.characters.length > 0">Reorder</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.characters !== undefined && favorites?.characters.length > 0"
           v-for="character in favorites.characters" :key="character.id" class="favorite">
        <img :src="character.img" :alt="character.alt">
      </div>
      <p v-else >No favorites yet...</p>
    </div>
  </div>
  <div class="favorite-section">
    <div class="header">
      <h2>Staff</h2>
      <button v-if="favorites?.staff !== undefined && favorites?.staff.length > 0" class="reorder">Reorder</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.staff !== undefined && favorites?.staff.length > 0"
           v-for="staff in favorites.staff" :key="staff.id" class="favorite">
        <img :src="staff.img" :alt="staff.alt">
      </div>
      <p v-else>No favorites yet...</p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "ProfileFavorites",
  data() {
    return {
      favorites: []
    }
  },
  created() {
    //TODO: fetch favorites
    this.favorites = {
      anime: [
        {
          title: 'anime title',
          img: `https://picsum.photos/seed/anime/50`,
          imgAlt: 'anime picture'
        }
      ],
      characters: [
        {
          name: 'character name',
          img: `https://picsum.photos/seed/character/50`,
          imgAlt: 'character picture'
        }
      ],
      staff: [
        {
          name: 'staff name',
          img: `https://picsum.photos/seed/staff/50`,
          imgAlt: 'staff picture'
        }
      ],
    }
  }
}
</script>

<style scoped>
.favorites {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.favorite-section {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.header {
  display: flex;
  justify-content: space-between;
}
.favorite-collection {
  padding: 1rem;
  background-color: var(--clr-secondary-800-3);
  border-radius: 10px;
}
h2 {
  font-size: var(--txt-med);
  font-weight: 500;
}
</style>