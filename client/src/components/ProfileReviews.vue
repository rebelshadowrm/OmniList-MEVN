<template>
<div class="reviews-container">
  <div v-if="reviews.length > 0"
       v-for="review in reviews"
       :key="review.id" class="review">
    <router-link :to="'/anime/'+review.anime+'/reviews/'+review.reviewId">
      <div class="review-card">
        <div class="review-info">
          <p class="title">{{review.reviewName}}</p>
          <p class="anime">{{review.anime}}</p>
          <p class="comments">comments {{review.comments.length}}</p>
        </div>
        <div class="review-author">
          <p>{{review.author}}</p>
        </div>
      </div>
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  name: "ProfileReviews",
  data() {
    return {
      reviews: [],
    }
  },
  created() {
    //TODO: fetch reviews
    this.reviews = [
      {
        anime: "Some_Longer_Anime_Title_Here",
        reviewId: 12345,
        reviewName: "Anime Review Title",
        author: 'Mr.Joe Blow',
        comments: [
          {
            userId: "0123",
            userName: "username",
            comment: "I agree with your review"
          },
          {
            userId: "0124",
            userName: "username2",
            comment: "I disagree with your review"
          }
        ]
      }
    ]
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: var(--clr-text);
}
.review-card {
  border: 1px solid white;
  padding: 1rem;
}
.review-info {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.review-author {
  display: flex;
  justify-content: end;
  margin-top: .75em;
  font-size: var(--txt-small);
}
</style>