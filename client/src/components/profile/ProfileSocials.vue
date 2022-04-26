<template>
  <div class="socials">
    <button v-if="user === currentUser?.user?.userName" @click.prevent="toggleForm" class="addSocial">Add Social
    </button>
    <span v-if="error" class="error">{{error}}</span>
    <form v-if="socialForm" @submit.prevent="addSocial">
      <div class="input">
        <label for="socialName">Social</label>
        <input
            :placeholder="
          socialType === '' ? 'Social Media' : '' ||
          socialType === 'tel:' ? 'My Phone' : '' ||
          socialType === 'mailto:' ? 'My Email' : '' "
            type="text"
            name="socialName"
            id="socialName">
      </div>
      <div class="input">
        <label for="socialType">Type</label>
        <select v-model="socialType" id="socialType" name="socialType">
          <option value="">web</option>
          <option value="tel:">phone</option>
          <option value="mailto:">email</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="input">
        <label for="socialValue">Value</label>
        <input
            :placeholder="
          socialType === '' ? 'http://www.website.com' : '' ||
          socialType === 'tel:' ? '555-123-4567' : '' ||
          socialType === 'mailto:' ? 'email@email.com' : '' "
            type="text"
            name="socialValue"
            id="socialValue">
      </div>
      <input type="submit" value="add">
    </form>
    <div class="social-links" v-for="social in socials" :key="social.id">
      <p class="social-label">{{ social?.socialName }}</p>&nbsp;
      <p v-if="social?.socialType === 'other'">{{ social?.socialValue }}</p>
      <a v-else :href="social?.socialType+social?.socialValue"
                class="social-value">{{ social?.socialValue }}
      </a>
      <button v-if="user === currentUser?.user?.userName"
          @click.prevent="deleteSocial"
          :data-id="social?._id">
        <i class="fa fa-trash-o" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script>
import useUser from "../../composables/user"
import UserService from "../../services/UserService";

export default {
  name: "ProfileSocials",
  data() {
    return {
      socials: [],
      socialForm: false,
      socialType: '',
      user: {},
      currentUser: {},
      error: ''
    }
  },
  async created() {
    try {
      const {getUser} = useUser()
      this.currentUser = getUser()
      this.user = this?.$route?.params?.username
      if(this?.user) {
        const res = await UserService.getUserByUsername(this?.user)
        if (res.status === 200) {
          const {socials} = res?.data?.userProfile
          this.socials = socials
        }
      }
    } catch(err) {
      console.log(err.message)
    }
  },
  methods: {
    toggleForm() {
      this.socialForm = !this.socialForm
      this.error = ''
    },
    async addSocial(e) {
      try {
        this.error = ''
        const {getUser} = useUser()
        const {user} = getUser().value
        const {socialName, socialType, socialValue} = Object.fromEntries(new FormData(e.target))
        if (user?._id) {
          if(socialType === '') {
            const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
            const regex = new RegExp(expression)
            if (!socialValue.match(regex)) {
              return this.error = 'Improper web format! Must use http:// OR https:// Example: http://website.com'
            }
          }
          if(socialType === 'mailto:') {
            const expression = /^\S+@\S+\.\S+$/ig
            const regex = new RegExp(expression)
            if(!socialValue.match(regex)) {
              return this.error = 'Invalid email format! Example: myname@email.com'
            }
          }
          if(socialType === 'tel:') {
            const expression = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/ig
            const regex = new RegExp(expression)
            if(!socialValue.match(regex)) {
              return this.error = 'Invalid phone format!'
            }
          }
          if(socialType === 'other') {
            if(socialValue?.trim()?.length < 1) {
              return this.error = 'Invalid! must have a value'
            }
          }
          if(socialName?.trim()?.length < 1) {
            return this.error = 'Invalid! social name must have a value'
          }
          const data = {
            socialName,
            socialType,
            socialValue
          }
          const res = await UserService.updateUser(user?._id, data)
          if (res.status === 200) {
            const {socials} = res?.data?.userProfile
            this.socialForm = false
            this.socialType = ''
            this.socials = socials
          }
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async deleteSocial(e) {
      try {
        const {getUser} = useUser()
        const {user} = getUser().value
        const id = e?.target?.dataset?.id
        console.log(id)
        const data = {
          removeSocial: id
        }
        const res = await UserService.updateUser(user?._id, data)
        console.log(res)
        if (res.status === 200) {
          const {socials} = res?.data?.userProfile
          this.socials = socials
        }
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}
</script>

<style scoped>
.socials {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

button {
  max-width: max-content;
}

.socials form {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.input {
  display: flex;
  gap: .5rem;
  align-items: center;
}

.social-links {
  display: grid;
  grid-auto-flow: column;
  gap: 1rem;
  grid-template-columns: minmax(1fr, 65ch) minmax(max-content, 1fr);
  max-width: max-content;
}

a {
  grid-column: 3;
  text-decoration: none;
  color: var(--clr-primary-200);
}

i {
  pointer-events: none;
}

input[type=text],
select,
option {
  border: 1px solid var(--clr-border);
  border-radius: 5px;
  background-color: var(--clr-bg);
  color: var(--clr-text);
  padding: .25rem .5rem;
}

button,
input[type=submit] {
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: var(--txt-med);
  padding: .1rem .65rem;
  font-weight: 500;
  color: var(--clr-btn);
  background-color: var(--clr-btn-bg);
  cursor: pointer;
}
</style>