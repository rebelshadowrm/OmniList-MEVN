<template>
  <section>
    <div class="section-heading">
      <h2>Profile</h2>
      <button class="save-btn" @click="$emit('save')">
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>

    <form class="settings-form" @submit.prevent="$emit('save')">
      <div class="image-row">
        <img
            class="avatar-preview"
            :src="avatarPreview"
            :alt="modelValue.imgAlt || modelValue.userName">
        <div class="banner-preview" :style="bannerPreviewStyle">
          <span>{{ modelValue.userName }}</span>
        </div>
      </div>

      <div class="field">
        <label for="firstName">First name</label>
        <input
            id="firstName"
            :value="modelValue.firstName"
            autocomplete="given-name"
            type="text"
            @input="updateField('firstName', $event.target.value.trim())">
      </div>

      <div class="field">
        <label for="lastName">Last name</label>
        <input
            id="lastName"
            :value="modelValue.lastName"
            autocomplete="family-name"
            type="text"
            @input="updateField('lastName', $event.target.value.trim())">
      </div>

      <div class="field">
        <label for="dateOfBirth">Date of birth</label>
        <input
            id="dateOfBirth"
            :value="modelValue.dateOfBirth"
            type="date"
            @input="updateField('dateOfBirth', $event.target.value)">
      </div>

      <div class="field">
        <label for="img">Avatar URL</label>
        <input
            id="img"
            :value="modelValue.img"
            type="url"
            @input="updateField('img', $event.target.value.trim())">
      </div>

      <div class="field">
        <label for="bgImg">Banner URL</label>
        <input
            id="bgImg"
            :value="modelValue.bgImg"
            type="url"
            @input="updateField('bgImg', $event.target.value.trim())">
      </div>

      <div class="field">
        <label for="imgAlt">Avatar alt text</label>
        <input
            id="imgAlt"
            :value="modelValue.imgAlt"
            type="text"
            @input="updateField('imgAlt', $event.target.value.trim())">
      </div>

      <div class="field full-field">
        <label for="bio">Bio</label>
        <textarea
            id="bio"
            :value="modelValue.bio"
            rows="5"
            @input="updateField('bio', $event.target.value)"></textarea>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "SettingsProfilePanel",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    avatarPreview: {
      type: String,
      required: true,
    },
    bannerPreviewStyle: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue', 'save'],
  methods: {
    updateField(field, value) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [field]: value,
      })
    },
  },
}
</script>

<style scoped>
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

h2 {
  color: var(--clr-primary-200);
}

.settings-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field {
  display: grid;
  gap: .35rem;
}

.full-field,
.image-row {
  grid-column: 1 / -1;
}

label {
  font-size: var(--txt-small);
  font-weight: 700;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .45rem .6rem;
  background: var(--clr-bg);
  color: var(--clr-text);
}

textarea {
  resize: vertical;
  min-height: 7rem;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .35rem .75rem;
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 700;
  cursor: pointer;
}

.image-row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1rem;
  align-items: stretch;
}

.avatar-preview {
  aspect-ratio: 1;
  width: 6rem;
  object-fit: cover;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
}

.banner-preview {
  min-height: 6rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--clr-bg);
  background-image: var(--preview-bg);
  background-position: center 40%;
  background-repeat: no-repeat;
  background-size: cover;
  color: hsl(var(--clr-white-200));
  font-weight: 800;
  text-shadow: 0 2px 2px hsl(var(--clr-black) / .7);
}

@media (max-width: 42rem) {
  .settings-form,
  .image-row {
    grid-template-columns: 1fr;
  }

  .avatar-preview {
    width: 5rem;
  }
}
</style>
