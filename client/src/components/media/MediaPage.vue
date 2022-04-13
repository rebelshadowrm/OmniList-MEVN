<template>
<div class="media-grid">
  <div class="hero">
    <img src="https://picsum.photos/2000/400" alt="">
    <div class="text">
      <h1 class="title">Anime Title</h1>
      <div class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ducimus nobis rem. Dolores, ducimus eius illum libero quaerat quibusdam veritatis.</div>
    </div>
    <div class="anime-card">
      <img src="https://picsum.photos/200/300" alt="">
      <div class="btn-container">
        <button>Add to List</button>
        <select name="addMedia" id="addMedia">
          <option value=""></option>
          <option value="watching">Set as Watching</option>
          <option value="planning">Set as Planning</option>
        </select>
        <div class="favorite">
          <i class="fas fa-heart"></i>
        </div>
      </div>

    </div>
  </div>
  <MediaPageNav/>
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
  grid-template-areas:
  'aside main';
  grid-template-rows: 1fr 5fr;
}
i {
  color: white;
}
.favorite {
  background-color: hsl(337, 100%, 40%);
  width: max-content;
  padding: .25rem .5rem;
  border-radius: 5px;
}
select {
  background: transparent;
  border: none;
  outline: none;
  color: var(--clr-text);
}
option {
  background-color: var(--clr-accent-600-7);
}
</style>