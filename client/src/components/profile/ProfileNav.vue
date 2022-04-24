<template>
<div class="profile-nav">
  <button @click="selected('overview')" :class="active === 'overview' ? 'active' : ''">Overview</button>
  <button @click="selected('animelist')" :class="active === 'animelist' ? 'active' : ''">AnimeList</button>
  <button @click="selected('favorites')" :class="active === 'favorites' ? 'active' : ''">Favorites</button>
  <button @click="selected('stats')" :class="active === 'stats' ? 'active' : ''">Stats</button>
  <button @click="selected('socials')" :class="active === 'socials' ? 'active' : ''">Socials</button>
  <button @click="selected('reviews')" :class="active === 'reviews' ? 'active' : ''">Reviews</button>
</div>
</template>

<script>
export default {
  name: "ProfileNav",
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
 .profile-nav {
   display: flex;
   max-width: 100vw;
   flex-direction: row;
   gap: 1.5rem;
   background-color: var(--clr-secondary-800);
   overflow-x: auto;
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
   color: var(--clr-text);
   padding-block: .75rem;
 }
 button:hover {
   color: var(--clr-accent-600);
 }
 button.active {
   color: var(--clr-accent-400);
   font-weight: 700;
 }
</style>