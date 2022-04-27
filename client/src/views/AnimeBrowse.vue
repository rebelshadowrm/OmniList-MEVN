<template>
  <div class="browse-options">
    <div class="search">
      <input v-model="search" type="text" name="search" id="search" placeholder="search" />
    </div>
    <div class="genres">
      <VueMultiselect
          v-model="genre"
          :options="genres"
          :multiple="true"
          :searchable="true"
          :close-on-select="true"
          :allow-empty="true"
          placeholder="Filter by genre"
      />
    </div>
    <div class="sort-by">
      <VueMultiselect
          v-model="sortBy"
          :options="sortTypes"
          :multiple="false"
          :searchable="false"
          :close-on-select="true"
          :allow-empty="false"
          :label="sortTypes.name"
          :track-by="sortTypes.name"
          :custom-label="customLabel"
          :show-labels="false"
      />
    </div>
    <button @click="update">update</button>
  </div>
  <div v-if="loading" class="loading">
    <h1>Loading...</h1>
  </div>
  <div v-else class="browse-items">
    <BrowseItem v-for="item in data" :key="item.id"
                :description="item.description"
                :id="item.id"
                :img="item.coverImage.large"
                :score="item.averageScore"
                :title="item.title?.english ?? item.title?.romaji"
                :episodes="item.episodes"
                :genres="item.genres"
    />
  </div>
</template>

<script>
import BrowseItem from "../components/BrowseItem.vue"
import VueMultiselect from 'vue-multiselect'
export default {
  name: "AnimeBrowse",
  components: {
    BrowseItem,
    VueMultiselect
  },
  data() {
    return {
      data: [],
      genres: [
        'Action', 'Adventure',
        'Comedy', 'Drama',
        'Ecchi', 'Fantasy',
        'Horror', 'Mahou Shoujo',
        'Mecha', 'Music',
        'Mystery', 'Psychological',
        'Romance'
      ],
      sortTypes: [
        { name: 'Trending', value: 'TRENDING_DESC' },
        { name: 'Rating', value: 'SCORE_DESC' },
        { name: 'Popularity', value: 'POPULARITY_DESC' },
        { name: 'Best Match', value: 'SEARCH_MATCH' }
      ],
      search: undefined,
      genre: undefined,
      sortBy: { name: 'Trending', value: 'TRENDING_DESC' },
      loading: true
    }
  },
  async created() {
    this.loading = true
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const url = 'https://graphql.anilist.co'
        const query = `
            query ($search: String, $genre: [String]) {
              Page {
                media(type: ANIME, search: $search, genre_in: $genre, sort: ${this?.sortBy?.value}) {
                    id
                    title {
                      english
                      romaji
                    }
                    coverImage {
                      large
                    }
                    description
                    genres
                    episodes
                    averageScore
                }
              }
            }
        `
        const variables = {
          search: this.search,
          genre: this.genre,
        }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables
          })
        }
        const res = await fetch(url, options)
        if (res.ok) {
          const json = await res.json()
          this.data = json.data.Page.media
          this.loading = false
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    customLabel({ name }) {
      return `${name}`
    },
    async update() {
      this.loading = true
      await this.fetchData()
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
h1 {
  text-align: center;
  margin-top: 2rem;
}
.browse-items {
  display: flex;
  flex-flow: row wrap;
  gap: 1.5rem;
  margin: 2rem;
  justify-content: center;
}

.browse-options {
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-around;
}
.genres {
  width: 17rem;
}
.search input {
  color: var(--clr-text);
  background-color: var(--clr-bg);
  padding: .2rem .5rem;
  border: none;
  border-bottom: 2px solid hsl(0deg 0% 100% / .3);
  outline: none;
  font-size: 1.75rem;
}
.search input:focus-visible {
  box-shadow: 0 10px 0 -5px var(--clr-border);
  border: none;
}

button {
  font-size: var(--txt-med);
  font-weight: 600;
  border-radius: 7px;
  padding: .5rem 1rem;
  border: none;
  outline: none;
  background-color: var(--clr-btn-bg);
  color: var(--clr-btn);
  cursor: pointer;
}

</style>
