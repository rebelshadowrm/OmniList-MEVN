<template>
<div class="favorites">
  <div class="favorite-section">
    <div class="header">
      <h2>Media</h2>
      <button @click.prevent="addFavoriteMedia" class="add">Add</button>
    </div>
    <div class="favorite-collection">
      <div v-if="favorites?.media?.length > 0"
           v-for="media in favorites.media" :key="`${media.mediaType ?? 'ANIME'}-${media.id}`" class="favorite">
        <router-link :to="mediaDetailPath(media)">
          <img :src="imageSrc(media?.coverImage?.large, 'poster', mediaTitle(media))"
               :alt="mediaTitle(media)"
               @error="setFallbackImage($event, 'poster', mediaTitle(media))">
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
        <img :src="imageSrc(character.img, 'avatar', character.alt)"
             :alt="character.alt"
             @error="setFallbackImage($event, 'avatar', character.alt)">
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
        <img :src="imageSrc(staff.img, 'avatar', staff.alt)"
             :alt="staff.alt"
             @error="setFallbackImage($event, 'avatar', staff.alt)">
      </div>
      <p v-else>No favorites yet...</p>
    </div>
  </div>
</div>
</template>

<script>
import UserService from "../../services/UserService";
import {mediaConfig} from "../../config/mediaTypes.js";
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";

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
          media: this.mediaFavorites(favorites),
          characters: favorites.characterFavorites,
          staff: favorites.staffFavorites
        }
      }
    }
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    addFavoriteMedia(e) {

    },
    addFavoriteCharacter(e) {

    },
    addFavoriteStaff(e) {

    },
    mediaFavorites(favorites) {
      const media = favorites?.mediaFavorites?.map(({media}) => media) ?? []
      const legacy = favorites?.animeFavorites?.map(({anime}) => anime) ?? []
      const seen = new Set()

      return [...media, ...legacy].filter(item => {
        const key = `${item?.mediaType ?? 'ANIME'}-${item?.id}`

        if (!item || seen.has(key)) {
          return false
        }

        seen.add(key)
        return true
      })
    },
    mediaTitle(media) {
      return media?.title?.english ?? media?.title?.romaji ?? media?.title?.native ?? media?.title
    },
    mediaDetailPath(media) {
      const config = mediaConfig(media?.mediaType)

      return `/${config.path}/${media?.id}`
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
  border-radius: var(--radius);
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
  border-radius: var(--radius-sm);
  outline: none;
  font-size: var(--txt-med);
  padding: .1rem .65rem;
  font-weight: 500;
  color: var(--clr-btn);
  background-color: var(--clr-btn-bg);
  cursor: pointer;
}
</style>
