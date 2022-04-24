<template>
  <div class="container">
    <ColorPicker />
  </div>
</template>

<script>
import ColorPicker from "../components/ColorPicker.vue"
export default {
  name: "Settings",
  components: {
    ColorPicker,
  },

}
</script>

<style scoped>
.container {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>