<template>
  <MediaDetailView :id="id" :media-type="mediaType" />
</template>

<script>
import MediaDetailView from "../components/media/MediaDetailView.vue"

export default {
  name: "Media",
  components: {
    MediaDetailView,
  },
  props: {
    id: [Number, String],
    mediaType: {
      type: String,
      default: 'ANIME',
    },
  },
}
</script>
