<template>
  <footer>
    <p>OmniList &copy; 2022</p>
    <ThemePresetToggle
        v-if="!isLoggedIn"
        class="footer-theme"
        label="Theme"
        compact
    />
  </footer>
</template>

<script>
import useUser from "../composables/user"
import ThemePresetToggle from "./ThemePresetToggle.vue"

export default {
  name: 'Footer',
  components: {
    ThemePresetToggle,
  },
  data() {
    return {
      loggedInState: null,
    }
  },
  computed: {
    isLoggedIn() {
      return !!(this.loggedInState?.value ?? this.loggedInState)
    },
  },
  created() {
    const {getIsLoggedIn} = useUser()
    this.loggedInState = getIsLoggedIn()
  },
}
</script>

<style scoped>
footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 2rem;
}

.footer-theme {
  justify-self: end;
}
</style>
