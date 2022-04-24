<template>
<div class="browse-item">
  <router-link class="title-link" :to="'/anime/' + id">
    <h2>{{title}}</h2>
  </router-link>
  <router-link class="img-link" :to="'/anime/' + id">
    <img :src="img" alt="" loading="lazy">
  </router-link>
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
  --rowHeight: 13rem;
  flex: 0 0 60ch;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  display: grid;
  grid-template-areas:
      'title title'
      'img info';
  grid-template-columns: max-content 1fr;
  grid-template-rows: repeat(2, max-content);
  max-height: min-content;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--clr-secondary-800-5);
  border-radius: 10px;
  font-size: var(--txt-xsm);
}
.title-link,
.img-link {
  color: var(--clr-text);
  text-decoration: none;
}
.title-link {
  grid-area: title;
}
.img-link {
  grid-area: img;
}
img {
  height: 100%;
  max-height: var(--rowHeight);
  aspect-ratio: 1 / 1.5;
  border-radius: 5px;
}
h2 {
  font-size: var(--txt-med);
  max-height: 3rem;
  overflow-y: hidden;
}
.sub {
  grid-area: info;
  max-height: var(--rowHeight);
  overflow-y: auto;
}
.sub div {
  padding-right: .5rem;
}
.info,
.genres {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}
@media only screen and (max-width: 40rem) {
  .browse-item {
    grid-template-areas:
      'img title'
      'info info';
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>