<template>
  <aside class="news-feed" :class="orientationClass" :data-cols="cols" :data-rows="rows">
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
          <div v-for="news in displayedNews"
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
  props: {
    limit: {
      type: Number,
      default: null,
    },
    orientation: {
      type: String,
      default: 'vertical',
      validator: value => ['vertical', 'horizontal'].includes(value),
    },
    cols: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      newsArr: [],
      loading: true
    }
  },
  computed: {
    orientationClass() {
      return `is-${this.orientation}`
    },
    displayedNews() {
      return Number.isInteger(this.limit) && this.limit > 0
          ? this.newsArr.slice(0, this.limit)
          : this.newsArr
    },
  },
  async created() {
    this.loading = true
    const res = await fetch('/api/news')
    if(res.ok) {
      const data = await res.json()
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
  min-height: 100%;
  width: 100%;
}

.news-feed {
  width: 100%;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  border: 1px inset var(--clr-border);
  border-radius: var(--radius);
  padding: .75rem .6rem;
  background-color: var(--clr-secondary-800-3);
}

.loaded {
  height: 100%;
  min-height: 0;
}

.news {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  min-width: 0;
  height: 100%;
  min-height: 0;
}

.news-container {
  gap: .75rem;
  padding-inline: .4rem;
  min-height: 0;
}

.is-vertical .news-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.is-horizontal .news-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(13rem, 1fr);
  overflow-x: auto;
  overflow-y: hidden;
  padding-block: .1rem .45rem;
}

.credit {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: .5rem 1rem;
  text-align: center;
}

.credit a {
  border-bottom: 1px solid var(--clr-secondary-400);
}

.news-card {
  min-width: 0;
  width: 100%;
  border-radius: 1vmin;
  border: 1px solid var(--clr-secondary-400-5);
  background-color: var(--clr-secondary-800-5);
}

.summary {
  padding: .5rem;
  font-size: var(--txt-small);
}

.is-horizontal .summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.category {
  display: inline-flex;
  flex-wrap: wrap;
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
  overflow-wrap: anywhere;
}

h1 {
  font-size: var(--txt-med);
}

.is-horizontal h2 {
  font-size: var(--txt-small);
}

.news-feed[data-rows="1"] .summary {
  display: none;
}

.is-horizontal .news-card {
  display: grid;
  grid-template-rows: max-content max-content 1fr;
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
