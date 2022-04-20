<template>
  <div class="container">
    <ProfileColorPicker />
  </div>
</template>

<script>
import ProfileColorPicker from "../components/profile/ProfileColorPicker.vue"
export default {
  name: "Settings",
  components: {
    ProfileColorPicker,
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