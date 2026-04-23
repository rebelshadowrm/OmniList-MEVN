<template>
  <section class="home-preferences">
    <div class="section-heading">
      <div>
        <h2>Home Preferences</h2>
        <p>Choose what the home dashboard should emphasize.</p>
      </div>
      <button class="save-btn" type="button" @click="save">
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>

    <div class="preference-grid">
      <fieldset class="style-options">
        <legend>Home style</legend>
        <button v-for="style in stylePresets"
                :key="style.value"
                type="button"
                :class="{selected: draft.style === style.value}"
                @click="draft.style = style.value">
          <span>{{ style.label }}</span>
          <strong>{{ style.name }}</strong>
          <small>{{ style.description }}</small>
        </button>
      </fieldset>

      <fieldset class="interest-options">
        <legend>Interests</legend>
        <div v-for="option in mediaOptions" :key="option.key" class="interest-row">
          <div>
            <strong>{{ option.label }}</strong>
            <span>{{ option.benefit }}</span>
          </div>
          <div class="segmented-control">
            <button v-for="level in interestLevels"
                    :key="level.value"
                    type="button"
                    :class="{selected: draft.interests[option.key] === level.value}"
                    @click="setInterest(option.key, level.value)">
              {{ level.label }}
            </button>
          </div>
        </div>
      </fieldset>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </section>
</template>

<script>
import {
  HOME_INTEREST_LEVELS,
  HOME_MEDIA_OPTIONS,
  HOME_STYLE_PRESETS,
  normalizeHomePreferences,
} from "../../config/homePreferences"

export default {
  name: "HomePreferencePanel",
  emits: ['save'],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    message: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      mediaOptions: HOME_MEDIA_OPTIONS,
      interestLevels: HOME_INTEREST_LEVELS,
      stylePresets: HOME_STYLE_PRESETS,
      draft: normalizeHomePreferences(this.value),
    }
  },
  watch: {
    value: {
      deep: true,
      handler(value) {
        this.draft = normalizeHomePreferences(value)
      },
    },
  },
  methods: {
    setInterest(key, value) {
      this.draft = {
        ...this.draft,
        interests: {
          ...this.draft.interests,
          [key]: value,
        },
      }
    },
    save() {
      this.$emit('save', normalizeHomePreferences(this.draft))
    },
  },
}
</script>

<style scoped>
.home-preferences {
  display: grid;
  gap: 1rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading p {
  font-size: var(--txt-small);
}

h2,
legend {
  color: var(--clr-primary-200);
}

.preference-grid {
  display: grid;
  grid-template-columns: minmax(16rem, .8fr) minmax(0, 1.2fr);
  gap: 1rem;
}

fieldset {
  display: grid;
  gap: .75rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
}

legend {
  margin-bottom: .35rem;
  font-weight: 800;
}

.style-options > button {
  display: grid;
  gap: .15rem;
  width: 100%;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .75rem;
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  text-align: left;
  cursor: pointer;
}

.style-options > button.selected {
  border-color: var(--clr-primary-200);
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
}

.style-options span,
.interest-row span,
small {
  font-size: var(--txt-small);
}

.interest-row {
  display: grid;
  grid-template-columns: minmax(10rem, 1fr) max-content;
  gap: 1rem;
  align-items: center;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .75rem;
  background: var(--clr-secondary-800-3);
}

.interest-row > div:first-child {
  display: grid;
  gap: .15rem;
}

.segmented-control {
  display: grid;
  grid-auto-flow: column;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.segmented-control button {
  border: none;
  border-left: 1px solid var(--clr-border);
  padding: .45rem .6rem;
  color: var(--clr-text);
  background: var(--clr-bg);
  cursor: pointer;
}

.segmented-control button:first-child {
  border-left: none;
}

.segmented-control button.selected {
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 800;
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

.message {
  color: var(--clr-primary-200);
  font-weight: 700;
}

@media (max-width: 58rem) {
  .preference-grid,
  .interest-row {
    grid-template-columns: 1fr;
  }

  .segmented-control {
    grid-auto-flow: row;
  }

  .segmented-control button {
    border-left: none;
    border-top: 1px solid var(--clr-border);
  }

  .segmented-control button:first-child {
    border-top: none;
  }
}
</style>
