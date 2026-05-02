<template>
  <div class="response">
    <span v-if="error" class="error">{{ error }}</span>
    <p class="username">
      <router-link :to="`/profile/${response?.comment?.user?.userName}`">
        <img :src="imageSrc(response?.comment?.user?.img, 'avatar', response?.comment?.user?.userName)"
             :alt="response?.comment?.user?.userName"
             @error="setFallbackImage($event, 'avatar', response?.comment?.user?.userName)">
      </router-link>
      <router-link :to="`/profile/${response?.comment?.user?.userName}`">{{ response?.comment?.user?.userName }}
      </router-link>
    </p>
    <p v-if="!isEditing" class="comment">{{ response?.comment?.comment }}</p>
    <textarea v-else
              v-model="draftComment"
              class="comment comment-input"
              rows="5"></textarea>
    <div v-if="isEditing" class="inputs">
      <hr/>
      <div class="buttons">
        <button @click="cancel" class="cancel">cancel</button>
        <button @click="saveComment" class="save">save</button>
      </div>
    </div>
    <i @click="menuToggle = !menuToggle" class="fas fa-ellipsis-v"></i>
    <ul v-if="menuToggle" class="menu">
      <li v-if="response?.comment?.user?._id !== loggedInUser?.user?._id && loggedInUser?.user?.role !== 'ADMIN' && loggedInUser?.user?.role !== 'MOD'"
          @click="reportComment" class="menu-item">Report
      </li>
      <li v-if="loggedInUser?.user?.role === 'ADMIN' || loggedInUser?.user?.role === 'MOD'"
          @click="suspendComment" class="menu-item">Suspend
      </li>
      <li v-if="response?.comment?.user?._id === loggedInUser?.user?._id"
          @click="editComment" class="menu-item">Edit
      </li>
      <li v-if="response?.comment?.user?._id === loggedInUser?.user?._id"
          @click="deleteComment" class="menu-item">Delete
      </li>
    </ul>

  </div>
</template>

<script>
import useUser from "../../composables/user"
import ThreadService from "../../services/ThreadService";
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";

export default {
  name: "ThreadResponse",
  props: {
    response: {},
    id: [String, Number],
    type: String,
  },
  data() {
    return {
      menuToggle: false,
      loggedInUser: {},
      isEditing: false,
      revertComment: '',
      draftComment: '',
      error: ''
    }
  },
  created() {
    const {getUser} = useUser()
    this.loggedInUser = getUser()
  },
  watch: {
    response: {
      handler(response) {
        const comment = response?.comment?.comment ?? ''
        this.revertComment = comment
        this.draftComment = comment
      },
      immediate: true,
    },
  },
  computed: {
    commentId() {
      return this.response?._id
    },
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    async reportComment() {
      this.menuToggle = false
      const data = this.type === 'discussion'
        ? {
          discussionId: this.id,
          commentId: this.commentId,
          flagged: true
        }
        : {
          reviewId: this.id,
          commentId: this.commentId,
          flagged: true
        }

      const res = this.type === 'discussion'
        ? await ThreadService.updateDiscussionComment(data)
        : await ThreadService.updateReviewComment(data)

      if (res?.status === 200) {
        this.isEditing = false
      }
    },
    async suspendComment() {
      this.menuToggle = false
      const data = this.type === 'discussion'
        ? {
          discussionId: this.id,
          commentId: this.commentId,
          suspended: true
        }
        : {
          reviewId: this.id,
          commentId: this.commentId,
          suspended: true
        }

      const res = this.type === 'discussion'
        ? await ThreadService.updateDiscussionComment(data)
        : await ThreadService.updateReviewComment(data)

      if (res?.status === 200) {
        this.isEditing = false
        await this.$emit('update-replies', data)
      }
    },
    editComment() {
      this.menuToggle = false
      this.error = ''
      this.draftComment = this.response?.comment?.comment ?? ''
      this.isEditing = true
    },
    async saveComment() {
      const comment = this.draftComment?.trim()
      this.error = ''
      if (comment?.length < 1) {
        this.error = 'Invalid! Comment cannot be empty.'
        return
      }

      const data = this.type === 'discussion'
        ? {
          discussionId: this.id,
          commentId: this.commentId,
          comment
        }
        : {
          reviewId: this.id,
          commentId: this.commentId,
          comment
        }

      const res = this.type === 'discussion'
        ? await ThreadService.updateDiscussionComment(data)
        : await ThreadService.updateReviewComment(data)

      if (res?.status === 200) {
        this.response.comment.comment = comment
        this.revertComment = comment
        this.isEditing = false
      }
    },
    async deleteComment() {
      this.menuToggle = false
      const data = this.type === 'discussion'
        ? {
          discussionId: this.id,
          commentId: this.commentId
        }
        : {
          reviewId: this.id,
          commentId: this.commentId
        }

      const res = this.type === 'discussion'
        ? await ThreadService.deleteDiscussionComment(data)
        : await ThreadService.deleteReviewComment(data)

      if (res?.status === 204) {
        this.isEditing = false
        await this.$emit('update-replies', data)
      }
    },
    cancel() {
      this.error = ''
      this.draftComment = this.revertComment
      this.isEditing = false
    },
  }
}
</script>

<style scoped>
.response {
  position: relative;
  margin-inline: 1rem;
  padding: 1em 2em;
}

.comment {
  line-height: 1.25;
  display: inline-block;
  margin: .25rem 0 0 0;
  font-size: var(--txt-small);
  width: 100%;
  color: var(--clr-text);
  background-color: transparent;
  border: none;
  outline: none;
  white-space: pre-wrap;
}

.comment-input {
  resize: vertical;
  border: 1px solid var(--clr-border);
  padding: .4rem .55rem;
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

.response:hover i {
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

.username {
  display: flex;
  gap: .5rem;
}

.username img {
  height: 35px;
  border-radius: var(--radius);
}

.username a {
  display: block;
  font-size: var(--txt-small);
  text-decoration: none;
  color: var(--clr-text);
  max-width: fit-content;
  align-self: end;
}
</style>
