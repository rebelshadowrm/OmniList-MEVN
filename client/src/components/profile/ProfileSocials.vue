<template>
<div class="socials">
  <button @click.prevent="toggleForm" class="addSocial">Add Social</button>
  <form v-if="socialForm" @submit.prevent="addSocial">
    <div class="input">
      <label for="socialName">Social</label>
      <input type="text" name="socialName" id="socialName">
    </div>
    <div class="input">
      <label for="socialType">Type</label>
      <select id="socialType" name="socialType">
        <option value="">link</option>
        <option value="tel:">phone</option>
        <option value="mailto:">email</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="input">
      <label for="socialValue">Value</label>
      <input type="text" name="socialValue" id="socialValue">
    </div>

  </form>
  <div class="social-links" v-for="social in socials" :key="social.id">
    <p class="social-label">{{social?.socialName}}</p>&nbsp;
    <p v-if="social?.socialType === 'other'">{{social?.socialValue}}</p>
    <a v-else :href="social?.socialType+social?.socialValue"
             class="social-value">{{social?.socialValue}}</a>
  </div>
</div>
</template>

<script>
export default {
  name: "ProfileSocials",
  data() {
    return {
      socials: [],
      socialForm: false,
    }
  },
  created() {
    //TODO: fetch user socials else this fallback
    //TODO: set href, href tel:, and href mailto: for link, phone, email dropdown
    this.socials = [
      {
        socialName: 'ex. Email',
        socialType: 'mailto:',
        socialValue: 'email@email.com'
      },
      {
        socialName: 'ex. Phone',
        socialType: 'tel:',
        socialValue: '8675309'
      },
    ]
  },
  methods: {
    toggleForm() {
      this.socialForm = !this.socialForm
    },
    async addSocial(e) {

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
</style>