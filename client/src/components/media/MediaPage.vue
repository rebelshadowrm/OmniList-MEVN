<template>
  <div class="media-grid">
    <img class="hero-img" src="https://picsum.photos/2000/600" alt="">
    <div class="text">
      <h1 class="title">Anime Title</h1>
      <div class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ducimus nobis rem. Dolores, ducimus eius illum libero quaerat quibusdam veritatis.</div>
    </div>
    <div class="card">
      <img class="card-img" src="https://picsum.photos/200/300" alt="">
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
  <MediaPageNav class="nav"/>
    <div class="content">
      Content components will go here
    </div>
</div>
</template>

<script>
import MediaPageNav from "./MediaPageNav.vue";
export default {
  name: "MediaPage",
  components: {
    MediaPageNav
  }
}
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: var(--clr-secondary-800-3);
}
.content {
  grid-column: 1/ span 7;
  grid-row: 7;
  background-color: var(--clr-bg);
}
.nav {
  grid-column: 1/ span 7;
  grid-row: 6;
}
.hero-img {
  grid-column: 1 / span 7;
  grid-row: 1 / span 2;
}
.text {
  grid-column: 3 / span 4;
  grid-row: 3 / span 2;
}
/*TODO: add media query to remove description in mobile
  will be replaced with a component in the lower section on mobile*/

.card {
  grid-column: 1 / span 2;
  grid-row: 2 / span 2;
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
</style>