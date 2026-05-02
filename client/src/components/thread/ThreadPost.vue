<template>
  <div class="post">
    <span v-if="error" class="error">{{ error }}</span>
    <h1>
      <span v-if="!isEditing" class="title">{{ post?.title }}</span>
      <input v-else
             v-model="draftTitle"
             class="title title-input"
             type="text">
    </h1>
    <router-link :to="subjectPath">
      <p class="subject">{{ post?.subject }}</p>
    </router-link>
    <router-link class="author" :to="`/profile/${post?.author}`">
      <img :src="imageSrc(post?.authorImg, 'avatar', post?.author)"
           :alt="post?.author"
           @error="setFallbackImage($event, 'avatar', post?.author)">
      <p>{{ post?.author }}</p>
    </router-link>
    <p v-if="!isEditing" class="body">{{ post?.body }}</p>
    <textarea v-else
              v-model="draftBody"
              class="body body-input"
              rows="8"></textarea>
    <div v-if="isEditing" class="inputs">
      <hr/>
      <div class="buttons">
        <button @click="cancel" class="cancel">cancel</button>
        <button @click="savePost" class="save">save</button>
      </div>
    </div>
    <i @click="menuToggle = !menuToggle" class="fas fa-ellipsis-v"></i>
    <ul v-if="menuToggle" class="menu">
      <li v-if="post?.authorId !== loggedInUser?.user?._id && loggedInUser?.user?.role !== 'ADMIN' && loggedInUser?.user?.role !== 'MOD'"
          @click="reportPost" class="menu-item">Report
      </li>
      <li v-if="loggedInUser?.user?.role === 'ADMIN' || loggedInUser?.user?.role === 'MOD'"
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
import ThreadService from "../../services/ThreadService";
import useUser from "../../composables/user";
import {mediaConfig} from "../../config/mediaTypes.js";
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";

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
      isEditing: false,
      revertBody: '',
      revertTitle: '',
      draftBody: '',
      draftTitle: '',
      error: ''
    }
  },
  created() {
    const {getUser} = useUser()
    this.loggedInUser = getUser()
  },
  watch: {
    post: {
      handler(post) {
        this.revertBody = post?.body ?? ''
        this.revertTitle = post?.title ?? ''
        this.draftBody = post?.body ?? ''
        this.draftTitle = post?.title ?? ''
      },
      immediate: true,
    },
  },
  computed: {
    postId() {
      return this.post?._id ?? this.post?.id
    },
    subjectPath() {
      const mediaType = this.post?.entityRef?.domain ?? this.post?.mediaType
      const subjectId = this.post?.entityRef?.externalId ?? this.post?.sourceId ?? this.post?.subjectId
      const config = mediaConfig(mediaType)

      return subjectId ? `/${config.path}/${subjectId}` : '/'
    },
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    async reportPost() {
      this.menuToggle = false
      const id = this.postId
      const data = {flagged: true}

      try {
        const res = this.type === 'discussion'
          ? await ThreadService.updateDiscussion(id, data)
          : await ThreadService.updateReview(id, data)

        if (res?.status === 200) {
          this.isEditing = false
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async suspendPost() {
      this.menuToggle = false
      const id = this.postId
      const data = {suspended: true}

      try {
        const res = this.type === 'discussion'
          ? await ThreadService.updateDiscussion(id, data)
          : await ThreadService.updateReview(id, data)

        if (res?.status === 200) {
          this.isEditing = false
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    editPost() {
      this.menuToggle = false
      this.error = ''
      this.draftBody = this.post?.body ?? ''
      this.draftTitle = this.post?.title ?? ''
      this.isEditing = true
    },
    async savePost() {
      const id = this.postId
      const title = this.draftTitle?.trim()
      const body = this.draftBody?.trim()

      this.error = ''
      if (title?.length < 1 || body?.length < 1) {
        this.error = 'Invalid! Title and Body cannot be empty.'
        return
      }

      try {
        const data = {title, body}
        const res = this.type === 'discussion'
          ? await ThreadService.updateDiscussion(id, data)
          : await ThreadService.updateReview(id, data)

        if (res?.status === 200) {
          this.post.title = title
          this.post.body = body
          this.revertTitle = title
          this.revertBody = body
          this.isEditing = false
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async deletePost() {
      this.menuToggle = false
      const id = this.postId

      try {
        const res = this.type === 'discussion'
          ? await ThreadService.deleteDiscussionById(id)
          : await ThreadService.deleteReviewById(id)

        if (res?.status === 204) {
          await this.$router.push(this.type === 'discussion' ? '/discussions' : '/reviews')
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    cancel() {
      this.error = ''
      this.draftBody = this.revertBody
      this.draftTitle = this.revertTitle
      this.isEditing = false
    },
  }
}
</script>

<style scoped>
.post {
  position: relative;
  padding: 1em 2em;
  background-color: var(--clr-bg);
  border-bottom: 1px solid var(--clr-border);
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
  width: 100%;
  color: var(--clr-text);
  background-color: transparent;
  outline: none;
  padding: 0 0 .3rem 0;
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
  border-bottom: 1px solid var(--clr-border);
  width: 90%;
  padding-bottom: .2rem;
  margin-bottom: .3rem;
}

.body {
  font-size: var(--txt-small);
  margin-top: 1rem;
  white-space: pre-wrap;
}

.title-input,
.body-input {
  border: 1px solid var(--clr-border);
  padding: .4rem .55rem;
}

.body-input {
  min-height: 10rem;
  resize: vertical;
}

.buttons {
  display: flex;
  place-content: end;
}

button {
  border: none;
  outline: none;
  font-weight: 500;
  padding: .35rem .55rem;
  font-size: var(--txt-med);
}

.cancel {
  background-color: transparent;
  color: var(--clr-text);
  cursor: pointer;
}

.save {
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
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
  border-radius: var(--radius-xs);
  border-style: solid;
  border-color: var(--clr-border);
  background-color: var(--clr-bg);
}

.menu-item {
  padding: 0 .5rem;
}

.menu-item:hover {
  background-color: var(--clr-secondary-200-1);
  cursor: pointer;
}
</style>
