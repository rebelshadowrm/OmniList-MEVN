<template>
  <div class="container">
    <h1>About the project</h1>
    <dl>
      <dt>The
        <span class="mongo">M</span>
        <span class="express">E</span>
        <span class="vue">V</span>
        <span class="node">N</span>
        Stack</dt>
      <dd class="mongo">Mongo DB <img src="https://img.icons8.com/color/48/000000/mongodb.png"/></dd>
      <dd class="express">Express.js <img src="../assets/expressjs-icon.svg" alt=""></dd>
      <dd class="vue">Vue (Vite) <img src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/000000/external-vuejs-an-open-source-javascript-framework-for-building-user-interfaces-and-single-page-applications-logo-shadow-tal-revivo.png"/></dd>
      <dd class="node">Node <img src="../assets/nodejs-horizontal.svg"/></dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "About"
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 2rem;
}
h1 {
  font-size: var(--txt-xlrg);
  border-bottom: 1px solid hsl(var(--clr-white-200));
}
dl {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
dt {
  font-size: 2rem;
  font-weight: 700;
}
dd {
  font-size: 1.5rem;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
dd img {
  display: inline-block;
  aspect-ratio: 1;
  height: 2rem;
}
.mongo {
  color: #4DB33D;
}
.node {
  color: #68A063;
}
.node img {
  aspect-ratio: unset;
  height: 3rem;
}
.vue {
  color: #41B883;
}
.express {
  color: royalblue;
}
.express img {
  background-color: royalblue;
  border-radius: 100%;
}

</style>