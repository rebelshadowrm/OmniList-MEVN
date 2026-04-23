<template>
  <aside>
    <div  v-if="loading" class="loading">
      <h1>Loading...</h1>
    </div>
    <div v-else class="loaded">
      <div class="news">
        <div class="credit">
          <h1>Anime News</h1>
          <p>Brought to you by <a href="https://www.animenewsnetwork.com">Anime News Network</a></p>
        </div>
        <div class="news-container">
          <div v-for="news in newsArr"
               :key="news.id"
               class="news-card">
              <span class="category">
                   <span v-for="category in news?.category"
                         :key="category.id">{{category?.$?.term}}</span>
              </span>
            <a :href="news?.id[0]">
              <h2>{{news?.title[0]?._}}</h2>
            </a>
            <p class="summary">{{news?.summary[0]?._}}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "News",
  data() {
    return {
      newsArr: [],
      loading: true
    }
  },
  async created() {
    this.loading = true
    const res = await fetch('/api/news')
    if(res.ok) {
      const data = await res.json()
      console.log(data)
      const {entry} = data.feed
      this.newsArr  = entry
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading {
  display: grid;
  place-items: center;
  min-height: 85vh;
  /* preload size
     35ch max width on news card
     + .6 x2 + .4 x2 = 2rem */
  width: calc(35ch + 2rem);
}

aside {
  border: 1px inset var(--clr-border);
  border-radius: var(--radius);
  padding: .75rem .6rem;
  background-color: var(--clr-secondary-800-3);
}

.news {
  display: flex;
  flex-direction: column;
}

.news-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-inline: .4rem;
  max-height: 75vh;
  overflow-x: auto;
}

.credit {
  align-self: center;
  margin-bottom: 1rem;
}

.credit a {
  border-bottom: 1px solid var(--clr-secondary-400);
}

.news-card {
  max-width: 35ch;
  border-radius: 1vmin;
  border: 1px solid var(--clr-secondary-400-5);
  background-color: var(--clr-secondary-800-5);
}

.summary {
  padding: .5rem;
  font-size: var(--txt-small);
}
.category {
  display: inline-flex;
  background-color: var(--clr-secondary-400-5);
  border-radius: 1vmin 1vmin 0 0;
  padding: .2rem .4rem;
  font-weight: 500;
  font-size: var(--txt-small);
  text-align: center;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

h2 {
  font-weight: 500;
  font-size: var(--txt-med);
  background-color: var(--clr-secondary-800-7);
  padding: .5rem;
}

a {
  text-decoration: none;
  color: var(--clr-text);
}

.news-container::-webkit-scrollbar {
  width: .3rem;
}
.news-container::-webkit-scrollbar-corner,
.news-container::-webkit-scrollbar-thumb,
.news-container::-webkit-scrollbar-track {
  border-radius: 1vmin;
  visibility: hidden;
}
.news-container:hover::-webkit-scrollbar-corner,
.news-container:hover::-webkit-scrollbar-thumb,
.news-container:hover::-webkit-scrollbar-track {
  visibility: visible;
}

</style>
