<template>
<div class="favorites">
  <div class="favorite-section">
    <div class="header">
      <h2>Anime</h2>
      <button @click.prevent="addFavoriteAnime" class="add">Add</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.anime?.length > 0"
           v-for="{anime} in favorites.anime" :key="anime.id" class="favorite">
        <router-link :to="`/anime/${anime?.id}`">
          <img :src="anime?.coverImage?.large" :alt="anime?.title?.english ?? anime?.title?.romaji ?? anime?.title?.native">
        </router-link>
      </div>
      <p v-else >No favorites yet...</p>
    </div>
  </div>
  <div class="favorite-section">
    <div class="header">
      <h2>Characters</h2>
      <button @click.prevent="addFavoriteCharacter" class="add">Add</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.characters?.length > 0"
           v-for="character in favorites.characters" :key="character.id" class="favorite">
        <img :src="character.img" :alt="character.alt">
      </div>
      <p v-else >No favorites yet...</p>
    </div>
  </div>
  <div class="favorite-section">
    <div class="header">
      <h2>Staff</h2>
      <button @click.prevent="addFavoriteStaff" class="add">Add</button>
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
import UserService from "../../services/UserService";

export default {
  name: "ProfileFavorites",
  data() {
    return {
      favorites: []
    }
  },
  async created() {
    const username = this?.$route?.params?.username
    if(username) {
      const res = await UserService.getUserByUsername(username)
      if(res.status === 200) {
        const {favorites} = res.data.userProfile
        this.favorites = {
          anime: favorites.animeFavorites,
          characters: favorites.characterFavorites,
          staff: favorites.staffFavorites
        }
      }
    }
  },
  methods: {
    addFavoriteAnime(e) {

    },
    addFavoriteCharacter(e) {

    },
    addFavoriteStaff(e) {

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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
h2 {
  font-size: var(--txt-med);
  font-weight: 500;
}
img {
  max-width: 50px;
  aspect-ratio: 1 / 1.5;
}

button {
  border: 1px solid var(--clr-border);
  border-radius: 5px;
  outline: none;
  font-size: var(--txt-med);
  padding: .1rem .65rem;
  font-weight: 500;
  color: var(--clr-btn);
  background-color: var(--clr-btn-bg);
  cursor: pointer;
}
</style>