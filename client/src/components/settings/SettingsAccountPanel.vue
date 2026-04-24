<template>
  <section>
    <div class="section-heading">
      <h2>Account</h2>
      <button class="save-btn" @click="$emit('save')">
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>

    <form class="settings-form" @submit.prevent="$emit('save')">
      <div class="field">
        <label for="userName">Username</label>
        <input
            id="userName"
            :value="modelValue.userName"
            autocomplete="username"
            type="text"
            @input="updateField('userName', $event.target.value.trim())">
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input
            id="email"
            :value="modelValue.email"
            type="email"
            disabled>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "SettingsAccountPanel",
  props: {
    modelValue: {
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

label {
  font-size: var(--txt-small);
  font-weight: 700;
}

input {
  width: 100%;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .45rem .6rem;
  background: var(--clr-bg);
  color: var(--clr-text);
}

input:disabled {
  opacity: .68;
  cursor: not-allowed;
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

@media (max-width: 42rem) {
  .settings-form {
    grid-template-columns: 1fr;
  }
}
</style>
