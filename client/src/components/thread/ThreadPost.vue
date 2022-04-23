<template>
  <div class="post">
    <h1>
      <span role="textbox"
            contenteditable="false"
            class="title">
        {{ post?.title }}
      </span>
    </h1>
    <router-link :to="`/anime/${post?.subjectId}`">
      <p class="subject">{{ post?.subject }}</p>
    </router-link>
    <router-link class="author" :to="`/profile/${post?.author}`">
      <img :src="post?.authorImg ?? `https://picsum.photos/seed/${post?.author}/50`" alt="">
      <p>{{ post?.author }}</p>
    </router-link>
    <span :data-id="post?.id"
        role="textbox"
        contenteditable="false"
        class="body">{{ post?.body }}</span>
    <div class="inputs">
      <hr/>
      <div class="buttons">
        <button @click="cancel" class="cancel">cancel</button>
        <button @click="savePost" class="save">save</button>
      </div>
    </div>
    <i @click="menuToggle = !menuToggle" class="fas fa-ellipsis-v"></i>
    <ul v-if="menuToggle" class="menu">
      <li v-if="post?.authorId !== loggedInUser?.user?._id"
          @click="reportPost" class="menu-item">Report
      </li>
      <li v-if="loggedInUser?.user?.role === 'admin'"
          @click="suspendPost" class="menu-item">Suspend
      </li>
      <li v-if="post?.authorId === loggedInUser?.user?._id"
          @click="editPost" class="menu-item">Edit
      </li>
      <li v-if="post?.authorId === loggedInUser?.user?._id"
          @click="deletePost" class="menu-item">Delete
      </li>
    </ul>
  </div>
</template>

<script>
import ThreadService from "../../ThreadService";
import useUser from "../../composables/user";
import router from "../../router";

export default {
  name: "ThreadPost",
  props: {
    post: Object,
    type: String
  },
  data() {
    return {
      loggedInUser: {},
      menuToggle: false,
      revertBody: '',
      revertTitle: '',
    }
  },
  created() {
    const {getUser} = useUser()
    this.loggedInUser = getUser()
  },
  methods: {
    reportPost(e) {
      this.menuToggle = false;
      const body = e.target.parentNode.parentNode.querySelector(".body")
      const id = body.dataset.id
    },
    suspendPost(e) {
      this.menuToggle = false;
      const body = e.target.parentNode.parentNode.querySelector(".body")
      const id = body.dataset.id
    },
    editPost(e) {
      this.menuToggle = false;
      const body = e.target.parentNode.parentNode.querySelector(".body")
      const title = e.target.parentNode.parentNode.querySelector(".title")
      this.revertBody = body.textContent
      this.revertTitle = title.textContent
      body.contentEditable = true
      title.contentEditable = true
    },
    async savePost(e) {
      const body = e.target.parentNode.parentNode.parentNode.querySelector(".body")
      const title = e.target.parentNode.parentNode.parentNode.querySelector(".title")
      const id = body.dataset.id
      console.log(id)
      if (this.type === 'discussion') {
        try {
          const data = {
            title: title.textContent,
            body: body.textContent
          }
          const res = await ThreadService.updateDiscussion(id, data)
          if (res.status === 200) {
            body.contentEditable = false
            title.contentEditable = false
          }
        } catch(err) {
          console.log(err.message)
        }
      }
      if (this.type === 'review') {
        try {
          const data = {
            title: title.textContent,
            body: body.textContent
          }
          const res = await ThreadService.updateReview(id, data)
          if (res.status === 200) {
            body.contentEditable = false
            title.contentEditable = false
          }
        } catch(err) {
          console.log(err.message)
        }
      }
    },
    async deletePost(e) {
      this.menuToggle = false;
      const body = e.target.parentNode.parentNode.querySelector(".body")
      const id = body.dataset.id
      if (this.type === 'discussion') {
        try {
          const res = await ThreadService.deleteDiscussionById(id)
          if(res.status === 204) {
            await router.go('/discussions')
          }
        } catch(err) {
          console.log(err.message)
        }
      }
      if (this.type === 'review') {
        try {
          const res = await ThreadService.deleteReviewById(id)
          if (res.status === 204) {
            await router.go('/reviews')
          }
        } catch(err) {
          console.log(err.message)
        }
      }
    },
    cancel(e) {
      const body = e.target.parentNode.parentNode.parentNode.querySelector(".body")
      const title = e.target.parentNode.parentNode.parentNode.querySelector(".title")
      body.textContent = this.revertBody
      title.textContent = this.revertTitle
      body.contentEditable = false
      title.contentEditable = false
    },
  }
}
</script>

<style scoped>
.post {
  position: relative;
  padding: 1em 2em;
  background-color: var(--clr-bg);
  /*
  border-radius: var(--radius);
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
   */
  border-bottom: 1px solid hsl(0deg 0% 100% / .5);
  line-height: 1.25;
}
a {
  display: block;
  color: var(--clr-text);
  text-decoration: none;
  max-width: fit-content;
}

.title,
.body {
  display: inline-block;
  color: var(--clr-text);
  background-color: transparent;
  outline: none;
  padding: 0 0 .3rem 0;
}

.title[contenteditable = false],
.body[contenteditable = false] {
  cursor: default;
  border: none;
}

.body[contenteditable = false] + .inputs {
  display: none;
}

.title[contenteditable = false] + .inputs {
  display: none;
}
.author {
  padding: .25rem 0;
  display: flex;
  gap: .5rem;
}
.author p {
  font-weight: 300;
  font-size: var(--txt-small);
  place-self: end;
}
.author img {
  height: 25px;
  border-radius: var(--radius);
}
.subject {
  font-weight: 500;
  font-size: var(--txt-small);
}

.title {
  font-weight: 700;
  font-size: var(--txt-med);
  border-bottom: 1px solid hsl(0deg 0% 100% / .5);
  width: 90%;
  padding-bottom: .2rem;
  margin-bottom: .3rem;
}
.body {
  font-size: var(--txt-small);
  width: 100%;
  margin-top: 1rem;
}

.buttons {
  display: flex;
  place-content: end;
}
button {
  border: none;
  outline: none;
  font-weight: 500;
  padding: .15rem .55rem;
  font-size: var(--txt-med);
}
.cancel {
  background-color: transparent;
  color: var(--clr-text);
  cursor: pointer;
}
.save {
  background-color: var(--clr-secondary-600);
  color: var(--clr-text);
  cursor: pointer;
}

hr {
  margin-top: 0;
}
i {
  position: absolute;
  inset: 1rem 2rem auto auto;
  padding: .5rem;
  border-radius: 100vw;
  opacity: 0;
  cursor: pointer;
}
.post:hover i {
  opacity: 1
}
.menu {
  position: absolute;
  inset: 3.5rem -1.75rem auto auto;
  user-select: none;
  z-index: 1;
  padding: .25rem;
  border-width: 1px;
  border-radius: 3px;
  border-style: solid;
  border-color: var(--clr-border);
  background-color: var(--clr-bg);
}
.menu-item {
  padding: 0 .5rem;
}
.menu-item:hover {
  background-color: var(--clr-secondary-600-3);
  cursor: pointer;
}
</style>