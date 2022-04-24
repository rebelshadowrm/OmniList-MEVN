<template>
  <h2>Discussions</h2>
  <ThreadCollection type="discussion" :threads="discussionSlice"/>
</template>

<script>
import ThreadCollection from "../thread/ThreadCollection.vue";
export default {
  name: "MediaDiscussions",
  components: {
    ThreadCollection
  },
  props: {
    section: String,
    discussions: Array
  },
  data() {
    return {
      limit: 3
    }
  },
  computed: {
    discussionSlice() {
      return this?.limit ? this?.discussions?.slice(0, this?.limit) : this?.discussions
    }
  },
  created() {
    if (this && this?.section === 'discussions') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  },
  updated() {
    if (this && this?.section === 'discussions') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  }

}
</script>

<style scoped>

</style>