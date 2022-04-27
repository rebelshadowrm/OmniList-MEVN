<template>
<div class="overview-container">
  <h2>Bio</h2>
  <div class="bio">
    <span class="bio-text" role="textbox" contenteditable="false">{{bio}}</span>
    <div class="inputs">
      <hr/>
      <div class="buttons">
        <button @click="cancel" class="cancel">cancel</button>
        <button @click="save" class="save">save</button>
      </div>
    </div>
    <button v-if="user?._id === currentUser?.user?._id"
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
     user: {},
     currentUser: {}
   }
  },
  async beforeUpdate() {
    this.$watch(
        async () => this.$route.params,
        async (toParams) => {
          const {username} = await toParams
          if (username) {
            const res = await UserService.getUserByUsername(username)
            if(res.status === 200) {
              const data = res.data
              await this.updateBio(data)
            }
          }
        })
  },
  async beforeCreate() {
    try {
      const username = this?.$route?.params?.username
      if(username) {
        const res = await UserService.getUserByUsername(username)
        if(res.status === 200) {
          const {getUser} = useUser()
          this.currentUser = getUser()
          this.user = res.data
          const {bio} = res.data.userProfile
          this.bio = bio
        }
      }
    } catch(err) {
      console.log(err.message)
    }


  },
  methods: {
    async updateBio(data) {
      this.user = data
      const {bio} = data.userProfile
      this.bio = bio
    },
    editBio(e) {
      const bio = document.querySelector('.bio-text')
      this.revertBio = bio.textContent
      bio.contentEditable = true

    },
    async save(e) {
      const bio = document.querySelector('.bio-text')
      const data = {
        bio: bio.textContent
      }
      if(this?.user?._id) {
        const res = await UserService.updateUser(this?.user?._id, data)
        if (res.status === 200) {
          bio.contentEditable = false
        }
      }
    },
    cancel(e) {
      const bio = document.querySelector('.bio-text')
      bio.textContent = this.revertComment
      bio.contentEditable = false
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
}
.edit {
  padding: 0 .25rem;
  position: absolute;
  aspect-ratio: 1;
  border-radius: 5px;
  inset: -2rem 0 auto auto;
  color: var(--clr-btn);
  background-color: var(--clr-btn-bg);
}
.bio-text[contenteditable = false] {
  cursor: default;
}

.bio-text[contenteditable = false] + .inputs {
  display: none;
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