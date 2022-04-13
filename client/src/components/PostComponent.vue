<template>
  <div class="container">
    <h1>Latest Posts</h1>
    <div class="create-post">
      <label for="create-post">Say something...</label>
      <input type="text" id="create-post" v-model="text" placeholder="Create a post">
      <button @click="createPost">Post!</button>
    </div>
    <hr>
    <p class="error" v-if="error">{{error}}</p>
    <div class="posts-container">
      <div class="post"
          v-for="post in posts" :key="post._id"
          @dblclick="deletePost(post._id)">
        <div class="created-at">
          {{ `${post.createdAt.getMonth()}/` +
            `${post.createdAt.getDate()}/`  +
          `/${post.createdAt.getFullYear()}`}}
        </div>
        <p class="text">{{post.text}}</p>
      </div>
    </div>
  </div>
</template>
<script >
import PostService from "../PostService";

export default {
  name: 'PostComponent',
  data() {
    return {
      posts: [],
      error: '',
      text: ''
    }
  },
  async created() {
    try {
      this.posts = await PostService.getPosts()
    } catch(err) {
      this.error = err.message
    }
  },
  methods: {
    async createPost() {
      await PostService.insertPost(this.text)
      this.posts = await PostService.getPosts()
      this.text = ''
    },
    async deletePost(id) {
      await PostService.deletePost(id)
      this.posts = await PostService.getPosts()
    }
  }
}
</script>
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.post {
  position: relative;
  border: 1px solid #5bd658;
  background-color: #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.created-at {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px 5px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 13px;
}

p.text {
  text-align: right;
  color: hsl(var(--clr-black-800));
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}
</style>
