<template>
  <ThreadDetailView :id="id" mode="discussion" />
</template>

<script>
import ThreadDetailView from "../components/thread/ThreadDetailView.vue";
export default {
  name: "Discussion",
  components: {ThreadDetailView},
  props: {
    id: [Number, String],
  },
}
</script>
