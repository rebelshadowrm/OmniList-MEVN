<template>
  <h2>Reviews</h2>
  <ThreadCollection type="review" :threads="reviewSlice"/>
</template>

<script>
import ThreadCollection from "../thread/ThreadCollection.vue";
export default {
  name: "MediaReviews",
  components: {
    ThreadCollection
  },
  props: {
    section: String,
    reviews: Array,
  },
  data() {
    return {
      limit: 3
    }
  },
  computed: {
    reviewSlice() {
      return this?.limit ? this?.reviews?.slice(0, this?.limit) : this?.reviews
    }
  },
  created() {
    if (this && this?.section === 'reviews') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  },
  updated() {
    if (this && this?.section === 'reviews') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  }
}
</script>

<style scoped>

</style>