<template>
  <section class="media-thread-section">
    <div class="section-header">
      <h2>Reviews</h2>
      <router-link v-if="showCreateAction && isAuthenticated"
                   class="create-link"
                   :to="createRoute">Create Review</router-link>
      <p v-else-if="showCreateAction" class="account-prompt">
        <router-link to="/login">Log in or create an account</router-link> to add a review.
      </p>
    </div>
    <ThreadCollection type="review" :threads="reviewSlice"/>
  </section>
</template>

<script>
import ThreadCollection from "../thread/ThreadCollection.vue";
export default {
  name: "MediaReviews",
  components: {
    ThreadCollection
  },
  props: {
    section: String,
    reviews: Array,
    subject: String,
    subjectId: [Number, String],
    mediaType: {
      type: String,
      default: 'ANIME',
    },
    source: {
      type: String,
      default: 'ANILIST',
    },
    isAuthenticated: Boolean,
  },
  data() {
    return {
      limit: 3
    }
  },
  computed: {
    reviewSlice() {
      return this?.limit ? this?.reviews?.slice(0, this?.limit) : this?.reviews
    },
    showCreateAction() {
      if (this.section === 'reviews') {
        return true
      }

      return this.section === 'overview' && (this.reviews?.length ?? 0) < this.limit
    },
    createRoute() {
      return {
        name: 'Reviews',
        query: {
          add: 'true',
          subject: this.subject,
          subjectId: this.subjectId,
          mediaType: this.mediaType,
          source: this.source,
        },
      }
    }
  },
  created() {
    if (this && this?.section === 'reviews') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  },
  updated() {
    if (this && this?.section === 'reviews') this.limit = null
    if (this && this?.section === 'overview') this.limit = 3
  }
}
</script>

<style scoped>
.media-thread-section {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: .75rem;
}
.create-link,
.account-prompt a {
  color: var(--clr-primary-400);
  font-weight: 600;
  text-decoration: none;
}
.create-link {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xs);
  padding: .2rem .65rem;
  background-color: var(--clr-btn-bg);
  color: var(--clr-btn);
}
.account-prompt {
  font-size: var(--txt-small);
}
</style>
