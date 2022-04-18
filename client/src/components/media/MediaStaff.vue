<template>
<h2>Staff</h2>
  <div class="staff-cards">
    <div class="staff-card" v-for="staff in staffSlice">
      <img class="image" :src="staff?.node?.image?.medium" alt="">
      <h3 class="title">{{staff?.node?.name?.userPreferred}}</h3>
      <p class="role">{{staff?.role}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaStaff",
  props: {
    section: String,
    staff: Array,
  },
  data() {
    return {
      limit: 6
    }
  },
  computed: {
    staffSlice() {
      return this?.limit ? this?.staff?.slice(0, this?.limit) : this?.staff
    }
  },
  created() {
    if (this && this?.section === 'staff') this.limit = null
    if (this && this?.section === 'overview') this.limit = 6
  },
  updated() {
    if (this && this?.section === 'staff') this.limit = null
    if (this && this?.section === 'overview') this.limit = 6
  }
}
</script>

<style scoped>
.staff-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 75rem;
}
.staff-card {
  flex: 1 1 30%;
  display: grid;
  grid-template-areas:
      'img title'
      'img role';
  grid-template-columns: max-content 1fr;
  justify-items: end;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--clr-secondary-800-3);
  border-radius: 10px;
  min-width: 28ch;
}
.staff-card .image {
  grid-area: img;
  aspect-ratio: 1 / 1.5;
  max-height: 100px;
  border-radius: var(--radius);
}
.staff-card .title {
  grid-area: title;
}
.staff-card .role {
  grid-area: role;
}
</style>