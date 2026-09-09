<template>
  <aside class="news-feed" :class="orientationClass" :data-cols="cols" :data-rows="rows">
    <div v-if="loading" class="feed-state">
      <p>Loading news...</p>
    </div>
    <div v-else-if="error" class="feed-state">
      <p>Anime news is unavailable.</p>
    </div>
    <div v-else class="loaded">
      <div class="news">
        <header class="credit">
          <h1>Anime News</h1>
          <a
              class="source-credit"
              href="https://www.animenewsnetwork.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="News provided by Anime News Network">
            <span>via</span> Anime News Network
          </a>
        </header>
        <div class="news-container">
          <div v-for="news in displayedNews"
               :key="news.id"
               class="news-card">
              <span class="category">
                   <span v-for="category in news?.category"
                         :key="category.id">{{category?.$?.term}}</span>
              </span>
            <a :href="news?.id[0]" target="_blank" rel="noopener noreferrer">
              <h2>{{news?.title[0]?._}}</h2>
            </a>
            <p class="summary">{{news?.summary[0]?._}}</p>
          </div>
          <button
              v-if="canLoadMore"
              class="load-more"
              type="button"
              aria-label="Load more news stories"
              @click="loadMore">
            More
          </button>
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
      loading: true,
      error: false,
      visibleLimit: null,
    }
  },
  computed: {
    orientationClass() {
      return `is-${this.orientation}`
    },
    displayedNews() {
      return Number.isInteger(this.visibleLimit) && this.visibleLimit > 0
          ? this.newsArr.slice(0, this.visibleLimit)
          : this.newsArr
    },
    canLoadMore() {
      return Number.isInteger(this.visibleLimit)
          && this.visibleLimit > 0
          && this.visibleLimit < this.newsArr.length
    },
  },
  async created() {
    this.loading = true
    this.error = false
    this.visibleLimit = Number.isInteger(this.limit) && this.limit > 0
        ? this.limit
        : null

    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error(`News request failed with ${res.status}`)

      const data = await res.json()
      this.newsArr = data?.feed?.entry ?? []
      this.error = this.newsArr.length === 0
    } catch {
      this.error = true
    } finally {
      this.loading = false
    }
  },
  methods: {
    loadMore() {
      const batchSize = Number.isInteger(this.limit) && this.limit > 0
          ? this.limit
          : 4

      this.visibleLimit = Math.min(this.visibleLimit + batchSize, this.newsArr.length)
    },
  },
}
</script>

<style scoped>
.feed-state {
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
  padding: .75rem 0 .75rem .6rem;
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
  flex: 1;
  min-height: 0;
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.news-container:hover,
.news-container:focus-within {
  scrollbar-color: var(--clr-secondary-400) var(--clr-primary-800-3);
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
  padding-block: .1rem;
}

.credit {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  gap: .5rem;
  min-width: 0;
  border-bottom: 1px solid var(--clr-border);
  margin-right: .6rem;
  padding: 0 .4rem .4rem;
}

.source-credit {
  color: var(--clr-primary-200);
  font-size: var(--txt-xsm);
  font-weight: 600;
  white-space: nowrap;
}

.source-credit span {
  color: var(--clr-text);
  font-weight: 400;
}

.news-card {
  min-width: 0;
  width: 100%;
  border-radius: 1vmin;
  border: 1px solid var(--clr-secondary-400-5);
  background-color: var(--clr-secondary-800-5);
}

.is-vertical .news-card,
.is-vertical .load-more {
  width: calc(100% - .5rem);
}

.load-more {
  min-height: 2.5rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .4rem .65rem;
  background: var(--clr-secondary-800-5);
  color: var(--clr-primary-200);
  font-weight: 600;
  cursor: pointer;
}

.load-more:hover,
.load-more:focus-visible {
  background: var(--clr-primary-400-1);
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

.news-feed[data-rows="1"] {
  padding: .45rem 0 .45rem .45rem;
}

.news-feed[data-rows="1"] .news {
  gap: .4rem;
}

.news-feed[data-rows="1"] .credit {
  margin-right: .45rem;
  padding: 0 .15rem .3rem;
}

.news-feed[data-rows="1"] .credit h1 {
  font-size: var(--txt-small);
}

.news-feed[data-rows="1"] .source-credit {
  font-size: var(--txt-xsm);
}

.news-feed[data-rows="1"] .news-container {
  gap: .45rem;
}

.news-feed[data-rows="1"] .category {
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
}

.news-feed[data-rows="1"] .category span:not(:first-child) {
  display: none;
}

.news-feed[data-rows="1"] h2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
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
  height: .3rem;
}

.news-container::-webkit-scrollbar-corner,
.news-container::-webkit-scrollbar-track {
  border-radius: 1vmin;
  background-color: transparent;
}

.news-container::-webkit-scrollbar-thumb {
  border-radius: 1vmin;
  background-color: transparent;
}

.news-container:hover::-webkit-scrollbar-corner,
.news-container:hover::-webkit-scrollbar-track,
.news-container:focus-within::-webkit-scrollbar-corner,
.news-container:focus-within::-webkit-scrollbar-track {
  background-color: var(--clr-primary-800-3);
}

.news-container:hover::-webkit-scrollbar-thumb,
.news-container:focus-within::-webkit-scrollbar-thumb {
  background-color: var(--clr-secondary-400);
}

@media (max-width: 30rem) {
  .credit {
    grid-template-columns: 1fr;
    gap: .1rem;
  }

  .source-credit {
    justify-self: start;
  }
}

</style>
