<template>
  <h1>Top 50 Trending</h1>
  <div class="browse-items">
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
import BrowseItem from "../components/BrowseItem.vue";
export default {
  name: "AnimeBrowse",
  components: {
    BrowseItem
  },
  data() {
    return {
      data: []
    }
  },
  async created() {
    const url = 'https://graphql.anilist.co'
    const query = `
            query {
              Page {
                media(type: ANIME, sort: TRENDING_DESC) {
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
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    }
    const res = await fetch(url, options)
    if(res.ok) {
      const json = await res.json()
      this.data = json.data.Page.media
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 2rem;
}
.browse-items {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 2rem;
  justify-content: center;
}

</style>