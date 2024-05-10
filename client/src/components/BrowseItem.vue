<template>
<div class="browse-item">
  <router-link class="title-link" :to="'/anime/' + id">
    <h2 :data-title="title" >{{title}}</h2>
  </router-link>
  <router-link class="img-link" :to="'/anime/' + id">
    <img :src="img" alt="" loading="lazy">
  </router-link>
    <div class="sub">
      <div v-html="description"></div>
    </div>
    <div class="ribbon">
      <div class="info">
        <p>Score: {{score}}</p>
        <p>Episodes: {{episodes}}</p>
      </div>
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
  /*--rowHeight: 13rem;*/
  flex: 0 0 60ch;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  display: grid;
  grid-template-areas:
      'title title'
      'img info'
      'img .';
  grid-template-columns: 3fr 5fr;
  grid-template-rows: max-content 3fr 1fr;
  max-height: min-content;
  gap: .5rem 1rem;
  padding: .75rem;
  background-color: var(--clr-secondary-800-5);
  border-radius: 10px;
  font-size: var(--txt-xsm);
  max-width: 100%;
  position: relative;
  max-height: 20rem;
}
.title-link,
.img-link {
  grid-area: img;
  color: var(--clr-text);
  text-decoration: none;
}
.title-link {
  grid-area: title;
}
img {
  height: 100%;
  max-height: var(--rowHeight);
  aspect-ratio: 1 / 1.5;
  object-fit: cover;
  border-radius: 5px;
}
h2 {
  font-size: var(--txt-med);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}
h2:hover {
  color: transparent;
}
h2:hover::before {
  content: attr(data-title);
  color: var(--clr-text);
  display: inline-block;
  overflow:visible;
  position: absolute;
  inset: .3rem .75rem auto .75rem;
  background: hsla(0, 0%, 0%, 0.7);
  padding: .3rem .75rem;
  border-radius: 1vmin;
  white-space: normal;
  word-wrap: normal;
}
.sub {
  grid-area: info;
  max-height: var(--rowHeight);
  overflow-y: auto;
}

.sub::-webkit-scrollbar {
  width: .3rem;
}
.sub::-webkit-scrollbar-corner,
.sub::-webkit-scrollbar-thumb,
.sub::-webkit-scrollbar-track {
  border-radius: 1vmin;
  visibility: hidden;
}
.sub:hover::-webkit-scrollbar-corner,
.sub:hover::-webkit-scrollbar-thumb,
.sub:hover::-webkit-scrollbar-track {
  visibility: visible;
}


.ribbon {
  grid-column: 1 / span 2;
  grid-row: 3/4;
  background: hsla(0, 0%, 0%, 0.75);
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .4rem .6rem;
  justify-content: space-between;
  border-radius: 0 0 5px 5px;
}
.sub div {
  padding-right: .5rem;
}
.info {
  font-size: var(--txt-small);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.genres {
  display: flex;
  flex-direction: row;
  gap: .4rem;
  overflow-x: overlay;
}
.genres::-webkit-scrollbar {
  height: .3rem;
}
.genres::-webkit-scrollbar-corner,
.genres::-webkit-scrollbar-thumb,
.genres::-webkit-scrollbar-track {
  border-radius: 1vmin;
  visibility: hidden;
}
.genres:hover::-webkit-scrollbar-corner,
.genres:hover::-webkit-scrollbar-thumb,
.genres:hover::-webkit-scrollbar-track {
  visibility: visible;
}

.genres p {
  display: inline-block;
  border: 1px solid var(--clr-accent-400-5);
  background-color: var(--clr-secondary-800-7);
  border-radius: 50vw;
  padding: .15rem .35rem;
}
@media only screen and (max-width: 40rem) {
  h2 {
  overflow: visible;
  white-space: normal;
  }
  .genres p {
    max-height: 1.5rem;
  }
}
</style>