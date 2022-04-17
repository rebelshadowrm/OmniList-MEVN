<template>
  <div class="media-grid">
    <img v-if="data?.bannerImage" class="hero-img" :src="data?.bannerImage" alt="">
    <div class="text">
      <h1 class="title">{{data?.title?.english ?? data?.title?.romaji}}</h1>
      <div v-html="data?.description" class="description"></div>
    </div>
    <div class="card">
      <img class="card-img" :src="data?.coverImage?.large" alt="">
      <div class="btn-container">
        <button>Add to List</button>
        <select name="addMedia" id="addMedia">
          <option value=""></option>
          <option value="watching">Set as Watching</option>
          <option value="planning">Set as Planning</option>
        </select>
      </div>
      <div class="favorite">
        <i class="fas fa-heart"></i>
      </div>
    </div>
    <MediaPageNav @active="activeSection" class="nav"/>
    <div class="content">
      <MediaAside class="aside"
                  :infos="info"
      />
      <div class="main">
        <MediaCharacters v-if="section === 'overview' || section === 'characters'"
                         :section="section" :characters="data?.characters?.edges"/>
        <MediaStaff v-if="section === 'overview' || section === 'staff'"
                    :section="section" :staff="data?.staff?.edges"/>
        <MediaReviews v-if="section === 'overview' || section === 'reviews'"
                      :section="section"/>
        <MediaStats v-if="section === 'overview' || section === 'stats'"
                    :section="section"/>
      </div>
    </div>
  </div>
</template>

<script>
import MediaPageNav from "./MediaNav.vue";
import MediaAside from "./MediaAside.vue";
import MediaCharacters from "./MediaCharacters.vue";
import MediaReviews from "./MediaReviews.vue";
import MediaStats from "./MediaStats.vue"
import MediaStaff from "./MediaStaff.vue"

export default {
  name: "MediaComponent",
  components: {
    MediaReviews,
    MediaCharacters,
    MediaAside,
    MediaPageNav,
    MediaStats,
    MediaStaff
  },
  props: {
    data: Object,
    info: Array
  },
  data() {
    return {
      section: '',
    }
  },
  methods: {
    activeSection(section) {
      this.section = section
    },
  }
}
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 17.5vh) 175px max-content 1fr;
  background-color: var(--clr-secondary-800-3);
  column-gap: 2rem;
  row-gap: .3rem;
}

.nav {
  grid-column: 4 / span 9;
  grid-row: 4 / 5;
}

.hero-img {
  grid-column: 1 / span 12;
  grid-row: 1 / 3;
  width: 100%;
  height: 35vh;
  object-fit: cover;

}

.text {
  grid-column: 4 / span 8;
  grid-row: 3 / 4;
  max-height: 175px;
  overflow-y: auto;
}

.card {
  grid-column: 2 / span 2;
  grid-row: 2 / 4;
  z-index: 1;
  width: 215px;
  display: grid;
  grid-template-areas:
      'img img'
      'btn fav';
  max-width: max-content;
  gap: 1rem;
}

.card-img {
  max-height: 300px;
  min-height: 300px;
  max-width: 215px;
  min-width: 215px;
  grid-area: img;
  border-radius: 5px;
  filter: drop-shadow(0 0 .75rem hsl(var(--clr-black-800) / .3));
}

.btn-container {
  grid-area: btn;
  align-self: end;
  display: flex;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  border-radius: 5px;
  color: var(--clr-secondary-400);
  background-color: var(--clr-primary-800-7);
  max-width: max-content;
}

i {
  color: white;
}

.favorite {
  grid-area: fav;
  background-color: hsl(337, 100%, 40%);
  width: max-content;
  padding: .25rem .5rem;
  border-radius: 5px;
  place-self: end;
}

button {
  background: transparent;
  border: none;
  color: inherit;
  padding: .23rem 1.4rem;
  border-right: 1px solid var(--clr-border);
  width: 100%;
}

select {
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  max-width: 20px;
  padding-inline: .25rem;
}

option {
  background-color: var(--clr-bg);
}

.title {
  font-size: var(--txt-med);
  font-weight: 600;
}

.content {
  grid-column: 1/ span 12;
  grid-row: 5;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 2rem;
  row-gap: .3rem;
  background-color: var(--clr-bg);
  --top-margin: 2rem;
}

.content .aside {
  margin-top: var(--top-margin);
  grid-column: 2 / span 2;
  display: flex;
  flex-direction: column;
  width: 215px;
  background-color: var(--clr-secondary-800-3);
  border-radius: 3px;
  padding-bottom: 1rem;
}

.content .main {
  margin-top: var(--top-margin);
  grid-column: 4 / span 8;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media only screen and (max-width: 48.375rem) {
  .media-grid {
    grid-template-rows: 17.5vh repeat(3, max-content) 1fr;
    row-gap: .5rem;
  }

  .text {
    grid-column: 2 / span 10;
    grid-row: 3/4;
  }

  .description {
    display: none;
  }

  .content .aside {
    grid-column: 1 / span 12;
    grid-row: 1/2;
    flex-direction: row;
    width: auto;
    overflow-x: auto;
    max-width: calc(100% - 2rem);
    place-self: center;
  }

  .content .main {
    grid-row-start: 2;
    grid-column: 2 / span 10;
  }

  .hero-img {
    height: 33vh;
  }

  .card {
    grid-row: 2/3;
    grid-column: 2 / span 10;
    grid-template-columns: max-content 1fr max-content;
    grid-template-areas:
      'img btn fav';
    width: auto;
    max-width: 100%;
  }

  .btn-container {
    max-width: 100%;
  }

  .card-img {
    min-height: unset;
    height: 175px;
    max-height: 100%;
    min-width: unset;
    max-width: 100%;
  }

  .nav {
    grid-column: 1 / span 12;
    grid-row: 4/5;
    max-width: calc(100% - 2rem);
    place-self: center;
  }
}
</style>