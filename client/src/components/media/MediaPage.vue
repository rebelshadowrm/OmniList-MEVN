<template>
  <div class="media-grid">
    <img class="hero-img" src="https://picsum.photos/2000/600" alt="">
    <div class="text">
      <h1 class="title">Anime Title</h1>
      <div class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ducimus nobis rem. Dolores, ducimus eius illum libero quaerat quibusdam veritatis.</div>
    </div>
    <div class="card">
      <img class="card-img" src="https://picsum.photos/215/300" alt="">
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
      <div class="aside">
        <MediaAside/>
      </div>
      <div class="main">
        <MediaCharacters v-if="section === 'overview' || section === 'characters'"
                         :section="section"/>
        <MediaStaff v-if="section === 'overview' || section === 'staff'"
                    :section="section"/>
        <MediaReviews v-if="section === 'overview' || section === 'reviews'"
                      :section="section"/>
        <MediaStats v-if="section === 'overview' || section === 'stats'"
                    :section="section"/>
      </div>
    </div>
</div>
</template>

<script>
import MediaPageNav from "./MediaPageNav.vue";
import MediaAside from "./MediaAside.vue";
import MediaCharacters from "./MediaCharacters.vue";
import MediaReviews from "./MediaReviews.vue";
import MediaStats from "./MediaStats.vue"
import MediaStaff from "./MediaStaff.vue"
export default {
  name: "MediaPage",
  components: {
    MediaReviews,
    MediaCharacters,
    MediaAside,
    MediaPageNav,
    MediaStats,
    MediaStaff
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
  column-gap: 1rem;
  row-gap: .3rem;
}
.content {
  grid-column: 1/ span 12;
  grid-row: 5;
  background-color: var(--clr-bg);
}
.nav {
  grid-column: 5 / span 7;
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
  grid-column: 5 / span 7;
  grid-row: 3 / 4;
  max-height: 175px;
  overflow-Y: auto;
}
/*TODO: add media query to remove description in mobile
  will be replaced with a component in the lower section on mobile*/

.card {
  grid-column: 2 / span 2;
  grid-row: 2 / 4;
  margin-left: 6rem;
  z-index: 1;
  place-self: center;
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
}
select {
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  width: 20px;
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
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding: 2rem;
}
.content .aside {
  grid-column: 2 / span 2;
  justify-self: center;
  margin-left: 2rem;
}
.content .main {
  grid-column: 5 / span 7;
}
</style>