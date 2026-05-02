<template>
  <div class="overview-container">
    <h2>Bio</h2>
    <div class="bio">
      <p v-if="!isEditing" class="bio-text">{{ bio }}</p>
      <textarea v-else
                v-model="draftBio"
                class="bio-text bio-input"
                rows="6"></textarea>
      <div v-if="isEditing" class="inputs">
        <hr/>
        <div class="buttons">
          <button @click="cancel" class="cancel">cancel</button>
          <button @click="save" class="save">save</button>
        </div>
      </div>
      <button v-if="canEdit && !isEditing"
              @click.prevent="editBio"
              class="edit">
        <i class="fas fa-edit"></i>
      </button>
    </div>
  </div>
</template>

<script>
import UserService from "../../services/UserService";
import useUser from "../../composables/user"

export default {
  name: "ProfileOverview",
  data() {
    return {
      bio: '',
      revertBio: '',
      draftBio: '',
      isEditing: false,
      user: {},
      currentUser: {}
    }
  },
  created() {
    const {getUser} = useUser()
    this.currentUser = getUser()
    this.fetchProfile(this?.$route?.params?.username)
  },
  watch: {
    '$route.params.username': {
      handler(username) {
        this.fetchProfile(username)
      },
    },
  },
  computed: {
    canEdit() {
      const currentUser = this.currentUser?.value ?? this.currentUser

      return this.user?._id && this.user?._id === currentUser?.user?._id
    },
  },
  methods: {
    async fetchProfile(username) {
      try {
        if (!username) return

        const res = await UserService.getUserByUsername(username)
        if (res.status === 200) {
          await this.updateBio(res.data)
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async updateBio(data) {
      this.user = data
      const bio = data?.userProfile?.bio ?? ''
      this.bio = bio
      this.revertBio = bio
      this.draftBio = bio
      this.isEditing = false
    },
    editBio() {
      this.revertBio = this.bio
      this.draftBio = this.bio
      this.isEditing = true
    },
    async save() {
      const data = {
        bio: this.draftBio
      }
      if (this?.user?._id) {
        const res = await UserService.updateUser(this?.user?._id, data)
        if (res.status === 200) {
          await this.updateBio(res.data)
        }
      }
    },
    cancel() {
      this.draftBio = this.revertBio
      this.isEditing = false
    }
  }
}
</script>

<style scoped>
.overview-container {
  margin-inline: auto;
  width: min(100%, 60rem);
}

.bio {
  position: relative;
}

.bio-text {
  line-height: 1.25;
  display: inline-block;
  margin: .25rem 0 0 0;
  font-size: var(--txt-small);
  width: 100%;
  min-height: 5ch;
  color: var(--clr-text);
  background-color: transparent;
  border: none;
  outline: none;
  white-space: pre-wrap;
}

.bio-input {
  resize: vertical;
  border: 1px solid var(--clr-border);
  padding: .4rem .55rem;
}

.edit {
  padding: 0 .25rem;
  position: absolute;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  inset: -2rem 0 auto auto;
  color: var(--clr-btn);
  background-color: var(--clr-btn-bg);
}

hr {
  margin-top: 0;
}

.buttons {
  display: flex;
  place-content: end;
}

i {
  pointer-events: none;
}

button {
  border: none;
  outline: none;
  font-weight: 500;
  padding: .15rem .55rem;
  font-size: var(--txt-med);
  cursor: pointer;
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
</style>
