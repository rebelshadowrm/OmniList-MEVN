<template>
<div class="browse-item">
  <router-link :to="'/anime/' + id">
    <h2>{{title}}</h2>
    <img :src="img" alt="">
    <div class="sub">
      <div v-html="description"></div>
      <div class="info">
        <p>Score: {{score}}</p>
        <p>Episodes: {{episodes}}</p>
      </div>
      <p>Genres:</p>
      <div class="genres">
        <p v-for="genre in genres" :key="genre.id">{{genre}}</p>
      </div>
    </div>

  </router-link>
</div>
</template>

<script>
export default {
  name: "BrowseItem",
  props: {
    id: Number,
    title: String,
    description: String,
    img: String,
    score: Number,
    episodes: Number,
    genres: Array,
  },
}
</script>

<style scoped>
.browse-item {
  flex: 1 1 40ch;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  display: flex;
  place-content: center;
  padding: 1rem;
  background-color: var(--clr-secondary-800-3);
  border-radius: var(--radius);
  font-size: var(--txt-small);
}
a {
  display: grid;
  gap: 1rem;
  color: var(--clr-text);
  text-decoration: none;
}
img {
  margin-inline: auto;
}
.sub {
  max-height: 15ch;
  overflow-y: auto;
  align-self: end;
}
.info,
.genres {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>