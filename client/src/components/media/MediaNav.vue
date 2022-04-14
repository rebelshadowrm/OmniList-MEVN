<template>
  <div class="media-nav">
    <button @click="selected('overview')" :class="active === 'overview' ? 'active' : ''">Overview</button>
    <button @click="selected('characters')" :class="active === 'characters' ? 'active' : ''">Characters</button>
    <button @click="selected('staff')" :class="active === 'staff' ? 'active' : ''">Staff</button>
    <button @click="selected('reviews')" :class="active === 'reviews' ? 'active' : ''">Reviews</button>
    <button @click="selected('stats')" :class="active === 'stats' ? 'active' : ''">Stats</button>
  </div>
</template>

<script>
export default {
  name: "MediaPageNav",
  data() {
    return {
      active: 'overview',
    }
  },
  created() {
    this.$emit('active', this.active)
  },
  methods: {
    selected(string) {
      this.active = string
      this.$emit('active', string)
    }
  }
}
</script>

<style scoped>
.media-nav {
  display: flex;
  max-width: 100vw;
  flex-direction: row;
  gap: 1.5rem;
  background-color: transparent;
  overflow-x: auto;
  place-content: center;
}
.profile-nav button:first-child {
  margin-left: auto;
}
.profile-nav button:last-child {
  margin-right: auto;
}
button {
  border: unset;
  background-color: transparent;
  cursor: pointer;
  color: var(--clr-primary-400);
  padding-block: .75rem;
}
button:hover {
  color: var(--clr-accent-400);
}
button.active {
  color: var(--clr-accent-400);
  font-weight: 700;
}
</style>