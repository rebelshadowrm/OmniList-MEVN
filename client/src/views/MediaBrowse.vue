<template>
  <MediaBrowseView :media-type="mediaType" />
</template>

<script>
import MediaBrowseView from "../components/media/MediaBrowseView.vue"

export default {
  name: "MediaBrowse",
  components: {
    MediaBrowseView,
  },
  props: {
    mediaType: {
      type: String,
      default: 'ANIME',
    },
  },
}
</script>
