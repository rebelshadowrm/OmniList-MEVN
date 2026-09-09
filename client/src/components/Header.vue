<template>
<header>
  <nav id="nav">
    <router-link class="logo-link" to="/">
      <img class="logo" src="../assets/logo.png" alt="omni list logo"/>
      <span>mni</span><span class="list l">L</span><span class="list">ist</span>
    </router-link>

    <div class="nav-items">
      <router-link to="/">Home</router-link>
      <router-link v-if="user?.user?.role === 'ADMIN' || user?.user?.role === 'MOD'" to="/admin">Admin</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/anime">Anime</router-link>
      <router-link to="/manga">Manga</router-link>
      <router-link to="/movies">Movies</router-link>
      <router-link to="/books">Books</router-link>
      <router-link to="/tv">TV</router-link>
      <router-link v-if="isLoggedIn" to="/discussions">Discussions</router-link>
      <router-link v-if="isLoggedIn" to="/reviews">Reviews</router-link>
    </div>
    <router-link class="login-link" v-if="!isLoggedIn" to="/login">Login / Register</router-link>
    <div v-if="isLoggedIn" class="profile-menu">
      <button
          id="profile-menu-trigger"
          ref="profileMenuTrigger"
          class="profile-menu-trigger dropdown-title"
          type="button"
          popovertarget="profile-menu-popover"
          :aria-expanded="fallbackMenuOpen ? 'true' : 'false'"
          aria-haspopup="menu"
          aria-controls="profile-menu-popover"
          @click="toggleFallbackMenu">
        <img
            class="user"
            :src="imageSrc(user?.user?.img, 'avatar', user?.user?.userName)"
            :alt="user?.user?.userName"
            @error="setFallbackImage($event, 'avatar', user?.user?.userName)"/>
        <span class="username">{{user?.user?.userName ?? ''}}</span>
      </button>
      <div
          id="profile-menu-popover"
          ref="profileMenuPopover"
          class="dropdown-items-nav profile-menu-popover"
          :class="{ 'is-fallback-open': !supportsPopover && fallbackMenuOpen }"
          popover="auto"
          role="menu"
          @toggle="syncPopoverState">
        <router-link role="menuitem" :to="profilePath" @click="closeProfileMenu">Profile</router-link>
        <router-link role="menuitem" to="/inbox" @click="closeProfileMenu">Inbox</router-link>
        <router-link role="menuitem" to="/settings" @click="closeProfileMenu">Settings</router-link>
        <button role="menuitem" type="button" class="menu-action" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</header>
</template>

<script>
import setLogin from "../composables/user";
import useTheme from "../composables/theme"
import UserService from "../services/UserService";
import {imageOrFallback, useFallbackImage} from "../utils/fallbackImages";
export default {
  name: "Header",
  data() {
    return {
      fallbackMenuOpen: false,
      supportsPopover: false,
    }
  },
  mounted() {
    this.supportsPopover = typeof HTMLElement !== 'undefined'
        && typeof HTMLElement.prototype.showPopover === 'function'
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    toggleFallbackMenu(event) {
      if (this.supportsPopover) {
        return
      }

      event.preventDefault()
      this.fallbackMenuOpen = !this.fallbackMenuOpen
    },
    closeProfileMenu() {
      this.fallbackMenuOpen = false

      const popover = this.$refs.profileMenuPopover
      if (this.supportsPopover && popover?.matches?.(':popover-open')) {
        popover.hidePopover()
      }
    },
    syncPopoverState(event) {
      this.fallbackMenuOpen = event.newState
          ? event.newState === 'open'
          : event.target?.matches?.(':popover-open') ?? false
    },
    async logout(e) {
      const res = await UserService.logoutUser()
      if(res.status === 204) {
        this.closeProfileMenu()
        const {setIsLoggedIn} = setLogin()
        setIsLoggedIn(false)
        const {clearThemes} = useTheme()
        clearThemes()
        await this.$router.push('/')
      } else {
        alert('Something went wrong logging you out, please try again later.')
      }
    },
  }
}
</script>
<script setup>
import {computed} from 'vue'
import useUser from "../composables/user";
const {getIsLoggedIn, getUser} = useUser()
const isLoggedIn = getIsLoggedIn()
const user = getUser()
const profilePath = computed(() => `/profile/${user.value?.user?.userName ?? ''}`)
</script>

<style scoped>
header {
  display: grid;
  position: relative;
  z-index: 1;
}
nav {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content 1fr max-content;
  grid-template-areas:'logo nav user';
  padding: .25rem .75rem .75rem .75rem;
  gap: 1.25em;
  overflow-x: auto;
  overflow-y: clip;
  width: 100%;
  background-color: var(--clr-secondary-800-5);
}
@media (width <= 820px) {
  nav {
    padding: .15rem;
    grid-template-columns: 1fr max-content;
    grid-template-areas: 'logo user'
                          'nav nav';
  }

}
.nav-items {
  grid-area: nav;
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-self: center;
  align-self: end;
}
.nav-items a {
  position: relative;
  display: inline-block;
  color: var(--clr-text);
  font-size: var(--txt-med);
  font-weight: 300;
  font-family: var(--ff-mono);
  text-decoration: none;
  text-transform: uppercase;
}
.nav-items a.active {
  color: var(--clr-accent-400);
  font-weight: 600;
}
.nav-items a::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  background: var(--clr-accent-400);
  height: 2px;
  border-radius: var(--radius-sm);
  visibility: hidden;
  transform: scaleX(0);
  transition: transform ease .5s;
}
.nav-items a:hover::after {
  visibility: visible;
  transform: scaleX(1);
}
.logo-link {
  display: flex;
  text-decoration: none;
  place-items: end;
}
.logo-link span {
  font-size: var(--txt-lrg);
  align-self: end;
  color: var(--clr-primary-400);
  font-weight: 700;
  letter-spacing: 1px;
  margin-left: -.45rem;
}
.logo {
  grid-area: logo;
  aspect-ratio: 1;
  height: 60px;
  margin: -.15rem -.15rem -.57rem -.2rem;
}
.user {
  grid-area: user;
  aspect-ratio: 1;
  height: 36px;
  border: 1px inset var(--clr-border);
  border-radius: var(--radius);
}
.username {
  place-self: end;
  font-weight: 500;
}
.profile-menu {
  grid-area: user;
  position: relative;
  justify-self: end;
  align-self: center;
}
.profile-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  color: var(--clr-text);
  background: transparent;
  border: 0;
  padding: .15rem .35rem;
  border-radius: var(--radius);
  cursor: pointer;
  font: inherit;
}
.profile-menu-trigger:hover,
.profile-menu-trigger:focus-visible {
  outline: 1px solid var(--clr-accent-400);
  outline-offset: 2px;
}
.profile-menu-popover {
  display: none;
  min-width: 10rem;
  padding: .35rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius);
  background: var(--clr-secondary-800);
  color: var(--clr-text);
  box-shadow: 0 .75rem 2rem hsl(0 0% 0% / .35);
  z-index: 20;
}
.profile-menu-popover:popover-open {
  display: grid;
  gap: .2rem;
  margin: 0;
  inset: 4.25rem .75rem auto auto;
}
.profile-menu-popover.is-fallback-open {
  display: grid;
  position: fixed;
  top: 4.25rem;
  right: .75rem;
  gap: .2rem;
}
.profile-menu-popover a,
.profile-menu-popover .menu-action {
  display: block;
  width: 100%;
  padding: .45rem .65rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--clr-text);
  font: inherit;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
}
.profile-menu-popover a:hover,
.profile-menu-popover a:focus-visible,
.profile-menu-popover .menu-action:hover,
.profile-menu-popover .menu-action:focus-visible {
  background: var(--clr-primary-400-3);
  color: var(--clr-accent-400);
}
@supports (position-anchor: --profile-menu-trigger) {
  .profile-menu-trigger {
    anchor-name: --profile-menu-trigger;
  }

  .profile-menu-popover:popover-open {
    position-anchor: --profile-menu-trigger;
    inset: auto;
    top: anchor(bottom);
    right: anchor(right);
    margin-top: .35rem;
  }
}
.login-link {
  grid-area: user;
  text-decoration: none;
  color: var(--clr-text);
  font-weight: 600;
  font-size: var(--txt-small);
  align-self: center;
  letter-spacing: 1px;
  padding: 0 .15rem;
}
span.list {
  color: var(--clr-accent-400);
}
span.l {
  margin: 0 -.5rem -1.4rem .15rem;
  font-size: var(--txt-xlrg);
}
@media (width <= 820px) {
  .profile-menu-popover {
    min-width: 9rem;
  }

  .username {
    max-width: 9ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
