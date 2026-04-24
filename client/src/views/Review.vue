<template>
  <ThreadDetailView :id="id" mode="review" />
</template>

<script>
import ThreadDetailView from "../components/thread/ThreadDetailView.vue";
export default {
  name: "Review",
  components: {ThreadDetailView},
  props: {
    id: [Number, String],
  },
}
</script>
