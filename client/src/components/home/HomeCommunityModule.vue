<template>
  <section class="community-module" :data-cols="cols" :data-rows="rows">
    <h2>Community</h2>
    <div class="community-actions">
      <router-link to="/discussions">Discussions</router-link>
      <router-link to="/reviews">Reviews</router-link>
      <router-link :to="{name: 'Settings', query: {section: 'home'}}">Home preferences</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeCommunityModule",
  props: {
    cols: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 1,
    },
  },
}
</script>

<style scoped>
.community-module {
  display: grid;
  align-content: start;
  gap: .85rem;
  min-width: 0;
  min-height: 100%;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

.community-module[data-cols="2"][data-rows="1"] {
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  align-content: center;
}

h2 {
  color: var(--clr-primary-200);
}

.community-actions {
  display: grid;
  gap: .7rem;
}

.community-module[data-cols="2"][data-rows="1"] .community-actions {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .45rem .75rem;
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  font-weight: 800;
  text-decoration: none;
}

@media (max-width: 42rem) {
  .community-module[data-cols="2"][data-rows="1"],
  .community-module[data-cols="2"][data-rows="1"] .community-actions {
    grid-template-columns: 1fr;
  }
}
</style>
