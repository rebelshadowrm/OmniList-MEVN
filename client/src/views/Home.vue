<template>
  <div v-if="loading" class="loading">
    <h1>Loading...</h1>
  </div>
  <div v-else class="loaded">
    <div v-if="isLoggedIn === true" class="news">
      <div class="credit">
        <h1>News</h1>
        <p>Brought to you by <a href="https://www.animenewsnetwork.com">Anime News Network</a></p>
      </div>
      <div class="news-container">
        <div v-for="news in newsArr"
             :key="news.id"
             class="news-card">
          <span class="category">{{news?.category[0]?.$?.term}}</span>
          <a :href="news?.id[0]">
            <h2>{{news?.title[0]?._}}</h2>
          </a>
          <p class="summary">{{news?.summary[0]?._}}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="forms">
    <Login @toggle-form="toggleForm" v-if="hasAccount === true && isLoggedIn === false"/>
    <Register @toggle-form="toggleForm" v-if="hasAccount === false && isLoggedIn === false"/>
  </div>
</template>

<script>
import PostComponent from "../components/PostComponent.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue";
import useUser from "../composables/user.js"
import UserService from "../services/UserService";

export default {
  name: "Home",
  components: {
    PostComponent,
    Login,
    Register
  },
  data() {
    return {
      isLoggedIn: false,
      hasAccount: false,
      users: [],
      newsArr: [],
      loading: true
    }
  },
  async created() {
    const {getIsLoggedIn} = useUser()
    this.isLoggedIn = getIsLoggedIn()
    this.loading = true
    const res = await fetch('/api/news')
    if(res.ok) {
      const data = await res.json()
      const {entry} = data.feed
      this.newsArr = entry
      this.loading = false
    }
  },
  methods: {
    toggleForm(e) {
      this.hasAccount = e
    },
  }
}
</script>

<style scoped>
.forms {
  padding: 2rem;
  margin-block: auto;
}
.loading {
  display: grid;
  place-items: center;
  height: 100%;
}
.credit {
  padding-top: 1rem;
  width: min(100% - 4rem, 30rem);
  margin-inline: auto;
}
.credit a {
  border-bottom: 1px solid var(--clr-secondary-400);
}
.news-container {
  display: flex;
  flex-wrap: wrap;
  margin-block: 2rem;
  gap: 1.25rem;
  justify-content: center;
}
.news-card {
  max-width: 35ch;
  border-radius: 1vmin;
  border: 1px solid var(--clr-secondary-400-5);
  background-color: var(--clr-secondary-800-5);
}
h2 {
  font-weight: 500;
  font-size: 1rem;
  background-color: hsl(0deg 0% 0% / .5);
  padding: .5rem;
}
.summary {
  padding: .5rem;
  font-size: var(--txt-small);
}
.category {
  display: block;
  background-color: var(--clr-secondary-400-5);
  border-radius: 1vmin 1vmin 0 0;
  padding: .2rem .4rem;
  font-weight: 500;
  font-size: var(--txt-small);
  text-align: center;
}
a {
  text-decoration: none;
  color: var(--clr-text);
}
</style>