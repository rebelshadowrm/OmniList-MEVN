<template>
  <section class="community-module" :data-cols="cols" :data-rows="rows">
    <div class="community-heading">
      <h2>{{ title }}</h2>
      <router-link :to="collectionPath">
        View all
        <i class="fas fa-arrow-right"></i>
      </router-link>
    </div>

    <div v-if="loading" class="community-list">
      <div v-for="index in resolvedLimit" :key="index" class="community-item skeleton"></div>
    </div>

    <div v-else-if="items.length" class="community-list">
      <router-link
          v-for="item in displayItems"
          :key="item._id"
          class="community-item"
          :to="itemPath(item)">
        <strong>{{ item.title }}</strong>
        <span>{{ item.subject }}</span>
        <small>{{ item.user?.userName ?? 'OmniList user' }} · {{ commentCount(item) }}</small>
      </router-link>
    </div>

    <p v-else class="empty-state">{{ emptyMessage }}</p>
  </section>
</template>

<script>
import ThreadService from "../../services/ThreadService"

export default {
  name: "HomeCommunityModule",
  props: {
    title: {
      type: String,
      default: 'Community',
    },
    threadType: {
      type: String,
      default: 'discussions',
      validator: value => ['discussions', 'reviews'].includes(value),
    },
    cols: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      items: [],
      loading: true,
      errorMessage: '',
    }
  },
  computed: {
    displayItems() {
      return this.items.slice(0, this.resolvedLimit)
    },
    collectionPath() {
      return `/${this.threadType}`
    },
    singularType() {
      return this.threadType === 'reviews' ? 'review' : 'discussion'
    },
    resolvedLimit() {
      if (this.cols >= 2 && this.rows >= 2) return 4
      if (this.cols >= 2 || this.rows >= 2) return 3

      return 2
    },
    emptyMessage() {
      return this.errorMessage || `No recent ${this.threadType} yet.`
    },
  },
  async created() {
    await this.loadItems()
  },
  watch: {
    threadType: 'loadItems',
  },
  methods: {
    async loadItems() {
      this.loading = true
      this.errorMessage = ''

      try {
        const getter = this.threadType === 'reviews'
            ? ThreadService.getReviews
            : ThreadService.getDiscussions
        const threads = await getter.call(ThreadService)

        this.items = threads
          .filter(({suspended}) => suspended === false)
          .sort((a, b) => b.createdAt - a.createdAt)
      } catch (err) {
        this.items = []
        this.errorMessage = 'Community activity could not load.'
      } finally {
        this.loading = false
      }
    },
    itemPath(item) {
      return `/${this.singularType}/${item._id}`
    },
    commentCount(item) {
      const count = item?.comments?.length ?? 0

      return `${count} ${count === 1 ? 'comment' : 'comments'}`
    },
  },
}
</script>

<style scoped>
.community-module {
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr);
  align-content: start;
  gap: .85rem;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

.community-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

h2 {
  color: var(--clr-primary-200);
  font-size: var(--txt-med);
}

.community-heading a {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.community-list {
  display: grid;
  gap: .65rem;
  min-height: 0;
  overflow: hidden;
}

.community-module[data-cols="2"] .community-list,
.community-module[data-cols="3"] .community-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.community-item {
  display: grid;
  align-content: start;
  gap: .2rem;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .55rem .65rem;
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  text-decoration: none;
}

.community-item strong,
.community-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-item strong {
  font-size: var(--txt-small);
}

.community-item span,
.community-item small {
  font-size: var(--txt-small);
}

.community-item small {
  color: var(--clr-primary-200);
}

.community-module[data-rows="1"] .community-item span {
  display: none;
}

.empty-state {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .75rem;
  background: var(--clr-secondary-800-3);
  font-size: var(--txt-small);
}

.skeleton {
  min-height: 4rem;
  background: linear-gradient(
      100deg,
      var(--clr-secondary-800-3),
      var(--clr-secondary-600-3),
      var(--clr-secondary-800-3)
  );
  background-size: 200% 100%;
  animation: loading-pulse 1.4s ease-in-out infinite;
}

@keyframes loading-pulse {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 42rem) {
  .community-module[data-cols="2"] .community-list,
  .community-module[data-cols="3"] .community-list {
    grid-template-columns: 1fr;
  }
}
</style>
